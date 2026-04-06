"use client";

import { useState, useEffect } from "react";

export default function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Já está instalado como PWA — não mostrar
        if (window.matchMedia("(display-mode: standalone)").matches) return;
        if (window.navigator.standalone === true) return;
        // Já foi dispensado antes
        if (sessionStorage.getItem("pwa_banner_dismissed")) return;

        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(ios);

        if (ios) {
            // iOS não dispara beforeinstallprompt — mostra banner fixo
            setShowBanner(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSGuide(true);
            return;
        }
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") setShowBanner(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        sessionStorage.setItem("pwa_banner_dismissed", "1");
        setShowBanner(false);
        setShowIOSGuide(false);
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Banner fixo na base */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
                background: "#191E22",
                borderTop: "1px solid rgba(180, 107, 251, 0.3)",
                padding: "14px 20px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
            }}>
                {/* Logo */}
                <div style={{
                    width: 48, height: 48, borderRadius: 12, overflow: "hidden",
                    background: "#191E22", border: "1px solid rgba(255,255,255,0.1)",
                    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <img src="/fitvision-logo-symbol.png" alt="FitVision" style={{ width: 40, height: 40, objectFit: "contain" }} />
                </div>

                {/* Texto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.2 }}>
                        Adicionar à tela inicial
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: 2 }}>
                        Acesse seus treinos com um toque
                    </div>
                </div>

                {/* Botões */}
                <button
                    onClick={handleDismiss}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "1.2rem", cursor: "pointer", padding: "4px 8px", flexShrink: 0 }}
                    aria-label="Fechar"
                >
                    ✕
                </button>
                <button
                    onClick={handleInstall}
                    style={{
                        background: "linear-gradient(135deg, #7E52F3, #B46BFB)",
                        border: "none", borderRadius: 10, color: "white",
                        fontWeight: 700, fontSize: "0.85rem", padding: "10px 16px",
                        cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                    }}
                >
                    Instalar
                </button>
            </div>

            {/* Modal iOS */}
            {showIOSGuide && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 10000,
                    background: "rgba(0,0,0,0.7)",
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                }}
                    onClick={handleDismiss}
                >
                    <div
                        style={{
                            background: "#1a1a2e", borderRadius: "20px 20px 0 0",
                            padding: "28px 24px 40px", width: "100%", maxWidth: 480,
                            border: "1px solid rgba(180, 107, 251, 0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <img src="/fitvision-logo-symbol.png" alt="FitVision" style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 12 }} />
                            <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>Instalar FitVision</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: 4 }}>Adicione à tela inicial do seu iPhone</div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { step: "1", icon: "⬆️", text: "Toque no botão Compartilhar na barra do Safari" },
                                { step: "2", icon: "➕", text: 'Role e toque em "Adicionar à Tela Inicial"' },
                                { step: "3", icon: "✓", text: 'Toque em "Adicionar" no canto superior direito' },
                            ].map(({ step, icon, text }) => (
                                <div key={step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: "rgba(126, 82, 243, 0.2)",
                                        border: "1px solid rgba(126, 82, 243, 0.4)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1rem", flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem" }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleDismiss}
                            style={{
                                marginTop: 28, width: "100%", padding: 14,
                                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 12, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem",
                                cursor: "pointer",
                            }}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
