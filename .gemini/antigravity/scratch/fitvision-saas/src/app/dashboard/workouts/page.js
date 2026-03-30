"use client";

import { useState, useEffect } from "react";
import styles from "../clients/clients.module.css";
import WorkoutBuilderModal from "../components/WorkoutBuilderModal";
import { getStudentsDB, saveStudent } from "../../../utils/storage";

export default function WorkoutsPage() {
    const [builderOpen, setBuilderOpen] = useState(false);
    const [builderStudent, setBuilderStudent] = useState(null);
    const [builderTitle, setBuilderTitle] = useState("Sugestão de Treino");
    const [detailsWorkout, setDetailsWorkout] = useState(null);
    const [renewTarget, setRenewTarget] = useState(null);

    const [dbStudents, setDbStudents] = useState([]);
    const [activeWorkouts, setActiveWorkouts] = useState([]);
    const [showStudentSelector, setShowStudentSelector] = useState(false);

    useEffect(() => {
        const load = () => {
            const db = getStudentsDB();
            const studentsArr = Object.values(db);
            setDbStudents(studentsArr);

            const workouts = [];
            studentsArr.forEach(student => {
                if (student.workouts && student.workouts.length > 0) {
                    student.workouts.forEach((w, index) => {
                        workouts.push({
                            ...w,
                            // Ensure meta properties exist
                            id: `${student.id}-${index}`,
                            clientId: student.id,
                            clientName: student.name,
                            initials: student.name.split(' ').map(n => n[0]).join('').substring(0, 2),
                            studentObj: student,
                            type: w.name || "Planilha",
                            status: w.status === "Ativo" ? "active" : "expired",
                            startDate: w.createdAt || "-",
                            endDate: "-", // Add logic for end date if needed
                            exercises: w.workouts?.reduce((acc, split) => acc + (split.exercises?.length || 0), 0) || 0,
                            daysLeft: 30 // Dummy days left
                        });
                    });
                }
            });
            setActiveWorkouts(workouts.reverse()); // latest first
        };
        load();
        
        window.addEventListener("fitvision_storage_update", load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener("fitvision_storage_update", load);
            window.removeEventListener("storage", load);
        };
    }, []);

    // Filter students who have filled their anamnesis
    const studentsWithAnamnesis = dbStudents.filter(s => s.anamnesis);

    // Open selector for a brand-new workout
    const openNew = () => {
        setShowStudentSelector(true);
    };

    // Open renewal: show context panel first
    const openRenewPanel = (workout) => {
        setRenewTarget(workout);
    };

    // Proceed from context panel into builder
    const proceedToBuilder = () => {
        const client = renewTarget.studentObj;
        setBuilderStudent(client);
        setBuilderTitle(`Renovar Treino — ${client.name}`);
        setBuilderOpen(true);
    };

    const deleteWorkoutGlobal = (workout) => {
        if (window.confirm(`Tem certeza que deseja excluir a planilha "${workout.type}" do aluno ${workout.clientName}?`)) {
            const student = workout.studentObj;
            const updatedWorkouts = [...student.workouts];
            
            // Extract the original index
            const indexStr = workout.id.split('-')[1];
            const index = parseInt(indexStr, 10);
            
            updatedWorkouts.splice(index, 1);
            
            const updatedStudent = {
                ...student,
                workouts: updatedWorkouts
            };
            
            saveStudent(student.id, updatedStudent);
            // The event listener will auto-refresh the list
        }
    };

    return (
        <>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>🏋️ Treinos</h1>
                    <p className={styles.pageSubtitle}>Gerencie e monte treinos personalizados</p>
                </div>
                <button className="btn btn-primary" onClick={openNew}>➕ Novo Treino</button>
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
                            <div className={styles.clientCardAvatar} style={{
                                background: workout.id % 2 === 0 ? "var(--gradient-accent)" : "var(--gradient-primary)"
                            }}>
                                {workout.initials}
                            </div>
                            <div>
                                <div className={styles.clientCardName}>{workout.clientName}</div>
                                <div className={styles.clientCardEmail}>{workout.type}</div>
                            </div>
                            <span className={`badge ${workout.status === "active" ? "badge-success" : workout.status === "warning" ? "badge-warning" : "badge-danger"}`}
                                style={{ marginLeft: "auto" }}>
                                {workout.status === "active" ? "Ativo" : workout.status === "warning" ? "Expirando" : "Expirado"}
                            </span>
                        </div>

                        <div className={styles.clientCardMeta}>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Início</div>
                                <div className={styles.metaValue}>{workout.startDate}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Fim</div>
                                <div className={styles.metaValue}>{workout.endDate}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Exercícios</div>
                                <div className={styles.metaValue}>{workout.exercises}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Dias Restantes</div>
                                <div className={styles.metaValue} style={{
                                    color: workout.daysLeft <= 3 ? "var(--danger)" : workout.daysLeft <= 7 ? "var(--warning)" : "var(--accent)"
                                }}>
                                    {workout.daysLeft > 0 ? `${workout.daysLeft} dias` : "Expirado"}
                                </div>
                            </div>
                        </div>

                        <div className={styles.clientCardActions}>
                            <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                                onClick={() => setDetailsWorkout(workout)}>📄 Detalhes</button>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                                onClick={() => openRenewPanel(workout)}>🔄 Renovar</button>
                            <button className="btn btn-sm" style={{ background: '#ffeeee', color: '#ff4757', border: '1px solid #ffcccc' }}
                                onClick={() => deleteWorkoutGlobal(workout)} title="Excluir">🗑️</button>
                        </div>
                    </div>
                )))}
            </div>

            {/* ── RENEWAL CONTEXT PANEL ─────────────────────────────────────────── */}
            {renewTarget && !builderOpen && (
                <div className={styles.modalOverlay} onClick={() => setRenewTarget(null)}>
                    <div className={styles.modal} style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>🔄 Renovar Treino — {renewTarget.clientName}</h3>
                            <button className={styles.modalClose} onClick={() => setRenewTarget(null)}>✕</button>
                        </div>
                        <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {(() => {
                                const client = renewTarget.studentObj;
                                return client?.anamnesis ? (
                                    <>
                                        {/* Anamnese */}
                                        <div style={{ background: "#f0f2ff", borderRadius: 12, padding: 14, border: "1px solid rgba(108,92,231,0.15)" }}>
                                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary)", marginBottom: 10 }}>📋 Anamnese</div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: "0.82rem" }}>
                                                <span>🎯 Objetivo: <strong>{client.anamnesis.basics.goal}</strong></span>
                                                <span>📅 Frequência: <strong>{client.anamnesis.lifestyle.trainingDays}x/semana</strong></span>
                                                <span>⚠️ Lesões: <strong>{client.anamnesis.injuries?.join(", ") || "Nenhuma"}</strong></span>
                                                {client.anamnesis.lifestyle.muscleDifficulty && (
                                                    <span>💪 Dificuldade: <strong>{client.anamnesis.lifestyle.muscleDifficulty}</strong></span>
                                                )}
                                            </div>
                                        </div>

                                         {/* Previous workout */}
                                        <div style={{ background: "#e8fdf5", borderRadius: 12, padding: 14, border: "1px solid rgba(0,200,130,0.2)" }}>
                                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#005f4a", marginBottom: 10 }}>
                                                🏋️ Planilha Atual — {renewTarget.type}
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                {renewTarget.workouts?.map((w, wIdx) => 
                                                    w.exercises?.map((ex, exIdx) => (
                                                        <span key={`${wIdx}-${exIdx}`} style={{ background: "white", border: "1px solid rgba(0,180,100,0.2)", borderRadius: 8, padding: "4px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
                                                            {w.letter}: {ex.name} <span style={{ color: "#888", fontWeight: 400 }}>{ex.sets}</span>
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Anamnese não disponível para este aluno.</p>
                                );
                            })()}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className="btn btn-outline" onClick={() => setRenewTarget(null)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={proceedToBuilder}>
                                🏋️ Montar Novo Treino
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── WORKOUT BUILDER (shared component) ────────────────────────────── */}
            {builderOpen && builderStudent && (
                <WorkoutBuilderModal
                    isOpen={builderOpen}
                    onClose={() => { setBuilderOpen(false); setRenewTarget(null); }}
                    onSave={(plan) => { 
                        const updatedStudent = {
                            ...builderStudent,
                            status: "Ativo",
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

            {/* ── DETAILS MODAL ─────────────────────────────────────────────────── */}
            {detailsWorkout && (
                <div className={styles.modalOverlay} onClick={() => setDetailsWorkout(null)}>
                    <div className={styles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>📄 Detalhes do Treino</h3>
                            <button className={styles.modalClose} onClick={() => setDetailsWorkout(null)}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>Aluno: <strong>{detailsWorkout.clientName}</strong></p>
                            <p style={{ marginBottom: 8, fontSize: "0.9rem" }}>🏋️ Tipo: <strong>{detailsWorkout.type}</strong></p>
                            <p style={{ marginBottom: 8, fontSize: "0.9rem" }}>📅 Período: <strong>{detailsWorkout.startDate} → {detailsWorkout.endDate}</strong></p>
                            <p style={{ marginBottom: 16, fontSize: "0.9rem" }}>
                                ⏳ Dias Restantes: <strong style={{ color: detailsWorkout.daysLeft <= 3 ? "var(--danger)" : detailsWorkout.daysLeft <= 7 ? "var(--warning)" : "var(--accent)" }}>
                                    {detailsWorkout.daysLeft > 0 ? `${detailsWorkout.daysLeft} dias` : "Expirado"}
                                </strong>
                            </p>
                            <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, color: "var(--text-secondary)" }}>Exercícios (Por divisão):</div>
                            {detailsWorkout.workouts?.map((w, i) => (
                                <div key={i} style={{ marginBottom: 12 }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.80rem", color: "var(--primary)", marginBottom: 4 }}>Treino {w.letter} - {w.title}</div>
                                    {w.exercises?.map((ex, exIdx) => (
                                        <div key={exIdx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                                            <span>{ex.name}</span>
                                            <span style={{ color: "var(--text-muted)" }}>{ex.sets} · {ex.equipment}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className="btn btn-outline" onClick={() => setDetailsWorkout(null)}>Fechar</button>
                            <button className="btn btn-primary" onClick={() => { openRenewPanel(detailsWorkout); setDetailsWorkout(null); }}>🔄 Renovar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SELECT STUDENT MODAL (For New Workout) ───────────────────────── */}
            {showStudentSelector && (
                <div className={styles.modalOverlay} onClick={() => setShowStudentSelector(false)}>
                    <div className={styles.modal} style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Selecione um Aluno</h3>
                            <button className={styles.modalClose} onClick={() => setShowStudentSelector(false)}>✕</button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                                Alunos que já preencheram a anamnese e estão prontos para receber um treino:
                            </p>
                            {studentsWithAnamnesis.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    Nenhum aluno preencheu a anamnese ainda.
                                </p>
                            ) : (
                                studentsWithAnamnesis.map(student => (
                                    <div key={student.id} 
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e1e4e8', transition: 'all 0.2s' }}
                                        onClick={() => {
                                            setBuilderStudent(student);
                                            setBuilderTitle(`Novo Treino — ${student.name}`);
                                            setShowStudentSelector(false);
                                            setBuilderOpen(true);
                                        }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#333' }}>{student.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                🎯 {student.anamnesis.basics.goal} • {student.anamnesis.lifestyle.trainingDays}x na semana
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm" style={{ padding: '6px 14px', borderRadius: '8px' }}>Gerar Treino</button>
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
