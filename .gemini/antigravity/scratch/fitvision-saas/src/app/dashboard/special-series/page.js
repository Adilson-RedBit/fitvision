"use client";

import Link from "next/link";
import styles from "../exercises/exercises.module.css";

export default function SpecialSeriesPage() {
    const series = [
        { name: "BI-SET" },
        { name: "TRI-SET" },
        { name: "DROP-SET" },
        { name: "CIRCUITO" },
        { name: "SUPER-SERIE" },
    ];

    return (
        <div className={styles.pageContainer}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Link href="/dashboard" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--primary)' }}>←</Link>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Séries especiais</h1>
                <span style={{ fontSize: '1.2rem', color: '#888' }}>?</span>
            </div>

            <button
                style={{
                    width: '100%',
                    padding: '16px',
                    background: '#7E52F3',
                    color: 'white',
                    borderRadius: '20px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    fontWeight: 700,
                    marginBottom: '24px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'white',
                    color: '#7E52F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}>+</div>
                Criar série especial
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {series.map(s => (
                    <div
                        key={s.name}
                        style={{
                            background: '#f8f9fd',
                            padding: '24px 20px',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <span style={{ fontWeight: 700, color: '#666', fontSize: '0.9rem' }}>{s.name}</span>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#aaa',
                            border: '1px solid var(--border)'
                        }}>›</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
