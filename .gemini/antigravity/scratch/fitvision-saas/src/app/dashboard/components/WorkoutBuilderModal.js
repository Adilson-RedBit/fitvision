"use client";

import { useState, useEffect } from "react";
import styles from "../clients/details.module.css";

// â”€â”€ Exercise Database â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const exerciseDB = {
    Peito: [
        { name: "Supino Reto", sets: "4x12", equipment: "Barra", rest: "60s" },
        { name: "Supino Inclinado", sets: "4x10", equipment: "Halter", rest: "60s" },
        { name: "Crucifixo", sets: "3x15", equipment: "Halter", rest: "45s" },
        { name: "Crossover", sets: "3x15", equipment: "Cabo", rest: "45s" },
        { name: "Supino Declinado", sets: "3x12", equipment: "Barra", rest: "60s" },
        { name: "Flexão de Braço", sets: "3x15", equipment: "Peso Corporal", rest: "45s" },
    ],
    Costas: [
        { name: "Puxada Frontal", sets: "4x12", equipment: "Cabo", rest: "60s" },
        { name: "Remada Curvada", sets: "4x10", equipment: "Barra", rest: "60s" },
        { name: "Remada Unilateral", sets: "3x12", equipment: "Halter", rest: "45s" },
        { name: "Pullover", sets: "3x15", equipment: "Halter", rest: "45s" },
        { name: "Remada Baixa", sets: "3x12", equipment: "Cabo", rest: "60s" },
        { name: "Puxada Supinada", sets: "3x12", equipment: "Cabo", rest: "60s" },
    ],
    Pernas: [
        { name: "Agachamento Livre", sets: "4x10", equipment: "Barra", rest: "90s" },
        { name: "Leg Press 45°", sets: "4x12", equipment: "Máquina", rest: "90s" },
        { name: "Cadeira Extensora", sets: "3x15", equipment: "Máquina", rest: "45s" },
        { name: "Mesa Flexora", sets: "3x12", equipment: "Máquina", rest: "45s" },
        { name: "Stiff", sets: "3x12", equipment: "Barra", rest: "60s" },
        { name: "Agachamento Búlgaro", sets: "3x10", equipment: "Halter", rest: "60s" },
        { name: "Passada", sets: "3x12", equipment: "Halter", rest: "60s" },
    ],
    Panturrilhas: [
        { name: "Panturrilha em Pé", sets: "4x15", equipment: "Máquina", rest: "30s" },
        { name: "Panturrilha Sentado", sets: "4x20", equipment: "Máquina", rest: "30s" },
        { name: "Gêmeos no Leg Press", sets: "3x20", equipment: "Máquina", rest: "30s" },
    ],
    Ombros: [
        { name: "Desenvolvimento", sets: "4x10", equipment: "Halter", rest: "60s" },
        { name: "Elevação Lateral", sets: "4x15", equipment: "Halter", rest: "45s" },
        { name: "Elevação Frontal", sets: "3x12", equipment: "Halter", rest: "45s" },
        { name: "Face Pull", sets: "3x15", equipment: "Cabo", rest: "45s" },
        { name: "Desenvolvimento Arnold", sets: "3x12", equipment: "Halter", rest: "60s" },
    ],
    Bíceps: [
        { name: "Rosca Direta", sets: "3x12", equipment: "Barra", rest: "45s" },
        { name: "Rosca Alternada", sets: "3x12", equipment: "Halter", rest: "45s" },
        { name: "Rosca Martelo", sets: "3x15", equipment: "Halter", rest: "45s" },
        { name: "Rosca Scott", sets: "3x12", equipment: "Barra", rest: "45s" },
        { name: "Rosca Concentrada", sets: "3x10", equipment: "Halter", rest: "45s" },
    ],
    Tríceps: [
        { name: "Tríceps Pulley", sets: "3x15", equipment: "Cabo", rest: "45s" },
        { name: "Tríceps Testa", sets: "3x12", equipment: "Barra", rest: "45s" },
        { name: "Tríceps Francês", sets: "3x12", equipment: "Halter", rest: "45s" },
        { name: "Mergulho", sets: "3x10", equipment: "Peso Corporal", rest: "60s" },
        { name: "Tríceps Corda", sets: "3x15", equipment: "Cabo", rest: "45s" },
    ],
    Core: [
        { name: "Abdominais", sets: "3x20", equipment: "Peso Corporal", rest: "30s" },
        { name: "Prancha", sets: "3x45s", equipment: "Peso Corporal", rest: "30s" },
        { name: "Russian Twist", sets: "3x20", equipment: "Peso Corporal", rest: "30s" },
        { name: "Elevação de Pernas", sets: "3x15", equipment: "Peso Corporal", rest: "30s" },
    ],
};

