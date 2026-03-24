"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "../onboarding.module.css";

const clientsMock = [
    { id: 1, name: "Rafael Mendes" },
    { id: 2, name: "Carla Silva" },
    { id: 3, name: "João Pedro" },
    { id: 4, name: "Ana Costa" },
    { id: 5, name: "Lucas Oliveira" },
    { id: 6, name: "Marina Santos" },
];

export default function OnboardingPage() {
    const params = useParams();
    const studentId = parseInt(params.id);
    const student = useMemo(() =>
        clientsMock.find(c => c.id === studentId) || { name: "Aluno" }
        , [studentId]);

    const [submitted, setSubmitted] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [currentPhotoSide, setCurrentPhotoSide] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRefs = {
        front: useRef(null),
        back: useRef(null),
        right: useRef(null),
        left: useRef(null)
    };

    const [form, setForm] = useState({
        email: "",
        phone: "",
        birthDate: "",
        weight: "",
        height: "",
        goal: "Hipertrofia",
        injuries: [],
        otherInjuryDetails: "",
        hadSurgery: null,
        surgeryDetails: "",
        surgeryTime: "",
        muscleDifficulty: "",
        trainingDays: "3",
        cardioFrequency: "0",
        alcohol: "Não",
        smoke: "Não",
        dietRating: "Boa",
        photos: {
            front: null,
            back: null,
            left: null,
            right: null
        }
    });

    const injuryOptions = ["Lombar", "Quadril", "Joelho", "Tornozelo", "Ombro", "Cervical", "Punho", "Outros"];

    const toggleInjury = (injury) => {
        setForm(prev => ({
            ...prev,
            injuries: prev.injuries.includes(injury)
                ? prev.injuries.filter(i => i !== injury)
                : [...prev.injuries, injury]
        }));
    };

    const handleFileChange = (side, e) => {
        console.log(`Alteração de arquivo detectada para: ${side}`);
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setForm(prev => ({
                    ...prev,
                    photos: { ...prev.photos, [side]: event.target.result }
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const startCamera = (side) => {
        console.log(`Iniciando câmera para: ${side}`);
        setCurrentPhotoSide(side);
        setCameraActive(true);
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Erro ao acessar a câmera:", err);
                alert("Não foi possível acessar a câmera.");
                setCameraActive(false);
            });
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setCameraActive(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");
        setForm(prev => ({
            ...prev,
            photos: { ...prev.photos, [currentPhotoSide]: imageData }
        }));

        stopCamera();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tentativa de envio do formulário...");
        console.log("Dados do formulário:", form);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.onboardingCard}>
                    <div className={styles.successView}>
                        <div className={styles.successIcon}>🎉</div>
                        <h2 className={styles.successTitle}>Tudo pronto, {student.name.split(' ')[0]}!</h2>
                        <p className={styles.successText}>
                            Suas informações foram enviadas com sucesso ao seu treinador.
                            Logo ele entrará em contato para dar início aos seus treinos!
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
                    <h1 className={styles.headerTitle}>Ficha Cadastral</h1>
                    <p className={styles.headerSubtitle}>Bem-vindo, <strong>{student.name}</strong>! Preencha seus dados para começar.</p>
                </div>

                <form className={styles.formBody} onSubmit={handleSubmit}>
                    <h2 className={styles.sectionTitle}>📍 Informações Básicas</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>E-mail</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="seu@email.com"
                            required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Telefone / WhatsApp</label>
                        <input
                            type="tel"
                            className={styles.input}
                            placeholder="(11) 99999-0000"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nascimento</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="dd/mm/aaaa"
                                required
                                maxLength={10}
                                value={form.birthDate}
                                onChange={e => {
                                    let v = e.target.value.replace(/\D/g, '');
                                    if (v.length > 8) v = v.slice(0, 8);
                                    if (v.length > 4) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
                                    else if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                                    setForm({ ...form, birthDate: v });
                                }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Objetivo</label>
                            <select
                                className={styles.select}
                                value={form.goal}
                                onChange={e => setForm({ ...form, goal: e.target.value })}
                            >
                                <option>Hipertrofia</option>
                                <option>Emagrecimento</option>
                                <option>Condicionamento</option>
                                <option>Definição</option>
                                <option>Saúde Geral</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Peso (kg)</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="75"
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
                                value={form.height}
                                onChange={e => setForm({ ...form, height: e.target.value })}
                            />
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>🏥 Anamnese Reativa</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Você sente dores ou tem lesões em algum destes locais?</label>
                        <p className={styles.helperText}>Selecione todas as opções que se aplicam.</p>
                        <div className={styles.buttonGroup}>
                            {injuryOptions.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`${styles.selectableBtn} ${form.injuries.includes(option) ? styles.selectableBtnActive : ""}`}
                                    onClick={() => toggleInjury(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {form.injuries.includes("Outros") && (
                            <div className={styles.othersField}>
                                <label className={styles.label}>Descreva outras dores ou lesões:</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Detalhe aqui..."
                                    value={form.otherInjuryDetails}
                                    onChange={e => setForm({ ...form, otherInjuryDetails: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Já passou por algum procedimento cirúrgico?</label>
                        <div className={styles.radioGroup}>
                            <div
                                className={`${styles.radioOption} ${form.hadSurgery === true ? styles.radioOptionActive : ""}`}
                                onClick={() => setForm({ ...form, hadSurgery: true })}
                            >
                                Sim
                            </div>
                            <div
                                className={`${styles.radioOption} ${form.hadSurgery === false ? styles.radioOptionActive : ""}`}
                                onClick={() => setForm({ ...form, hadSurgery: false })}
                            >
                                Não
                            </div>
                        </div>
                    </div>

                    {form.hadSurgery && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Onde?</label>
                                <input
                                    className={styles.input}
                                    placeholder="Ex: Joelho"
                                    value={form.surgeryDetails}
                                    onChange={e => setForm({ ...form, surgeryDetails: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Há quanto tempo?</label>
                                <input
                                    className={styles.input}
                                    placeholder="Ex: 2 anos"
                                    value={form.surgeryTime}
                                    onChange={e => setForm({ ...form, surgeryTime: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

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
                            <label className={styles.label}>Consome álcool?</label>
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

                    <h2 className={styles.sectionTitle}>📸 Fotos para Avaliação</h2>
                    <p className={styles.helperText}>Envie fotos ou capture agora para melhor acompanhamento.</p>

                    <div className={styles.photoGrid}>
                        {[
                            { id: 'front', label: 'Frente', icon: '👤' },
                            { id: 'back', label: 'Costas', icon: '👤' },
                            { id: 'right', label: 'Perfil D', icon: '👥' },
                            { id: 'left', label: 'Perfil E', icon: '👥' }
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
                                                    console.log(`Trocar clicado para: ${slot.id}`);
                                                    startCamera(slot.id);
                                                }}
                                            >
                                                Trocar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                                        <div className={styles.photoIcon}>{slot.icon}</div>
                                        <div className={styles.photoLabel}>{slot.label}</div>

                                        <div className={styles.slotButtonContainer}>
                                            <button
                                                type="button"
                                                className={`${styles.slotBtn} ${styles.cameraBtn}`}
                                                onClick={() => {
                                                    console.log(`Botão Câmera clicado para: ${slot.id}`);
                                                    startCamera(slot.id);
                                                }}
                                            >
                                                📸 Câmera
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.slotBtn} ${styles.galleryBtn}`}
                                                onClick={() => {
                                                    console.log(`Botão Galeria clicado para: ${slot.id}`);
                                                    if (fileInputRefs[slot.id].current) {
                                                        fileInputRefs[slot.id].current.click();
                                                    } else {
                                                        console.error(`Ref para ${slot.id} não encontrada!`);
                                                    }
                                                }}
                                            >
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
                                    id={`file-${slot.id}`}
                                    onChange={(e) => handleFileChange(slot.id, e)}
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Finalizar Cadastro
                    </button>
                </form>
            </div>

            {/* Camera Capture Modal */}
            {cameraActive && (
                <div className={styles.modalOverlay}>
                    <div className={styles.cameraContainer}>
                        <button className={styles.closeCamera} onClick={stopCamera}>✕</button>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={styles.videoFeed}
                        />
                        <div className={styles.cameraControls}>
                            <button type="button" className={styles.captureBtn} onClick={capturePhoto}></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
