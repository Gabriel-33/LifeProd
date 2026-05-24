// app/layout.tsx 
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeProd - Produtividade, Carreira e Organização',
  description: 'Ferramentas inteligentes para organizar sua vida. Currículo IA, Planner, Calculadoras e muito mais.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}