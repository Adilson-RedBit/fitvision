"use client";

import { useState } from "react";
import styles from "../clients/clients.module.css";

const anamneseQuestions = [
    { id: "injury", label: "Possui alguma lesão ou dor articular?", type: "text", placeholder: "Descreva lesões, dores ou limitações..." },
    { id: "diseases", label: "Possui doenças ou condições de saúde?", type: "text", placeholder: "Ex: diabetes, hipertensão, asma..." },
    { id: "medications", label: "Toma algum medicamento contínuo?", type: "text", placeholder: "Liste os medicamentos..." },
    { id: "experience", label: "Nível de experiência com treino", type: "select", options: ["Iniciante", "Intermediário", "Avançado"] },
    { id: "frequency", label: "Quantas vezes por semana pode treinar?", type: "select", options: ["2x", "3x", "4x", "5x", "6x"] },
    { id: "sleepHours", label: "Horas de sono por noite (média)", type: "select", options: ["Menos de 5h", "5-6h", "6-7h", "7-8h", "Mais de 8h"] },
    { id: "nutrition", label: "Como avalia sua alimentação?", type: "select", options: ["Ruim", "Regular", "Boa", "Excelente"] },
    { id: "goals", label: "Objetivos específicos", type: "textarea", placeholder: "Descreva detalhadamente seus objetivos..." },
];

const mockAssessments = [
    {
        id: 1,
        clientName: "Rafael Mendes",
        initials: "RM",
        date: "08/03/2026",
        status: "completed",
        goal: "Hipertrofia",
        photos: 4,
    },
    {
        id: 2,
        clientName: "Carla Silva",
        initials: "CS",
        date: "05/03/2026",
        status: "completed",
        goal: "Emagrecimento",
        photos: 4,
    },
    {
        id: 3,
        clientName: "João Pedro",
        initials: "JP",
        date: "01/03/2026",
        status: "pending",
        goal: "Condicionamento",
        photos: 0,
    },
];