export const allAvailableExercises = Object.entries(exerciseDB).flatMap(([muscle, exs]) =>
    exs.map(ex => ({ ...ex, muscle }))
);

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function parseSetsToArray(setsStr) {
    const match = setsStr?.match(/(\d+)x(\d+)/);
    if (match) {
        const count = parseInt(match[1]);
        const reps = match[2];
        return Array.from({ length: count }, () => ({ reps }));
    }
    return [{ reps: "12" }, { reps: "12" }, { reps: "12" }];
}

export function formatSetsArray(setsArray) {
    if (!setsArray || setsArray.length === 0) return "0x0";
    const allSame = setsArray.every(s => s.reps === setsArray[0].reps);
    return allSame
        ? `${setsArray.length}x${setsArray[0].reps}`
        : `${setsArray.length}s: ${setsArray.map(s => s.reps).join('/')}`;
}

// â”€â”€ Suggestion Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const splitTemplates = {
    2: [
        { letter: "A", title: "Superior", muscles: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"], pickCount: { Peito: 2, Costas: 2, Ombros: 2, Bíceps: 1, Tríceps: 1 } },
        { letter: "B", title: "Inferior + Core", muscles: ["Pernas", "Panturrilhas", "Core"], pickCount: { Pernas: 4, Panturrilhas: 2, Core: 2 } },
    ],
    3: [
        { letter: "A", title: "Peito + Tríceps + Ombros", muscles: ["Peito", "Tríceps", "Ombros"], pickCount: { Peito: 3, Tríceps: 2, Ombros: 2 } },
        { letter: "B", title: "Costas + Bíceps", muscles: ["Costas", "Bíceps"], pickCount: { Costas: 3, Bíceps: 3 } },
        { letter: "C", title: "Pernas + Core", muscles: ["Pernas", "Panturrilhas", "Core"], pickCount: { Pernas: 4, Panturrilhas: 2, Core: 2 } },
    ],
    4: [
        { letter: "A", title: "Peito + Tríceps", muscles: ["Peito", "Tríceps"], pickCount: { Peito: 4, Tríceps: 3 } },
        { letter: "B", title: "Costas + Bíceps", muscles: ["Costas", "Bíceps"], pickCount: { Costas: 4, Bíceps: 3 } },
        { letter: "C", title: "Pernas (Quadríceps)", muscles: ["Pernas", "Panturrilhas"], pickCount: { Pernas: 5, Panturrilhas: 2 } },
        { letter: "D", title: "Ombros + Pernas (Posterior)", muscles: ["Ombros", "Pernas", "Core"], pickCount: { Ombros: 3, Pernas: 3, Core: 2 } },
    ],
    5: [
        { letter: "A", title: "Peito", muscles: ["Peito"], pickCount: { Peito: 5 } },
        { letter: "B", title: "Costas", muscles: ["Costas"], pickCount: { Costas: 5 } },
        { letter: "C", title: "Ombros + Trapézio", muscles: ["Ombros"], pickCount: { Ombros: 5 } },
        { letter: "D", title: "Bíceps + Tríceps", muscles: ["Bíceps", "Tríceps"], pickCount: { Bíceps: 3, Tríceps: 3 } },
        { letter: "E", title: "Pernas + Core", muscles: ["Pernas", "Panturrilhas", "Core"], pickCount: { Pernas: 4, Panturrilhas: 2, Core: 2 } },
    ],
    6: [
        { letter: "A", title: "Peito", muscles: ["Peito"], pickCount: { Peito: 5 } },
        { letter: "B", title: "Costas", muscles: ["Costas"], pickCount: { Costas: 5 } },
        { letter: "C", title: "Ombros", muscles: ["Ombros"], pickCount: { Ombros: 5 } },
        { letter: "D", title: "Bíceps + Tríceps", muscles: ["Bíceps", "Tríceps"], pickCount: { Bíceps: 3, Tríceps: 3 } },
        { letter: "E", title: "Quadríceps + Panturrilha", muscles: ["Pernas", "Panturrilhas"], pickCount: { Pernas: 4, Panturrilhas: 3 } },
        { letter: "F", title: "Posterior + Core", muscles: ["Pernas", "Core"], pickCount: { Pernas: 3, Core: 3 } },
    ],
};

