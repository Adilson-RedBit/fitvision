"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getStudent, saveStudent } from "../../../utils/storage";

// Extrai o videoId de uma URL do YouTube (vários formatos)
function extractYoutubeId(url) {
    if (!url) return null;
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) {
            if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1];
            return u.searchParams.get('v');
        }
    } catch {
        // URL inválida
    }
    return null;
}

// Busca o videoId via API Route (chave nunca exposta no browser)
async function fetchYoutubeVideoId(query) {
    try {
        const res = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.videoId || null;
    } catch {
        return null;
    }
}

// Componente de player de vídeo inteligente
function VideoPlayer({ ex }) {
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState(null); // 'trainer' | 'youtube-api' | 'fallback'

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setVideoId(null);
        setSource(null);

        const load = async () => {
            // 1. Vídeo do treinador
            if (ex.videoUrl) {
                const id = extractYoutubeId(ex.videoUrl);
                if (id) {
                    if (!cancelled) { setVideoId(id); setSource('trainer'); setLoading(false); }
                    return;
                }
                // URL não é YouTube — abre como link externo
                if (!cancelled) { setSource('external'); setLoading(false); }
                return;
            }

            // 2. Busca automática via YouTube API
            const id = await fetchYoutubeVideoId(ex.name);
            if (cancelled) return;
            if (id) {
                setVideoId(id);
                setSource('youtube-api');
            } else {
                setSource('fallback');
            }
            setLoading(false);
        };

        load();
        return () => { cancelled = true; };
    }, [ex.name, ex.videoUrl]);

    if (loading) {
        return (
            <div style={{
                background: '#0f0f1a', borderRadius: '12px', height: '180px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px', gap: '10px'
            }}>
                <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: '2px solid #7E52F3', borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{ color: '#888', fontSize: '0.85rem' }}>Buscando vídeo...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Player embed
    if (videoId) {
        return (
            <div style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={ex.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute', top: 0, left: 0,
                            width: '100%', height: '100%', border: 'none'
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '6px', padding: '0 2px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: source === 'trainer' ? '#D4FF00' : '#888' }}>
                        {source === 'trainer' ? '✅ Vídeo do treinador' : '🔍 Buscado automaticamente no YouTube'}
                    </span>
                </div>
            </div>
        );
    }

    // Fallback — link externo
    if (source === 'external') {
        return (
            <a href={ex.videoUrl} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                color: '#ff4444', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem'
            }}>
                ▶ Assistir vídeo do exercício (link externo)
            </a>
        );
    }

    // Fallback — busca manual no YouTube
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' como fazer academia')}`;
    return (
        <a href={searchUrl} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
            color: '#ff4444', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem'
        }}>
            🔍 Buscar demonstração no YouTube
        </a>
    );
}

export default function TreinoPage() {
    const params = useParams();
    const studentId = params.id;
    const [student, setStudent] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(0);
    const [activeSplit, setActiveSplit] = useState(null);
    const [openExercise, setOpenExercise] = useState(null);
    const [seriesData, setSeriesData] = useState({});
    const [completedSplits, setCompletedSplits] = useState({});

    useEffect(() => {
        const load = async () => {
            const data = await getStudent(studentId);
            if (data) {
                setStudent(data);
                if (data.seriesData) setSeriesData(data.seriesData);
                if (data.completedSplits) setCompletedSplits(data.completedSplits);
            }
        };
        load();
    }, [studentId]);

    const persistData = useCallback(async (newSeriesData, newCompletedSplits) => {
        if (!student) return;
        try {
            await saveStudent(studentId, {
                ...student,
                seriesData: newSeriesData,
                completedSplits: newCompletedSplits
            });
        } catch (e) {
            console.error('Erro ao salvar carga:', e);
        }
    }, [student, studentId]);

    if (!student) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' }}>
                <div style={{ color: 'white' }}>Carregando treino...</div>
            </div>
        );
    }

    const workouts = student.workouts || [];

    if (workouts.length === 0) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏋️</div>
                <h2 style={{ color: 'white', fontWeight: 700, marginBottom: '8px' }}>Nenhum treino ainda</h2>
                <p style={{ color: '#888', textAlign: 'center' }}>Aguarde seu personal trainer criar sua planilha de treino.</p>
            </div>
        );
    }

    const getNumSeries = (setsStr) => {
        const match = setsStr?.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 3;
    };

    const isExerciseDone = (splitKey, exIdx, numSeries) => {
        return Array.from({ length: numSeries }, (_, i) => {
            const key = `${splitKey}-${exIdx}-${i}`;
            return seriesData[key]?.done;
        }).every(Boolean);
    };

    const toggleSeries = async (splitKey, exIdx, serieIdx) => {
        const key = `${splitKey}-${exIdx}-${serieIdx}`;
        const newData = { ...seriesData, [key]: { ...seriesData[key], done: !seriesData[key]?.done } };
        setSeriesData(newData);
        await persistData(newData, completedSplits);
    };

    const updateCarga = async (splitKey, exIdx, serieIdx, value) => {
        const key = `${splitKey}-${exIdx}-${serieIdx}`;
        const newData = { ...seriesData, [key]: { ...seriesData[key], carga: value } };
        setSeriesData(newData);
        await persistData(newData, completedSplits);
    };

    // Tela inicial — seletor de treino
    if (activeSplit === null) {
        const currentWorkout = workouts[activeWorkout];
        const splits = currentWorkout?.workouts || [];

        return (
            <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'sans-serif' }}>
                <div style={{ background: 'linear-gradient(135deg, #7E52F3, #5a35c7)', padding: '24px 20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: '#191E22', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src="/fitvision-logo-symbol.png" alt="FitVision" style={{ height: '28px' }} onError={e => e.target.style.display='none'} />
                            <span style={{ fontWeight: 900, fontSize: '18px' }}>
                                <span style={{ color: '#D4FF00' }}>Fit</span>
                                <span style={{ color: '#B46BFB' }}>Vision</span>
                            </span>
                        </div>
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                        Olá, {student.name?.split(' ')[0]}! 💪
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Selecione um treino
                    </p>
                </div>

                {workouts.length > 1 && (
                    <div style={{ padding: '16px 20px 0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                        {workouts.map((w, i) => (
                            <button key={i} onClick={() => setActiveWorkout(i)} style={{
                                padding: '8px 16px', borderRadius: '20px', border: 'none',
                                background: i === activeWorkout ? '#7E52F3' : '#1e1e2e',
                                color: i === activeWorkout ? 'white' : '#888',
                                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap'
                            }}>
                                {w.name || `Planilha ${i + 1}`}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {splits.map((split, i) => {
                        const splitKey = `${activeWorkout}-${i}`;
                        const isCompleted = completedSplits[splitKey];
                        const exCount = split.exercises?.length || 0;
                        const doneSeries = split.exercises?.reduce((acc, ex, exIdx) => {
                            const n = getNumSeries(ex.sets);
                            return acc + Array.from({ length: n }, (_, si) => seriesData[`${splitKey}-${exIdx}-${si}`]?.done ? 1 : 0).reduce((a, b) => a + b, 0);
                        }, 0);
                        const totalSeries = split.exercises?.reduce((acc, ex) => acc + getNumSeries(ex.sets), 0) || 0;

                        return (
                            <div key={i} onClick={() => setActiveSplit(i)} style={{
                                background: '#1e1e2e', borderRadius: '16px', padding: '18px 20px',
                                cursor: 'pointer', border: `2px solid ${isCompleted ? '#D4FF00' : 'transparent'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: isCompleted ? '#D4FF00' : '#7E52F3',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isCompleted ? '#0f0f1a' : 'white', fontWeight: 800, fontSize: '1.1rem'
                                    }}>
                                        {isCompleted ? '✓' : split.letter}
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Treino {split.letter}</div>
                                        <div style={{ color: '#888', fontSize: '0.82rem', marginTop: '2px' }}>{split.title}</div>
                                        <div style={{ color: '#555', fontSize: '0.78rem', marginTop: '4px' }}>
                                            {exCount} exercícios · {doneSeries}/{totalSeries} séries
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                    background: isCompleted ? 'rgba(212,255,0,0.15)' : 'rgba(126,82,243,0.15)',
                                    color: isCompleted ? '#D4FF00' : '#7E52F3'
                                }}>
                                    {isCompleted ? '✅ Completo' : '▶ Iniciar'}
                                </span>
                            </div>
                        );
                    })}

                    {student.anamnesis?.lifestyle?.cardioFrequency && student.anamnesis.lifestyle.cardioFrequency !== '0' && (
                        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '18px 20px', border: '2px solid #7E52F3' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #7E52F3, #D4FF00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                                    🏃
                                </div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Cardio Pós-Treino</div>
                                    <div style={{ color: '#888', fontSize: '0.82rem', marginTop: '2px' }}>
                                        {student.anamnesis.lifestyle.cardioFrequency === '1-2' ? '1 a 2x por semana' :
                                         student.anamnesis.lifestyle.cardioFrequency === '3-4' ? '3 a 4x por semana' :
                                         student.anamnesis.lifestyle.cardioFrequency === '5+' ? '5+ vezes por semana' : ''}
                                        {student.anamnesis.lifestyle.trainingHours ? ` · ${student.anamnesis.lifestyle.trainingHours}` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Tela de exercícios
    const currentWorkout = workouts[activeWorkout];
    const splits = currentWorkout?.workouts || [];
    const currentSplit = splits[activeSplit];
    const splitKey = `${activeWorkout}-${activeSplit}`;

    const allDone = currentSplit?.exercises?.every((ex, i) => {
        const n = getNumSeries(ex.sets);
        return isExerciseDone(splitKey, i, n);
    });

    return (
        <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg, #7E52F3, #5a35c7)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => { setActiveSplit(null); setOpenExercise(null); }} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                        width: '36px', height: '36px', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer'
                    }}>←</button>
                    <div>
                        <div style={{ color: '#D4FF00', fontWeight: 800, fontSize: '1rem' }}>Treino {currentSplit?.letter}</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{currentSplit?.title}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto' }}>
                    {splits.map((split, i) => (
                        <button key={i} onClick={() => { setActiveSplit(i); setOpenExercise(null); }} style={{
                            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                            background: i === activeSplit ? '#D4FF00' : 'rgba(255,255,255,0.15)',
                            color: i === activeSplit ? '#0f0f1a' : 'white',
                            fontWeight: 800, cursor: 'pointer', flexShrink: 0
                        }}>
                            {completedSplits[`${activeWorkout}-${i}`] ? '✓' : split.letter}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '16px' }}>
                {currentSplit?.exercises?.map((ex, exIdx) => {
                    const numSeries = getNumSeries(ex.sets);
                    const isOpen = openExercise === exIdx;
                    const done = isExerciseDone(splitKey, exIdx, numSeries);

                    return (
                        <div key={exIdx} style={{ marginBottom: '10px' }}>
                            <div onClick={() => setOpenExercise(isOpen ? null : exIdx)} style={{
                                background: done ? '#1a2e1a' : '#1e1e2e',
                                borderRadius: isOpen ? '14px 14px 0 0' : '14px',
                                padding: '16px', cursor: 'pointer',
                                border: `2px solid ${done ? '#4caf50' : isOpen ? '#7E52F3' : 'transparent'}`,
                                display: 'flex', alignItems: 'center', gap: '12px'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                                    background: done ? '#4caf50' : '#7E52F3',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 800
                                }}>
                                    {done ? '✓' : exIdx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'white', fontWeight: 700 }}>{ex.name}</div>
                                    <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '2px' }}>
                                        {ex.sets} · {ex.equipment} · {ex.rest}
                                    </div>
                                </div>
                                <span style={{ color: '#888', fontSize: '1.2rem' }}>{isOpen ? '▲' : '▼'}</span>
                            </div>

                            {isOpen && (
                                <div style={{ background: '#181828', borderRadius: '0 0 14px 14px', border: '2px solid #7E52F3', borderTop: 'none', padding: '16px' }}>

                                    {/* Player de vídeo inteligente */}
                                    <VideoPlayer ex={ex} />

                                    {/* Observações do treinador */}
                                    {ex.observation && (
                                        <div style={{
                                            background: 'rgba(212,255,0,0.06)',
                                            border: '1px solid rgba(212,255,0,0.2)',
                                            borderRadius: '10px',
                                            padding: '12px 14px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            gap: '10px',
                                            alignItems: 'flex-start'
                                        }}>
                                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>📋</span>
                                            <div>
                                                <div style={{ color: '#D4FF00', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Instruções do treinador
                                                </div>
                                                <div style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                    {ex.observation}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 40px', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
                                        <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: 700 }}>SÉRIE</span>
                                        <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: 700 }}>REPS</span>
                                        <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: 700 }}>CARGA kg</span>
                                        <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                                    </div>

                                    {Array.from({ length: numSeries }, (_, serieIdx) => {
                                        const key = `${splitKey}-${exIdx}-${serieIdx}`;
                                        const serie = seriesData[key] || {};
                                        return (
                                            <div key={serieIdx} style={{
                                                display: 'grid', gridTemplateColumns: '40px 1fr 80px 40px',
                                                gap: '8px', alignItems: 'center', marginBottom: '8px',
                                                padding: '10px 4px', borderRadius: '8px',
                                                background: serie.done ? 'rgba(76,175,80,0.1)' : 'transparent'
                                            }}>
                                                <span style={{
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    background: '#7E52F3', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem'
                                                }}>{serieIdx + 1}</span>
                                                <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                                                    {ex.sets?.match(/x(\d+)/)?.[1] || '12'} reps
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="--"
                                                    value={serie.carga || ''}
                                                    onChange={e => updateCarga(splitKey, exIdx, serieIdx, e.target.value)}
                                                    style={{
                                                        background: '#252535', border: '1px solid #333', borderRadius: '8px',
                                                        color: 'white', padding: '6px 8px', fontSize: '0.9rem',
                                                        width: '100%', textAlign: 'center'
                                                    }}
                                                />
                                                <button onClick={() => toggleSeries(splitKey, exIdx, serieIdx)} style={{
                                                    width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                                                    background: serie.done ? '#4caf50' : '#252535',
                                                    color: serie.done ? 'white' : '#555',
                                                    fontSize: '1rem', cursor: 'pointer'
                                                }}>
                                                    {serie.done ? '✓' : '○'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {allDone && (
                    <button
                        onClick={async () => {
                            const newCompleted = { ...completedSplits, [splitKey]: true };
                            setCompletedSplits(newCompleted);
                            await persistData(seriesData, newCompleted);
                            setActiveSplit(null);
                            setOpenExercise(null);
                        }}
                        style={{
                            width: '100%', padding: '16px', background: 'linear-gradient(135deg, #D4FF00, #a8cc00)',
                            border: 'none', borderRadius: '14px', color: '#0f0f1a',
                            fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: '8px'
                        }}
                    >
                        ✅ Concluir Treino {currentSplit?.letter}
                    </button>
                )}
            </div>
            <div style={{ height: '40px' }} />
        </div>
    );
}
