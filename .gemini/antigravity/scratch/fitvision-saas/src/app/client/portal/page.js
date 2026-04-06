"use client";

import { useState, useEffect } from "react";
import styles from "../client.module.css";
import Link from "next/link";

// storage loaded dynamically
/* ===== ANAMNESE QUESTIONS ===== */
const anamneseQuestions = [
    { id: "injury", label: "Possui alguma lesÃ£o ou dor?", type: "text", placeholder: "Descreva lesÃµes..." },
    { id: "diseases", label: "DoenÃ§as ou condiÃ§Ãµes?", type: "text", placeholder: "Ex: diabetes..." },
    { id: "medications", label: "Medicamentos contÃ­nuos?", type: "text", placeholder: "Liste..." },
    { id: "experience", label: "NÃ­vel de experiÃªncia", type: "select", options: ["Iniciante", "IntermediÃ¡rio", "AvanÃ§ado"] },
    { id: "frequency", label: "Treinos por semana?", type: "select", options: ["2x", "3x", "4x", "5x", "6x"] },
    { id: "sleep", label: "Horas de sono", type: "select", options: ["< 5h", "5-6h", "6-7h", "7-8h", "> 8h"] },
    { id: "nutrition", label: "AlimentaÃ§Ã£o", type: "select", options: ["Ruim", "Regular", "Boa", "Excelente"] },
    { id: "goals", label: "Objetivos especÃ­ficos", type: "textarea", placeholder: "Descreva seus objetivos..." },
];

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState("workouts"); // "assessment" | "workouts"
    const [activeDay, setActiveDay] = useState(0);
    const [videoModal, setVideoModal] = useState(null);
    const [anamneseData, setAnamneseData] = useState({});
    
    // Dynamic E2E State
    const [student, setStudent] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { supabase } = await import("../../../utils/supabase");
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { setLoading(false); return; }

                const { getStudentByEmail } = await import("../../../utils/storage");
                const foundStudent = await getStudentByEmail(user.email);

                if (foundStudent) {
                    setStudent(foundStudent);
                    // workoutPlan = array de splits do último plano
                    if (foundStudent.workouts && foundStudent.workouts.length > 0) {
                        const lastPlan = foundStudent.workouts[foundStudent.workouts.length - 1];
                        setWorkoutPlan(lastPlan.workouts || []);
                    }
                }
            } catch (err) {
                console.error("Portal load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // State: { exerciseId: { setIndex: { reps, load, done } } }
    const [setsState, setSetsState] = useState({});

    const getSetsData = (exerciseId, setIndex) => {
        return setsState?.[exerciseId]?.[setIndex] || { reps: "", load: "", done: false };
    };

    const updateSet = (exerciseId, setIndex, field, value) => {
        setSetsState((prev) => ({
            ...prev,
            [exerciseId]: {
                ...prev[exerciseId],
                [setIndex]: {
                    ...getSetsData(exerciseId, setIndex),
                    [field]: value,
                },
            },
        }));
    };

    if (loading) return <div style={{ padding: 40, color: 'white', textAlign: 'center' }}>Carregando seu portal...</div>;
    
    if (!student) return <div style={{ padding: 40, color: 'white', textAlign: 'center' }}>Aluno nÃ£o encontrado. Por favor, volte e faÃ§a login com o email cadastrado na sua ficha de anamnese.</div>;

    const currentDay = workoutPlan[activeDay] || null;

    // Calculate progress
    let totalSets = 0;
    let completedSets = 0;
    
    if (currentDay) {
        totalSets = currentDay.exercises.reduce((sum, ex) => sum + (ex.setsArray ? ex.setsArray.length : 1), 0);
        completedSets = currentDay.exercises.reduce((sum, ex) => {
            let done = 0;
            const setLength = ex.setsArray ? ex.setsArray.length : 1;
            for (let i = 0; i < setLength; i++) {
                if (getSetsData(ex.id, i).done) done++;
            }
            return sum + done;
        }, 0);
    }
    
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
        <div className={styles.clientDash}>
            {/* Top Bar */}
            <div className={styles.clientTopBar}>
                <Link href="/client/portal" className={styles.clientTopLogo} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#191E22', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>
                    <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "44px", objectFit: "contain" }} />
                    <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                        <span style={{ color: '#D4FF00' }}>Fit</span>
                        <span style={{ color: '#B46BFB' }}>Vision</span>
                    </span>
                </Link>
                <div className={styles.clientTopUser}>
                    <span>{student.name}</span>
                    <div className={styles.clientTopAvatar}>
                        {student.name.substring(0,2).toUpperCase()}
                    </div>
                </div>
            </div>

            <div className={styles.clientBody}>
                {/* Tabs */}
                <div className={styles.clientTabs}>
                    <button
                        className={`${styles.clientTab} ${activeTab === "assessment" ? styles.clientTabActive : ""}`}
                        onClick={() => setActiveTab("assessment")}
                    >
                        ðŸ“‹ AvaliaÃ§Ã£o
                    </button>
                    <button
                        className={`${styles.clientTab} ${activeTab === "workouts" ? styles.clientTabActive : ""}`}
                        onClick={() => setActiveTab("workouts")}
                    >
                        ðŸ‹ï¸ Meus Treinos
                    </button>
                </div>

                {/* ===== ASSESSMENT TAB ===== */}
                {activeTab === "assessment" && (
                    <>
                        <div className={styles.assessmentWelcome}>
                            <div className={styles.assessmentWelcomeIcon}>ðŸ“·</div>
                            <h2 className={styles.assessmentWelcomeTitle}>AvaliaÃ§Ã£o FÃ­sica</h2>
                            <p className={styles.assessmentWelcomeText}>
                                Envie suas 4 fotos padrÃ£o e preencha o questionÃ¡rio de anamnese para que seu Personal possa montar o treino ideal.
                            </p>
                        </div>

                        {/* Photo Upload */}
                        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                ðŸ“· Fotos de AvaliaÃ§Ã£o
                            </h3>
                            <div className={styles.photoGrid}>
                                {["Frontal", "Lateral Esquerda", "Lateral Direita", "Costas"].map((angle) => (
                                    <div key={angle} className={styles.photoUpload}>
                                        <div className={styles.photoUploadIcon}>ðŸ“·</div>
                                        <div className={styles.photoUploadLabel}>{angle}</div>
                                        <div className={styles.photoUploadHint}>Toque para enviar</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Anamnesis */}
                        <div className="card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                ðŸ“‹ Anamnese
                            </h3>
                            {anamneseQuestions.map((q) => (
                                <div key={q.id} style={{ marginBottom: 14 }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                                        {q.label}
                                    </label>
                                    {q.type === "text" && (
                                        <input
                                            style={{ width: "100%", padding: "10px 14px", fontSize: "0.9rem", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                                            placeholder={q.placeholder}
                                            value={anamneseData[q.id] || ""}
                                            onChange={(e) => setAnamneseData({ ...anamneseData, [q.id]: e.target.value })}
                                        />
                                    )}
                                    {q.type === "textarea" && (
                                        <textarea
                                            rows={3}
                                            style={{ width: "100%", padding: "10px 14px", fontSize: "0.9rem", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical" }}
                                            placeholder={q.placeholder}
                                            value={anamneseData[q.id] || ""}
                                            onChange={(e) => setAnamneseData({ ...anamneseData, [q.id]: e.target.value })}
                                        />
                                    )}
                                    {q.type === "select" && (
                                        <select
                                            style={{ width: "100%", padding: "10px 14px", fontSize: "0.9rem", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                                            value={anamneseData[q.id] || ""}
                                            onChange={(e) => setAnamneseData({ ...anamneseData, [q.id]: e.target.value })}
                                        >
                                            <option value="">Selecione</option>
                                            {q.options.map((opt) => <option key={opt}>{opt}</option>)}
                                        </select>
                                    )}
                                </div>
                            ))}
                            <button className="btn btn-accent" style={{ width: "100%", marginTop: 8 }}>
                                âœ“ Enviar AvaliaÃ§Ã£o
                            </button>
                        </div>
                    </>
                )}

                {/* ===== WORKOUTS TAB ===== */}
                {activeTab === "workouts" && (
                    <>
                        {/* Progress Summary */}
                        {currentDay && <div className={styles.progressSummary}>
                            <div className={styles.progressInfo}>
                                <div className={styles.progressTitle}>
                                    {currentDay.label} â€” {currentDay.focus}
                                </div>
                                <div className={styles.progressSubtext}>
                                    {completedSets}/{totalSets} sÃ©ries completadas
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div
                                className={styles.progressPercent}
                                style={{ color: progressPercent === 100 ? "var(--accent)" : "var(--primary-light)" }}
                            >
                                {progressPercent}%
                            </div>
                        </div>}

                        {/* Day Tabs */}
                        {workoutPlan.length > 0 ? (
                            <div className={styles.dayTabs}>
                                {workoutPlan.map((day, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.dayTab} ${activeDay === index ? styles.dayTabActive : ""}`}
                                        onClick={() => setActiveDay(index)}
                                    >
                                        <span>Treino {day.letter}</span>
                                        <span className={styles.dayTabLabel}>{day.title}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--card-bg)", borderRadius: 16 }}>
                                <h3>VocÃª ainda nÃ£o possui nenhum treino montado!</h3>
                                <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Aguarde seu treinador gerar o seu treino ou preencha a sua Ficha de Anamnese caso ainda nÃ£o tenha feito.</p>
                            </div>
                        )}

                        {/* Exercise Cards */}
                        {currentDay && currentDay.exercises.map((exercise) => {
                            const setLength = exercise.setsArray ? exercise.setsArray.length : 1;
                            return (
                            <div key={exercise.id} className={styles.exerciseCard}>
                                {/* Header */}
                                <div className={styles.exerciseCardHeader}>
                                    <div className={styles.exerciseHeaderLeft}>
                                        <div className={styles.exerciseCardIcon}>ðŸ‹ï¸</div>
                                        <div>
                                            <div className={styles.exerciseCardName}>{exercise.name}</div>
                                            <div className={styles.exerciseCardMuscle}>{exercise.muscle || "Diversos"}</div>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.videoBtn}
                                        onClick={() => setVideoModal(exercise)}
                                    >
                                        <span className={styles.videoBtnIcon}>â–¶</span>
                                        Assista
                                    </button>
                                </div>

                                {/* Sets Table */}
                                <table className={styles.setsTable}>
                                    <thead>
                                        <tr>
                                            <th>SÃ©rie</th>
                                            <th>Reps</th>
                                            <th>Carga</th>
                                            <th>âœ“</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: setLength }, (_, i) => {
                                            const defaultRep = exercise.setsArray ? exercise.setsArray[i]?.reps : "-";
                                            const setData = getSetsData(exercise.id, i);
                                            return (
                                                <tr
                                                    key={i}
                                                    className={setData.done ? styles.completedRow : ""}
                                                >
                                                    <td>
                                                        <span className={styles.setNumber}>{i + 1}Âª</span>
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.setInput}
                                                            placeholder={`${defaultRep}x`}
                                                            value={setData.reps}
                                                            onChange={(e) =>
                                                                updateSet(exercise.id, i, "reps", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.setInput}
                                                            placeholder="0 kg"
                                                            value={setData.load}
                                                            onChange={(e) =>
                                                                updateSet(exercise.id, i, "load", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className={styles.setCheckbox}>
                                                            <input
                                                                type="checkbox"
                                                                checked={setData.done}
                                                                onChange={(e) =>
                                                                    updateSet(exercise.id, i, "done", e.target.checked)
                                                                }
                                                            />
                                                            <span className={styles.checkboxVisual}>âœ“</span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Note */}
                                {exercise.professionalObservation && (
                                    <div className={styles.exerciseNote} style={{ borderLeft: "3px solid var(--primary)" }}>
                                        <span className={styles.exerciseNoteIcon}>ðŸ‘¨â€ðŸ«</span>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: 2 }}>ObservaÃ§Ã£o do Professor</strong>
                                            {exercise.professionalObservation}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )})}
                    </>
                )}
            </div>

            {/* Video Modal */}
            {videoModal && (
                <div className={styles.videoModal} onClick={() => setVideoModal(null)}>
                    <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.videoModalHeader}>
                            <h3 className={styles.videoModalTitle}>
                                ðŸŽ¬ {videoModal.name}
                            </h3>
                            <button
                                className={styles.videoModalClose}
                                onClick={() => setVideoModal(null)}
                            >
                                âœ•
                            </button>
                        </div>
                        <div className={styles.videoPlaceholder}>
                            <div className={styles.videoPlaceholderIcon}>â–¶</div>
                            <span>VÃ­deo demonstrativo do exercÃ­cio</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {videoModal.muscle} Â· {videoModal.name}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
