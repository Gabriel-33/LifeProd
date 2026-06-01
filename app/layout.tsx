// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Palavras-chave principais do LifeProd
const keywords = [
  'produtividade',
  'currículo IA',
  'planner semanal',
  'organizador de estudos',
  'checklist',
  'calculadora de juros',
  'calculadora IMC',
  'streak de hábitos',
  'ferramentas de produtividade',
  'inteligência artificial',
  'LifeProd',
  'currículo com IA',
  'gestão de tarefas',
  'planejamento semanal',
  'hábitos diários',
];

export const metadata: Metadata = {
  title: {
    default: 'LifeProd | Produtividade, Carreira e Organização com IA',
    template: '%s | LifeProd',
  },
  description: 'Ferramentas inteligentes para organizar sua vida. Currículo IA, Planner Semanal, Checklist, Calculadora de Juros, IMC e muito mais. Tudo em um só lugar.',
  keywords: keywords,
  authors: [{ name: 'LifeProd', url: 'https://lifeprod.vercel.app' }],
  creator: 'LifeProd',
  publisher: 'LifeProd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'LifeProd | Seu hub de produtividade com IA',
    description: 'Ferramentas inteligentes para currículo, planejamento, estudos e finanças.',
    url: 'https://lifeprod.vercel.app',
    siteName: 'LifeProd',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://lifeprod.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LifeProd - Ferramentas de Produtividade com IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LifeProd | Produtividade com IA',
    description: 'Simplifique sua vida com as ferramentas do LifeProd.',
    images: ['https://lifeprod.vercel.app/twitter-image.png'],
  },
  verification: {
    google: 'googlee01c5f0d5fc84a39', // Seu código de verificação
  },
  alternates: {
    canonical: 'https://lifeprod.vercel.app',
  },
  category: 'produtividade',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href="https://lifeprod.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="pR1TwdInmqmjL86vQhk2UiMzQ5NBSttti_I_NdpnIsw" />
        <meta name="google-adsense-account" content="ca-pub-2356473671774504"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}