"use client";

import styles from "./dashboard.module.css";
import Link from "next/link";

const mockClients = [
    {
        name: "Rafael Mendes",
        email: "rafael@email.com",
        initials: "RM",
        color: "var(--gradient-primary)",
        goal: "Hipertrofia",
        status: "active",
        workoutExpiry: "12 dias",
    },
    {
        name: "Carla Silva",
        email: "carla@email.com",
        initials: "CS",
        color: "var(--gradient-accent)",
        goal: "Emagrecimento",
        status: "warning",
        workoutExpiry: "3 dias",
    },
    {
        name: "João Pedro",
        email: "joao@email.com",
        initials: "JP",
        color: "var(--gradient-primary)",
        goal: "Condicionamento",
        status: "active",
        workoutExpiry: "20 dias",
    },
    {
        name: "Ana Costa",
        email: "ana@email.com",
        initials: "AC",
        color: "var(--gradient-accent)",
        goal: "Reabilitação",
        status: "expired",
        workoutExpiry: "Expirado",
    },
];

export default function DashboardPage() {
    return (
        <div className={styles.dashboardContainer}>
            {/* Header Greeting */}
            <div className={styles.greeting}>
                <h1 className={styles.greetingTitle}>Olá, Adilson</h1>
                <p className={styles.greetingSubtitle}>Acompanhe suas métricas.</p>
            </div>

            {/* Horizontal Metrics */}
            <div className={styles.horizontalMetrics}>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>👥</span>
                    <div className={styles.metricValue}>24</div>
                    <div className={styles.metricLabel}>Total de alunos</div>
                </div>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>👤</span>
                    <div className={styles.metricValue}>18</div>
                    <div className={styles.metricLabel}>Alunos ativos</div>
                </div>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>📅</span>
                    <div className={styles.metricValue}>3</div>
                    <div className={styles.metricLabel}>Alunos em risco</div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className={styles.activityCard}>
                <div className={styles.activityHeader}>
                    <h3 className={styles.activityTitle}>Treinos</h3>
                    <Link href="/dashboard/workouts" className={styles.centralTreinos}>
                        Central de Treinos <span className={styles.arrowIcon}>›</span>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <div className={styles.metricValue} style={{ fontSize: '2.4rem' }}>5</div>
                        <div className={styles.metricLabel} style={{ textAlign: 'left' }}>Treinos realizados <br />esta semana</div>
                    </div>

                    <div className={styles.activityChart} style={{ flex: 1, marginLeft: '20px' }}>
                        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                            <div key={i} className={styles.chartBarContainer}>
                                <div
                                    className={`${styles.chartBar} ${i === 2 ? styles.chartBarActive : ""}`}
                                    style={{ height: i === 2 ? '80px' : '15px', width: '8px' }}
                                />
                                <span className={styles.chartDayLabel}>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Menu List */}
            <div className={styles.menuList}>
                <Link href="/dashboard/workouts" className={styles.menuItem}>
                    <div className={styles.menuItemIcon}>📋</div>
                    <div className={styles.menuItemContent}>
                        <div className={styles.menuItemTitle}>Minhas planilhas modelo</div>
                        <div className={styles.menuItemDesc}>Crie modelos de planilhas e copie para seus alunos</div>
                    </div>
                    <div className={styles.menuItemArrow}>›</div>
                </Link>

                <Link href="/dashboard/exercises" className={styles.menuItem}>
                    <div className={styles.menuItemIcon}>🎬</div>
                    <div className={styles.menuItemContent}>
                        <div className={styles.menuItemTitle}>Exercícios e vídeos</div>
                        <div className={styles.menuItemDesc}>Utilize nosso banco de vídeos ou crie personalizados</div>
                    </div>
                    <div className={styles.menuItemArrow}>›</div>
                </Link>

                <Link href="/dashboard/exercises?tab=muscle-groups" className={styles.menuItem}>
                    <div className={styles.menuItemIcon}>💪</div>
                    <div className={styles.menuItemContent}>
                        <div className={styles.menuItemTitle}>Grupos musculares</div>
                        <div className={styles.menuItemDesc}>Gerencie seus grupos musculares</div>
                    </div>
                    <div className={styles.menuItemArrow}>›</div>
                </Link>

                <Link href="/dashboard/special-series" className={styles.menuItem}>
                    <div className={styles.menuItemIcon}>🧱</div>
                    <div className={styles.menuItemContent}>
                        <div className={styles.menuItemTitle}>Séries especiais</div>
                        <div className={styles.menuItemDesc}>Gerencie suas séries especiais (Bi-set, Tri-set, etc)</div>
                    </div>
                    <div className={styles.menuItemArrow}>›</div>
                </Link>
            </div>

            {/* Upgrade Banner */}
            <div className={styles.upgradeBanner}>
                <div className={styles.upgradeInner}>
                    <div className={styles.upgradeIcon}>⬆️</div>
                    <div className={styles.upgradeText}>
                        Faça um <span className={styles.upgradeHighlight}>upgrade</span> e <span className={styles.upgradeHighlight}>aumente</span> agora a sua lista de exercícios e vídeos.
                    </div>
                </div>
            </div>
        </div>
    );
}
