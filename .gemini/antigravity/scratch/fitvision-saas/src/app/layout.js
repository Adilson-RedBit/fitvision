import "./globals.css";

export const metadata = {
  title: "FitVision – Treinos Personalizados com IA para Personal Trainers",
  description: "Plataforma inteligente para Personal Trainers: avaliação física por fotos, anamnese digital, geração automática de treinos personalizados e acompanhamento de evolução.",
  keywords: "personal trainer, treino personalizado, avaliação física, anamnese, micro saas, fitness",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#7E52F3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FitVision" />
        <link rel="apple-touch-icon" href="/fitvision-logo-symbol.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
