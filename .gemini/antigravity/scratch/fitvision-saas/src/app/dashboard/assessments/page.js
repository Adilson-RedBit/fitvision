"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../clients/clients.module.css";
import { getStudentsDB } from "../../../utils/storage";

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

export default function AssessmentsPage() {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const totalSteps = 3;

    const updateField = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const [dbStudents, setDbStudents] = useState([]);

    useEffect(() => {
        const load = async () => {
            const db = await getStudentsDB();
            setDbStudents(Object.values(db));
        };
        load();
        window.addEventListener("fitvision_storage_update", load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener("fitvision_storage_update", load);
            window.removeEventListener("storage", load);
        };
    }, []);

    const activeAssessments = dbStudents.map(student => ({
        id: student.id,
        clientName: student.name,
        initials: student.name.split(' ').map(n => n[0]).join('').substring(0, 2),
        date: student.createdAt || new Date().toLocaleDateString('pt-BR'),
        status: student.anamnesis ? "completed" : "pending",
        goal: student.anamnesis?.basics?.goal || "Pendente",
        photos: student.anamnesis?.photos ? Object.values(student.anamnesis.photos).filter(Boolean).length : 0
    }));

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
                    + Nova Avaliação
                </button>
            </div>

            {/* Assessment List */}
            <div className={styles.clientsGrid}>
                {activeAssessments.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>
                        Nenhum aluno cadastrado.
                    </div>
                ) : (
                    activeAssessments.map((assessment) => (
                        <Link
                            key={assessment.id}
                            href={`/dashboard/clients/${assessment.id}`}
                            className={styles.clientCard}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className={styles.clientCardHeader}>
                                <div className={styles.clientAvatar}>
                                    {assessment.initials}
                                </div>
                                <div className={styles.clientInfo}>
                                    <div className={styles.clientName}>{assessment.clientName}</div>
                                    <div className={styles.clientMeta}>{assessment.date}</div>
                                </div>
                                <span
                                    className={styles.statusBadge}
                                    style={{
                                        background: assessment.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                                        color: assessment.status === 'completed' ? '#2e7d32' : '#e65100',
                                    }}
                                >
                                    {assessment.status === 'completed' ? '✅ Completa' : '⏳ Pendente'}
                                </span>
                            </div>
                            <div className={styles.clientCardBody}>
                                <div className={styles.clientStat}>
                                    <span className={styles.clientStatLabel}>Objetivo</span>
                                    <span className={styles.clientStatValue}>{assessment.goal}</span>
                                </div>
                                <div className={styles.clientStat}>
                                    <span className={styles.clientStatLabel}>Fotos</span>
                                    <span className={styles.clientStatValue}>{assessment.photos}/4</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Modal Nova Avaliação */}
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Nova Avaliação — Etapa {step}/{totalSteps}</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0" }}>
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    style={{
                                        flex: 1,
                                        height: 4,
                                        borderRadius: 2,
                                        background: s <= step ? "var(--primary)" : "rgba(108, 92, 231, 0.15)",
                                        transition: "background 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        <div className={styles.modalBody}>
                            {/* Step 1: Selecionar Aluno */}
                            {step === 1 && (
                                <div>
                                    <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>
                                        1️⃣ Selecionar Aluno
                                    </h4>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Aluno</label>
                                        <select
                                            className={styles.formSelect}
                                            value={formData.clientId || ""}
                                            onChange={(e) => {
                                                const selected = dbStudents.find(s => s.id === e.target.value);
                                                updateField("clientId", e.target.value);
                                                updateField("clientName", selected?.name || "");
                                            }}
                                        >
                                            <option value="">Selecione um aluno</option>
                                            {dbStudents.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name}
                                                </option>
                                            ))}
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

                            {/* Step 2: Fotos */}
                            {step === 2 && (
                                <div>
                                    <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>
                                        2️⃣ Fotos de Avaliação
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 16 }}>
                                        As fotos são enviadas pelo aluno através do link de onboarding.
                                    </p>
                                    {formData.clientId && (
                                        <Link
                                            href={`/dashboard/clients/${formData.clientId}`}
                                            style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}
                                        >
                                            Ver perfil completo do aluno →
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Anamnese */}
                            {step === 3 && (
                                <div>
                                    <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>
                                        3️⃣ Anamnese
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
                                    ✅ Finalizar Avaliação
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
