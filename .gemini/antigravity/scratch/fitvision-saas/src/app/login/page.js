"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState("login"); // "login" | "register" | "reset"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const switchMode = (next) => { setMode(next); setError(""); setResetSent(false); };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) {
            setError("E-mail ou senha inválidos. Tente novamente.");
            setLoading(false);
            return;
        }

        const { data: trainerProfile } = await supabase
            .from("trainer_profiles")
            .select("id")
            .eq("id", data.user.id)
            .single();

        router.push(trainerProfile ? "/dashboard" : "/client/portal");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: { data: { full_name: name.trim() } },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // Cria o perfil do trainer na tabela trainer_profiles
        const { error: profileError } = await supabase
            .from("trainer_profiles")
            .insert({ id: data.user.id, full_name: name.trim(), email: email.trim().toLowerCase() });

        if (profileError) {
            setError("Conta criada, mas erro ao salvar perfil: " + profileError.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(
            resetEmail.trim().toLowerCase(),
            { redirectTo: `${window.location.origin}/auth/reset-password` }
        );
        setLoading(false);
        if (error) {
            setError("Erro ao enviar e-mail. Verifique o endereço.");
        } else {
            setResetSent(true);
        }
    };

    const inputStyle = {
        width: "100%", padding: "12px 16px", fontSize: "0.95rem",
        background: "var(--bg-input)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)", color: "var(--text-primary)",
    };

    const subtitle = mode === "reset" ? "Recuperar senha"
        : mode === "register" ? "Criar conta de Personal Trainer"
        : "Área do Personal Trainer";

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--bg-light)", position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", width: 500, height: 500, background: "rgba(126, 82, 243, 0.08)", borderRadius: "50%", filter: "blur(100px)", top: -150, right: -100, pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 350, height: 350, background: "rgba(230, 240, 89, 0.06)", borderRadius: "50%", filter: "blur(100px)", bottom: -100, left: -100, pointerEvents: "none" }} />

            <div style={{
                width: "100%", maxWidth: 420, background: "white",
                border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
                padding: 40, position: "relative", zIndex: 1,
                boxShadow: "0 4px 40px rgba(126, 82, 243, 0.08)",
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, backgroundColor: "#191E22", padding: "12px 20px", borderRadius: 16, marginBottom: 16 }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision" style={{ height: 56, objectFit: "contain" }} />
                        <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                            <span style={{ color: "#D4FF00" }}>Fit</span>
                            <span style={{ color: "#B46BFB" }}>Vision</span>
                        </span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{subtitle}</p>
                </div>

                {/* Erro */}
                {error && (
                    <div style={{ background: "rgba(255, 56, 96, 0.08)", border: "1px solid rgba(255, 56, 96, 0.2)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "0.85rem", color: "var(--danger)", textAlign: "center", marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {/* LOGIN */}
                {mode === "login" && (
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>E-mail</label>
                            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Senha</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: 14, marginTop: 8, fontSize: "1rem", fontWeight: 700 }}>
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                )}

                {/* CADASTRO */}
                {mode === "register" && (
                    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Nome Completo</label>
                            <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>E-mail</label>
                            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Senha</label>
                            <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: 14, marginTop: 8, fontSize: "1rem", fontWeight: 700 }}>
                            {loading ? "Criando conta..." : "Criar Conta"}
                        </button>
                    </form>
                )}

                {/* RECUPERAR SENHA */}
                {mode === "reset" && (
                    <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {resetSent ? (
                            <div style={{ background: "rgba(0, 209, 178, 0.08)", border: "1px solid rgba(0, 209, 178, 0.2)", borderRadius: "var(--radius-md)", padding: "16px", textAlign: "center", fontSize: "0.9rem", color: "var(--success)" }}>
                                ✅ E-mail de recuperação enviado!<br />
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Verifique sua caixa de entrada.</span>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Seu e-mail cadastrado</label>
                                    <input type="email" placeholder="seu@email.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required style={inputStyle} />
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: "1rem", fontWeight: 700 }}>
                                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                                </button>
                            </>
                        )}
                    </form>
                )}

                {/* Footer links */}
                <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
                    {mode === "login" && (
                        <>
                            <div>
                                Não tem conta?{" "}
                                <span onClick={() => switchMode("register")} style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                                    Criar cadastro
                                </span>
                            </div>
                            <div>
                                Esqueceu a senha?{" "}
                                <span onClick={() => switchMode("reset")} style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                                    Recuperar
                                </span>
                            </div>
                        </>
                    )}
                    {mode === "register" && (
                        <span onClick={() => switchMode("login")} style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                            ← Já tenho conta
                        </span>
                    )}
                    {mode === "reset" && (
                        <span onClick={() => switchMode("login")} style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                            ← Voltar ao login
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
