"use client";

import { useState } from "react";
import styles from "../client.module.css";
import Link from "next/link";

/* ===== EXERCISE DATA PER WORKOUT DAY ===== */
const workoutDays = {
    A: {
        label: "Treino A",
        focus: "Peito / Tríceps",
        exercises: [
            {
                id: 1,
                name: "Supino Reto com Barra",
                muscle: "Peito",
                icon: "🏋️",
                sets: 4,
                defaultReps: "12x",
                note: "Diminui repetição — aumenta carga",
                videoUrl: "#",
            },
            {
                id: 2,
                name: "Supino Inclinado com Halteres",
                muscle: "Peito Superior",
                icon: "🏋️",
                sets: 4,
                defaultReps: "10x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 3,
                name: "Crucifixo na Máquina",
                muscle: "Peito",
                icon: "🏋️",
                sets: 3,
                defaultReps: "15x",
                note: "Manter contração no pico",
                videoUrl: "#",
            },
            {
                id: 4,
                name: "Tríceps Pulley (Corda)",
                muscle: "Tríceps",
                icon: "💪",
                sets: 4,
                defaultReps: "15x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 5,
                name: "Tríceps Testa com Barra EZ",
                muscle: "Tríceps",
                icon: "💪",
                sets: 3,
                defaultReps: "12x",
                note: "Manter cotovelos fixos",
                videoUrl: "#",
            },
        ],
    },
    B: {
        label: "Treino B",
        focus: "Costas / Bíceps",
        exercises: [
            {
                id: 6,
                name: "Puxada Frontal Aberta",
                muscle: "Costas",
                icon: "💪",
                sets: 4,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 7,
                name: "Remada Curvada com Barra",
                muscle: "Costas",
                icon: "💪",
                sets: 4,
                defaultReps: "10x",
                note: "Manter lombar neutra",
                videoUrl: "#",
            },
            {
                id: 8,
                name: "Remada Unilateral com Halter",
                muscle: "Dorsal",
                icon: "💪",
                sets: 3,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 9,
                name: "Rosca Direta com Barra",
                muscle: "Bíceps",
                icon: "💪",
                sets: 3,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 10,
                name: "Rosca Martelo com Halteres",
                muscle: "Bíceps",
                icon: "💪",
                sets: 3,
                defaultReps: "15x",
                note: "Alternado",
                videoUrl: "#",
            },
        ],
    },
    C: {
        label: "Treino C",
        focus: "Pernas / Glúteos",
        exercises: [
            {
                id: 11,
                name: "Agachamento Livre com Barra",
                muscle: "Quadríceps / Glúteos",
                icon: "🦵",
                sets: 4,
                defaultReps: "10x",
                note: "Descer até paralelo",
                videoUrl: "#",
            },
            {
                id: 12,
                name: "Leg Press 45°",
                muscle: "Pernas",
                icon: "🦵",
                sets: 4,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 13,
                name: "Cadeira Extensora",
                muscle: "Quadríceps",
                icon: "🦵",
                sets: 3,
                defaultReps: "15x",
                note: "Segurar na contração 2s",
                videoUrl: "#",
            },
            {
                id: 14,
                name: "Stiff com Barra",
                muscle: "Posterior / Glúteos",
                icon: "🦵",
                sets: 3,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 15,
                name: "Panturrilha em Pé",
                muscle: "Panturrilha",
                icon: "🦵",
                sets: 4,
                defaultReps: "20x",
                note: "Amplitude total",
                videoUrl: "#",
            },
        ],
    },
    D: {
        label: "Treino D",
        focus: "Ombros / Core",
        exercises: [
            {
                id: 16,
                name: "Desenvolvimento com Halteres Sentado",
                muscle: "Deltóide",
                icon: "🔱",
                sets: 4,
                defaultReps: "10x",
                note: "Diminui repetição — aumenta carga",
                videoUrl: "#",
            },
            {
                id: 17,
                name: "Elevação Lateral com Halteres",
                muscle: "Deltóide Lateral",
                icon: "🔱",
                sets: 4,
                defaultReps: "15x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 18,
                name: "Elevação Frontal Alternada",
                muscle: "Deltóide Anterior",
                icon: "🔱",
                sets: 3,
                defaultReps: "12x",
                note: "",
                videoUrl: "#",
            },
            {
                id: 19,
                name: "Prancha Abdominal",
                muscle: "Core",
                icon: "🔥",
                sets: 3,
                defaultReps: "45s",
                note: "Isométrico",
                videoUrl: "#",
            },
            {
                id: 20,
                name: "Abdominal Infra na Barra",
                muscle: "Core Inferior",
                icon: "🔥",
                sets: 3,
                defaultReps: "15x",
                note: "",
                videoUrl: "#",
            },
        ],
    },
};

