"use client";

import { useState, useEffect } from "react";
import styles from "../clients/clients.module.css";
import WorkoutBuilderModal from "../components/WorkoutBuilderModal";
import { getStudentsDB, saveStudent } from "../../../utils/storage";

export default function WorkoutsPage() {
    const [builderOpen, setBuilderOpen] = useState(false);
    const [builderStudent, setBuilderStudent] = useState(null);
    const [builderTitle, setBuilderTitle] = useState("Novo Treino");
    const [detailsWorkout, setDetailsWorkout] = useState(null);
    const [renewTarget, setRenewTarget] = useState(null);
    const [dbStudents, setDbStudents] = useState([]);
    const [activeWorkouts, setActiveWorkouts] = useState([]);
    const [showStudentSelector, setShowStudentSelector] = useState(false);

    const load = async () => {
        const db = await getStudentsDB();
        const studentsArr = Object.values(db);
        setDbStudents(studentsArr);

        const workouts = [];
        studentsArr.forEach(student => {
            if (student.workouts && student.workouts.length > 0) {
                student.workouts.forEach((w, index) => {
                    // Calculate days left from expiryDate
                    let daysLeft = 30;
                    let endDate = '-';
                    if (w.expiryDate) {
                        const expiry = new Date(w.expiryDate);
                        daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                        endDate = expiry.toLocaleDateString('pt-BR');
                    }
                    workouts.push({
                        ...w,
                        id: `${student.id}-${index}`,
                        clientId: student.id,
                        clientName: student.name,
                        initials: student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                        studentObj: student,
                        type: w.name || 'Planilha',
                        status: daysLeft < 0 ? 'expired' : daysLeft <= 7 ? 'warning' : 'active',
                        startDate: w.createdAt || '-',
                        endDate,
                        exercises: w.workouts?.reduce((acc, split) => acc + (split.exercises?.length || 0), 0) || 0,
                        daysLeft
                    });
                });
            }
        });
        setActiveWorkouts(workouts.reverse());
    };

    useEffect(() => {
        load();
        window.addEventListener("fitvision_storage_update", load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener("fitvision_storage_update", load);
            window.removeEventListener("storage", load);
        };
    }, []);

    const studentsWithAnamnesis = dbStudents.filter(s => s.anamnesis);

    const openRenewPanel = (workout) => setRenewTarget(workout);

    const proceedToBuilder = () => {
        const client = renewTarget.studentObj;
        setBuilderStudent(client);
        setBuilderTitle(`Renovar Treino - ${client.name}`);
        setBuilderOpen(true);
    };

    const deleteWorkoutGlobal = async (workout) => {
        if (window.confirm(`Excluir a planilha "${workout.type}" do aluno ${workout.clientName}?`)) {
            const student = workout.studentObj;
            const updatedWorkouts = [...student.workouts];
            const index = parseInt(workout.id.split('-').pop(), 10);
            updatedWorkouts.splice(index, 1);
            await saveStudent(student.id, { ...student, workouts: updatedWorkouts });
        }
    };

    const getDaysColor = (daysLeft) => {
        if (daysLeft < 0) return 'var(--danger)';
        if (daysLeft <= 7) return '#ffa500';
        return 'var(--accent)';
    };

    const getDaysLabel = (daysLeft) => {
        if (daysLeft < 0) return `Vencido ha ${Math.abs(daysLeft)} dias`;
        if (daysLeft === 0) return 'Vence hoje';
        return `${daysLeft} dias`;
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Treinos</h1>
                    <p className={styles.pageSubtitle}>Gerencie e monte treinos personalizados</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowStudentSelector(true)}>
                    + Novo Treino
                </button>
            </div>

            <div className={styles.clientsGrid}>
                {activeWorkouts.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #eee', gridColumn: '1 / -1' }}>
                        Nenhuma planilha de treino ativa.
                    </div>
                ) : (
                    activeWorkouts.map((workout) => (
                        <div key={workout.id} className="card" style={{ padding: 20 }}>
                            <div className={styles.clientCardTop}>
                                <div className={styles.clientCardAvatar} style={{ background: 'var(--gradient-primary)' }}>
                                    {workout.initials}
                                </div>
                                <div>
                                    <div className={styles.clientCardName}>{workout.clientName}</div>
                                    <div className={styles.clientCardEmail}>{workout.type}</div>
                                </div>
                                <span className={`badge ${workout.status === 'active' ? 'badge-success' : workout.status === 'warning' ? 'badge-warning' : 'badge-danger'}`}
                                    style={{ marginLeft: 'auto' }}>
                                    {workout.status === 'active' ? 'Ativo' : workout.status === 'warning' ? 'Expirando' : 'Expirado'}
                                </span>
                            </div>

                            <div className={styles.clientCardMeta}>
                                <div className={styles.metaItem}>
                                    <div className={styles.metaLabel}>Inicio</div>
                                    <div className={styles.metaValue}>{workout.startDate}</div>
                                </div>
                                <div className={styles.metaItem}>
                                    <div className={styles.metaLabel}>Fim</div>
                                    <div className={styles.metaValue}>{workout.endDate}</div>
                                </div>
                                <div className={styles.metaItem}>
                                    <div className={styles.metaLabel}>Exercicios</div>
                                    <div className={styles.metaValue}>{workout.exercises}</div>
                                </div>
                                <div className={styles.metaItem}>
                                    <div className={styles.metaLabel}>Dias Restantes</div>
                                    <div className={styles.metaValue} style={{ color: getDaysColor(workout.daysLeft), fontWeight: 700 }}>
                                        {getDaysLabel(workout.daysLeft)}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.clientCardActions}>
                                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                                    onClick={() => setDetailsWorkout(workout)}>Detalhes</button>
                                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                                    onClick={() => openRenewPanel(workout)}>Renovar</button>
                                <button className="btn btn-sm" style={{ background: '#ffeeee', color: '#ff4757', border: '1px solid #ffcccc' }}
                                    onClick={() => deleteWorkoutGlobal(workout)} title="Excluir">&#128465;</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* RENEWAL PANEL */}
            {renewTarget && !builderOpen && (
                <div className={styles.modalOverlay} onClick={() => setRenewTarget(null)}>
                    <div className={styles.modal} style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Renovar Treino - {renewTarget.clientName}</h3>
                            <button className={styles.modalClose} onClick={() => setRenewTarget(null)}>&#10005;</button>
                        </div>
                        <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {(() => {
                                const client = renewTarget.studentObj;
                                return client?.anamnesis ? (
                                    <>
                                        <div style={{ background: '#f0f2ff', borderRadius: 12, padding: 14, border: '1px solid rgba(108,92,231,0.15)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 10 }}>Anamnese</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '0.82rem' }}>
                                                <span>Objetivo: <strong>{client.anamnesis.basics.goal}</strong></span>
                                                <span>Frequencia: <strong>{client.anamnesis.lifestyle.trainingDays}x/semana</strong></span>
                                                <span>Lesoes: <strong>{client.anamnesis.injuries?.join(', ') || 'Nenhuma'}</strong></span>
                                                {client.anamnesis.lifestyle.muscleDifficulty && (
                                                    <span>Dificuldade: <strong>{client.anamnesis.lifestyle.muscleDifficulty}</strong></span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ background: '#e8fdf5', borderRadius: 12, padding: 14, border: '1px solid rgba(0,200,130,0.2)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#005f4a', marginBottom: 10 }}>
                                                Planilha Atual - {renewTarget.type}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {renewTarget.workouts?.map((w, wIdx) =>
                                                    w.exercises?.map((ex, exIdx) => (
                                                        <span key={`${wIdx}-${exIdx}`} style={{ background: 'white', border: '1px solid rgba(0,180,100,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
                                                            {w.letter}: {ex.name} <span style={{ color: '#888', fontWeight: 400 }}>{ex.sets}</span>
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Anamnese nao disponivel.</p>
                                );
                            })()}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className="btn btn-outline" onClick={() => setRenewTarget(null)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={proceedToBuilder}>Montar Novo Treino</button>
                        </div>
                    </div>
                </div>
            )}

            {/* WORKOUT BUILDER */}
            {builderOpen && builderStudent && (
                <WorkoutBuilderModal
                    isOpen={builderOpen}
                    onClose={() => { setBuilderOpen(false); setRenewTarget(null); }}
                    onSave={(plan) => {
                        const updatedStudent = {
                            ...builderStudent, status: 'Ativo',
                            workouts: [...(builderStudent.workouts || []), { ...plan, dateSaved: new Date().toISOString() }]
                        };
                        saveStudent(builderStudent.id, updatedStudent);
                        setBuilderOpen(false);
                        setRenewTarget(null);
                    }}
                    student={builderStudent}
                    modalTitle={builderTitle}
                    initialWorkouts={renewTarget ? renewTarget.workouts : null}
                />
            )}

            {/* DETAILS MODAL */}
            {detailsWorkout && (
                <div className={styles.modalOverlay} onClick={() => setDetailsWorkout(null)}>
                    <div className={styles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Detalhes do Treino</h3>
                            <button className={styles.modalClose} onClick={() => setDetailsWorkout(null)}>&#10005;</button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: 12, fontSize: '0.9rem' }}>Aluno: <strong>{detailsWorkout.clientName}</strong></p>
                            <p style={{ marginBottom: 8, fontSize: '0.9rem' }}>Tipo: <strong>{detailsWorkout.type}</strong></p>
                            <p style={{ marginBottom: 8, fontSize: '0.9rem' }}>Periodo: <strong>{detailsWorkout.startDate} - {detailsWorkout.endDate}</strong></p>
                            <p style={{ marginBottom: 16, fontSize: '0.9rem' }}>
                                Dias Restantes: <strong style={{ color: getDaysColor(detailsWorkout.daysLeft) }}>
                                    {getDaysLabel(detailsWorkout.daysLeft)}
                                </strong>
                            </p>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>Exercicios por divisao:</div>
                            {detailsWorkout.workouts?.map((w, i) => (
                                <div key={i} style={{ marginBottom: 12 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.80rem', color: 'var(--primary)', marginBottom: 4 }}>Treino {w.letter} - {w.title}</div>
                                    {w.exercises?.map((ex, exIdx) => (
                                        <div key={exIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                            <span>{ex.name}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>{ex.sets} - {ex.equipment}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className="btn btn-outline" onClick={() => setDetailsWorkout(null)}>Fechar</button>
                            <button className="btn btn-primary" onClick={() => { openRenewPanel(detailsWorkout); setDetailsWorkout(null); }}>Renovar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SELECT STUDENT MODAL */}
            {showStudentSelector && (
                <div className={styles.modalOverlay} onClick={() => setShowStudentSelector(false)}>
                    <div className={styles.modal} style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Selecione um Aluno</h3>
                            <button className={styles.modalClose} onClick={() => setShowStudentSelector(false)}>&#10005;</button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                                Alunos que ja preencheram a anamnese e estao prontos para receber um treino:
                            </p>
                            {studentsWithAnamnesis.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    Nenhum aluno preencheu a anamnese ainda.
                                </p>
                            ) : (
                                studentsWithAnamnesis.map(student => (
                                    <div key={student.id}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e1e4e8' }}
                                        onClick={() => {
                                            setBuilderStudent(student);
                                            setBuilderTitle(`Novo Treino - ${student.name}`);
                                            setShowStudentSelector(false);
                                            setBuilderOpen(true);
                                        }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#333' }}>{student.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                {student.anamnesis.basics.goal} - {student.anamnesis.lifestyle.trainingDays}x na semana
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm" style={{ padding: '6px 14px', borderRadius: '8px' }}>
                                            Gerar Treino
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
