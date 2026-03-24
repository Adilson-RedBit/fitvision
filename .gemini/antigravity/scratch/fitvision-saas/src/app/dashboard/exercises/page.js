"use client";

import { useState } from "react";
import styles from "./exercises.module.css";

const allExercises = [
    { id: 1, name: "Supino Reto", muscle: "Peito", equipment: "Barra", level: "Intermediário", icon: "🏋️" },
    { id: 2, name: "Supino Inclinado", muscle: "Peito", equipment: "Halter", level: "Intermediário", icon: "🏋️" },
    { id: 3, name: "Crucifixo", muscle: "Peito", equipment: "Halter", level: "Iniciante", icon: "🏋️" },
    { id: 4, name: "Crossover", muscle: "Peito", equipment: "Cabo", level: "Avançado", icon: "🏋️" },
    { id: 5, name: "Puxada Frontal", muscle: "Costas", equipment: "Cabo", level: "Iniciante", icon: "💪" },
    { id: 6, name: "Remada Curvada", muscle: "Costas", equipment: "Barra", level: "Intermediário", icon: "💪" },
    { id: 7, name: "Remada Unilateral", muscle: "Costas", equipment: "Halter", level: "Intermediário", icon: "💪" },
    { id: 8, name: "Pullover", muscle: "Costas", equipment: "Halter", level: "Avançado", icon: "💪" },
    { id: 9, name: "Agachamento Livre", muscle: "Pernas", equipment: "Barra", level: "Intermediário", icon: "🦵" },
    { id: 10, name: "Leg Press 45°", muscle: "Pernas", equipment: "Máquina", level: "Iniciante", icon: "🦵" },
    { id: 11, name: "Cadeira Extensora", muscle: "Pernas", equipment: "Máquina", level: "Iniciante", icon: "🦵" },
    { id: 12, name: "Stiff", muscle: "Pernas", equipment: "Barra", level: "Intermediário", icon: "🦵" },
    { id: 13, name: "Desenvolvimento", muscle: "Ombros", equipment: "Halter", level: "Intermediário", icon: "🔱" },
    { id: 14, name: "Elevação Lateral", muscle: "Ombros", equipment: "Halter", level: "Iniciante", icon: "🔱" },
    { id: 15, name: "Elevação Frontal", muscle: "Ombros", equipment: "Halter", level: "Iniciante", icon: "🔱" },
    { id: 16, name: "Rosca Direta", muscle: "Bíceps", equipment: "Barra", level: "Iniciante", icon: "💪" },
    { id: 17, name: "Rosca Alternada", muscle: "Bíceps", equipment: "Halter", level: "Iniciante", icon: "💪" },
    { id: 18, name: "Rosca Martelo", muscle: "Bíceps", equipment: "Halter", level: "Intermediário", icon: "💪" },
    { id: 19, name: "Tríceps Pulley", muscle: "Tríceps", equipment: "Cabo", level: "Iniciante", icon: "💪" },
    { id: 20, name: "Tríceps Testa", muscle: "Tríceps", equipment: "Barra", level: "Intermediário", icon: "💪" },
    { id: 21, name: "Tríceps Francês", muscle: "Tríceps", equipment: "Halter", level: "Intermediário", icon: "💪" },
    { id: 22, name: "Abdominais", muscle: "Core", equipment: "Peso Corporal", level: "Iniciante", icon: "🔥" },
    { id: 23, name: "Prancha", muscle: "Core", equipment: "Peso Corporal", level: "Iniciante", icon: "🔥" },
    { id: 24, name: "Russian Twist", muscle: "Core", equipment: "Peso Corporal", level: "Intermediário", icon: "🔥" },
];

const muscleGroups = [
    { name: "Abdominais", icon: "🍫" },
    { name: "Antebraço", icon: "💪" },
    { name: "Bíceps", icon: "💪" },
    { name: "Cardio", icon: "❤️" },
    { name: "Costas", icon: "👐" },
    { name: "Glúteos", icon: "🦵" },
    { name: "Ombros", icon: "🔱" },
    { name: "Peito", icon: "🏋️" },
    { name: "Pernas", icon: "🦵" },
    { name: "Tríceps", icon: "💪" },
];

export default function ExercisesPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = allExercises.filter((ex) => {
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    return (
        <div className={styles.pageContainer}>
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Exercícios
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 'muscles' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('muscles')}
                >
                    Grupos Musculares
                </div>
            </div>

            {activeTab === 'muscles' ? (
                <div className={styles.muscleGrid}>
                    {muscleGroups.map(m => (
                        <div key={m.name} className={styles.muscleCard}>
                            <div className={styles.muscleIconWrapper}>{m.icon}</div>
                            <span className={styles.muscleLabel}>{m.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            className={styles.searchInput}
                            placeholder="Pesquisar exercício..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filtered.map((ex) => (
                            <div
                                key={ex.id}
                                style={{
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px'
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '12px',
                                        background: '#f0f2f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.4rem',
                                        flexShrink: 0,
                                        color: 'var(--primary)'
                                    }}
                                >
                                    {ex.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ex.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                        {ex.muscle} • {ex.equipment}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--primary)' }}>›</div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            Nenhum exercício encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
