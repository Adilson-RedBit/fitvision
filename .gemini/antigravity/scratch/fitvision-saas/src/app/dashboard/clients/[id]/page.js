"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../details.module.css";

const exerciseDB = {
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

const studentsDB = {
    1: {
        name: "RAFAEL MENDES",
        avatar: "👤",
        rating: 5,
        status: "Ativo",
        isProspect: false,
        onboardingLink: "http://localhost:3000/onboarding/1",
        anamnesis: {
            basics: {
                email: "rafael.mendes@email.com",
                phone: "(11) 98765-4321",
                birth: "15/04/1998",
                goal: "Hipertrofia",
                weight: "82",
                height: "178"
            },
            injuries: ["Lombar", "Joelho"],
            hadSurgery: false,
            surgeryDetails: "",
            surgeryTime: "",
            lifestyle: {
                trainingDays: "4",
                muscleDifficulty: "Panturrilhas, Braços",
                cardioFrequency: "1-2",
                alcohol: "Socialmente",
                smoke: "Não",
                dietRating: "Boa"
            },
            photos: {
                front: null,
                back: null,
                right: null,
                left: null
            }
        },
        workouts: [],
        feedbacks: []
    },
    2: {
        name: "CARLA SILVA",
        avatar: "👤",
        rating: 4,
        status: "Ativo",
        isProspect: false,
        anamnesis: null,
        workouts: [],
        feedbacks: []
    },
    3: {
        name: "JOÃO PEDRO",
        avatar: "👤",
        rating: 3,
        status: "Prospect",
        isProspect: true,
        onboardingLink: "http://localhost:3000/onboarding/3",
        anamnesis: null,
        workouts: [],
        feedbacks: []
    }
};

const defaultStudent = {
    name: "ALUNO",
    avatar: "👤",
    rating: 0,
    status: "Prospect",
    isProspect: true,
    anamnesis: null,
    workouts: [],
    feedbacks: []
};

// ========================================
// WORKOUT SUGGESTION ENGINE
// ========================================
function generateWorkoutSuggestion(student) {
    if (!student.anamnesis) return [];

    const { basics, injuries, lifestyle } = student.anamnesis;
    const trainingDays = parseInt(lifestyle.trainingDays) || 3;
    const goal = basics.goal;
    const injuryList = injuries || [];
    const muscleDiff = (lifestyle.muscleDifficulty || "").toLowerCase();

    // Injury-aware exercise selection
    const hasLombar = injuryList.includes("Lombar");
    const hasJoelho = injuryList.includes("Joelho");
    const hasOmbro = injuryList.includes("Ombro");

    // Build warnings
    const getWarnings = (muscleGroup) => {
        const warnings = [];
        if (hasLombar && ["Pernas", "Costas"].includes(muscleGroup)) {
            warnings.push("⚠️ Cuidado com a lombar — evitar carga excessiva e movimentos com muita flexão de tronco.");
        }
        if (hasJoelho && muscleGroup === "Pernas") {
            warnings.push("⚠️ Atenção ao joelho — prefira amplitudes controladas e cargas progressivas.");
        }
        if (hasOmbro && ["Peito", "Ombros"].includes(muscleGroup)) {
            warnings.push("⚠️ Cuidado com o ombro — evitar angulações extremas.");
        }
        return warnings;
    };

    // Filter exercises that might be risky
    const filterExercises = (exercises, muscleGroup) => {
        return exercises.filter(ex => {
            if (hasLombar && ["Stiff", "Agachamento Livre", "Remada Curvada"].includes(ex.name)) return false;
            if (hasJoelho && ["Agachamento Livre", "Passada", "Agachamento Búlgaro"].includes(ex.name)) return false;
            if (hasOmbro && ["Desenvolvimento", "Supino Inclinado"].includes(ex.name)) return false;
            return true;
        });
    };

    // Adjust sets based on goal
    const adjustForGoal = (exercises) => {
        return exercises.map(ex => {
            let adjusted = { ...ex };
            if (goal === "Emagrecimento") {
                // More reps, less rest
                const parts = ex.sets.split("x");
                if (parts.length === 2) {
                    adjusted.sets = `${parts[0]}x${Math.min(parseInt(parts[1]) + 5, 25)}`;
                }
                adjusted.rest = "30s";
            } else if (goal === "Hipertrofia") {
                adjusted.rest = "60s";
            } else if (goal === "Condicionamento") {
                adjusted.rest = "30s";
            }
            return adjusted;
        });
    };

    // Check if muscle difficulty areas need priority
    const needsPanturrilha = muscleDiff.includes("panturrilha");
    const needsBracos = muscleDiff.includes("braço") || muscleDiff.includes("braco");

    // ========== SPLIT TEMPLATES ==========
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

    const template = splitTemplates[trainingDays] || splitTemplates[3];

    return template.map(workout => {
        let allExercises = [];
        let allWarnings = [];

        workout.muscles.forEach(muscle => {
            const available = exerciseDB[muscle] || [];
            const safe = filterExercises(available, muscle);
            const adjusted = adjustForGoal(safe);
            const count = (workout.pickCount && workout.pickCount[muscle]) || 3;
            const picked = adjusted.slice(0, count);

            // Add priority note for difficulty areas
            if (needsPanturrilha && muscle === "Panturrilhas") {
                allWarnings.push("💪 Área prioritária: Panturrilhas — volume extra adicionado conforme perfil do aluno.");
            }
            if (needsBracos && (muscle === "Bíceps" || muscle === "Tríceps")) {
                allWarnings.push(`💪 Área prioritária: ${muscle} — volume extra adicionado conforme perfil do aluno.`);
            }

            const warnings = getWarnings(muscle);
            allWarnings.push(...warnings);

            picked.forEach(ex => {
                const setsArray = parseSetsToArray(ex.sets);
                allExercises.push({ ...ex, muscle, setsArray, id: Math.random().toString(36).substr(2, 9) });
            });
        });

        return {
            letter: workout.letter,
            title: workout.title,
            exercises: allExercises,
            warnings: [...new Set(allWarnings)],
            notes: ""
        };
    });
}

// Parse "4x12" into [{reps:"12"},{reps:"12"},{reps:"12"},{reps:"12"}]
function parseSetsToArray(setsStr) {
    const match = setsStr.match(/(\d+)x(\d+)/);
    if (match) {
        const count = parseInt(match[1]);
        const reps = match[2];
        return Array.from({ length: count }, () => ({ reps }));
    }
    return [{ reps: "12" }, { reps: "12" }, { reps: "12" }];
}

function formatSetsArray(setsArray) {
    if (!setsArray || setsArray.length === 0) return "0x0";
    const allSame = setsArray.every(s => s.reps === setsArray[0].reps);
    return allSame
        ? `${setsArray.length}x${setsArray[0].reps}`
        : `${setsArray.length}s: ${setsArray.map(s => s.reps).join('/')}`;
}

// All available exercises for the "add exercise" picker
const allAvailableExercises = Object.entries(exerciseDB).flatMap(([muscle, exs]) =>
    exs.map(ex => ({ ...ex, muscle }))
);

export default function StudentProfile() {
    const { id } = useParams();
    const router = useRouter();
    const student = studentsDB[id] || defaultStudent;

    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [suggestedWorkouts, setSuggestedWorkouts] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [workoutName, setWorkoutName] = useState("");
    const [savedWorkouts, setSavedWorkouts] = useState(student.workouts || []);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [exerciseSearch, setExerciseSearch] = useState("");
    const [editingExercise, setEditingExercise] = useState(null);
    const [showCreateExercise, setShowCreateExercise] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: "", muscle: "Peito", equipment: "Halter", customEquipment: "",
        setsArray: [{reps: "12"}, {reps: "12"}, {reps: "12"}],
        rest: "60s", videoUrl: ""
    });

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

    const openWorkoutModal = () => {
        const suggestions = generateWorkoutSuggestion(student);
        setSuggestedWorkouts(suggestions);
        setActiveTab(0);
        setWorkoutName(`Planilha — ${student.name.split(' ').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')}`);
        setShowWorkoutModal(true);
    };

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
            updated[activeTab] = {
                ...updated[activeTab],
                exercises: [...updated[activeTab].exercises, {
                    ...exercise,
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
        const setsDisplay = allSame 
            ? `${setsArr.length}x${setsArr[0].reps}` 
            : `${setsArr.length}s: ${setsArr.map(s => s.reps).join('/')}`;
        addExerciseToWorkout({
            name: newExercise.name,
            muscle: newExercise.muscle,
            equipment: equipment,
            sets: setsDisplay,
            rest: newExercise.rest,
            videoUrl: newExercise.videoUrl || ""
        });
        setNewExercise({
            name: "", muscle: "Peito", equipment: "Halter", customEquipment: "",
            setsArray: [{reps: "12"}, {reps: "12"}, {reps: "12"}],
            rest: "60s", videoUrl: ""
        });
    };

    const updateSetReps = (setIdx, reps) => {
        setNewExercise(prev => ({
            ...prev,
            setsArray: prev.setsArray.map((s, i) => i === setIdx ? { ...s, reps } : s)
        }));
    };

    const addSet = () => {
        setNewExercise(prev => ({
            ...prev,
            setsArray: [...prev.setsArray, { reps: prev.setsArray[prev.setsArray.length - 1]?.reps || "12" }]
        }));
    };

    const removeSet = (setIdx) => {
        if (newExercise.setsArray.length <= 1) return;
        setNewExercise(prev => ({
            ...prev,
            setsArray: prev.setsArray.filter((_, i) => i !== setIdx)
        }));
    };

    const updateNotes = (workoutIdx, notes) => {
        setSuggestedWorkouts(prev => {
            const updated = [...prev];
            updated[workoutIdx] = { ...updated[workoutIdx], notes };
            return updated;
        });
    };

    const saveWorkout = () => {
        const newWorkout = {
            name: workoutName,
            status: "Ativo",
            workouts: suggestedWorkouts,
            createdAt: new Date().toLocaleDateString('pt-BR')
        };
        setSavedWorkouts(prev => [...prev, newWorkout]);
        setShowWorkoutModal(false);
        setSuggestedWorkouts([]);
    };

    const filteredExercises = allAvailableExercises.filter(ex =>
        ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(exerciseSearch.toLowerCase())
    );

    return (
        <div className={styles.profileContainer}>
            <header className={styles.profileHeader}>
                <Link href="/dashboard/clients" className={styles.backButton}>←</Link>
                <h1 className={styles.headerTitle}>Perfil do aluno</h1>
            </header>

            <div className={styles.profileCard}>
                <div className={styles.profileMain}>
                    <div className={styles.profileAvatar}>{student.avatar}</div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{student.name}</div>
                        <div className={styles.ratingStars}>{'★'.repeat(student.rating)}{'☆'.repeat(5 - student.rating)}</div>
                    </div>
                </div>

                <div className={styles.actionGrid}>
                    <div className={styles.actionItem}>
                        <div className={styles.actionIcon}>✎</div>
                        <span className={styles.actionLabel}>Editar Perfil</span>
                    </div>
                    <div className={styles.actionItem}>
                        <div className={styles.actionIcon}>✉</div>
                        <span className={styles.actionLabel}>Enviar app para o aluno</span>
                    </div>
                    <div className={styles.actionItem}>
                        <div className={styles.actionIcon}>🩺</div>
                        <span className={styles.actionLabel}>Avaliação Física</span>
                    </div>
                    <div className={styles.actionItem}>
                        <div className={`${styles.actionIcon} ${styles.actionIconGreen}`}>💬</div>
                        <span className={styles.actionLabel}>Enviar WhatsApp</span>
                    </div>
                </div>
            </div>

            {/* ===== ANAMNESE & FICHA CADASTRAL ===== */}
            <div className={styles.section}>
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
                        {/* Informações Básicas */}
                        <div className={styles.anamnesisCard}>
                            <h4 className={styles.detailTitle}>📍 Informações Básicas</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>E-mail</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics.email}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Telefone</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics.phone}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Nascimento</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics.birth}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Objetivo</span>
                                    <span className={styles.anamnesisValue}>
                                        <span className={styles.goalBadge}>{student.anamnesis.basics.goal}</span>
                                    </span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Peso</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics.weight} kg</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Altura</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.basics.height} cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Anamnese Reativa */}
                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>🏥 Anamnese Reativa</h4>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <span className={styles.anamnesisLabel}>Dores / Lesões reportadas</span>
                                <div className={styles.injuryTags}>
                                    {student.anamnesis.injuries && student.anamnesis.injuries.length > 0 ? (
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

                        {/* Estilo de Vida */}
                        <div className={styles.anamnesisCard} style={{ marginTop: '12px' }}>
                            <h4 className={styles.detailTitle}>🥦 Estilo de Vida</h4>
                            <div className={styles.anamnesisGrid}>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Dias disponíveis para treino</span>
                                    <span className={styles.anamnesisValue}>
                                        <span className={styles.goalBadge}>
                                            {trainingDaysLabels[student.anamnesis.lifestyle.trainingDays] || student.anamnesis.lifestyle.trainingDays + 'x/semana'}
                                        </span>
                                    </span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Dificuldade em ganhar massa</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle.muscleDifficulty || '—'}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Cardio / Semana</span>
                                    <span className={styles.anamnesisValue}>{cardioLabels[student.anamnesis.lifestyle.cardioFrequency] || student.anamnesis.lifestyle.cardioFrequency}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Álcool</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle.alcohol}</span>
                                </div>
                                <div className={styles.anamnesisItem}>
                                    <span className={styles.anamnesisLabel}>Fumante</span>
                                    <span className={styles.anamnesisValue}>{student.anamnesis.lifestyle.smoke}</span>
                                </div>
                            </div>
                            <div className={styles.dietSection}>
                                <span className={styles.anamnesisLabel}>Alimentação</span>
                                <div className={styles.dietBadge}>
                                    <span>{dietEmojis[student.anamnesis.lifestyle.dietRating] || '⚪'}</span>
                                    <span>{student.anamnesis.lifestyle.dietRating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fotos */}
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
                                        {student.anamnesis.photos[slot.id] ? (
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

            {/* ===== ACESSO ===== */}
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

            {/* ===== PLANILHAS DE TREINO ===== */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Planilhas de treino</h3>
                    <button
                        className="btn btn-primary btn-sm"
                        style={{ background: '#7E52F3', borderRadius: '12px' }}
                        onClick={openWorkoutModal}
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
                                <span className={styles.savedWorkoutStatus}>✅ {w.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== FEEDBACKS ===== */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Feedbacks</h3>
                </div>

                <div className={styles.calendarCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>◂</span>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>Março 2026</div>
                        <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>▸</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.7rem' }}>
                        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                            <div key={d} style={{ color: '#9c9c9c', fontWeight: 600 }}>{d}</div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} style={{
                                padding: '8px 0',
                                borderRadius: '50%',
                                position: 'relative',
                                background: i === 10 ? '#E8E4FF' : 'transparent',
                                border: i === 10 ? '1px solid #7E52F3' : 'none',
                                color: i === 10 ? '#7E52F3' : '#333',
                                fontWeight: i === 10 ? 700 : 400
                            }}>
                                {i + 1}
                                {(i === 4 || i === 5 || i === 6 || i === 9 || i === 10) && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: '#00D1B2'
                                    }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.feedbackList} style={{ marginTop: '20px' }}>
                    {student.feedbacks.length === 0 ? (
                        <div className={styles.anamnesisCard} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                            <p style={{ fontSize: '0.85rem' }}>Nenhum feedback registrado.</p>
                        </div>
                    ) : (
                        student.feedbacks.map(f => (
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

            {/* ===== WORKOUT SUGGESTION MODAL ===== */}
            {showWorkoutModal && (
                <div className={styles.workoutModalOverlay} onClick={() => setShowWorkoutModal(false)}>
                    <div className={styles.workoutModal} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className={styles.workoutModalHeader}>
                            <div>
                                <h3 className={styles.workoutModalTitle}>🏋️ Sugestão de Treino</h3>
                                <p className={styles.workoutModalSubtitle}>
                                    Baseado no perfil de {student.name.split(' ').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')} •
                                    Objetivo: <strong>{student.anamnesis?.basics?.goal}</strong> •
                                    <strong> {student.anamnesis?.lifestyle?.trainingDays}x/semana</strong>
                                </p>
                            </div>
                            <button className={styles.workoutModalClose} onClick={() => setShowWorkoutModal(false)}>✕</button>
                        </div>

                        {/* Info Banner */}
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

                        {/* Active Workout Content */}
                        {suggestedWorkouts[activeTab] && (
                            <div className={styles.workoutModalBody}>
                                {/* Warnings */}
                                {suggestedWorkouts[activeTab].warnings.length > 0 && (
                                    <div className={styles.warningsContainer}>
                                        {suggestedWorkouts[activeTab].warnings.map((w, i) => (
                                            <div key={i} className={styles.warningNote}>
                                                {w}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Exercise List */}
                                <div className={styles.exerciseList}>
                                    {suggestedWorkouts[activeTab].exercises.map((ex, exIdx) => (
                                        <div key={ex.id} className={`${styles.exerciseRow} ${editingExercise === ex.id ? styles.exerciseRowExpanded : ''}`}>
                                            <div className={styles.exerciseRowMain}>
                                                <div className={styles.exerciseOrder}>{exIdx + 1}</div>
                                                <div className={styles.exerciseDetails}>
                                                    <div className={styles.exerciseName}>
                                                        {ex.name}
                                                        {ex.videoUrl && (
                                                            <a
                                                                href={ex.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.videoLink}
                                                                title="Ver vídeo do exercício"
                                                                onClick={e => e.stopPropagation()}
                                                            >▶️</a>
                                                        )}
                                                    </div>
                                                    <div className={styles.exerciseMuscle}>{ex.muscle} • {ex.equipment}</div>
                                                </div>
                                                <div className={styles.exerciseControls}>
                                                    <span className={styles.exerciseSets}>
                                                        {ex.setsArray ? formatSetsArray(ex.setsArray) : ex.sets}
                                                    </span>
                                                    <span className={styles.exerciseRest}>⏱ {ex.rest}</span>
                                                    <button
                                                        className={styles.exerciseEditBtn}
                                                        onClick={() => setEditingExercise(editingExercise === ex.id ? null : ex.id)}
                                                        title={editingExercise === ex.id ? "Fechar" : "Editar"}
                                                    >{editingExercise === ex.id ? '✖️' : '✏️'}</button>
                                                    <button
                                                        className={styles.exerciseRemoveBtn}
                                                        onClick={() => removeExercise(activeTab, exIdx)}
                                                        title="Remover"
                                                    >🗑️</button>
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
                                                                    <input
                                                                        className={styles.setRepsInput}
                                                                        type="number"
                                                                        min="1"
                                                                        value={set.reps}
                                                                        onChange={e => updateExerciseSetsArray(activeTab, exIdx, sIdx, e.target.value)}
                                                                    />
                                                                    <span className={styles.setRepsLabel}>reps</span>
                                                                    {(ex.setsArray || []).length > 1 && (
                                                                        <button
                                                                            className={styles.setRemoveBtn}
                                                                            onClick={() => removeSetFromExercise(activeTab, exIdx, sIdx)}
                                                                            type="button"
                                                                        >✕</button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                className={styles.setAddBtn}
                                                                onClick={() => addSetToExercise(activeTab, exIdx)}
                                                                type="button"
                                                            >
                                                                + Adicionar série
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={styles.editPanelSection}>
                                                        <label className={styles.createFormLabel}>Descanso</label>
                                                        <input
                                                            className={styles.createFormInput}
                                                            value={ex.rest}
                                                            onChange={e => updateExercise(activeTab, exIdx, 'rest', e.target.value)}
                                                            placeholder="60s"
                                                            style={{ maxWidth: '120px' }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add Exercise Button */}
                                {!showAddExercise ? (
                                    <button
                                        className={styles.addExerciseBtn}
                                        onClick={() => setShowAddExercise(true)}
                                    >
                                        ➕ Adicionar exercício
                                    </button>
                                ) : (
                                    <div className={styles.addExercisePanel}>
                                        <div className={styles.addExerciseHeader}>
                                            <input
                                                className={styles.addExerciseSearch}
                                                placeholder="Buscar exercício..."
                                                value={exerciseSearch}
                                                onChange={e => setExerciseSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <button
                                                className={styles.addExerciseClose}
                                                onClick={() => { setShowAddExercise(false); setShowCreateExercise(false); setExerciseSearch(""); }}
                                            >✕</button>
                                        </div>

                                        {!showCreateExercise ? (
                                            <>
                                                {/* Create Exercise Button */}
                                                <div
                                                    className={styles.createExerciseBtn}
                                                    onClick={() => setShowCreateExercise(true)}
                                                >
                                                    <div className={styles.createExerciseIcon}>✨</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>Criar novo exercício</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>Adicione um exercício personalizado com vídeo</div>
                                                    </div>
                                                </div>

                                                {/* Exercise Search Results */}
                                                <div className={styles.addExerciseList}>
                                                    {filteredExercises.slice(0, 8).map((ex, i) => (
                                                        <div
                                                            key={i}
                                                            className={styles.addExerciseItem}
                                                            onClick={() => addExerciseToWorkout(ex)}
                                                        >
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ex.name}</div>
                                                                <div style={{ fontSize: '0.7rem', color: '#888' }}>{ex.muscle} • {ex.equipment}</div>
                                                            </div>
                                                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            /* Create Exercise Form */
                                            <div className={styles.createExerciseForm}>
                                                <div className={styles.createFormHeader}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>✨ Novo Exercício</span>
                                                    <button
                                                        className={styles.addExerciseClose}
                                                        onClick={() => setShowCreateExercise(false)}
                                                    >←</button>
                                                </div>

                                                <div className={styles.createFormGrid}>
                                                    <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                        <label className={styles.createFormLabel}>Nome do exercício *</label>
                                                        <input
                                                            className={styles.createFormInput}
                                                            placeholder="Ex: Elevação Pélvica"
                                                            value={newExercise.name}
                                                            onChange={e => setNewExercise({...newExercise, name: e.target.value})}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className={styles.createFormGroup}>
                                                        <label className={styles.createFormLabel}>Grupo muscular</label>
                                                        <select
                                                            className={styles.createFormSelect}
                                                            value={newExercise.muscle}
                                                            onChange={e => setNewExercise({...newExercise, muscle: e.target.value})}
                                                        >
                                                            {["Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Core", "Panturrilhas", "Glúteos", "Outro"].map(m => (
                                                                <option key={m}>{m}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className={styles.createFormGroup}>
                                                        <label className={styles.createFormLabel}>Equipamento</label>
                                                        <select
                                                            className={styles.createFormSelect}
                                                            value={newExercise.equipment}
                                                            onChange={e => setNewExercise({...newExercise, equipment: e.target.value})}
                                                        >
                                                            {["Halter", "Barra", "Cabo", "Máquina", "Peso Corporal", "Elástico", "Kettlebell", "Outro"].map(eq => (
                                                                <option key={eq}>{eq}</option>
                                                            ))}
                                                        </select>
                                                        {newExercise.equipment === "Outro" && (
                                                            <input
                                                                className={styles.createFormInput}
                                                                style={{ marginTop: '6px' }}
                                                                placeholder="Nome do equipamento..."
                                                                value={newExercise.customEquipment}
                                                                onChange={e => setNewExercise({...newExercise, customEquipment: e.target.value})}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                        <label className={styles.createFormLabel}>Séries e Repetições</label>
                                                        <div className={styles.setsEditor}>
                                                            {newExercise.setsArray.map((set, sIdx) => (
                                                                <div key={sIdx} className={styles.setRow}>
                                                                    <span className={styles.setLabel}>Série {sIdx + 1}</span>
                                                                    <input
                                                                        className={styles.setRepsInput}
                                                                        type="number"
                                                                        min="1"
                                                                        value={set.reps}
                                                                        onChange={e => updateSetReps(sIdx, e.target.value)}
                                                                    />
                                                                    <span className={styles.setRepsLabel}>reps</span>
                                                                    {newExercise.setsArray.length > 1 && (
                                                                        <button
                                                                            className={styles.setRemoveBtn}
                                                                            onClick={() => removeSet(sIdx)}
                                                                            type="button"
                                                                        >✕</button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                className={styles.setAddBtn}
                                                                onClick={addSet}
                                                                type="button"
                                                            >
                                                                + Adicionar série
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={styles.createFormGroup}>
                                                        <label className={styles.createFormLabel}>Descanso</label>
                                                        <input
                                                            className={styles.createFormInput}
                                                            placeholder="60s"
                                                            value={newExercise.rest}
                                                            onChange={e => setNewExercise({...newExercise, rest: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className={styles.createFormGroup} style={{ gridColumn: '1 / -1' }}>
                                                        <label className={styles.createFormLabel}>🎬 Link do vídeo (YouTube, etc.)</label>
                                                        <div className={styles.videoInputWrapper}>
                                                            <span className={styles.videoInputIcon}>▶️</span>
                                                            <input
                                                                className={styles.createFormInput}
                                                                style={{ paddingLeft: '36px' }}
                                                                placeholder="https://youtube.com/watch?v=..."
                                                                value={newExercise.videoUrl}
                                                                onChange={e => setNewExercise({...newExercise, videoUrl: e.target.value})}
                                                            />
                                                        </div>
                                                        <span className={styles.createFormHint}>Cole o link de um vídeo demonstrativo do exercício</span>
                                                    </div>
                                                </div>

                                                <div className={styles.createFormActions}>
                                                    <button
                                                        className={styles.createFormCancel}
                                                        onClick={() => setShowCreateExercise(false)}
                                                    >
                                                        Voltar
                                                    </button>
                                                    <button
                                                        className={styles.createFormSave}
                                                        onClick={createCustomExercise}
                                                        disabled={!newExercise.name.trim()}
                                                    >
                                                        ➕ Adicionar ao treino
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Notes */}
                                <div className={styles.notesSection}>
                                    <label className={styles.notesLabel}>📝 Observações do profissional</label>
                                    <textarea
                                        className={styles.notesTextarea}
                                        placeholder="Adicione notas, recomendações ou ajustes específicos para este treino..."
                                        value={suggestedWorkouts[activeTab].notes}
                                        onChange={e => updateNotes(activeTab, e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className={styles.workoutModalFooter}>
                            <button
                                className={styles.workoutCancelBtn}
                                onClick={() => setShowWorkoutModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.workoutSaveBtn}
                                onClick={saveWorkout}
                            >
                                💾 Salvar Planilha
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
