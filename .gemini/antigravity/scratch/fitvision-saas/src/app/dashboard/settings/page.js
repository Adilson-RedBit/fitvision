"use client";

import { useState, useEffect } from "react";
import styles from "../clients/clients.module.css";
import { getTrainerProfile, updateTrainerProfile, getCurrentUser } from "../../../utils/storage";

export default function SettingsPage() {
    const [profile, setProfile] = useState({ full_name: "", email: "", phone: "", cref: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [user, dbProfile] = await Promise.all([getCurrentUser(), getTrainerProfile()]);
            setProfile({
                full_name: dbProfile?.full_name || "",
                email: user?.email || "",
                phone: dbProfile?.phone || "",
                cref: dbProfile?.cref || "",
            });
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await updateTrainerProfile({
                full_name: profile.full_name,
                phone: profile.phone,
                cref: profile.cref,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert("Erro ao salvar: " + err.message);
        } finally {
            setSaving(false);
        }
    };

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
                    {loading ? (
                        <p style={{ color: "#888", fontSize: "0.9rem" }}>Carregando...</p>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nome Completo</label>
                                <input
                                    className={styles.formInput}
                                    value={profile.full_name}
                                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>E-mail</label>
                                <input
                                    className={styles.formInput}
                                    value={profile.email}
                                    type="email"
                                    disabled
                                    style={{ background: "#f5f5f5", color: "#888" }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Telefone</label>
                                <input
                                    className={styles.formInput}
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="(11) 99999-0000"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>CREF</label>
                                <input
                                    className={styles.formInput}
                                    value={profile.cref}
                                    onChange={e => setProfile({ ...profile, cref: e.target.value })}
                                    placeholder="000000-G/SP"
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                    {saving ? "Salvando..." : "Salvar Alterações"}
                                </button>
                                {saved && <span style={{ color: "#4caf50", fontSize: "0.9rem", fontWeight: 600 }}>✓ Salvo!</span>}
                            </div>
                        </>
                    )}
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
