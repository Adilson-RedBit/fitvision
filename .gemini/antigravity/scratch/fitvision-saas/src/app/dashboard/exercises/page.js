"use client";

import { useState, useEffect } from "react";
import styles from "./exercises.module.css";

const DEFAULT_EXERCISES = [
    { id: 1, name: "Supino Reto", muscle: "Peito", equipment: "Barra", icon: "🏋️" },
    { id: 2, name: "Supino Inclinado", muscle: "Peito", equipment: "Halter", icon: "🏋️" },
    { id: 3, name: "Crucifixo", muscle: "Peito", equipment: "Halter", icon: "🏋️" },
    { id: 4, name: "Crossover", muscle: "Peito", equipment: "Cabo", icon: "🏋️" },
    { id: 5, name: "Supino Declinado", muscle: "Peito", equipment: "Barra", icon: "🏋️" },
    { id: 6, name: "Puxada Frontal", muscle: "Costas", equipment: "Cabo", icon: "💪" },
    { id: 7, name: "Remada Curvada", muscle: "Costas", equipment: "Barra", icon: "💪" },
    { id: 8, name: "Remada Unilateral", muscle: "Costas", equipment: "Halter", icon: "💪" },
    { id: 9, name: "Pullover", muscle: "Costas", equipment: "Halter", icon: "💪" },
    { id: 10, name: "Remada Baixa", muscle: "Costas", equipment: "Cabo", icon: "💪" },
    { id: 11, name: "Agachamento Livre", muscle: "Pernas", equipment: "Barra", icon: "🦵" },
    { id: 12, name: "Leg Press 45", muscle: "Pernas", equipment: "Maquina", icon: "🦵" },
    { id: 13, name: "Cadeira Extensora", muscle: "Pernas", equipment: "Maquina", icon: "🦵" },
    { id: 14, name: "Mesa Flexora", muscle: "Pernas", equipment: "Maquina", icon: "🦵" },
    { id: 15, name: "Stiff", muscle: "Pernas", equipment: "Barra", icon: "🦵" },
    { id: 16, name: "Passada", muscle: "Pernas", equipment: "Halter", icon: "🦵" },
    { id: 17, name: "Panturrilha em Pe", muscle: "Panturrilhas", equipment: "Maquina", icon: "🦵" },
    { id: 18, name: "Desenvolvimento", muscle: "Ombros", equipment: "Halter", icon: "🔱" },
    { id: 19, name: "Elevacao Lateral", muscle: "Ombros", equipment: "Halter", icon: "🔱" },
    { id: 20, name: "Elevacao Frontal", muscle: "Ombros", equipment: "Halter", icon: "🔱" },
    { id: 21, name: "Face Pull", muscle: "Ombros", equipment: "Cabo", icon: "🔱" },
    { id: 22, name: "Rosca Direta", muscle: "Biceps", equipment: "Barra", icon: "💪" },
    { id: 23, name: "Rosca Alternada", muscle: "Biceps", equipment: "Halter", icon: "💪" },
    { id: 24, name: "Rosca Martelo", muscle: "Biceps", equipment: "Halter", icon: "💪" },
    { id: 25, name: "Rosca Scott", muscle: "Biceps", equipment: "Barra", icon: "💪" },
    { id: 26, name: "Triceps Pulley", muscle: "Triceps", equipment: "Cabo", icon: "💪" },
    { id: 27, name: "Triceps Testa", muscle: "Triceps", equipment: "Barra", icon: "💪" },
    { id: 28, name: "Triceps Frances", muscle: "Triceps", equipment: "Halter", icon: "💪" },
    { id: 29, name: "Abdominais", muscle: "Core", equipment: "Peso Corporal", icon: "🔥" },
    { id: 30, name: "Prancha", muscle: "Core", equipment: "Peso Corporal", icon: "🔥" },
    { id: 31, name: "Russian Twist", muscle: "Core", equipment: "Peso Corporal", icon: "🔥" },
];

const MUSCLE_GROUPS = [
    "Biceps", "Costas", "Core", "Ombros", "Panturrilhas",
    "Peito", "Pernas", "Triceps", "Outro"
];

const EQUIPMENT_OPTIONS = [
    "Barra", "Cabo", "Halter", "Maquina", "Peso Corporal", "Outro"
];

const STORAGE_KEY = "fitvision_custom_exercises";

