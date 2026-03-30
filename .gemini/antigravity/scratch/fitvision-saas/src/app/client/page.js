"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./client.module.css";
import { supabase } from "../../utils/supabase";

export default function ClientLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) {
            setError("E-mail ou senha inválidos. Tente novamente.");
            setLoading(false);
            return;
        }

        router.push("/client/portal");
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            { redirectTo: `${window.location.origin}/auth/reset-password` }
        );
        setLoading(false);
        if (error) {
            setError("Erro ao enviar e-mail. Verifique o endereço.");
        } else {
            setResetSent(true);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={`${styles.loginOrb} ${styles.loginOrb1}`} />
            <div className={`${styles.loginOrb} ${styles.loginOrb2}`} />

            <div className={styles.loginCard}>
                <div className={styles.loginLogo}>
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 16, marginBottom: 16, backgroundColor: "#191E22",
                        padding: "16px 24px", borderRadius: 16,
                    }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision"
                            style={{ height: 80, objectFit: "contain" }} />
                        <span style={{
                            fontSize: 48, fontWeight: 900, letterSpacing: "-0.03em",
                            lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif',
                        }}>
                            <span style={{ color: "#D4FF00" }}>Fit</span>
                            <span style={{ color: "#B46BFB" }}>Vision</span>
                        </span>
                    </div>
                    <div className={styles.loginSubtitle}>
                        {showReset ? "Recuperar senha" : "Área do Aluno"}
                    </div>
                </div>

                {!showReset ? (
                    <form className={styles.loginForm} onSubmit={handleLogin}>
                        {error && <div className={styles.loginError}>{error}</div>}

                        <div className={styles.loginInputGroup}>
                            <label className={styles.loginLabel}>E-mail</label>
                            <input
                                type="email"
                                className={styles.loginInput}
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.loginInputGroup}>
                            <label className={styles.loginLabel}>Senha</label>
                            <input
                                type="password"
                                className={styles.loginInput}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.loginButton}`}
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                ) : (
                    <form className={styles.loginForm} onSubmit={handleReset}>
                        {resetSent ? (
                            <div style={{
                                background: "rgba(0,209,178,0.08)",
                                border: "1px solid rgba(0,209,178,0.2)",
                                borderRadius: "var(--radius-md)",
                                padding: "16px", textAlign: "center",
                                fontSize: "0.9rem", color: "var(--success)",
                            }}>
                                ✅ Link enviado! Verifique seu e-mail.
                            </div>
                        ) : (
                            <>
                                {error && <div className={styles.loginError}>{error}</div>}
                                <div className={styles.loginInputGroup}>
                                    <label className={styles.loginLabel}>Seu e-mail</label>
                                    <input
                                        type="email"
                                        className={styles.loginInput}
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${styles.loginButton}`}
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                                </button>
                            </>
                        )}
                    </form>
                )}

                <div className={styles.loginFooter}>
                    {showReset ? (
                        <span
                            className={styles.loginFooterLink}
                            onClick={() => { setShowReset(false); setError(""); setResetSent(false); }}
                        >
                            ← Voltar ao login
                        </span>
                    ) : (
                        <>
                            Esqueceu a senha?{" "}
                            <span
                                className={styles.loginFooterLink}
                                onClick={() => { setShowReset(true); setError(""); }}
                            >
                                Recuperar
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
