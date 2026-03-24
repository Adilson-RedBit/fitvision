"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

const navItems = [
    { href: "/dashboard", icon: "📊", label: "Visão Geral" },
    { href: "/dashboard/clients", icon: "👥", label: "Alunos" },
    { href: "/dashboard/assessments", icon: "📷", label: "Avaliações" },
    { href: "/dashboard/workouts", icon: "🏋️", label: "Treinos" },
    { href: "/dashboard/exercises", icon: "💪", label: "Exercícios" },
];

const settingsItems = [
    { href: "/dashboard/settings", icon: "⚙️", label: "Configurações" },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <div className={styles.dashboardLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.sidebarLogo} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', backgroundColor: '#191E22', padding: '12px', borderRadius: '12px', marginTop: '16px' }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "48px", objectFit: "contain" }} />
                        <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                            <span style={{ color: '#D4FF00' }}>Fit</span>
                            <span style={{ color: '#B46BFB' }}>Vision</span>
                        </span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    <div className={styles.sidebarSection}>Principal</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.sidebarLink} ${isActive(item.href) ? styles.sidebarLinkActive : ""
                                }`}
                        >
                            <span className={styles.sidebarLinkIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <div className={styles.sidebarSection}>Sistema</div>
                    {settingsItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.sidebarLink} ${isActive(item.href) ? styles.sidebarLinkActive : ""
                                }`}
                        >
                            <span className={styles.sidebarLinkIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.sidebarUser}>
                        <div className={styles.sidebarAvatar}>PT</div>
                        <div>
                            <div className={styles.sidebarUserName}>Coach Demo</div>
                            <div className={styles.sidebarUserRole}>Personal Trainer</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className={styles.mainContent}>
                <header className={styles.topBar}>
                    <button className={styles.menuToggle}>☰</button>
                    <div className={styles.topBarSearch}>
                        🔍 <span>Buscar aluno, treino...</span>
                    </div>
                    <div className={styles.topBarRight}>
                        <button className={styles.topBarNotification}>
                            🔔
                            <span className={styles.notificationDot} />
                        </button>
                    </div>
                </header>

                <main className={styles.pageContent}>{children}</main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className={styles.bottomNav}>
                <Link
                    href="/dashboard"
                    className={`${styles.bottomNavItem} ${isActive("/dashboard") ? styles.bottomNavItemActive : ""
                        }`}
                >
                    <span className={styles.bottomNavIcon}>🏠</span>
                    <span>Início</span>
                </Link>
                <Link
                    href="/dashboard/workouts"
                    className={`${styles.bottomNavItem} ${isActive("/dashboard/workouts") ? styles.bottomNavItemActive : ""
                        }`}
                >
                    <span className={styles.bottomNavIcon}>🏋️</span>
                    <span>Treinos</span>
                </Link>
                <div className={styles.bottomNavCenter}>
                    ➕
                </div>
                <Link
                    href="/dashboard/clients"
                    className={`${styles.bottomNavItem} ${isActive("/dashboard/clients") ? styles.bottomNavItemActive : ""
                        }`}
                >
                    <span className={styles.bottomNavIcon}>👥</span>
                    <span>Alunos</span>
                </Link>
                <Link
                    href="/dashboard/settings"
                    className={`${styles.bottomNavItem} ${isActive("/dashboard/settings") ? styles.bottomNavItemActive : ""
                        }`}
                >
                    <span className={styles.bottomNavIcon}>⚙️</span>
                    <span>Ajustes</span>
                </Link>
            </nav>
        </div>
    );
}
