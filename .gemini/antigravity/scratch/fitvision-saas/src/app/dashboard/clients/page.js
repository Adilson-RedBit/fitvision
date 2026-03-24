"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./clients.module.css";
import dashStyles from "../dashboard.module.css";

const initialClients = [
    {
        id: 1,
        name: "Rafael Mendes",
        email: "rafael@email.com",
        initials: "RM",
        color: "var(--gradient-primary)",
        phone: "(11) 99999-0001",
        goal: "Hipertrofia",
        age: 28,
        status: "active",
        workoutExpiry: "12 dias",
        assessments: 3,
    },
    {
        id: 2,
        name: "Carla Silva",
        email: "carla@email.com",
        initials: "CS",
        color: "var(--gradient-accent)",
        phone: "(11) 99999-0002",
        goal: "Emagrecimento",
        age: 34,
        status: "warning",
        workoutExpiry: "3 dias",
        assessments: 2,
    },
    {
        id: 3,
        name: "João Pedro",
        email: "joao@email.com",
        initials: "JP",
        color: "var(--gradient-primary)",
        phone: "(11) 99999-0003",
        goal: "Condicionamento",
        age: 22,
        status: "active",
        workoutExpiry: "20 dias",
        assessments: 1,
    },
    {
        id: 4,
        name: "Ana Costa",
        email: "ana@email.com",
        initials: "AC",
        color: "var(--gradient-accent)",
        phone: "(11) 99999-0004",
        goal: "Reabilitação",
        age: 45,
        status: "expired",
        workoutExpiry: "Expirado",
        assessments: 4,
    },
    {
        id: 5,
        name: "Lucas Oliveira",
        email: "lucas@email.com",
        initials: "LO",
        color: "var(--gradient-primary)",
        phone: "(11) 99999-0005",
        goal: "Hipertrofia",
        age: 31,
        status: "active",
        workoutExpiry: "18 dias",
        assessments: 2,
    },
    {
        id: 6,
        name: "Marina Santos",
        email: "marina@email.com",
        initials: "MS",
        color: "var(--gradient-accent)",
        phone: "(11) 99999-0006",
        goal: "Definição",
        age: 27,
        status: "active",
        workoutExpiry: "25 dias",
        assessments: 1,
    },
];

export default function ClientsPage() {
    const [showModal, setShowModal] = useState(false);
    const [clients, setClients] = useState(initialClients);
    const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "Hipertrofia", age: "" });
    const [registrationLink, setRegistrationLink] = useState(null);
    const [justCreatedName, setJustCreatedName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newId = Date.now();
        const initials = form.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

        const newClient = {
            id: newId,
            name: form.name,
            initials,
            color: clients.length % 2 === 0 ? "var(--gradient-primary)" : "var(--gradient-accent)",
            status: "prospect",
            workoutExpiry: "-",
            assessments: 0,
        };

        setClients([newClient, ...clients]);
        setJustCreatedName(form.name);
        setRegistrationLink(`http://localhost:3000/onboarding/${newId}`);
        setForm({ name: "", email: "", phone: "", goal: "Hipertrofia", age: "" });
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
                {clients.map((client) => (
                    <Link
                        key={client.id}
                        href={`/dashboard/clients/${client.id}`}
                        className={styles.clientCard}
                    >
                        <div className={styles.clientAvatar}>
                            👤
                        </div>
                        <div className={styles.clientInfo}>
                            <div className={`${styles.statusIndicator} ${client.status === 'expired' ? styles.statusBlocked : styles.statusActive}`}>
                                <span className={styles.statusDot}></span>
                                {client.status === 'expired' ? 'Bloqueado' : 'Ativo'}
                            </div>
                            <div className={styles.clientName}>{client.name}</div>
                        </div>
                        <div style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>›</div>
                    </Link>
                ))}
            </div>

            <div className={styles.clientsSummary}>
                O <span className={styles.summaryHighlight}>total de alunos</span> é a soma de alunos ativos, bloqueados e prospects.
            </div>

            {/* New Client Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeAndReset}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {registrationLink ? "Link Gerado!" : "Novo Aluno"}
                            </h3>
                            <button
                                className={styles.modalClose}
                                onClick={closeAndReset}
                            >
                                ✕
                            </button>
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
                                        style={{ width: '100%', marginTop: '20px' }}
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Olá ${justCreatedName}! Para começarmos seus treinos, por favor preencha sua ficha cadastral no link: ${registrationLink}`)}`, '_blank')}
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
                                            onChange={(e) =>
                                                setForm({ ...form, name: e.target.value })
                                            }
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <p className={styles.formHelp}>
                                        Após cadastrar, você receberá um link de anamnese para enviar ao aluno.
                                    </p>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={closeAndReset}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Gerar Link de Cadastro
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
