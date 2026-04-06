"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../details.module.css";
import WorkoutBuilderModal from "../../components/WorkoutBuilderModal";
import { getStudent, saveStudent, deleteStudent } from "../../../../utils/storage";

function ExpiryModal({ expiryInfo, expiryMessage, setExpiryMessage, sendExpiryWhatsApp, onClose }) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '440px', maxWidth: '94%' }} onClick={e => e.stopPropagation()}>
                <h3 style={{ marginBottom: '8px', fontWeight: 800, fontSize: '1.1rem' }}>Mensagem de Vencimento</h3>
                {expiryInfo && (
                    <div style={{
                        background: expiryInfo.diffDays < 0 ? '#fff0f0' : expiryInfo.diffDays <= 7 ? '#fff8e1' : '#f0fff4',
                        border: `1px solid ${expiryInfo.diffDays < 0 ? '#ff4757' : expiryInfo.diffDays <= 7 ? '#ffa500' : '#4caf50'}`,
                        borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem',
                        color: expiryInfo.diffDays < 0 ? '#cc0000' : expiryInfo.diffDays <= 7 ? '#cc7000' : '#2e7d32', fontWeight: 600
                    }}>
                        {expiryInfo.diffDays < 0
                            ? `Treino "${expiryInfo.workoutName}" venceu ha ${Math.abs(expiryInfo.diffDays)} dia(s)`
                            : expiryInfo.diffDays <= 7
                            ? `Treino "${expiryInfo.workoutName}" vence em ${expiryInfo.diffDays} dia(s)`
                            : `Treino "${expiryInfo.workoutName}" valido por mais ${expiryInfo.diffDays} dias`}
                    </div>
                )}
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>
                    Edite a mensagem antes de enviar:
                </label>
                <textarea
                    value={expiryMessage}
                    onChange={e => setExpiryMessage(e.target.value)}
                    rows={6}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', lineHeight: '1.5', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" style={{ background: '#25D366', borderColor: '#25D366' }} onClick={sendExpiryWhatsApp}>
                        Enviar WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function StudentProfile() {
    const { id } = useParams();
    const router = useRouter();

    const [student, setStudent] = useState(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [editingWorkoutIndex, setEditingWorkoutIndex] = useState(null);
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '' });
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const [expiryMessage, setExpiryMessage] = useState('');

    const loadStudent = async () => {
        const data = await getStudent(id);
        if (data) {
            setStudent(data);
            setSavedWorkouts(data.workouts || []);
        }
    };

    useEffect(() => {
        loadStudent();
        window.addEventListener("fitvision_storage_update", loadStudent);
        window.addEventListener("storage", loadStudent);
        return () => {
            window.removeEventListener("fitvision_storage_update", loadStudent);
            window.removeEventListener("storage", loadStudent);
        };
    }, [id]);

    const cardioLabels = {
        "0": "Nenhuma", "1-2": "1 a 2 vezes/semana",
        "3-4": "3 a 4 vezes/semana", "5+": "5 ou mais vezes/semana"
    };

    const trainingDaysLabels = {
        "2": "2x por semana", "3": "3x por semana", "4": "4x por semana",
        "5": "5x por semana", "6": "6x por semana"
    };

    const getExpiryInfo = () => {
        const workouts = student?.workouts || [];
        const withExpiry = workouts.filter(w => w.expiryDate);
        if (withExpiry.length === 0) return null;
        const latest = withExpiry[withExpiry.length - 1];
        const expiry = new Date(latest.expiryDate);
        const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
        return { diffDays, workoutName: latest.name };
    };

    const openExpiryWhatsApp = () => {
        const expiryInfo = getExpiryInfo();
        const firstName = student.name?.split(' ')[0] || student.name;
        const workoutLink = `${window.location.origin}/treino/${student.id}`;
        let msg = '';
        if (expiryInfo && expiryInfo.diffDays < 0) {
            msg = `Ola ${firstName}! Seu treino "${expiryInfo.workoutName}" venceu. Vamos montar um novo? Me chame!`;
        } else if (expiryInfo && expiryInfo.diffDays <= 7) {
            msg = `Ola ${firstName}! Seu treino "${expiryInfo.workoutName}" vence em ${expiryInfo.diffDays} dia(s). Vamos renovar?`;
        } else {
            msg = `Ola ${firstName}! Seu treino esta disponivel: ${workoutLink}\n\nQualquer duvida e so me chamar!`;
        }
        setExpiryMessage(msg);
        setShowExpiryModal(true);
    };

    const sendExpiryWhatsApp = () => {
        const phone = student.anamnesis?.basics?.phone || student.phone || "";
        if (!phone) { alert("Numero de telefone nao encontrado."); return; }
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(expiryMessage)}`, '_blank');
        setShowExpiryModal(false);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir o perfil de ${student.name}?\n\nEsta acao e irreversivel.`);
        if (!confirmed) return;
        const doubleConfirm = window.confirm(`CONFIRMACAO FINAL\n\nVoce esta prestes a excluir permanentemente "${student.name}".\n\nClique em OK para confirmar.`);
        if (!doubleConfirm) return;
        try {
            await deleteStudent(student.id);
            router.push('/dashboard/clients');
        } catch (err) {
            alert('Erro ao excluir aluno: ' + err.message);
        }
    };

    const handleSendApp = () => {
        const link = student.onboardingLink || `${window.location.origin}/onboarding/${student.id}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado! Envie para o aluno preencher a Anamnese.');
    };

    const handleSendRenewal = () => {
        const link = `${window.location.origin}/renovacao/${student.id}`;
        const phone = student.anamnesis?.basics?.phone || student.phone || "";
        if (!phone) {
            navigator.clipboard.writeText(link);
            alert('Link de renovação copiado!\n\n' + link);
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        const msg = encodeURIComponent(`Ola ${student.name?.split(' ')[0]}! Chegou a hora de renovar seu treino. Preencha sua ficha de renovacao: ${link}`);
        window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
    };

    const calcIMC = (weight, height) => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100;
        if (!w || !h) return null;
        return (w / (h * h)).toFixed(1);
    };

    const getIMCLabel = (imc) => {
        if (!imc) return null;
        const v = parseFloat(imc);
        if (v < 18.5) return { label: 'Abaixo do peso', color: '#2196f3' };
        if (v < 25)   return { label: 'Peso normal', color: '#4caf50' };
        if (v < 30)   return { label: 'Sobrepeso', color: '#ff9800' };
        if (v < 35)   return { label: 'Obesidade I', color: '#f44336' };
        if (v < 40)   return { label: 'Obesidade II', color: '#b71c1c' };
        return { label: 'Obesidade III', color: '#7f0000' };
    };

    const handleSendWorkout = () => {
        const phone = student.anamnesis?.basics?.phone || student.phone || "";
        const workoutLink = `${window.location.origin}/treino/${student.id}`;
        if (!phone) { navigator.clipboard.writeText(workoutLink); alert('Link do treino copiado!\n\n' + workoutLink); return; }
        const cleanPhone = phone.replace(/\D/g, '');
        const msg = encodeURIComponent(`Ola ${student.name?.split(' ')[0]}! Acesse sua planilha de treino aqui: ${workoutLink}`);
        window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
    };

    const handleWhatsApp = () => {
        const phone = student.anamnesis?.basics?.phone || student.phone || "";
        if (!phone) { alert("Numero de telefone nao encontrado."); return; }
        window.open(`https://wa.me/55${phone.replace(/\D/g, '')}`, '_blank');
    };

    const handleScrollToPlanilhas = () => {
        document.getElementById('planilhas-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const openEditModal = () => {
        setEditForm({ name: student.name || '', phone: student.anamnesis?.basics?.phone || student.phone || '' });
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        const updated = { ...student, name: editForm.name, phone: editForm.phone };
        if (updated.anamnesis?.basics) updated.anamnesis.basics.phone = editForm.phone;
        await saveStudent(student.id, updated);
        setStudent(updated);
        setShowEditModal(false);
    };

    const deleteWorkout = async (index) => {
        if (window.confirm('Tem certeza que deseja excluir esta planilha?')) {
            const updated = [...savedWorkouts];
            updated.splice(index, 1);
            const updatedStudent = { ...student, workouts: updated };
            await saveStudent(student.id, updatedStudent);
            setSavedWorkouts(updated);
            setStudent(updatedStudent);
        }
    };

    if (!student) {
        return (
            <div className={styles.profileContainer} style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
                Carregando perfil do aluno...
            </div>
        );
    }

    const expiryInfo = getExpiryInfo();

    return (
        <div className={styles.profileContainer}>
            <header className={styles.profileHeader}>
                <Link href="/dashboard/clients" className={styles.backButton}>&#8592;</Link>
                <h1 className={styles.headerTitle}>Perfil do aluno</h1>
            </header>

            <div className={styles.profileCard}>
                <div className={styles.profileMain}>
                    <div className={styles.profileAvatar}>{student.avatar || '?'}</div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{student.name}</div>
                        <div className={styles.ratingStars}>
                            {'★'.repeat(student.rating || 0)}{'☆'.repeat(5 - (student.rating || 0))}
                        </div>
                    </div>
                </div>
                <div className={styles.actionGrid}>
                    <div className={styles.actionItem} onClick={openEditModal} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon}>&#9998;</div>
                        <span className={styles.actionLabel}>Editar Perfil</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleSendApp} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon}>&#9993;</div>
                        <span className={styles.actionLabel}>Enviar app para o aluno</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleSendWorkout} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#25D366' }}>&#128170;</div>
                        <span className={styles.actionLabel}>Enviar Treino</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleScrollToPlanilhas} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#7E52F3' }}>&#127947;</div>
                        <span className={styles.actionLabel}>Planilhas de Treino</span>
                    </div>
                    <div className={styles.actionItem} onClick={openExpiryWhatsApp} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#FF6B35' }}>&#128197;</div>
                        <span className={styles.actionLabel}>Aviso de Vencimento</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleWhatsApp} style={{ cursor: 'pointer' }}>
                        <div className={`${styles.actionIcon} ${styles.actionIconGreen}`}>&#128172;</div>
                        <span className={styles.actionLabel}>Enviar WhatsApp</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleSendRenewal} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#00b894' }}>&#128257;</div>
                        <span className={styles.actionLabel}>Ficha de Renovação</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleDelete} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#ff4757' }}>&#128465;</div>
                        <span className={styles.actionLabel} style={{ color: '#ff4757' }}>Excluir Aluno</span>
                    </div>
                </div>
            </div>

            {/* ANAMNESE */}
            <div id="anamnese-section" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Anamnese &amp; Ficha Cadastral</h3>
                </div>
                {!student.anamnesis ? (
                    <div className={styles.anamnesisCard}>
                        <div style={{ padding: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>&#9203;</div>
                            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Aguardando preenchimento do aluno</p>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>O aluno ainda nao preencheu o formulario de anamnese.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.anamnesisCard}>
                            <h4 className={styles.detailTitle}>Informacoes Basicas</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>E-mail</span><span className={styles.anamnesisValue}>{student.anamnesis.basics?.email || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Telefone</span><span className={styles.anamnesisValue}>{student.anamnesis.basics?.phone || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Nascimento</span><span className={styles.anamnesisValue}>{student.anamnesis.basics?.birth || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Objetivo</span><span className={styles.anamnesisValue}><span className={styles.goalBadge}>{student.anamnesis.basics?.goal || '-'}</span></span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Peso</span><span className={styles.anamnesisValue}>{student.anamnesis.basics?.weight || '-'} kg</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Altura</span><span className={styles.anamnesisValue}>{student.anamnesis.basics?.height || '-'} cm</span></div>
                                {(() => {
                                    const imc = calcIMC(student.anamnesis.basics?.weight, student.anamnesis.basics?.height);
                                    const info = getIMCLabel(imc);
                                    if (!imc) return null;
                                    return (
                                        <div className={styles.anamnesisItem} style={{ gridColumn: '1 / -1' }}>
                                            <span className={styles.anamnesisLabel}>IMC</span>
                                            <span className={styles.anamnesisValue} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <strong style={{ fontSize: '1.1rem' }}>{imc}</strong>
                                                <span style={{ background: info.color + '22', color: info.color, border: `1px solid ${info.color}55`, borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {info.label}
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>Anamnese Reativa</h4>
                            <div style={{ marginBottom: '16px' }}>
                                <span className={styles.anamnesisLabel}>Dores / Lesoes reportadas</span>
                                <div className={styles.injuryTags}>
                                    {(student.anamnesis.injuries || []).length > 0
                                        ? student.anamnesis.injuries.map(injury => <span key={injury} className={styles.injuryTag}>{injury}</span>)
                                        : <span className={styles.noInjuryTag}>Nenhuma dor ou lesao reportada</span>}
                                </div>
                            </div>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Cirurgia</span>
                                    <span className={styles.anamnesisValue}>
                                        {student.anamnesis.hadSurgery ? <span className={styles.surgeryYes}>Sim</span> : <span className={styles.surgeryNo}>Nao</span>}
                                    </span>
                                </div>
                                {student.anamnesis.hadSurgery && (<>
                                    <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Local</span><span className={styles.anamnesisValue}>{student.anamnesis.surgeryDetails || '-'}</span></div>
                                    <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Ha quanto tempo</span><span className={styles.anamnesisValue}>{student.anamnesis.surgeryTime || '-'}</span></div>
                                </>)}
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>Estilo de Vida</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Dias disponiveis</span><span className={styles.anamnesisValue}><span className={styles.goalBadge}>{trainingDaysLabels[student.anamnesis.lifestyle?.trainingDays] || '-'}</span></span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Dificuldade em ganhar massa</span><span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.muscleDifficulty || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Horas disponiveis/dia</span><span className={styles.anamnesisValue}><span className={styles.goalBadge}>{student.anamnesis.lifestyle?.trainingHours || '-'}</span></span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Cardio / Semana</span><span className={styles.anamnesisValue}>{cardioLabels[student.anamnesis.lifestyle?.cardioFrequency] || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Alcool</span><span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.alcohol || '-'}</span></div>
                                <div className={styles.anamnesisItem}><span className={styles.anamnesisLabel}>Fumante</span><span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.smoke || '-'}</span></div>
                            </div>
                            <div className={styles.dietSection}>
                                <span className={styles.anamnesisLabel}>Alimentacao</span>
                                <div className={styles.dietBadge}>
                                    <span>{student.anamnesis.lifestyle?.dietRating || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>Fotos de Avaliacao</h4>
                            <div className={styles.photosGrid}>
                                {[{ id: 'front', label: 'Frente' }, { id: 'back', label: 'Costas' }, { id: 'right', label: 'Perfil D' }, { id: 'left', label: 'Perfil E' }].map(slot => (
                                    <div key={slot.id} className={styles.photoSlotPro}>
                                        {student.anamnesis.photos?.[slot.id]
                                            ? <img src={student.anamnesis.photos[slot.id]} alt={slot.label} className={styles.photoImg} />
                                            : <div className={styles.photoPlaceholder}><span>Foto</span></div>}
                                        <span className={styles.photoSlotLabel}>{slot.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RENOVAÇÕES */}
                        {(student.anamnesis.renewals || []).length > 0 && (() => {
                            const renewals = student.anamnesis.renewals;
                            const photoSides = [
                                { id: 'front', label: 'Frente' },
                                { id: 'back', label: 'Costas' },
                                { id: 'right', label: 'Perfil D' },
                                { id: 'left', label: 'Perfil E' },
                            ];
                            return (
                                <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                                    <h4 className={styles.detailTitle}>Renovacoes de Treino</h4>
                                    {renewals.map((renewal, ri) => {
                                        const imc = calcIMC(renewal.basics?.weight, renewal.basics?.height);
                                        const imcInfo = getIMCLabel(imc);
                                        const prevPhotos = ri === 0
                                            ? student.anamnesis.photos
                                            : renewals[ri - 1].photos;
                                        return (
                                            <div key={ri} style={{ marginBottom: ri < renewals.length - 1 ? '24px' : 0 }}>
                                                {/* Cabeçalho da renovação */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', background: '#7E52F322', color: '#7E52F3', border: '1px solid #7E52F344', borderRadius: '20px', padding: '3px 12px' }}>
                                                        Renovacao {ri + 1}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{renewal.date}</span>
                                                </div>

                                                {/* Medidas desta renovação */}
                                                <div className={styles.anamnesisGrid} style={{ marginBottom: '16px' }}>
                                                    <div className={styles.anamnesisItem}>
                                                        <span className={styles.anamnesisLabel}>Peso</span>
                                                        <span className={styles.anamnesisValue}>{renewal.basics?.weight || '-'} kg</span>
                                                    </div>
                                                    <div className={styles.anamnesisItem}>
                                                        <span className={styles.anamnesisLabel}>Altura</span>
                                                        <span className={styles.anamnesisValue}>{renewal.basics?.height || '-'} cm</span>
                                                    </div>
                                                    {imc && (
                                                        <div className={styles.anamnesisItem} style={{ gridColumn: '1 / -1' }}>
                                                            <span className={styles.anamnesisLabel}>IMC</span>
                                                            <span className={styles.anamnesisValue} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <strong style={{ fontSize: '1.1rem' }}>{imc}</strong>
                                                                <span style={{ background: imcInfo.color + '22', color: imcInfo.color, border: `1px solid ${imcInfo.color}55`, borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                                    {imcInfo.label}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Comparativo antes / depois */}
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Comparativo de Fotos
                                                </div>
                                                {photoSides.map(slot => {
                                                    const before = prevPhotos?.[slot.id];
                                                    const after = renewal.photos?.[slot.id];
                                                    if (!before && !after) return null;
                                                    return (
                                                        <div key={slot.id} style={{ marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginBottom: '8px' }}>{slot.label}</div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>Antes</div>
                                                                    {before
                                                                        ? <img src={before} alt={`antes-${slot.id}`} style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '3/4' }} />
                                                                        : <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '10px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '0.8rem' }}>Sem foto</div>}
                                                                </div>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4caf50', marginBottom: '4px', textTransform: 'uppercase' }}>Depois</div>
                                                                    {after
                                                                        ? <img src={after} alt={`depois-${slot.id}`} style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '3/4' }} />
                                                                        : <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '10px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '0.8rem' }}>Sem foto</div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>

            {/* ACESSO */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Acesso</h3>
                </div>
                <div className={styles.accessCard}>
                    <div className={`${styles.statusCard} ${student.isProspect ? styles.statusCardProspect : styles.statusCardActive}`}>
                        <span className={styles.statusLabel}>Status</span>
                        <span className={styles.statusValue}>{student.status}</span>
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                            {student.isProspect ? '...' : 'OK'}
                        </span>
                    </div>
                    {!student.isProspect && (
                        <div className={`${styles.statusCard} ${styles.statusCardRelease}`}>
                            <span className={styles.statusLabel}>Liberar</span>
                            <span className={styles.statusValue}>Acesso</span>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>&#8250;</span>
                        </div>
                    )}
                </div>
            </div>

            {/* PLANILHAS */}
            <div id="planilhas-section" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Planilhas de treino</h3>
                    <button className="btn btn-primary btn-sm" style={{ background: '#7E52F3', borderRadius: '12px' }}
                        onClick={() => { setEditingWorkoutIndex(null); setShowWorkoutModal(true); }} disabled={!student.anamnesis}>
                        Adicionar +
                    </button>
                </div>
                {savedWorkouts.length === 0 ? (
                    <div className={styles.anamnesisCard} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                        <p style={{ fontSize: '0.85rem' }}>Nenhuma planilha de treino criada ainda.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {savedWorkouts.map((w, i) => (
                            <div key={i} className={styles.savedWorkoutCard}>
                                <div className={styles.savedWorkoutInfo}>
                                    <span className={styles.savedWorkoutName}>{w.name}</span>
                                    <span className={styles.savedWorkoutMeta}>
                                        {w.workouts?.length || 0} treinos &bull; Criado em {w.createdAt}
                                        {w.validityWeeks && ` \u2022 ${w.validityWeeks} semanas`}
                                    </span>
                                </div>
                                <div className={styles.savedWorkoutBadges}>
                                    {w.workouts?.map(wk => <span key={wk.letter} className={styles.workoutLetterBadge}>{wk.letter}</span>)}
                                </div>
                                <span className={styles.savedWorkoutStatus} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {w.status}
                                    <button onClick={() => { setEditingWorkoutIndex(i); setShowWorkoutModal(true); }}
                                        style={{ background: 'none', border: 'none', color: '#7E52F3', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}
                                        title="Editar planilha">&#9998;</button>
                                    <button onClick={() => deleteWorkout(i)}
                                        style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}
                                        title="Excluir planilha">&#128465;</button>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CARGA DO ALUNO */}
            {student.seriesData && Object.keys(student.seriesData).length > 0 && (() => {
                const workouts = student.workouts || [];
                const cargaMap = {};
                workouts.forEach((plan, planIdx) => {
                    (plan.workouts || []).forEach((split, splitIdx) => {
                        const splitKey = `${planIdx}-${splitIdx}`;
                        const splitLabel = `${plan.name || 'Planilha ' + (planIdx + 1)} - Treino ${split.letter}`;
                        (split.exercises || []).forEach((ex, exIdx) => {
                            const numSeries = (() => { const m = ex.sets?.match(/^(\d+)/); return m ? parseInt(m[1]) : 3; })();
                            const cargas = [];
                            for (let si = 0; si < numSeries; si++) {
                                const key = `${splitKey}-${exIdx}-${si}`;
                                const entry = student.seriesData[key];
                                if (entry?.carga) cargas.push({ serie: si + 1, carga: entry.carga, done: entry.done });
                            }
                            if (cargas.length > 0) {
                                if (!cargaMap[ex.name]) cargaMap[ex.name] = [];
                                cargaMap[ex.name].push({ splitLabel, cargas });
                            }
                        });
                    });
                });
                const exercises = Object.entries(cargaMap);
                if (exercises.length === 0) return null;
                return (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Carga Registrada pelo Aluno</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {exercises.map(([exName, entries]) => (
                                <div key={exName} className={styles.anamnesisCard} style={{ padding: '16px 20px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', color: '#1a1a2e' }}>
                                        {exName}
                                    </div>
                                    {entries.map((entry, i) => (
                                        <div key={i} style={{ marginBottom: i < entries.length - 1 ? '10px' : 0 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px', fontWeight: 600 }}>{entry.splitLabel}</div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {entry.cargas.map((s, si) => (
                                                    <div key={si} style={{
                                                        background: s.done ? '#e8f5e9' : '#f5f5f5',
                                                        border: `1px solid ${s.done ? '#4caf50' : '#ddd'}`,
                                                        borderRadius: '8px', padding: '6px 12px',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                                                    }}>
                                                        <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>S{s.serie}</span>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: s.done ? '#2e7d32' : '#333' }}>{s.carga} kg</span>
                                                        {s.done && <span style={{ fontSize: '0.65rem', color: '#4caf50' }}>OK</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* FEEDBACKS */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Feedbacks</h3>
                </div>
                <div className={styles.feedbackList} style={{ marginTop: '20px' }}>
                    {(student.feedbacks || []).length === 0 ? (
                        <div className={styles.anamnesisCard} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                            <p style={{ fontSize: '0.85rem' }}>Nenhum feedback registrado.</p>
                        </div>
                    ) : (
                        (student.feedbacks || []).map(f => (
                            <div key={f.id} className={styles.feedbackItem}>
                                <div className={styles.feedbackHeader}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.type}</div>
                                    <div className={styles.feedbackTime}>{f.time}</div>
                                </div>
                                <div className={styles.ratingStars}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 8 }}>{f.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ height: '40px' }}></div>

            {/* WORKOUT MODAL — criação e edição */}
            <WorkoutBuilderModal
                isOpen={showWorkoutModal}
                onClose={() => { setShowWorkoutModal(false); setEditingWorkoutIndex(null); }}
                onSave={async (plan) => {
                    if (student) {
                        const updated = [...(student.workouts || [])];
                        if (editingWorkoutIndex !== null) {
                            // Edição: preserva dateSaved original
                            updated[editingWorkoutIndex] = { ...updated[editingWorkoutIndex], ...plan };
                        } else {
                            // Criação nova
                            updated.push({ ...plan, dateSaved: new Date().toISOString() });
                        }
                        const updatedStudent = { ...student, status: "Ativo", workouts: updated };
                        await saveStudent(student.id, updatedStudent);
                        setSavedWorkouts(updatedStudent.workouts);
                        setStudent(updatedStudent);
                    }
                    setShowWorkoutModal(false);
                    setEditingWorkoutIndex(null);
                }}
                student={student}
                initialWorkouts={editingWorkoutIndex !== null ? savedWorkouts[editingWorkoutIndex]?.workouts : null}
                modalTitle={editingWorkoutIndex !== null ? 'Editar Planilha' : 'Sugestão de Treino'}
            />

            {/* EDIT MODAL */}
            {showEditModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    onClick={() => setShowEditModal(false)}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Editar Perfil</h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#666' }}>Nome Completo</label>
                            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#666' }}>WhatsApp (com DDD)</label>
                            <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} placeholder="(11) 99999-9999" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={saveEdit}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPIRY WHATSAPP MODAL */}
            {showExpiryModal && (
                <ExpiryModal
                    expiryInfo={expiryInfo}
                    expiryMessage={expiryMessage}
                    setExpiryMessage={setExpiryMessage}
                    sendExpiryWhatsApp={sendExpiryWhatsApp}
                    onClose={() => setShowExpiryModal(false)}
                />
            )}
        </div>
    );
}
