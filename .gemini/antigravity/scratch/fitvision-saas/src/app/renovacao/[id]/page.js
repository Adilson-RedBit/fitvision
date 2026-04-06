"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../../onboarding/onboarding.module.css";
import { getStudent, saveStudent, uploadRenewalPhoto } from "../../../utils/storage";

export default function RenovacaoPage() {
    const params = useParams();
    const studentId = params.id;

    const [student, setStudent] = useState({ name: "Carregando..." });

    useEffect(() => {
        const load = async () => {
            const data = await getStudent(studentId);
            if (data) setStudent(data);
            else setStudent({ name: "Aluno" });
        };
        load();
    }, [studentId]);

    const [submitted, setSubmitted] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [currentPhotoSide, setCurrentPhotoSide] = useState(null);
    const videoRef = useRef(null);
    const fileInputRefs = {
        front: useRef(null),
        back: useRef(null),
        right: useRef(null),
        left: useRef(null),
    };

    const [form, setForm] = useState({
        weight: "",
        height: "",
        muscleDifficulty: "",
        trainingDays: "3",
        trainingHours: "1h",
        cardioFrequency: "0",
        alcohol: "Não",
        smoke: "Não",
        dietRating: "Boa",
        photos: { front: null, back: null, left: null, right: null },
    });

    const handleFileChange = (side, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_SIZE = 800;
                    let width = img.width;
                    let height = img.height;
                    if (width > height && width > MAX_SIZE) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else if (height > MAX_SIZE) {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                    setForm(prev => ({ ...prev, photos: { ...prev.photos, [side]: canvas.toDataURL("image/jpeg", 0.7) } }));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = (side) => {
        setCurrentPhotoSide(side);
        setCameraActive(true);
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
            .catch(() => { alert("Não foi possível acessar a câmera."); setCameraActive(false); });
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
        setCameraActive(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 800;
        let width = video.videoWidth;
        let height = video.videoHeight;
        if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(video, 0, 0, width, height);
        setForm(prev => ({ ...prev, photos: { ...prev.photos, [currentPhotoSide]: canvas.toDataURL("image/jpeg", 0.7) } }));
        stopCamera();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student.id) { setSubmitted(true); return; }

        const ts = Date.now();
        const uploadedPhotos = { front: null, back: null, right: null, left: null };
        await Promise.all(
            ['front', 'back', 'right', 'left'].map(async (side) => {
                if (form.photos[side]) {
                    try {
                        uploadedPhotos[side] = await uploadRenewalPhoto(studentId, ts, side, form.photos[side]);
                    } catch {
                        uploadedPhotos[side] = form.photos[side];
                    }
                }
            })
        );

        const renewal = {
            date: new Date().toLocaleDateString('pt-BR'),
            dateISO: new Date().toISOString(),
            basics: { weight: form.weight, height: form.height },
            lifestyle: {
                trainingDays: form.trainingDays,
                trainingHours: form.trainingHours,
                muscleDifficulty: form.muscleDifficulty,
                cardioFrequency: form.cardioFrequency,
                alcohol: form.alcohol,
                smoke: form.smoke,
                dietRating: form.dietRating,
            },
            photos: uploadedPhotos,
        };

        const currentAnamnesis = student.anamnesis || {};
        const renewals = [...(currentAnamnesis.renewals || []), renewal];
        await saveStudent(studentId, { ...student, anamnesis: { ...currentAnamnesis, renewals } });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.onboardingCard}>
                    <div className={styles.successView}>
                        <div className={styles.successIcon}>✅</div>
                        <h2 className={styles.successTitle}>Renovação enviada, {student.name?.split(' ')[0]}!</h2>
                        <p className={styles.successText}>
                            Suas informações foram atualizadas com sucesso. Seu personal irá preparar sua nova planilha em breve!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.onboardingCard}>
                <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', backgroundColor: '#191E22', padding: '16px', borderRadius: '16px' }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "72px", objectFit: "contain" }} />
                        <span style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                            <span style={{ color: '#D4FF00' }}>Fit</span>
                            <span style={{ color: '#B46BFB' }}>Vision</span>
                        </span>
                    </div>
                    <h1 className={styles.headerTitle}>Ficha de Renovação de Treino</h1>
                    <p className={styles.headerSubtitle}>Olá, <strong>{student.name}</strong>! Atualize suas informações para o novo ciclo.</p>
                </div>

                <form className={styles.formBody} onSubmit={handleSubmit}>

                    {/* MEDIDAS ATUAIS */}
                    <h2 className={styles.sectionTitle}>📏 Medidas Atuais</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Peso atual (kg)</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="75"
                                required
                                value={form.weight}
                                onChange={e => setForm({ ...form, weight: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Altura (cm)</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="175"
                                required
                                value={form.height}
                                onChange={e => setForm({ ...form, height: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ESTILO DE VIDA */}
                    <h2 className={styles.sectionTitle}>🥦 Estilo de Vida</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Em qual região você tem mais dificuldade em ganhar massa?</label>
                        <input
                            className={styles.input}
                            placeholder="Ex: Panturrilhas, Braços..."
                            value={form.muscleDifficulty}
                            onChange={e => setForm({ ...form, muscleDifficulty: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quantos dias por semana você tem disponíveis para treinar?</label>
                        <div className={styles.radioGroup}>
                            {["2", "3", "4", "5", "6"].map(day => (
                                <div
                                    key={day}
                                    className={`${styles.radioOption} ${form.trainingDays === day ? styles.radioOptionActive : ""}`}
                                    onClick={() => setForm({ ...form, trainingDays: day })}
                                >
                                    {day}x
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Disponibilidade em horas diárias (incluindo cárdio)</label>
                        <div className={styles.radioGroup}>
                            {["1h", "1h30", "2h", "2h30", "3h+"].map(h => (
                                <div
                                    key={h}
                                    className={`${styles.radioOption} ${form.trainingHours === h ? styles.radioOptionActive : ""}`}
                                    onClick={() => setForm({ ...form, trainingHours: h })}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quantas vezes por semana você faz cardio?</label>
                        <select
                            className={styles.select}
                            value={form.cardioFrequency}
                            onChange={e => setForm({ ...form, cardioFrequency: e.target.value })}
                        >
                            <option value="0">Nenhuma</option>
                            <option value="1-2">1 a 2 vezes</option>
                            <option value="3-4">3 a 4 vezes</option>
                            <option value="5+">5 ou mais vezes</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Consome Álcool?</label>
                            <select
                                className={styles.select}
                                value={form.alcohol}
                                onChange={e => setForm({ ...form, alcohol: e.target.value })}
                            >
                                <option>Não</option>
                                <option>Socialmente</option>
                                <option>Frequência moderada</option>
                                <option>Frequência alta</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Fumante?</label>
                            <select
                                className={styles.select}
                                value={form.smoke}
                                onChange={e => setForm({ ...form, smoke: e.target.value })}
                            >
                                <option>Não</option>
                                <option>Sim</option>
                                <option>Raramente</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Como avalia sua alimentação atual?</label>
                        <div className={styles.radioGroup}>
                            {["Excelente", "Boa", "Regular", "Ruim"].map(rating => (
                                <div
                                    key={rating}
                                    className={`${styles.radioOption} ${form.dietRating === rating ? styles.radioOptionActive : ""}`}
                                    onClick={() => setForm({ ...form, dietRating: rating })}
                                >
                                    {rating}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOTOS */}
                    <h2 className={styles.sectionTitle}>📸 Fotos para Avaliação</h2>
                    <p className={styles.helperText}>Envie fotos atuais para comparação com sua avaliação anterior.</p>

                    <div className={styles.photoGrid}>
                        {[
                            { id: 'front', label: 'Frente', icon: '👤' },
                            { id: 'back', label: 'Costas', icon: '👤' },
                            { id: 'right', label: 'Perfil D', icon: '👥' },
                            { id: 'left', label: 'Perfil E', icon: '👥' },
                        ].map(slot => (
                            <div key={slot.id} className={styles.photoSlot}>
                                {form.photos[slot.id] ? (
                                    <>
                                        <img src={form.photos[slot.id]} className={styles.photoPreview} alt={slot.label} />
                                        <div className={styles.photoActions}>
                                            <button
                                                type="button"
                                                className={styles.actionBtn}
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, photos: { ...prev.photos, [slot.id]: null } }));
                                                    if (fileInputRefs[slot.id].current) fileInputRefs[slot.id].current.value = "";
                                                }}
                                            >
                                                Remover / Trocar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                                        <div className={styles.photoIcon}>{slot.icon}</div>
                                        <div className={styles.photoLabel}>{slot.label}</div>
                                        <div className={styles.slotButtonContainer}>
                                            <button type="button" className={`${styles.slotBtn} ${styles.cameraBtn}`} onClick={() => startCamera(slot.id)}>
                                                📸 Câmera
                                            </button>
                                            <button type="button" className={`${styles.slotBtn} ${styles.galleryBtn}`} onClick={() => fileInputRefs[slot.id].current?.click()}>
                                                📁 Galeria
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={fileInputRefs[slot.id]}
                                    onChange={e => handleFileChange(slot.id, e)}
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Enviar Renovação
                    </button>
                </form>
            </div>

            {cameraActive && (
                <div className={styles.modalOverlay}>
                    <div className={styles.cameraContainer}>
                        <button className={styles.closeCamera} onClick={stopCamera}>✕</button>
                        <video ref={videoRef} autoPlay playsInline className={styles.videoFeed} />
                        <div className={styles.cameraControls}>
                            <button type="button" className={styles.captureBtn} onClick={capturePhoto} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
