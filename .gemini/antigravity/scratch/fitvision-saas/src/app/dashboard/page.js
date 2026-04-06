"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Link from "next/link";
import { getStudentsDB, getCurrentUser, getTrainerProfile } from "../../utils/storage";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState({ total: 0, active: 0, atRisk: 0 });
    const [trainerName, setTrainerName] = useState("Personal");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [profile, studentsMap] = await Promise.all([
                getTrainerProfile(),
                getStudentsDB(),
            ]);

            if (profile?.full_name) {
                setTrainerName(profile.full_name.split(" ")[0]);
            } else {
                const user = await getCurrentUser();
                if (user?.email) setTrainerName(user.email.split("@")[0]);
            }

            const students = Object.values(studentsMap);
            const now = new Date();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            const active = students.filter(s => s.status === "Ativo").length;
            const atRisk = students.filter(s => {
                const workouts = s.workouts || [];
                const withExpiry = workouts.filter(w => w.expiryDate);
                if (!withExpiry.length) return false;
                const latest = withExpiry[withExpiry.length - 1];
                const expiry = new Date(latest.expiryDate);
                const diff = expiry - now;
                return diff >= 0 && diff <= sevenDays;
            }).length;

            setMetrics({ total: students.length, active, atRisk });
            setLoading(false);
        };
        load();
        window.addEventListener("fitvision_storage_update", load);
        return () => window.removeEventListener("fitvision_storage_update", load);
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Greeting */}
            <div className={styles.greeting}>
                <h1 className={styles.greetingTitle}>Olá, {trainerName}</h1>
                <p className={styles.greetingSubtitle}>Acompanhe suas métricas.</p>
            </div>

            {/* Horizontal Metrics */}
            <div className={styles.horizontalMetrics}>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>👥</span>
                    <div className={styles.metricValue}>{loading ? "—" : metrics.total}</div>
                    <div className={styles.metricLabel}>Total de alunos</div>
                </div>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>👤</span>
                    <div className={styles.metricValue}>{loading ? "—" : metrics.active}</div>
                    <div className={styles.metricLabel}>Alunos ativos</div>
                </div>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>📅</span>
                    <div className={styles.metricValue}>{loading ? "—" : metrics.atRisk}</div>
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
                        <div className={styles.metricValue} style={{ fontSize: '2.4rem' }}>{loading ? "—" : metrics.active}</div>
                        <div className={styles.metricLabel} style={{ textAlign: 'left' }}>Alunos ativos<br />com treino</div>
                    </div>

                    <div className={styles.activityChart} style={{ flex: 1, marginLeft: '20px' }}>
                        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                            <div key={i} className={styles.chartBarContainer}>
                                <div
                                    className={`${styles.chartBar} ${i === new Date().getDay() ? styles.chartBarActive : ""}`}
                                    style={{ height: i === new Date().getDay() ? '80px' : '15px', width: '8px' }}
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