export function generateWorkoutSuggestion(student) {
    if (!student?.anamnesis) return [];
    const { basics, injuries, lifestyle } = student.anamnesis;
    const trainingDays = parseInt(lifestyle?.trainingDays) || 3;
    const injuryList = injuries || [];
    const goal = basics?.goal || "Hipertrofia";
    const muscleDiff = (lifestyle?.muscleDifficulty || "").toLowerCase();

    const hasLombar = injuryList.includes("Lombar");
    const hasJoelho = injuryList.includes("Joelho");
    const hasOmbro = injuryList.includes("Ombro");
    const needsPanturrilha = muscleDiff.includes("panturrilha");
    const needsBracos = muscleDiff.includes("braço") || muscleDiff.includes("braco");

    const getWarnings = (muscle) => {
        const w = [];
        if (hasLombar && ["Pernas", "Costas"].includes(muscle)) w.push("⚠️ Cuidado com a lombar — evitar carga excessiva.");
        if (hasJoelho && muscle === "Pernas") w.push("⚠️ Atenção ao joelho — amplitudes controladas.");
        if (hasOmbro && ["Peito", "Ombros"].includes(muscle)) w.push("⚠️ Cuidado com o ombro — evitar angulações extremas.");
        return w;
    };

    const filterExercises = (exs) => exs.filter(ex => {
        if (hasLombar && ["Stiff", "Agachamento Livre", "Remada Curvada"].includes(ex.name)) return false;
        if (hasJoelho && ["Agachamento Livre", "Passada", "Agachamento Búlgaro"].includes(ex.name)) return false;
        if (hasOmbro && ["Desenvolvimento", "Supino Inclinado"].includes(ex.name)) return false;
        return true;
    });

    const adjustGoal = (exs) => exs.map(ex => {
        const adj = { ...ex };
        if (goal === "Emagrecimento") { adj.rest = "30s"; }
        else if (goal === "Hipertrofia") { adj.rest = "60s"; }
        else if (goal === "Condicionamento") { adj.rest = "30s"; }
        return adj;
    });

    const template = splitTemplates[trainingDays] || splitTemplates[3];
    return template.map(workout => {
        let allExercises = [];
        let allWarnings = [];
        workout.muscles.forEach(muscle => {
            const available = exerciseDB[muscle] || [];
            const safe = adjustGoal(filterExercises(available));
            const count = (workout.pickCount && workout.pickCount[muscle]) || 3;
            const picked = safe.slice(0, count);
            if (needsPanturrilha && muscle === "Panturrilhas") allWarnings.push("💪 Área prioritária: Panturrilhas — volume extra conforme perfil.");
            if (needsBracos && (muscle === "Bíceps" || muscle === "Tríceps")) allWarnings.push(`💪 Área prioritária: ${muscle} — volume extra conforme perfil.`);
            allWarnings.push(...getWarnings(muscle));
            picked.forEach(ex => {
                const setsArray = parseSetsToArray(ex.sets);
                allExercises.push({ ...ex, muscle, setsArray, id: Math.random().toString(36).substr(2, 9) });
            });
        });
        return { letter: workout.letter, title: workout.title, exercises: allExercises, warnings: [...new Set(allWarnings)], notes: "" };
    });
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * WorkoutBuilderModal
 * Props:
 *   isOpen       boolean
 *   onClose      () => void
 *   onSave       (plan: { name, workouts }) => void
 *   student      { name, anamnesis: { basics, injuries, lifestyle } }
 *   initialWorkouts  WorkoutPlan[] | null  — pre-populate for renewal
 *   modalTitle   string (default "Sugestão de Treino")
 */
export default function WorkoutBuilderModal({ isOpen, onClose, onSave, student, initialWorkouts = null, modalTitle }) {
    const [suggestedWorkouts, setSuggestedWorkouts] = useState(() =>
        initialWorkouts || (isOpen ? generateWorkoutSuggestion(student) : [])
    );
    const [activeTab, setActiveTab] = useState(0);
    const [validityWeeks, setValidityWeeks] = useState('4');
    const [workoutName, setWorkoutName] = useState(() => {
        if (!student?.name) return "Planilha";
        const displayName = student.name.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        return `Planilha — ${displayName}`;
    });
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [exerciseSearch, setExerciseSearch] = useState("");
    const [editingExercise, setEditingExercise] = useState(null);
    const [showCreateExercise, setShowCreateExercise] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: "", muscle: "Peito", equipment: "Halter", customEquipment: "",
        setsArray: [{ reps: "12" }, { reps: "12" }, { reps: "12" }],
        rest: "60s", videoUrl: ""
    });

    // Re-generate when component opens
    useEffect(() => {
        if (isOpen) {
            if (initialWorkouts) {
                setSuggestedWorkouts(initialWorkouts);
            } else {
                setSuggestedWorkouts(generateWorkoutSuggestion(student));
            }
            setActiveTab(0);
            
            if (student?.name) {
                const parts = student.name.split(' ');
                const displayName = parts.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                setWorkoutName(`Planilha — ${displayName}`);
            } else {
                setWorkoutName("Planilha");
            }
        } else {
            setSuggestedWorkouts([]);
        }
    }, [isOpen, student, initialWorkouts]);

    if (!isOpen) return null;

    // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const updateExercise = (workoutIdx, exerciseIdx, field, value) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = {
                ...updated[workoutIdx],
                exercises: updated[workoutIdx].exercises.map((ex, i) =>
                    i === exerciseIdx ? { ...ex, [field]: value } : ex
                )
            };
            return updated;
        });
    };

    const updateExerciseSetsArray = (workoutIdx, exerciseIdx, setIdx, reps) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = {
                ...updated[workoutIdx],
                exercises: updated[workoutIdx].exercises.map((ex, i) => {
                    if (i !== exerciseIdx) return ex;
                    const newArr = ex.setsArray.map((s, si) => si === setIdx ? { ...s, reps } : s);
                    return { ...ex, setsArray: newArr, sets: formatSetsArray(newArr) };
                })
            };
            return updated;
        });
    };

    const addSetToExercise = (workoutIdx, exerciseIdx) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = {
                ...updated[workoutIdx],
                exercises: updated[workoutIdx].exercises.map((ex, i) => {
                    if (i !== exerciseIdx) return ex;
                    const lastReps = ex.setsArray[ex.setsArray.length - 1]?.reps || "12";
                    const newArr = [...ex.setsArray, { reps: lastReps }];
                    return { ...ex, setsArray: newArr, sets: formatSetsArray(newArr) };
                })
            };
            return updated;
        });
    };

    const removeSetFromExercise = (workoutIdx, exerciseIdx, setIdx) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = {
                ...updated[workoutIdx],
                exercises: updated[workoutIdx].exercises.map((ex, i) => {
                    if (i !== exerciseIdx || ex.setsArray.length <= 1) return ex;
                    const newArr = ex.setsArray.filter((_, si) => si !== setIdx);
                    return { ...ex, setsArray: newArr, sets: formatSetsArray(newArr) };
                })
            };
            return updated;
        });
    };

    const removeExercise = (workoutIdx, exerciseIdx) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = {
                ...updated[workoutIdx],
                exercises: updated[workoutIdx].exercises.filter((_, i) => i !== exerciseIdx)
            };
            return updated;
        });
    };

    const addExerciseToWorkout = (exercise) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            const setsArray = exercise.setsArray || parseSetsToArray(exercise.sets);
            updated[activeTab] = {
                ...updated[activeTab],
                exercises: [...updated[activeTab].exercises, {
                    ...exercise,
                    setsArray,
                    id: Math.random().toString(36).substr(2, 9)
                }]
            };
            return updated;
        });
        setShowAddExercise(false);
        setShowCreateExercise(false);
        setExerciseSearch("");
    };

    const createCustomExercise = () => {
        if (!newExercise.name.trim()) return;
        const equipment = newExercise.equipment === "Outro"
            ? (newExercise.customEquipment.trim() || "Outro")
            : newExercise.equipment;
        const setsArr = newExercise.setsArray;
        const allSame = setsArr.every(s => s.reps === setsArr[0].reps);
        const setsDisplay = allSame ? `${setsArr.length}x${setsArr[0].reps}` : `${setsArr.length}s: ${setsArr.map(s => s.reps).join('/')}`;
        addExerciseToWorkout({ name: newExercise.name, muscle: newExercise.muscle, equipment, sets: setsDisplay, setsArray: setsArr, rest: newExercise.rest, videoUrl: newExercise.videoUrl || "" });
        setNewExercise({ name: "", muscle: "Peito", equipment: "Halter", customEquipment: "", setsArray: [{ reps: "12" }, { reps: "12" }, { reps: "12" }], rest: "60s", videoUrl: "" });
    };

    const updateNotes = (workoutIdx, notes) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = { ...updated[workoutIdx], notes };
            return updated;
        });
    };

    const handleSave = () => {
        const expiryDate = validityWeeks
            ? new Date(Date.now() + parseInt(validityWeeks) * 7 * 24 * 60 * 60 * 1000).toISOString()
            : null;
        onSave({ name: workoutName, workouts: suggestedWorkouts, validityWeeks: validityWeeks || null, expiryDate, status: "Ativo", createdAt: new Date().toLocaleDateString('pt-BR') });
        onClose();
    };

    const filteredExercises = allAvailableExercises.filter(ex =>
        ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(exerciseSearch.toLowerCase())
    );

    const displayName = student?.name
        ? student.name.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        : "Aluno";
    const goal = student?.anamnesis?.basics?.goal;
    const trainingDays = student?.anamnesis?.lifestyle?.trainingDays;

    return (
        <div className={styles.workoutModalOverlay} onClick={onClose}>
            <div className={styles.workoutModal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.workoutModalHeader}>
                    <div>
                        <h3 className={styles.workoutModalTitle}>🏋️ {modalTitle || "Sugestão de Treino"}</h3>
                        <p className={styles.workoutModalSubtitle}>
                            Baseado no perfil de {displayName}
                            {goal && <> — Objetivo: <strong>{goal}</strong></>}
                            {trainingDays && <> — <strong>{trainingDays}x/semana</strong></>}
                        </p>
                    </div>
                    <button className={styles.workoutModalClose} onClick={onClose}>✕</button>
                </div>

                {/* Banner */}
                <div className={styles.suggestionBanner}>
                    <span>💡</span>
                    <span>Estas são <strong>sugestões</strong> baseadas no perfil do aluno. Edite livremente — a decisão final é sempre do profissional.</span>
                </div>

                {/* Workout Name */}
                <div className={styles.workoutNameField}>
                    <label className={styles.workoutNameLabel}>Nome da planilha</label>
                    <input
                        className={styles.workoutNameInput}
                        value={workoutName}
                        onChange={e => setWorkoutName(e.target.value)}
                        placeholder="Nome da planilha..."
                    />
                </div>
                <div className={styles.workoutNameSection} style={{ marginTop: '12px' }}>
                    <label className={styles.workoutNameLabel}>VALIDADE (SEMANAS)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="number"
                            min="1"
                            max="52"
                            className={styles.workoutNameInput}
                            style={{ maxWidth: '100px' }}
                            value={validityWeeks}
                            onChange={e => setValidityWeeks(e.target.value)}
                            placeholder="Ex: 4"
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {validityWeeks ? `Vence em ${validityWeeks} semana${validityWeeks == 1 ? '' : 's'}` : 'Sem validade'}
                        </span>
                    </div>
                </div>


                {/* Tabs */}
                <div className={styles.workoutTabs}>
                    {suggestedWorkouts.map((w, i) => (
                        <button
                            key={w.letter}
                            className={`${styles.workoutTab} ${activeTab === i ? styles.workoutTabActive : ''}`}
                            onClick={() => setActiveTab(i)}
                        >
                            <span className={styles.workoutTabLetter}>Treino {w.letter}</span>
                            <span className={styles.workoutTabTitle}>{w.title}</span>
                        </button>
                    ))}
                </div>

                {/* Active workout content */}
                {suggestedWorkouts[activeTab] && (
                    <div className={styles.workoutModalBody}>
                        {/* Warnings */}
                        {suggestedWorkouts[activeTab].warnings.length > 0 && (
                            <div className={styles.warningsContainer}>
                                {suggestedWorkouts[activeTab].warnings.map((w, i) => (
                                    <div key={i} className={styles.warningNote}>{w}</div>
                                ))}
                            </div>
                        )}

                        {/* Exercise list */}
                        <div className={styles.exerciseList}>
                            {suggestedWorkouts[activeTab].exercises.map((ex, exIdx) => (
                                <div key={ex.id} className={`${styles.exerciseRow} ${editingExercise === ex.id ? styles.exerciseRowExpanded : ''}`}
                                    style={{ flexDirection: "column", alignItems: "stretch" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div className={styles.exerciseOrder}>{exIdx + 1}</div>
                                        <div className={styles.exerciseDetails}>
                                            <div className={styles.exerciseName}>
                                                {ex.name}
                                                {ex.videoUrl && (
                                                    <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer"
                                                        className={styles.videoLink} title="Ver vídeo"
                                                        onClick={e => e.stopPropagation()}>▶️</a>
                                                )}
                                            </div>
                                            <div className={styles.exerciseMuscle}>{ex.muscle} — {ex.equipment}</div>
                                        </div>
                                        <div className={styles.exerciseControls}>
                                            <span className={styles.exerciseSets}>
                                                {ex.setsArray ? formatSetsArray(ex.setsArray) : ex.sets}
                                            </span>
                                            <span className={styles.exerciseRest}>⏱ {ex.rest}</span>
                                            <button className={styles.exerciseEditBtn}
                                                onClick={() => setEditingExercise(editingExercise === ex.id ? null : ex.id)}
                                                title={editingExercise === ex.id ? "Fechar" : "Editar"}>
                                                {editingExercise === ex.id ? '✖️' : '✏️'}
                                            </button>
                                            <button className={styles.exerciseRemoveBtn}
                                                onClick={() => removeExercise(activeTab, exIdx)}
                                                title="Remover">🗑️</button>
                                        </div>
                                    </div>
                                    {editingExercise === ex.id && (
                                        <div className={styles.exerciseEditPanel}>
                                            <div className={styles.editPanelSection}>
                                                <label className={styles.createFormLabel}>Séries e Repetições</label>
                                                <div className={styles.setsEditor}>
                                                    {(ex.setsArray || []).map((set, sIdx) => (
                                                        <div key={sIdx} className={styles.setRow}>
                                                            <span className={styles.setLabel}>Série {sIdx + 1}</span>
                                                            <input className={styles.setRepsInput} type="number" min="1" value={set.reps}
                                                                onChange={e => updateExerciseSetsArray(activeTab, exIdx, sIdx, e.target.value)} />
                                                            <span className={styles.setRepsLabel}>reps</span>
                                                            {(ex.setsArray || []).length > 1 && (
                                                                <button className={styles.setRemoveBtn} type="button"
                                                                    onClick={() => removeSetFromExercise(activeTab, exIdx, sIdx)}>✕</button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button className={styles.setAddBtn} type="button"
                                                        onClick={() => addSetToExercise(activeTab, exIdx)}>+ Adicionar série</button>
                                                </div>
                                            </div>
                                            <div className={styles.editPanelSection}>
                                                <label className={styles.createFormLabel}>Descanso</label>
                                                <input className={styles.createFormInput} value={ex.rest}
                                                    onChange={e => updateExercise(activeTab, exIdx, 'rest', e.target.value)}
                                                    placeholder="60s" style={{ maxWidth: '120px' }} />
                                            </div>
                                            <div className={styles.editPanelSection} style={{ gridColumn: '1 / -1' }}>
                                                <label className={styles.createFormLabel}>📋 Observações do treinador</label>
                                                <textarea
                                                    className={styles.createFormInput}
                                                    value={ex.observation || ''}
                                                    onChange={e => updateExercise(activeTab, exIdx, 'observation', e.target.value)}
                                                    placeholder="Ex: Manter escápulas retraídas, descer controlado em 3s, não travar o cotovelo..."
                                                    rows={3}
                                                    style={{ resize: 'vertical', minHeight: '72px', fontFamily: 'inherit', lineHeight: '1.5' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Exercise */}
                        {!showAddExercise ? (
                            <button className={styles.addExerciseBtn} onClick={() => setShowAddExercise(true)}>
                                ➕ Adicionar exercício
                            </button>
                        ) : (
                            <div className={styles.addExercisePanel}>
                                <div className={styles.addExerciseHeader}>
                                    <input className={styles.addExerciseSearch} placeholder="Buscar exercício..."
                                        value={exerciseSearch} onChange={e => setExerciseSearch(e.target.value)} autoFocus />
                                    <button className={styles.addExerciseClose}
                                        onClick={() => { setShowAddExercise(false); setShowCreateExercise(false); setExerciseSearch(""); }}>✕</button>
                                </div>
                                {!showCreateExercise ? (
                                    <>
                                        <div className={styles.createExerciseBtn} onClick={() => setShowCreateExercise(true)}>
                                            <div className={styles.createExerciseIcon}>✨</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>Criar novo exercício</div>
                                                <div style={{ fontSize: '0.7rem', color: '#888' }}>Adicione personalizado com vídeo</div>
                                            </div>
                                        </div>
                                        <div className={styles.addExerciseList}>
                                            {filteredExercises.slice(0, 8).map((ex, i) => (
                                                <div key={i} className={styles.addExerciseItem} onClick={() => addExerciseToWorkout(ex)}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ex.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>{ex.muscle} — {ex.equipment}</div>
                                                    </div>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.createExerciseForm}>
                                        <div className={styles.createFormHeader}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>✨ Novo Exercício</span>
                                            <button className={styles.addExerciseClose} onClick={() => setShowCreateExercise(false)}>←</button>
                                        </div>
                                        <div className={styles.createFormGrid}>
                                            <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                <label className={styles.createFormLabel}>Nome *</label>
                                                <input className={styles.createFormInput} placeholder="Ex: Elevação Pélvica"
                                                    value={newExercise.name}
                                                    onChange={e => setNewExercise({ ...newExercise, name: e.target.value })} autoFocus />
                                            </div>
                                            <div className={styles.createFormGroup}>
                                                <label className={styles.createFormLabel}>Grupo muscular</label>
                                                <select className={styles.createFormSelect} value={newExercise.muscle}
                                                    onChange={e => setNewExercise({ ...newExercise, muscle: e.target.value })}>
                                                    {["Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Core", "Panturrilhas", "Glúteos", "Outro"].map(m => (
                                                        <option key={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={styles.createFormGroup}>
                                                <label className={styles.createFormLabel}>Equipamento</label>
                                                <select className={styles.createFormSelect} value={newExercise.equipment}
                                                    onChange={e => setNewExercise({ ...newExercise, equipment: e.target.value })}>
                                                    {["Halter", "Barra", "Cabo", "Máquina", "Peso Corporal", "Elástico", "Kettlebell", "Outro"].map(eq => (
                                                        <option key={eq}>{eq}</option>
                                                    ))}
                                                </select>
                                                {newExercise.equipment === "Outro" && (
                                                    <input className={styles.createFormInput} style={{ marginTop: 6 }}
                                                        placeholder="Nome do equipamento..."
                                                        value={newExercise.customEquipment}
                                                        onChange={e => setNewExercise({ ...newExercise, customEquipment: e.target.value })} />
                                                )}
                                            </div>
                                            <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                <label className={styles.createFormLabel}>Séries e Reps</label>
                                                <div className={styles.setsEditor}>
                                                    {newExercise.setsArray.map((set, sIdx) => (
                                                        <div key={sIdx} className={styles.setRow}>
                                                            <span className={styles.setLabel}>Série {sIdx + 1}</span>
                                                            <input className={styles.setRepsInput} type="number" min="1" value={set.reps}
                                                                onChange={e => setNewExercise(prev => ({ ...prev, setsArray: prev.setsArray.map((s, i) => i === sIdx ? { ...s, reps: e.target.value } : s) }))} />
                                                            <span className={styles.setRepsLabel}>reps</span>
                                                            {newExercise.setsArray.length > 1 && (
                                                                <button className={styles.setRemoveBtn} type="button"
                                                                    onClick={() => setNewExercise(prev => ({ ...prev, setsArray: prev.setsArray.filter((_, i) => i !== sIdx) }))}>✕</button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button className={styles.setAddBtn} type="button"
                                                        onClick={() => setNewExercise(prev => ({ ...prev, setsArray: [...prev.setsArray, { reps: prev.setsArray[prev.setsArray.length - 1]?.reps || "12" }] }))}>
                                                        + Adicionar série
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={styles.createFormGroup}>
                                                <label className={styles.createFormLabel}>Descanso</label>
                                                <input className={styles.createFormInput} placeholder="60s" value={newExercise.rest}
                                                    onChange={e => setNewExercise({ ...newExercise, rest: e.target.value })} />
                                            </div>
                                            <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                <label className={styles.createFormLabel}>🎬 Link do vídeo (opcional)</label>
                                                <div className={styles.videoInputWrapper}>
                                                    <span className={styles.videoInputIcon}>▶️</span>
                                                    <input className={styles.createFormInput} style={{ paddingLeft: '36px' }}
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        value={newExercise.videoUrl}
                                                        onChange={e => setNewExercise({ ...newExercise, videoUrl: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.createFormActions}>
                                            <button className={styles.createFormCancel} onClick={() => setShowCreateExercise(false)}>Voltar</button>
                                            <button className={styles.createFormSave} onClick={createCustomExercise}
                                                disabled={!newExercise.name.trim()}>➕ Adicionar ao treino</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        <div className={styles.notesSection}>
                            <label className={styles.notesLabel}>📝 Observações do profissional</label>
                            <textarea className={styles.notesTextarea}
                                placeholder="Adicione notas, recomendações ou ajustes para este treino..."
                                value={suggestedWorkouts[activeTab].notes}
                                onChange={e => updateNotes(activeTab, e.target.value)} rows={3} />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className={styles.workoutModalFooter}>
                    <button className={styles.workoutCancelBtn} onClick={onClose}>Cancelar</button>
                    <button className={styles.workoutSaveBtn} onClick={handleSave}>💾 Salvar Planilha</button>
                </div>
            </div>
        </div>
    );
}
