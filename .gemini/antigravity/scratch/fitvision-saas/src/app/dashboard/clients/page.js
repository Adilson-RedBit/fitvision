"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./clients.module.css";
import { getStudentsDB, createProspect } from "../../../utils/storage";

export default function ClientsPage() {
    const [showModal, setShowModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "Hipertrofia", age: "" });
    const [registrationLink, setRegistrationLink] = useState(null);
    const [justCreatedName, setJustCreatedName] = useState("");
    const [loading, setLoading] = useState(false);

    const loadClients = async () => {
        const db = await getStudentsDB();
        const clientsArray = Object.values(db).map((c, index) => {
            const nameParts = (c.name || "Aluno").split(" ");
            let initials = nameParts[0][0] || "";
            if (nameParts.length > 1) initials += nameParts[1][0];

            return {
                id: c.id,
                name: c.name,
                email: c.anamnesis?.basics?.email || c.email || "",
                initials: initials.toUpperCase(),
                color: index % 2 === 0 ? "var(--gradient-primary)" : "var(--gradient-accent)",
                phone: c.anamnesis?.basics?.phone || c.phone || "",
                goal: c.anamnesis?.basics?.goal || c.goal || "-",
                status: c.status?.toLowerCase() || "prospect",
                workoutExpiry: c.workouts?.length ? "Ativo" : "-",
                assessments: c.anamnesis ? 1 : 0
            };
        });
        setClients(clientsArray.reverse());
    };

    useEffect(() => {
        loadClients();
        window.addEventListener("fitvision_storage_update", loadClients);
        window.addEventListener("storage", loadClients);
        return () => {
            window.removeEventListener("fitvision_storage_update", loadClients);
            window.removeEventListener("storage", loadClients);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newStudent = await createProspect(form.name, form.email, form.phone, form.goal);
            setJustCreatedName(form.name);
            setRegistrationLink(newStudent.onboardingLink);
            setForm({ name: "", email: "", phone: "", goal: "Hipertrofia", age: "" });
            await loadClients();
        } catch (err) {
            console.error("Erro ao criar aluno:", err);
            alert("Erro ao cadastrar aluno: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const closeAndReset = () => {
        setShowModal(false);
        setRegistrationLink(null);
        setJustCreatedName("");
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Pesquisar aluno..."
                    />
                </div>
                <button
                    className={styles.fabAdd}
                    onClick={() => setShowModal(true)}
                >
                    Novo Cadastro
                </button>
            </div>

            <div className={styles.clientsGrid}>
                {clients.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
                        Nenhum aluno cadastrado ainda.
                    </div>
                )}
                {clients.map((client) => (
                    <Link
                        key={client.id}
                        href={`/dashboard/clients/${client.id}`}
                        className={styles.clientCard}
                    >
                        <div className={styles.clientAvatar}>👤</div>
                        <div className={styles.clientInfo}>
                            <div className={`${styles.statusIndicator} ${client.status === "expired" ? styles.statusBlocked : styles.statusActive}`}>
                                <span className={styles.statusDot}></span>
                                {client.status === "expired" ? "Bloqueado" : "Ativo"}
                            </div>
                            <div className={styles.clientName}>{client.name}</div>
                        </div>
                        <div style={{ color: "var(--primary)", fontSize: "1.2rem" }}>›</div>
                    </Link>
                ))}
            </div>

            <div className={styles.clientsSummary}>
                O <span className={styles.summaryHighlight}>total de alunos</span> é a soma de alunos ativos, bloqueados e prospects.
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeAndReset}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {registrationLink ? "Link Gerado!" : "Novo Aluno"}
                            </h3>
                            <button className={styles.modalClose} onClick={closeAndReset}>✕</button>
                        </div>

                        {registrationLink ? (
                            <div className={styles.modalBody}>
                                <div className={styles.successContainer}>
                                    <div className={styles.successIcon}>✅</div>
                                    <p className={styles.successText}>
                                        O pré-cadastro de <strong>{justCreatedName}</strong> foi realizado com sucesso!
                                    </p>
                                    <p className={styles.successSubtext}>
                                        Compartilhe o link abaixo para que o aluno complete as informações cadastrais e anamnese.
                                    </p>
                                    <div className={styles.linkCopyBox}>
                                        <input
                                            readOnly
                                            value={registrationLink}
                                            className={styles.linkInput}
                                        />
                                        <button
                                            className={styles.copyBtn}
                                            onClick={() => navigator.clipboard.writeText(registrationLink)}
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "100%", marginTop: "20px" }}
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Olá ${justCreatedName}! Para começarmos seus treinos, por favor preencha sua ficha cadastral no link: ${registrationLink}`)}`, "_blank")}
                                    >
                                        Enviar via WhatsApp 💬
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Nome Completo do Aluno</label>
                                        <input
                                            className={styles.formInput}
                                            placeholder="Ex: João Silva"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <p className={styles.formHelp}>
                                        Após cadastrar, você receberá um link de anamnese para enviar ao aluno.
                                    </p>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className="btn btn-outline" onClick={closeAndReset}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Cadastrando..." : "Gerar Link de Cadastro"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}