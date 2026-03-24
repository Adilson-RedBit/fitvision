"use client";

import styles from "../clients/clients.module.css";

export default function SettingsPage() {
    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>⚙️ Configurações</h1>
                    <p className={styles.pageSubtitle}>Gerencie seu perfil e preferências</p>
                </div>
            </div>

            <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
                {/* Profile */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 20, fontFamily: "var(--font-display)" }}>
                        Perfil do Personal
                    </h3>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nome Completo</label>
                        <input className={styles.formInput} defaultValue="Coach Demo" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>E-mail</label>
                        <input className={styles.formInput} defaultValue="coach@fitvision.com" type="email" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Telefone</label>
                        <input className={styles.formInput} defaultValue="(11) 99999-0000" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>CREF</label>
                        <input className={styles.formInput} placeholder="000000-G/SP" />
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 8 }}>Salvar Alterações</button>
                </div>

                {/* Workout Settings */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 20, fontFamily: "var(--font-display)" }}>
                        Configurações de Treino
                    </h3>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Validade padrão do treino (semanas)</label>
                        <select className={styles.formSelect} defaultValue="4">
                            <option value="3">3 semanas</option>
                            <option value="4">4 semanas</option>
                            <option value="6">6 semanas</option>
                            <option value="8">8 semanas</option>
                            <option value="12">12 semanas</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Alerta de expiração (dias antes)</label>
                        <select className={styles.formSelect} defaultValue="7">
                            <option value="3">3 dias</option>
                            <option value="5">5 dias</option>
                            <option value="7">7 dias</option>
                            <option value="14">14 dias</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 8 }}>Salvar</button>
                </div>

                {/* Subscription Info */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 20, fontFamily: "var(--font-display)" }}>
                        Plano Atual
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <span className="badge badge-primary" style={{ fontSize: "0.85rem", padding: "6px 16px" }}>
                            Starter (Grátis)
                        </span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                        Você está usando o plano gratuito com limite de 5 alunos. Faça upgrade para desbloquear recursos avançados.
                    </p>
                    <button className="btn btn-accent">🚀 Fazer Upgrade</button>
                </div>
            </div>
        </>
    );
}
