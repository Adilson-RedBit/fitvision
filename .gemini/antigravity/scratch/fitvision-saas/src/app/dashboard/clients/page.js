"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./clients.module.css";
import { getStudentsDB, createProspect } from "../../../utils/storage";

function getExpiryInfo(workouts) {
    if (!workouts || workouts.length === 0) return null;
    // Get most recent workout with expiryDate
    const withExpiry = workouts.filter(w => w.expiryDate);
    if (withExpiry.length === 0) return null;
    const latest = withExpiry[withExpiry.length - 1];
    const expiry = new Date(latest.expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return { diffDays, expiryDate: expiry, workoutName: latest.name };
}

function ExpiryBadge({ diffDays }) {
    if (diffDays === null || diffDays === undefined) return null;
    if (diffDays < 0) {
        return (
            <span style={{
                background: '#ff47571a', border: '1px solid #ff4757',
                color: '#ff4757', borderRadius: '20px', padding: '2px 8px',
                fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap'
            }}>
                🔴 Vencido
            </span>
        );
    }
    if (diffDays <= 7) {
        return (
            <span style={{
                background: '#ffa5001a', border: '1px solid #ffa500',
                color: '#ffa500', borderRadius: '20px', padding: '2px 8px',
                fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap'
            }}>
                🟡 Vence em {diffDays}d
            </span>
        );
    }
    return (
        <span style={{
            background: '#4caf501a', border: '1px solid #4caf50',
            color: '#4caf50', borderRadius: '20px', padding: '2px 8px',
            fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap'
        }}>
            🟢 {diffDays}d restantes
        </span>
    );
}

export default function ClientsPage() {
    const [showModal, setShowModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "Hipertrofia", age: "" });
    const [registrationLink, setRegistrationLink] = useState(null);
    const [justCreatedName, setJustCreatedName] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const loadClients = async () => {
        const db = await getStudentsDB();
        const clientsArray = Object.values(db).map((c, index) => {
            const nameParts = (c.name || "Aluno").split(" ");
            let initials = nameParts[0][0] || "";
            if (nameParts.length > 1) initials += nameParts[1][0];
            const expiryInfo = getExpiryInfo(c.workouts);
            return {
                id: c.id,
                name: c.name,
                email: c.anamnesis?.basics?.email || c.email || "",
                initials: initials.toUpperCase(),
                color: index % 2 === 0 ? "var(--gradient-primary)" : "var(--gradient-accent)",
                phone: c.anamnesis?.basics?.phone || c.phone || "",
                goal: c.anamnesis?.basics?.goal || c.goal || "-",
                status: c.status?.toLowerCase() || "prospect",
                expiryInfo,
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

    const filtered = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Pesquisar aluno..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button className={styles.fabAdd} onClick={() => setShowModal(true)}>
                    Novo Cadastro
                </button>
            </div>

            <div className={styles.clientsGrid}>
                {filtered.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
                        Nenhum aluno cadastrado ainda.
                    </div>
                )}
                {filtered.map((client) => (
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
                            {client.expiryInfo && (
                                <div style={{ marginTop: '4px' }}>
                                    <ExpiryBadge diffDays={client.expiryInfo.diffDays} />
                                </div>
                            )}
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
                                        <input readOnly value={registrationLink} className={styles.linkInput} />
                                        <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(registrationLink)}>
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
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>WhatsApp (com DDD)</label>
                                        <input
                                            className={styles.formInput}
                                            placeholder="Ex: (11) 99999-9999"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>E-mail</label>
                                        <input
                                            className={styles.formInput}
                                            type="email"
                                            placeholder="Ex: joao@email.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
