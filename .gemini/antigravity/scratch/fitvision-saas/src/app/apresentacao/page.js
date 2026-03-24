"use client";

import styles from "./apresentacao.module.css";

export default function ApresentacaoPage() {
    return (
        <div className={styles.presentationPage}>
            {/* ====== NAV ====== */}
            <nav className={styles.presNav}>
                <div className={`container ${styles.presNavContent}`}>
                    <div className={styles.presLogo} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#191E22', padding: '8px 16px', borderRadius: '12px' }}>
                        <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "48px", objectFit: "contain" }} />
                        <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
                            <span style={{ color: '#D4FF00' }}>Fit</span>
                            <span style={{ color: '#B46BFB' }}>Vision</span>
                        </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Apresentação Exclusiva
                    </span>
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════
          A — ATENÇÃO (Attention)
      ═══════════════════════════════════════════════ */}
            <section className={styles.presHero}>
                <div className={`${styles.presHeroOrb} ${styles.presHeroOrb1}`} />
                <div className={`${styles.presHeroOrb} ${styles.presHeroOrb2}`} />
                <div className={styles.presHeroContent}>
                    <div className={styles.presTag}>🚀 Apresentação Exclusiva</div>
                    <h1 className={styles.presHeroTitle}>
                        A plataforma que vai{" "}
                        <span className="text-gradient">transformar</span> a forma como
                        você treina seus alunos
                    </h1>
                    <p className={styles.presHeroSub}>
                        Avaliação visual por fotos, anamnese digital, treinos
                        personalizados e acompanhamento de evolução — tudo em um só
                        lugar, na palma da sua mão.
                    </p>
                    <a href="#interesse" className="btn btn-primary btn-lg">
                        Conhecer a Plataforma
                    </a>
                    <div className={styles.presScrollHint}>
                        <span>Deslize para descobrir</span>
                        <span className={styles.presScrollArrow}>↓</span>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
          I — INTERESSE (Interest)
      ═══════════════════════════════════════════════ */}

            {/* --- I.1: Painel do Personal (Dashboard) --- */}
            <section id="interesse" className={styles.presSection}>
                <div className="container">
                    <div className={styles.presSplitGrid}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagPurple}`}>
                                📊 Painel do Personal
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Visão completa dos seus{" "}
                                <span className="text-gradient">alunos</span>
                            </h2>
                            <p className={styles.presSectionSub}>
                                Ao acessar o sistema, você tem um dashboard intuitivo com
                                todas as informações que importam: quantos alunos ativos,
                                treinos em andamento, avaliações realizadas e alertas de treinos
                                que estão próximos de expirar.
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>👥</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Gestão de Alunos
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Cadastre alunos, visualize status e acesse o histórico completo.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>⚠️</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Alertas Inteligentes
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Notificação automática quando um treino está expirando — nunca mais perca o timing da troca.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/dashboard.png" alt="Dashboard do Personal" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- I.2: Aba de Alunos --- */}
            <section className={`${styles.presSection} ${styles.presSectionAlt}`}>
                <div className="container">
                    <div className={`${styles.presSplitGrid} ${styles.presSplitReverse}`}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagGreen}`}>
                                👥 Gestão de Alunos
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Cada aluno com seu{" "}
                                <span className="text-gradient-accent">perfil completo</span>
                            </h2>
                            <p className={styles.presSectionSub}>
                                Cards visuais mostram objetivo, idade, status do treino e
                                validade — tudo de um relance. Cadastre novos alunos em
                                segundos.
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>🎯</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Objetivo do Aluno
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Hipertrofia, emagrecimento, condicionamento, reabilitação — classificação clara.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>🟢</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Status em Tempo Real
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Badges coloridos (Ativo / Expirando / Expirado) para controle rápido.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/clients.png" alt="Gestão de Alunos" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
          D — DESEJO (Desire)
      ═══════════════════════════════════════════════ */}

            {/* --- D.1: Avaliação Física --- */}
            <section className={styles.presSection}>
                <div className="container">
                    <div className={styles.presSplitGrid}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagBlue}`}>
                                📷 Avaliação Visual
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Avaliação por{" "}
                                <span className="text-gradient">4 fotos</span> + Anamnese
                                Digital
                            </h2>
                            <p className={styles.presSectionSub}>
                                O aluno envia 4 fotos padrão (frontal, laterais e costas)
                                e responde um questionário completo de saúde. Com essas
                                informações, você monta o treino ideal.
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>📱</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Upload pelo Celular
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            O aluno tira as fotos e envia direto pelo app — sem enviar por WhatsApp.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>📋</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Anamnese Completa
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Lesões, medicamentos, nível de experiência, frequência, sono, alimentação e objetivos.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/assessment.png" alt="Avaliação Física" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- D.2: Banco de Exercícios --- */}
            <section className={`${styles.presSection} ${styles.presSectionAlt}`}>
                <div className="container">
                    <div className={`${styles.presSplitGrid} ${styles.presSplitReverse}`}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagYellow}`}>
                                💪 Banco de Exercícios
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Biblioteca completa de{" "}
                                <span className="text-gradient-accent">exercícios</span>
                            </h2>
                            <p className={styles.presSectionSub}>
                                Mais de 500 exercícios organizados por grupo muscular,
                                equipamento e nível de dificuldade. Filtre e encontre
                                o exercício ideal em segundos.
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>🔍</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Busca & Filtros
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Peito, Costas, Pernas, Ombros, Bíceps, Tríceps, Core — com filtro por nível.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>🎬</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Vídeo de Execução
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Cada exercício com vídeo demonstrativo para o aluno executar corretamente.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/exercises.png" alt="Banco de Exercícios" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- D.3: Treino do Aluno (a estrela da apresentação) --- */}
            <section className={styles.presSection}>
                <div className="container">
                    <div className={styles.presSplitGrid}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagPurple}`}>
                                🏋️ Treino Personalizado
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Seu treino{" "}
                                <span className="text-gradient">na palma da mão</span>
                            </h2>
                            <p className={styles.presSectionSub}>
                                O aluno acessa seu próprio painel e vê os treinos semanais
                                organizados em divisões (A, B, C, D). Cada exercício
                                mostra:
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>▶️</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Vídeo do Exercício
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Botão "Assista" para ver o vídeo demonstrativo antes de executar.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>📝</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Séries, Reps & Carga
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            O aluno preenche a carga utilizada e marca cada série como concluída com checkbox.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>📊</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Progresso em Tempo Real
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Barra de progresso mostra a % de conclusão do treino do dia.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/workout-exec.png" alt="Treino do Aluno" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- D.4: Modal de Vídeo --- */}
            <section className={`${styles.presSection} ${styles.presSectionAlt}`}>
                <div className="container">
                    <div className={`${styles.presSplitGrid} ${styles.presSplitReverse}`}>
                        <div>
                            <div className={`${styles.presSectionTag} ${styles.tagGreen}`}>
                                🎬 Vídeos de Execução
                            </div>
                            <h2 className={styles.presSectionTitle}>
                                Cada exercício com{" "}
                                <span className="text-gradient-accent">vídeo demonstrativo</span>
                            </h2>
                            <p className={styles.presSectionSub}>
                                O aluno nunca mais terá dúvida de como executar um exercício.
                                Basta tocar em "Assista" e o vídeo aparece em tela cheia,
                                mostrando a execução correta e as orientações do personal.
                            </p>
                            <div className={styles.presBullets}>
                                <div className={styles.presBullet}>
                                    <div className={styles.presBulletIcon}>✅</div>
                                    <div>
                                        <div className={styles.presBulletTitle}>
                                            Execução Correta
                                        </div>
                                        <div className={styles.presBulletDesc}>
                                            Reduz o risco de lesão e garante a eficiência máxima de cada repetição.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/video-modal.png" alt="Vídeo de Exercício" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- D.5: Gestão de Treinos (Aba do Coach) --- */}
            <section className={styles.presSection}>
                <div className="container text-center">
                    <div className={`${styles.presSectionTag} ${styles.tagPurple}`}>
                        📋 Como Funciona
                    </div>
                    <h2 className={styles.presSectionTitle}>
                        Simples de usar,{" "}
                        <span className="text-gradient">profissional</span> no resultado
                    </h2>
                    <p className={`${styles.presSectionSub} ${styles.presSectionSubCenter}`}>
                        Em 4 passos simples, você tem um treino completo e personalizado
                        rodando na mão do seu aluno.
                    </p>
                    <div className={styles.presSteps}>
                        <div className={styles.presStep}>
                            <div className={styles.presStepNum}>1</div>
                            <div className={styles.presStepTitle}>Cadastre o Aluno</div>
                            <div className={styles.presStepDesc}>
                                Nome, e-mail e objetivo — pronto.
                            </div>
                        </div>
                        <div className={styles.presStep}>
                            <div className={styles.presStepNum}>2</div>
                            <div className={styles.presStepTitle}>Avaliação</div>
                            <div className={styles.presStepDesc}>
                                O aluno envia 4 fotos e responde a anamnese.
                            </div>
                        </div>
                        <div className={styles.presStep}>
                            <div className={styles.presStepNum}>3</div>
                            <div className={styles.presStepTitle}>Monte o Treino</div>
                            <div className={styles.presStepDesc}>
                                Escolha exercícios, defina séries e reps.
                            </div>
                        </div>
                        <div className={styles.presStep}>
                            <div className={styles.presStepNum}>4</div>
                            <div className={styles.presStepTitle}>Acompanhe</div>
                            <div className={styles.presStepDesc}>
                                O aluno executa e você acompanha a evolução.
                            </div>
                        </div>
                    </div>

                    {/* Workout Manager Screenshot */}
                    <div style={{ marginTop: 48, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
                        <div className={styles.screenshotFrame}>
                            <div className={styles.screenshotBar}>
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotRed}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotYellow}`} />
                                <span className={`${styles.screenshotDot} ${styles.screenshotDotGreen}`} />
                            </div>
                            <img src="/slides/workouts.png" alt="Gestão de Treinos" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
          A — AÇÃO (Action)
      ═══════════════════════════════════════════════ */}
            <section className={styles.presCta}>
                <div className="container">
                    <div className={styles.presCtaBox}>
                        <h2 className={styles.presCtaTitle}>
                            Pronto para{" "}
                            <span className="text-gradient-accent">elevar o nível</span> dos
                            seus treinos?
                        </h2>
                        <p className={styles.presCtaSub}>
                            Comece agora a usar o FitVision e transforme a experiência dos
                            seus alunos com tecnologia profissional.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="/client" className="btn btn-accent btn-lg">
                                🚀 Acessar como Aluno
                            </a>
                            <a href="/dashboard" className="btn btn-primary btn-lg">
                                📊 Acessar como Personal
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    padding: "24px 0",
                    borderTop: "1px solid var(--border)",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                }}
            >
                © 2026 FitVision — Tecnologia para Personal Trainers
            </footer>
        </div>
    );
}
