"use client";

import { useState } from "react";
import styles from "../clients/clients.module.css";

const exerciseDB = {
    Peito: [
        { name: "Supino Reto", sets: "4x12", equipment: "Barra" },
        { name: "Supino Inclinado", sets: "4x10", equipment: "Halter" },
        { name: "Crucifixo", sets: "3x15", equipment: "Halter" },
        { name: "Crossover", sets: "3x15", equipment: "Cabo" },
    ],
    Costas: [
        { name: "Puxada Frontal", sets: "4x12", equipment: "Cabo" },
        { name: "Remada Curvada", sets: "4x10", equipment: "Barra" },
        { name: "Remada Unilateral", sets: "3x12", equipment: "Halter" },
        { name: "Pullover", sets: "3x15", equipment: "Halter" },
    ],
    Pernas: [
        { name: "Agachamento Livre", sets: "4x10", equipment: "Barra" },
        { name: "Leg Press 45°", sets: "4x12", equipment: "Máquina" },
        { name: "Cadeira Extensora", sets: "3x15", equipment: "Máquina" },
        { name: "Stiff", sets: "3x12", equipment: "Barra" },
    ],
    Ombros: [
        { name: "Desenvolvimento", sets: "4x10", equipment: "Halter" },
        { name: "Elevação Lateral", sets: "4x15", equipment: "Halter" },
        { name: "Elevação Frontal", sets: "3x12", equipment: "Halter" },
    ],
    Bíceps: [
        { name: "Rosca Direta", sets: "3x12", equipment: "Barra" },
        { name: "Rosca Alternada", sets: "3x12", equipment: "Halter" },
        { name: "Rosca Martelo", sets: "3x15", equipment: "Halter" },
    ],
    Tríceps: [
        { name: "Tríceps Pulley", sets: "3x15", equipment: "Cabo" },
        { name: "Tríceps Testa", sets: "3x12", equipment: "Barra" },
        { name: "Tríceps Francês", sets: "3x12", equipment: "Halter" },
    ],
};

const mockWorkouts = [
    {
        id: 1,
        clientName: "Rafael Mendes",
        initials: "RM",
        type: "A - Peito / Tríceps",
        status: "active",
        startDate: "01/03/2026",
        endDate: "29/03/2026",
        daysLeft: 12,
        exercises: 6,
    },
    {
        id: 2,
        clientName: "Carla Silva",
        initials: "CS",
        type: "B - Costas / Bíceps",
        status: "warning",
        startDate: "10/02/2026",
        endDate: "10/03/2026",
        daysLeft: 3,
        exercises: 5,
    },
    {
        id: 3,
        clientName: "João Pedro",
        initials: "JP",
        type: "Full Body",
        status: "active",
        startDate: "05/03/2026",
        endDate: "02/04/2026",
        daysLeft: 20,
        exercises: 8,
    },
    {
        id: 4,
        clientName: "Ana Costa",
        initials: "AC",
        type: "Reabilitação",
        status: "expired",
        startDate: "01/02/2026",
        endDate: "01/03/2026",
        daysLeft: 0,
        exercises: 4,
    },
];

