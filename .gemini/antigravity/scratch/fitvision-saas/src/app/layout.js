import "./globals.css";

export const metadata = {
  title: "FitVision — Treinos Personalizados com IA para Personal Trainers",
  description:
    "Plataforma inteligente para Personal Trainers: avaliação física por fotos, anamnese digital, geração automática de treinos personalizados e acompanhamento de evolução.",
  keywords: "personal trainer, treino personalizado, avaliação física, anamnese, micro saas, fitness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
