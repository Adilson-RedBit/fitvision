"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../details.module.css";
import WorkoutBuilderModal from "../../components/WorkoutBuilderModal";
import { getStudent, saveStudent, deleteStudent } from "../../../../utils/storage";

export default function StudentProfile() {
    const { id } = useParams();
    const router = useRouter();

    const [student, setStudent] = useState(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '' });

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
        "0": "Nenhuma",
        "1-2": "1 a 2 vezes/semana",
        "3-4": "3 a 4 vezes/semana",
        "5+": "5 ou mais vezes/semana"
    };

    const dietEmojis = {
        "Excelente": "🟢",
        "Boa": "🔵",
        "Regular": "🟡",
        "Ruim": "🔴"
    };

    const trainingDaysLabels = {
        "2": "2x por semana",
        "3": "3x por semana",
        "4": "4x por semana",
        "5": "5x por semana",
        "6": "6x por semana"
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `⚠️ Tem certeza que deseja excluir o perfil de ${student.name}?\n\nEsta ação é irreversível e apagará todos os dados, anamnese e treinos do aluno.`
        );
        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            `🔴 CONFIRMAÇÃO FINAL\n\nVocê está prestes a excluir permanentemente "${student.name}".\n\nClique em OK para confirmar a exclusão.`
        );
        if (!doubleConfirm) return;

        try {
            await deleteStudent(student.id);
            router.push('/dashboard/clients');
        } catch (err) {
            console.error('Erro ao excluir aluno:', err);
            alert('Erro ao excluir aluno: ' + err.message);
        }
    };

    const handleSendApp = () => {
        const link = student.onboardingLink || `${window.location.origin}/onboarding/${student.id}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!\n\nEnvie para o aluno preencher a Anamnese.');
    };

    const handleWhatsApp = () => {
        const phone = student.anamnesis?.basics?.phone || student.phone || "";
        if (!phone) {
            alert("Número de telefone não encontrado. Por favor, edite o perfil para adicionar.");
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    };

    const handleScrollToAvaliacao = () => {
        const section = document.getElementById('anamnese-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollToPlanilhas = () => {
        const section = document.getElementById('planilhas-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const openEditModal = () => {
        setEditForm({
            name: student.name || '',
            phone: student.anamnesis?.basics?.phone || student.phone || ''
        });
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        const updatedStudent = { ...student, name: editForm.name, phone: editForm.phone };
        if (updatedStudent.anamnesis?.basics) {
            updatedStudent.anamnesis.basics.phone = editForm.phone;
        }
        await saveStudent(student.id, updatedStudent);
        setStudent(updatedStudent);
        setShowEditModal(false);
    };

    const deleteWorkout = async (index) => {
        if (window.confirm('Tem certeza que deseja excluir esta planilha?')) {
            const updatedWorkouts = [...savedWorkouts];
            updatedWorkouts.splice(index, 1);
            const updatedStudent = { ...student, workouts: updatedWorkouts };
            await saveStudent(student.id, updatedStudent);
            setSavedWorkouts(updatedWorkouts);
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

    return (
        <div className={styles.profileContainer}>
            <header className={styles.profileHeader}>
                <Link href="/dashboard/clients" className={styles.backButton}>←</Link>
                <h1 className={styles.headerTitle}>Perfil do aluno</h1>
            </header>

            <div className={styles.profileCard}>
                <div className={styles.profileMain}>
                    <div className={styles.profileAvatar}>{student.avatar || '👤'}</div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{student.name}</div>
                        <div className={styles.ratingStars}>{'★'.repeat(student.rating || 0)}{'☆'.repeat(5 - (student.rating || 0))}</div>
                    </div>
                </div>

                <div className={styles.actionGrid}>
                    <div className={styles.actionItem} onClick={openEditModal} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon}>✎</div>
                        <span className={styles.actionLabel}>Editar Perfil</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleSendApp} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon}>✉</div>
                        <span className={styles.actionLabel}>Enviar app para o aluno</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleScrollToAvaliacao} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon}>🩺</div>
                        <span className={styles.actionLabel}>Avaliação Física</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleScrollToPlanilhas} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#7E52F3' }}>🏋️</div>
                        <span className={styles.actionLabel}>Planilhas de Treino</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleWhatsApp} style={{ cursor: 'pointer' }}>
                        <div className={`${styles.actionIcon} ${styles.actionIconGreen}`}>💬</div>
                        <span className={styles.actionLabel}>Enviar WhatsApp</span>
                    </div>
                    <div className={styles.actionItem} onClick={handleDelete} style={{ cursor: 'pointer' }}>
                        <div className={styles.actionIcon} style={{ background: '#ff4757' }}>🗑️</div>
                        <span className={styles.actionLabel} style={{ color: '#ff4757' }}>Excluir Aluno</span>
                    </div>
                </div>
            </div>

            {/* ANAMNESE */}
            <div id="anamnese-section" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>📋 Anamnese & Ficha Cadastral</h3>
                </div>
                {!student.anamnesis ? (
                    <div className={styles.anamnesisCard}>
                        <div style={{ padding: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Aguardando preenchimento do aluno</p>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>O aluno ainda não preencheu o formulário de anamnese.</p>
                            {student.onboardingLink && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    style={{ marginTop: '16px' }}
                                    onClick={() => navigator.clipboard.writeText(student.onboardingLink)}
                                >
                                    Copiar Link novamente
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.anamnesisCard}>
                            <h4 className={styles.detailTitle}>📝 Informações Básicas</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>E-mail</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics?.email || '-'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Telefone</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics?.phone || '-'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Nascimento</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics?.birth || '-'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Objetivo</span>
                                    <span className={styles.anamnesisValue}>
                                        <span className={styles.goalBadge}>{student.anamnesis.basics?.goal || '-'}</span>
                                    </span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Peso</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics?.weight || '-'} kg</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Altura</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics?.height || '-'} cm</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>🏥 Anamnese Reativa</h4>
                            <div style={{ marginBottom: '16px' }}>
                                <span className={styles.anamnesisLabel}>Dores / Lesões reportadas</span>
                                <div className={styles.injuryTags}>
                                    {(student.anamnesis.injuries || []).length > 0 ? (
                                        student.anamnesis.injuries.map(injury => (
                                            <span key={injury} className={styles.injuryTag}>⚠️ {injury}</span>
                                        ))
                                    ) : (
                                        <span className={styles.noInjuryTag}>✅ Nenhuma dor ou lesão reportada</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Cirurgia</span>
                                    <span className={styles.anamnesisValue}>
                                        {student.anamnesis.hadSurgery ? (
                                            <span className={styles.surgeryYes}>Sim</span>
                                        ) : (
                                            <span className={styles.surgeryNo}>Não</span>
                                        )}
                                    </span>
                                </div>
                                {student.anamnesis.hadSurgery && (
                                    <>
                                        <div className={styles.anamnesisItem}>
                                            <span className={styles.anamnesisLabel}>Local</span>
                                            <span className={styles.anamnesisValue}>{student.anamnesis.surgeryDetails || '—'}</span>
                                        </div>
                                        <div className={styles.anamnesisItem}>
                                            <span className={styles.anamnesisLabel}>Há quanto tempo</span>
                                            <span className={styles.anamnesisValue}>{student.anamnesis.surgeryTime || '—'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>🥦 Estilo de Vida</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Dias disponíveis para treino</span>
                                    <span className={styles.anamnesisValue}>
                                        <span className={styles.goalBadge}>
                                            {trainingDaysLabels[student.anamnesis.lifestyle?.trainingDays] || (student.anamnesis.lifestyle?.trainingDays + 'x/semana') || '-'}
                                        </span>
                                    </span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Dificuldade em ganhar massa</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.muscleDifficulty || '—'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Cardio / Semana</span>
                                    <span className={styles.anamnesisValue}>{cardioLabels[student.anamnesis.lifestyle?.cardioFrequency] || student.anamnesis.lifestyle?.cardioFrequency || '-'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Álcool</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.alcohol || '-'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Fumante</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle?.smoke || '-'}</span>
                                </div>
                            </div>
                            <div className={styles.dietSection}>
                                <span className={styles.anamnesisLabel}>Alimentação</span>
                                <div className={styles.dietBadge}>
                                    <span>{dietEmojis[student.anamnesis.lifestyle?.dietRating] || '⚪'}</span>
                                    <span>{student.anamnesis.lifestyle?.dietRating || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>📸 Fotos de Avaliação</h4>
                            <div className={styles.photosGrid}>
                                {[
                                    { id: 'front', label: 'Frente' },
                                    { id: 'back', label: 'Costas' },
                                    { id: 'right', label: 'Perfil D' },
                                    { id: 'left', label: 'Perfil E' }
                                ].map(slot => (
                                    <div key={slot.id} className={styles.photoSlotPro}>
                                        {student.anamnesis.photos?.[slot.id] ? (
                                            <img src={student.anamnesis.photos[slot.id]} alt={slot.label} className={styles.photoImg} />
                                        ) : (
                                            <div className={styles.photoPlaceholder}>
                                                <span>📷</span>
                                            </div>
                                        )}
                                        <span className={styles.photoSlotLabel}>{slot.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            {student.isProspect ? '⏳' : '✅'}
                        </span>
                    </div>
                    {!student.isProspect && (
                        <div className={`${styles.statusCard} ${styles.statusCardRelease}`}>
                            <span className={styles.statusLabel}>Liberar</span>
                            <span className={styles.statusValue}>Acesso</span>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>›</span>
                        </div>
                    )}
                </div>
            </div>

            {/* PLANILHAS */}
            <div id="planilhas-section" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Planilhas de treino</h3>
                    <button
                        className="btn btn-primary btn-sm"
                        style={{ background: '#7E52F3', borderRadius: '12px' }}
                        onClick={() => setShowWorkoutModal(true)}
                        disabled={!student.anamnesis}
                    >
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
                                        {w.workouts?.length || 0} treinos • Criado em {w.createdAt}
                                    </span>
                                </div>
                                <div className={styles.savedWorkoutBadges}>
                                    {w.workouts?.map(wk => (
                                        <span key={wk.letter} className={styles.workoutLetterBadge}>{wk.letter}</span>
                                    ))}
                                </div>
                                <span className={styles.savedWorkoutStatus} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    ✅ {w.status}
                                    <button
                                        onClick={() => deleteWorkout(i)}
                                        style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}
                                        title="Excluir planilha"
                                    >
                                        🗑️
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

            {/* WORKOUT MODAL */}
            <WorkoutBuilderModal
                isOpen={showWorkoutModal}
                onClose={() => setShowWorkoutModal(false)}
                onSave={async (plan) => {
                    if (student) {
                        const updatedStudent = {
                            ...student,
                            status: "Ativo",
                            workouts: [...(student.workouts || []), { ...plan, dateSaved: new Date().toISOString() }]
                        };
                        await saveStudent(student.id, updatedStudent);
                        setSavedWorkouts(updatedStudent.workouts);
                        setStudent(updatedStudent);
                    }
                    setShowWorkoutModal(false);
                }}
                student={student}
            />

            {/* EDIT MODAL */}
            {showEditModal && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    onClick={() => setShowEditModal(false)}
                >
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>✏️ Editar Perfil</h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#666' }}>Nome Completo</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#666' }}>WhatsApp (com DDD)</label>
                            <input
                                type="text"
                                value={editForm.phone}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={saveEdit}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