export default function AssessmentsPage() {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const totalSteps = 3;

    const updateField = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>📷 Avaliações Físicas</h1>
                    <p className={styles.pageSubtitle}>
                        Avaliações por fotos e anamnese digital
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowModal(true);
                        setStep(1);
                    }}
                >
                    ➕ Nova Avaliação
                </button>
            </div>

            {/* Assessment List */}
            <div className={styles.clientsGrid}>
                {mockAssessments.map((item) => (
                    <div key={item.id} className="card" style={{ padding: "20px" }}>
                        <div className={styles.clientCardTop}>
                            <div
                                className={styles.clientCardAvatar}
                                style={{
                                    background:
                                        item.id % 2 === 0
                                            ? "var(--gradient-accent)"
                                            : "var(--gradient-primary)",
                                }}
                            >
                                {item.initials}
                            </div>
                            <div>
                                <div className={styles.clientCardName}>{item.clientName}</div>
                                <div className={styles.clientCardEmail}>{item.date}</div>
                            </div>
                            <span
                                className={`badge ${item.status === "completed"
                                        ? "badge-success"
                                        : "badge-warning"
                                    }`}
                                style={{ marginLeft: "auto" }}
                            >
                                {item.status === "completed" ? "Completa" : "Pendente"}
                            </span>
                        </div>
                        <div className={styles.clientCardMeta}>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Objetivo</div>
                                <div className={styles.metaValue}>{item.goal}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>Fotos</div>
                                <div className={styles.metaValue}>{item.photos}/4</div>
                            </div>
                        </div>
                        <div className={styles.clientCardActions} style={{ marginTop: 14 }}>
                            <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                                📄 Ver Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Multi-Step Assessment Modal */}
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={styles.modal}
                        style={{ maxWidth: 600 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                Nova Avaliação — Etapa {step}/{totalSteps}
                            </h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Step Progress */}
                        <div
                            style={{
                                display: "flex",
                                gap: 4,
                                padding: "12px 24px 0",
                            }}
                        >
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    style={{
                                        flex: 1,
                                        height: 4,
                                        borderRadius: 2,
                                        background:
                                            s <= step
                                                ? "var(--primary)"
                                                : "rgba(108, 92, 231, 0.15)",
                                        transition: "background 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        <div className={styles.modalBody}>
                            {/* Step 1: Select Client */}
                            {step === 1 && (
                                <div>
                                    <h4
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            marginBottom: 16,
                                        }}
                                    >
                                        1️⃣ Selecionar Aluno
                                    </h4>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Aluno</label>
                                        <select
                                            className={styles.formSelect}
                                            value={formData.clientName || ""}
                                            onChange={(e) => updateField("clientName", e.target.value)}
                                        >
                                            <option value="">Selecione um aluno</option>
                                            <option>Rafael Mendes</option>
                                            <option>Carla Silva</option>
                                            <option>João Pedro</option>
                                            <option>Ana Costa</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Objetivo</label>
                                        <select
                                            className={styles.formSelect}
                                            value={formData.goal || ""}
                                            onChange={(e) => updateField("goal", e.target.value)}
                                        >
                                            <option value="">Selecione o objetivo</option>
                                            <option>Hipertrofia</option>
                                            <option>Emagrecimento</option>
                                            <option>Condicionamento</option>
                                            <option>Definição</option>
                                            <option>Reabilitação</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Photo Upload */}
                            {step === 2 && (
                                <div>
                                    <h4
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            marginBottom: 16,
                                        }}
                                    >
                                        📷 Upload de Fotos (4 ângulos)
                                    </h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 12,
                                        }}
                                    >
                                        {["Frontal", "Lateral Esquerda", "Lateral Direita", "Costas"].map(
                                            (angle) => (
                                                <div
                                                    key={angle}
                                                    style={{
                                                        border: "2px dashed var(--border-strong)",
                                                        borderRadius: "var(--radius-md)",
                                                        padding: 24,
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                        background: "var(--bg-surface)",
                                                    }}
                                                >
                                                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>
                                                        📷
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            fontWeight: 600,
                                                            color: "var(--text-secondary)",
                                                        }}
                                                    >
                                                        {angle}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "0.7rem",
                                                            color: "var(--text-muted)",
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        Clique para enviar
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Anamnesis */}
                            {step === 3 && (
                                <div>
                                    <h4
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            marginBottom: 16,
                                        }}
                                    >
                                        📋 Anamnese
                                    </h4>
                                    {anamneseQuestions.map((q) => (
                                        <div key={q.id} className={styles.formGroup}>
                                            <label className={styles.formLabel}>{q.label}</label>
                                            {q.type === "text" && (
                                                <input
                                                    className={styles.formInput}
                                                    placeholder={q.placeholder}
                                                    value={formData[q.id] || ""}
                                                    onChange={(e) => updateField(q.id, e.target.value)}
                                                />
                                            )}
                                            {q.type === "textarea" && (
                                                <textarea
                                                    className={styles.formInput}
                                                    placeholder={q.placeholder}
                                                    rows={3}
                                                    value={formData[q.id] || ""}
                                                    onChange={(e) => updateField(q.id, e.target.value)}
                                                    style={{ resize: "vertical" }}
                                                />
                                            )}
                                            {q.type === "select" && (
                                                <select
                                                    className={styles.formSelect}
                                                    value={formData[q.id] || ""}
                                                    onChange={(e) => updateField(q.id, e.target.value)}
                                                >
                                                    <option value="">Selecione</option>
                                                    {q.options.map((opt) => (
                                                        <option key={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            {step > 1 && (
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setStep(step - 1)}
                                >
                                    ← Voltar
                                </button>
                            )}
                            <div style={{ flex: 1 }} />
                            {step < totalSteps ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setStep(step + 1)}
                                >
                                    Próximo →
                                </button>
                            ) : (
                                <button
                                    className="btn btn-accent"
                                    onClick={() => {
                                        setShowModal(false);
                                        setStep(1);
                                        setFormData({});
                                    }}
                                >
                                    ✓ Finalizar Avaliação
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