/* ===== ANAMNESE QUESTIONS ===== */
const anamneseQuestions = [
    { id: "injury", label: "Possui alguma lesão ou dor?", type: "text", placeholder: "Descreva lesões..." },
    { id: "diseases", label: "Doenças ou condições?", type: "text", placeholder: "Ex: diabetes..." },
    { id: "medications", label: "Medicamentos contínuos?", type: "text", placeholder: "Liste..." },
    { id: "experience", label: "Nível de experiência", type: "select", options: ["Iniciante", "Intermediário", "Avançado"] },
    { id: "frequency", label: "Treinos por semana?", type: "select", options: ["2x", "3x", "4x", "5x", "6x"] },
    { id: "sleep", label: "Horas de sono", type: "select", options: ["< 5h", "5-6h", "6-7h", "7-8h", "> 8h"] },
    { id: "nutrition", label: "Alimentação", type: "select", options: ["Ruim", "Regular", "Boa", "Excelente"] },
    { id: "goals", label: "Objetivos específicos", type: "textarea", placeholder: "Descreva seus objetivos..." },
];

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState("workouts"); // "assessment" | "workouts"
    const [activeDay, setActiveDay] = useState("A");
    const [videoModal, setVideoModal] = useState(null);
    const [anamneseData, setAnamneseData] = useState({});

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

    const currentDay = workoutDays[activeDay];

    // Calculate progress
    const totalSets = currentDay.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = currentDay.exercises.reduce((sum, ex) => {
        let done = 0;
        for (let i = 0; i < ex.sets; i++) {
            if (getSetsData(ex.id, i).done) done++;
        }
        return sum + done;
    }, 0);
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
                    <span>Rafael Mendes</span>
                    <div className={styles.clientTopAvatar}>RM</div>
                </div>
            </div>

            <div className={styles.clientBody}>
                {/* Tabs */}
                <div className={styles.clientTabs}>
                    <button
                        className={`${styles.clientTab} ${activeTab === "assessment" ? styles.clientTabActive : ""}`}
                        onClick={() => setActiveTab("assessment")}
                    >
                        📋 Avaliação
                    </button>
                    <button
                        className={`${styles.clientTab} ${activeTab === "workouts" ? styles.clientTabActive : ""}`}
                        onClick={() => setActiveTab("workouts")}
                    >
                        🏋️ Meus Treinos
                    </button>
                </div>

                {/* ===== ASSESSMENT TAB ===== */}
                {activeTab === "assessment" && (
                    <>
                        <div className={styles.assessmentWelcome}>
                            <div className={styles.assessmentWelcomeIcon}>📷</div>
                            <h2 className={styles.assessmentWelcomeTitle}>Avaliação Física</h2>
                            <p className={styles.assessmentWelcomeText}>
                                Envie suas 4 fotos padrão e preencha o questionário de anamnese para que seu Personal possa montar o treino ideal.
                            </p>
                        </div>

                        {/* Photo Upload */}
                        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                📷 Fotos de Avaliação
                            </h3>
                            <div className={styles.photoGrid}>
                                {["Frontal", "Lateral Esquerda", "Lateral Direita", "Costas"].map((angle) => (
                                    <div key={angle} className={styles.photoUpload}>
                                        <div className={styles.photoUploadIcon}>📷</div>
                                        <div className={styles.photoUploadLabel}>{angle}</div>
                                        <div className={styles.photoUploadHint}>Toque para enviar</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Anamnesis */}
                        <div className="card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                📋 Anamnese
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
                                ✓ Enviar Avaliação
                            </button>
                        </div>
                    </>
                )}

                {/* ===== WORKOUTS TAB ===== */}
                {activeTab === "workouts" && (
                    <>
                        {/* Progress Summary */}
                        <div className={styles.progressSummary}>
                            <div className={styles.progressInfo}>
                                <div className={styles.progressTitle}>
                                    {currentDay.label} — {currentDay.focus}
                                </div>
                                <div className={styles.progressSubtext}>
                                    {completedSets}/{totalSets} séries completadas
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
                        </div>

                        {/* Day Tabs */}
                        <div className={styles.dayTabs}>
                            {Object.entries(workoutDays).map(([key, day]) => (
                                <button
                                    key={key}
                                    className={`${styles.dayTab} ${activeDay === key ? styles.dayTabActive : ""}`}
                                    onClick={() => setActiveDay(key)}
                                >
                                    <span>Treino {key}</span>
                                    <span className={styles.dayTabLabel}>{day.focus}</span>
                                </button>
                            ))}
                        </div>

                        {/* Exercise Cards */}
                        {currentDay.exercises.map((exercise) => (
                            <div key={exercise.id} className={styles.exerciseCard}>
                                {/* Header */}
                                <div className={styles.exerciseCardHeader}>
                                    <div className={styles.exerciseHeaderLeft}>
                                        <div className={styles.exerciseCardIcon}>{exercise.icon}</div>
                                        <div>
                                            <div className={styles.exerciseCardName}>{exercise.name}</div>
                                            <div className={styles.exerciseCardMuscle}>{exercise.muscle}</div>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.videoBtn}
                                        onClick={() => setVideoModal(exercise)}
                                    >
                                        <span className={styles.videoBtnIcon}>▶</span>
                                        Assista
                                    </button>
                                </div>

                                {/* Sets Table */}
                                <table className={styles.setsTable}>
                                    <thead>
                                        <tr>
                                            <th>Série</th>
                                            <th>Reps</th>
                                            <th>Carga</th>
                                            <th>✓</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: exercise.sets }, (_, i) => {
                                            const setData = getSetsData(exercise.id, i);
                                            return (
                                                <tr
                                                    key={i}
                                                    className={setData.done ? styles.completedRow : ""}
                                                >
                                                    <td>
                                                        <span className={styles.setNumber}>{i + 1}ª</span>
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.setInput}
                                                            placeholder={exercise.defaultReps}
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
                                                            <span className={styles.checkboxVisual}>✓</span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Note */}
                                {exercise.note && (
                                    <div className={styles.exerciseNote}>
                                        <span className={styles.exerciseNoteIcon}>📝</span>
                                        {exercise.note}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Video Modal */}
            {videoModal && (
                <div className={styles.videoModal} onClick={() => setVideoModal(null)}>
                    <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.videoModalHeader}>
                            <h3 className={styles.videoModalTitle}>
                                🎬 {videoModal.name}
                            </h3>
                            <button
                                className={styles.videoModalClose}
                                onClick={() => setVideoModal(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.videoPlaceholder}>
                            <div className={styles.videoPlaceholderIcon}>▶</div>
                            <span>Vídeo demonstrativo do exercício</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {videoModal.muscle} · {videoModal.name}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