export default function WorkoutsPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedMuscles, setSelectedMuscles] = useState([]);

    const toggleMuscle = (muscle) => {
        setSelectedMuscles((prev) =>
            prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
        );
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>🏋️ Treinos</h1>
                    <p className={styles.pageSubtitle}>
                        Gerencie e monte treinos personalizados
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    ➕ Novo Treino
                </button>
            </div>

            <div className={styles.clientsGrid}>
                {mockWorkouts.map((workout) => (
                    <div key={workout.id} className="card" style={{ padding: 20 }}>
                        <div className={styles.clientCardTop}>
                            <div
                                className={styles.clientCardAvatar}
                                style={{
                                    background:
                                        workout.id % 2 === 0
                                            ? "var(--gradient-accent)"
                                            : "var(--gradient-primary)",
                                }}
                            >
                                {workout.initials}
                            </div>
                            <div>
                                <div className={styles.clientCardName}>
                                    {workout.clientName}
                                </div>
                                <div className={styles.clientCardEmail}>{workout.type}</div>
                            </div>
                            <span
                                className={`badge ${workout.status === "active"
                                        ? "badge-success"
                                        : workout.status === "warning"
                                            ? "badge-warning"
                                            : "badge-danger"
                                    }`}
                                style={{ marginLeft: "auto" }}
                            >
                                {workout.status === "active"
                                    ? "Ativo"
                                    : workout.status === "warning"
                                        ? "Expirando"
                                        : "Expirado"}
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
                                <div
                                    className={styles.metaValue}
                                    style={{
                                        color:
                                            workout.daysLeft <= 3
                                                ? "var(--danger)"
                                                : workout.daysLeft <= 7
                                                    ? "var(--warning)"
                                                    : "var(--accent)",
                                    }}
                                >
                                    {workout.daysLeft > 0 ? `${workout.daysLeft} dias` : "Expirado"}
                                </div>
                            </div>
                        </div>
                        <div className={styles.clientCardActions} style={{ marginTop: 14 }}>
                            <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                                📄 Detalhes
                            </button>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                                🔄 Renovar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Workout Builder Modal */}
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={styles.modal}
                        style={{ maxWidth: 700, maxHeight: "90vh" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>🏋️ Montar Treino</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 12,
                                    marginBottom: 20,
                                }}
                            >
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Aluno</label>
                                    <select className={styles.formSelect}>
                                        <option>Rafael Mendes</option>
                                        <option>Carla Silva</option>
                                        <option>João Pedro</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Tipo</label>
                                    <input
                                        className={styles.formInput}
                                        placeholder="Ex: A - Peito / Tríceps"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Data Início</label>
                                    <input type="date" className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Duração (semanas)</label>
                                    <select className={styles.formSelect}>
                                        <option>4 semanas</option>
                                        <option>6 semanas</option>
                                        <option>8 semanas</option>
                                        <option>12 semanas</option>
                                    </select>
                                </div>
                            </div>

                            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>
                                Selecione os Grupos Musculares
                            </h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                                {Object.keys(exerciseDB).map((muscle) => (
                                    <button
                                        key={muscle}
                                        onClick={() => toggleMuscle(muscle)}
                                        className={`badge ${selectedMuscles.includes(muscle) ? "badge-primary" : ""
                                            }`}
                                        style={{
                                            cursor: "pointer",
                                            padding: "8px 16px",
                                            fontSize: "0.85rem",
                                            background: selectedMuscles.includes(muscle)
                                                ? "rgba(108, 92, 231, 0.2)"
                                                : "var(--bg-surface)",
                                            border: `1px solid ${selectedMuscles.includes(muscle)
                                                    ? "rgba(108, 92, 231, 0.4)"
                                                    : "var(--border)"
                                                }`,
                                            borderRadius: "var(--radius-full)",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {muscle}
                                    </button>
                                ))}
                            </div>

                            {/* Show exercises for selected muscles */}
                            {selectedMuscles.map((muscle) => (
                                <div key={muscle} style={{ marginBottom: 16 }}>
                                    <h5
                                        style={{
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            marginBottom: 8,
                                            color: "var(--primary-light)",
                                        }}
                                    >
                                        💪 {muscle}
                                    </h5>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {exerciseDB[muscle].map((ex, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: "10px 14px",
                                                    background: "var(--bg-surface)",
                                                    borderRadius: "var(--radius-sm)",
                                                    border: "1px solid var(--border)",
                                                    fontSize: "0.85rem",
                                                }}
                                            >
                                                <span style={{ fontWeight: 600 }}>{ex.name}</span>
                                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                    <span
                                                        className="badge badge-primary"
                                                        style={{ fontSize: "0.7rem" }}
                                                    >
                                                        {ex.sets}
                                                    </span>
                                                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                                        {ex.equipment}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-accent"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedMuscles([]);
                                }}
                            >
                                ✓ Salvar Treino
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
