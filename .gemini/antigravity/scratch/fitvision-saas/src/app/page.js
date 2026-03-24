"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* ====== NAVBAR ====== */}
      <nav className={styles.navbar}>
        <div className={`container ${styles.navContent}`}>
          <Link href="/dashboard" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#191E22', padding: '8px 16px', borderRadius: '16px', textDecoration: 'none' }}>
            <img src="/fitvision-logo-symbol.png" alt="FitVision Icon" style={{ height: "64px", objectFit: "contain" }} />
            <span style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Nunito", "Arial Rounded MT Bold", sans-serif' }}>
              <span style={{ color: '#D4FF00' }}>Fit</span>
              <span style={{ color: '#B46BFB' }}>Vision</span>
            </span>
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <a href="#features" className={styles.navLink}>
                Funcionalidades
              </a>
            </li>
            <li>
              <a href="#how-it-works" className={styles.navLink}>
                Como Funciona
              </a>
            </li>
            <li>
              <a href="#pricing" className={styles.navLink}>
                Planos
              </a>
            </li>
            <li>
              <a href="/dashboard" className="btn btn-primary btn-sm">
                Acessar Plataforma
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className={styles.hero}>
        <div className={`${styles.heroOrb} ${styles.heroOrb1}`} />
        <div className={`${styles.heroOrb} ${styles.heroOrb2}`} />

        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              🚀 Plataforma Inteligente para Profissionais
            </div>
            <h1 className={styles.heroTitle}>
              Treinos <span className="text-gradient">Personalizados</span> com
              Avaliação Visual
            </h1>
            <p className={styles.heroSubtitle}>
              Monte treinos específicos baseados em avaliação fotográfica e
              anamnese digital. Acompanhe a evolução dos seus alunos com
              inteligência e praticidade.
            </p>
            <div className={styles.heroActions}>
              <a href="/dashboard" className="btn btn-primary btn-lg">
                Começar Agora — Grátis
              </a>
              <a href="#how-it-works" className="btn btn-outline btn-lg">
                Ver Como Funciona
              </a>
            </div>
            <div className={styles.heroStats}>
              <div>
                <div className={`${styles.heroStatNumber} text-gradient`}>
                  500+
                </div>
                <div className={styles.heroStatLabel}>Exercícios</div>
              </div>
              <div>
                <div
                  className={`${styles.heroStatNumber} text-gradient-accent`}
                >
                  4 Fotos
                </div>
                <div className={styles.heroStatLabel}>Avaliação Completa</div>
              </div>
              <div>
                <div className={`${styles.heroStatNumber} text-gradient`}>
                  Auto
                </div>
                <div className={styles.heroStatLabel}>Troca de Treino</div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className={styles.heroVisual}>
            <div className={styles.heroPhone}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneHeader}>
                  <span className={styles.phoneHeaderTitle}>
                    Treino do Dia
                  </span>
                  <div className={styles.phoneAvatar}>RF</div>
                </div>
                <div className={styles.phoneBody}>
                  <div className={styles.phoneCard}>
                    <div className={styles.phoneCardLabel}>Progresso Semanal</div>
                    <div className={`${styles.phoneCardValue} text-gradient`}>
                      72% Completo
                    </div>
                    <div className={styles.phoneProgress}>
                      <div className={styles.phoneProgressBar} />
                    </div>
                  </div>
                  <div className={styles.phoneExercise}>
                    <div
                      className={`${styles.exerciseIcon} ${styles.exerciseIconPurple}`}
                    >
                      🏋️
                    </div>
                    <div>
                      <div className={styles.exerciseName}>Supino Reto</div>
                      <div className={styles.exerciseMeta}>
                        4x12 · 60kg · Peito
                      </div>
                    </div>
                  </div>
                  <div className={styles.phoneExercise}>
                    <div
                      className={`${styles.exerciseIcon} ${styles.exerciseIconGreen}`}
                    >
                      💪
                    </div>
                    <div>
                      <div className={styles.exerciseName}>Rosca Direta</div>
                      <div className={styles.exerciseMeta}>
                        3x15 · 14kg · Bíceps
                      </div>
                    </div>
                  </div>
                  <div className={styles.phoneExercise}>
                    <div
                      className={`${styles.exerciseIcon} ${styles.exerciseIconBlue}`}
                    >
                      🦵
                    </div>
                    <div>
                      <div className={styles.exerciseName}>Agachamento</div>
                      <div className={styles.exerciseMeta}>
                        4x10 · 80kg · Pernas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.heroFloatingCard} ${styles.floatingLeft}`}>
              <div className={styles.floatingCardIcon}>📷</div>
              <div className={styles.floatingCardText}>Avaliação</div>
              <div className={`${styles.floatingCardValue} text-gradient-accent`}>
                4 Fotos
              </div>
            </div>
            <div className={`${styles.heroFloatingCard} ${styles.floatingRight}`}>
              <div className={styles.floatingCardIcon}>📈</div>
              <div className={styles.floatingCardText}>Evolução</div>
              <div className={`${styles.floatingCardValue} text-gradient`}>
                +15%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className={styles.features}>
        <div className="container text-center">
          <div className={styles.sectionLabel}>✦ Funcionalidades</div>
          <h2 className={styles.sectionTitle}>
            Tudo que você precisa em{" "}
            <span className="text-gradient">um só lugar</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Ferramentas profissionais para avaliação, prescrição e
            acompanhamento dos seus alunos.
          </p>
          <div className={styles.featuresGrid}>
            {[
              {
                icon: "📷",
                title: "Avaliação por Fotos",
                desc: "Capture 4 ângulos (frontal, laterais e costas) para uma avaliação visual completa do biotipo e postura do aluno.",
              },
              {
                icon: "📋",
                title: "Anamnese Digital",
                desc: "Questionário completo de saúde, objetivos, lesões e histórico de treino — tudo digital e organizado.",
              },
              {
                icon: "🏋️",
                title: "Banco de Exercícios",
                desc: "Mais de 500 exercícios categorizados por grupo muscular, equipamento e nível de dificuldade.",
              },
              {
                icon: "🤖",
                title: "Treino Inteligente",
                desc: "Geração automática de treinos baseada na avaliação visual, anamnese e objetivos do aluno.",
              },
              {
                icon: "📈",
                title: "Acompanhamento",
                desc: "Histórico completo de evolução com comparação de fotos, medidas e desempenho ao longo do tempo.",
              },
              {
                icon: "🔔",
                title: "Alerta de Renovação",
                desc: "Aviso automático quando o treino está próximo de vencer, garantindo periodização adequada.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`card ${styles.featureCard} animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className="container text-center">
          <div className={styles.sectionLabel}>✦ Como Funciona</div>
          <h2 className={styles.sectionTitle}>
            Simples, <span className="text-gradient-accent">rápido</span> e
            profissional
          </h2>
          <div className={styles.stepsGrid}>
            {[
              {
                num: "1",
                color: "Purple",
                title: "Cadastre o Aluno",
                desc: "Adicione as informações básicas e dê acesso ao aluno via e-mail.",
              },
              {
                num: "2",
                color: "Green",
                title: "Avaliação Completa",
                desc: "O aluno envia as 4 fotos padrão e responde a anamnese digital.",
              },
              {
                num: "3",
                color: "Purple",
                title: "Monte o Treino",
                desc: "Use o banco de exercícios e as sugestões inteligentes para montar o treino ideal.",
              },
              {
                num: "4",
                color: "Green",
                title: "Acompanhe",
                desc: "Monitore a execução, compare resultados e renove os treinos no tempo certo.",
              },
            ].map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div
                  className={`${styles.stepNumber} ${styles[`stepNumber${step.color}`]
                    }`}
                >
                  {step.num}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.desc}</p>
                {i < 3 && (
                  <div className={`${styles.stepConnector} hide-mobile`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="pricing" className={styles.pricing}>
        <div className="container text-center">
          <div className={styles.sectionLabel}>✦ Planos</div>
          <h2 className={styles.sectionTitle}>
            Escolha o plano{" "}
            <span className="text-gradient">ideal para você</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Comece gratuitamente e escale conforme sua base de alunos cresce.
          </p>
          <div className={styles.pricingGrid}>
            {/* Free */}
            <div className={`card ${styles.pricingCard}`}>
              <h3 className={styles.pricingName}>Starter</h3>
              <div className={styles.pricingPrice}>
                R$<span>0</span>
              </div>
              <div className={styles.pricingPeriod}>para sempre</div>
              <div className={styles.pricingDivider} />
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}>Até 5 alunos</li>
                <li className={styles.pricingFeature}>Avaliação por fotos</li>
                <li className={styles.pricingFeature}>Anamnese digital</li>
                <li className={styles.pricingFeature}>Banco de exercícios</li>
              </ul>
              <a href="/dashboard" className="btn btn-outline" style={{ width: '100%' }}>
                Começar Grátis
              </a>
            </div>

            {/* Pro */}
            <div
              className={`card ${styles.pricingCard} ${styles.pricingFeatured}`}
            >
              <div className={styles.pricingBadge}>
                <span className="badge badge-primary">Popular</span>
              </div>
              <h3 className={styles.pricingName}>Pro</h3>
              <div className={`${styles.pricingPrice} text-gradient`}>
                R$<span>49</span>
              </div>
              <div className={styles.pricingPeriod}>/mês</div>
              <div className={styles.pricingDivider} />
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}>Até 50 alunos</li>
                <li className={styles.pricingFeature}>Treino inteligente com IA</li>
                <li className={styles.pricingFeature}>Comparação de evolução</li>
                <li className={styles.pricingFeature}>Alerta de renovação</li>
                <li className={styles.pricingFeature}>Suporte prioritário</li>
              </ul>
              <a href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
                Assinar Agora
              </a>
            </div>

            {/* Enterprise */}
            <div className={`card ${styles.pricingCard}`}>
              <h3 className={styles.pricingName}>Enterprise</h3>
              <div className={styles.pricingPrice}>
                R$<span>149</span>
              </div>
              <div className={styles.pricingPeriod}>/mês</div>
              <div className={styles.pricingDivider} />
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}>Alunos ilimitados</li>
                <li className={styles.pricingFeature}>Multi-personal (equipe)</li>
                <li className={styles.pricingFeature}>API personalizada</li>
                <li className={styles.pricingFeature}>White-label</li>
                <li className={styles.pricingFeature}>Suporte dedicado</li>
              </ul>
              <a href="/dashboard" className="btn btn-outline" style={{ width: '100%' }}>
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>
              Pronto para{" "}
              <span className="text-gradient-accent">revolucionar</span> seus
              treinos?
            </h2>
            <p className={styles.ctaSubtitle}>
              Junte-se a centenas de profissionais que já usam o FitVision para
              transformar seus alunos.
            </p>
            <a href="/dashboard" className="btn btn-accent btn-lg">
              Começar Agora — É Grátis
            </a>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContent}`}>
          <div className={styles.logo}>
            <img src="/fitvision-logo-eye.png" alt="FitVision Logo" style={{ height: "48px", objectFit: "contain", borderRadius: "8px" }} />
          </div>
          <div className={styles.footerCopy}>
            © 2026 FitVision. Todos os direitos reservados.
          </div>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#" className={styles.footerLink}>
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Privacidade
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Contato
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
