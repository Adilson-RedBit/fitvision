"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./client.module.css";

export default function ClientLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate login
        setTimeout(() => {
            if (email && password) {
                router.push("/client/portal");
            } else {
                setError("Preencha todos os campos.");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className={styles.loginPage}>
            <div className={`${styles.loginOrb} ${styles.loginOrb1}`} />
            <div className={`${styles.loginOrb} ${styles.loginOrb2}`} />

            <div className={styles.loginCard}>
                <div className={styles.loginLogo}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px', backgroundColor: '#191E22', padding: '16px 24px', borderRadius: '16px' }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "80px", objectFit: "contain" }} />
                        <span style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                            <span style={{ color: '#D4FF00' }}>Fit</span>
                            <span style={{ color: '#B46BFB' }}>Vision</span>
                        </span>
                    </div>
                    <div className={styles.loginSubtitle}>Área do Aluno</div>
                </div>

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

                <div className={styles.loginFooter}>
                    Esqueceu a senha?{" "}
                    <span className={styles.loginFooterLink}>Recuperar</span>
                </div>
            </div>
        </div>
    );
}