function loadCustomExercises() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveCustomExercises(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

export default function ExercisesPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [customExercises, setCustomExercises] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", muscle: "Peito", equipment: "Halter", videoUrl: "" });
    const [filterMuscle, setFilterMuscle] = useState("Todos");

    useEffect(() => {
        setCustomExercises(loadCustomExercises());
    }, []);

    const allExercises = [
        ...DEFAULT_EXERCISES,
        ...customExercises.map((ex, i) => ({ ...ex, id: `custom-${i}`, icon: "⭐" }))
    ];

    const muscles = ["Todos", ...Array.from(new Set(allExercises.map(e => e.muscle))).sort()];

    const filtered = allExercises.filter(ex => {
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchMuscle = filterMuscle === "Todos" || ex.muscle === filterMuscle;
        return matchSearch && matchMuscle;
    });

    const handleSave = () => {
        if (!form.name.trim()) return;
        const newEx = { ...form, createdAt: new Date().toISOString() };
        const updated = [...customExercises, newEx];
        setCustomExercises(updated);
        saveCustomExercises(updated);
        setForm({ name: "", muscle: "Peito", equipment: "Halter", videoUrl: "" });
        setShowForm(false);
        setActiveTab("all");
        setSearch(newEx.name);
    };

    const handleDelete = (idx) => {
        if (!window.confirm("Excluir este exercicio?")) return;
        const updated = customExercises.filter((_, i) => i !== idx);
        setCustomExercises(updated);
        saveCustomExercises(updated);
    };

    return (
        <div className={styles.pageContainer}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className={styles.tabs} style={{ margin: 0 }}>
                    <div className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
                        onClick={() => { setActiveTab("all"); setShowForm(false); }}>
                        Exercicios
                    </div>
                    <div className={`${styles.tab} ${activeTab === "muscles" ? styles.tabActive : ""}`}
                        onClick={() => { setActiveTab("muscles"); setShowForm(false); }}>
                        Grupos Musculares
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: "10px" }}
                    onClick={() => { setShowForm(true); setActiveTab("all"); }}>
                    + Novo Exercicio
                </button>
            </div>

            {/* NEW EXERCISE FORM */}
            {showForm && (
                <div style={{
                    background: "white", borderRadius: "16px", padding: "20px",
                    border: "2px solid var(--primary)", marginBottom: "16px"
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "16px", color: "var(--primary)" }}>
                        Novo Exercicio
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "6px" }}>
                                NOME *
                            </label>
                            <input
                                autoFocus
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Ex: Elevacao Pelvica"
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.95rem", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "6px" }}>
                                GRUPO MUSCULAR
                            </label>
                            <select
                                value={form.muscle}
                                onChange={e => setForm({ ...form, muscle: e.target.value })}
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.95rem", background: "white" }}>
                                {MUSCLE_GROUPS.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "6px" }}>
                                EQUIPAMENTO
                            </label>
                            <select
                                value={form.equipment}
                                onChange={e => setForm({ ...form, equipment: e.target.value })}
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.95rem", background: "white" }}>
                                {EQUIPMENT_OPTIONS.map(eq => <option key={eq}>{eq}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "6px" }}>
                                VIDEO (YouTube URL - opcional)
                            </label>
                            <input
                                value={form.videoUrl}
                                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.95rem", boxSizing: "border-box" }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
                        <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={!form.name.trim()}>
                            Salvar Exercicio
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "muscles" ? (
                <div className={styles.muscleGrid}>
                    {Array.from(new Set(allExercises.map(e => e.muscle))).sort().map(m => (
                        <div key={m} className={styles.muscleCard}
                            onClick={() => { setActiveTab("all"); setFilterMuscle(m); }}>
                            <div className={styles.muscleIconWrapper}>💪</div>
                            <span className={styles.muscleLabel}>{m}</span>
                            <span style={{ fontSize: "0.7rem", color: "#888", marginTop: "2px" }}>
                                {allExercises.filter(e => e.muscle === m).length} exercicios
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div className={styles.searchBox} style={{ flex: 1 }}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                className={styles.searchInput}
                                placeholder="Pesquisar exercicio..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={filterMuscle}
                            onChange={e => setFilterMuscle(e.target.value)}
                            style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.85rem", background: "white", cursor: "pointer" }}>
                            {muscles.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>

                    {customExercises.length > 0 && filterMuscle === "Todos" && !search && (
                        <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, padding: "0 4px" }}>
                            {customExercises.length} exercicio(s) personalizado(s) adicionado(s)
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {filtered.map((ex) => {
                            const isCustom = String(ex.id).startsWith("custom-");
                            const customIdx = isCustom ? parseInt(String(ex.id).split("-")[1]) : -1;
                            return (
                                <div key={ex.id} style={{
                                    padding: "16px", background: "white", borderRadius: "16px",
                                    border: `1px solid ${isCustom ? "var(--primary)" : "var(--border)"}`,
                                    display: "flex", alignItems: "center", gap: "14px"
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: "12px",
                                        background: isCustom ? "rgba(126,82,243,0.1)" : "#f0f2f5",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1.4rem", flexShrink: 0
                                    }}>
                                        {ex.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                            {ex.name}
                                            {isCustom && (
                                                <span style={{ fontSize: "0.65rem", background: "var(--primary)", color: "white", borderRadius: "6px", padding: "1px 6px", fontWeight: 600 }}>
                                                    MEU
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                                            {ex.muscle} • {ex.equipment}
                                        </div>
                                        {ex.videoUrl && (
                                            <a href={ex.videoUrl} target="_blank" rel="noreferrer"
                                                style={{ fontSize: "0.7rem", color: "red", marginTop: "4px", display: "block" }}>
                                                ▶ Ver video
                                            </a>
                                        )}
                                    </div>
                                    {isCustom ? (
                                        <button onClick={() => handleDelete(customIdx)}
                                            style={{ background: "none", border: "none", color: "#ff4757", cursor: "pointer", fontSize: "1.1rem", padding: "4px" }}
                                            title="Excluir">
                                            &#128465;
                                        </button>
                                    ) : (
                                        <div style={{ color: "var(--primary)" }}>›</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                            Nenhum exercicio encontrado.
                            <br />
                            <button className="btn btn-primary btn-sm" style={{ marginTop: "12px" }}
                                onClick={() => setShowForm(true)}>
                                + Criar Exercicio
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
