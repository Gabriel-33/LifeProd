# 🚀 LifeProd

**Seu hub pessoal de produtividade, carreira e organização**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2)](https://ai.google.dev/)

##  Sobre o Projeto

LifeProd é uma plataforma completa de ferramentas inteligentes para organizar sua vida. Combinando **Inteligência Artificial** com ferramentas práticas, oferecemos soluções rápidas para sua carreira, produtividade e dia a dia.

##  Ferramentas Disponíveis

###  Profissional (IA)
| Ferramenta | Descrição |
|------------|-----------|
| **Currículo IA** | Gere currículos profissionais otimizados para ATS |
| **Bio LinkedIn** | Crie bios impactantes para seu perfil |
| **Organizador de Estudos** | Plano de estudos personalizado com IA |

###  Produtividade
| Ferramenta | Descrição |
|------------|-----------|
| **Planner Semanal** | Organize sua semana com planejamento inteligente |
| **Contador de streak** | Monitore a evolução dos seus bons hábitos!|
| **Checklist Diário** | Acompanhe suas tarefas com prioridades |

###  Ferramentas
| Ferramenta | Descrição |
|------------|-----------|
| **Calculadora de Juros** | Simule investimentos e financiamentos |
| **Calculadora IMC** | Avalie seu índice de massa corporal |
| **Contador de Caracteres** | Conte caracteres, palavras e linhas |

##  Tecnologias

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **UI Components:** shadcn/ui
- **IA:** Google Gemini API
- **Armazenamento:** LocalStorage

##  Como Executar

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Chave da API Gemini ([obter aqui](https://aistudio.google.com/apikey))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Gabriel-33/LifeProd.git

# Entre na pasta
cd LifeProd

# Instale as dependências
npm install

# Configure a chave da API
echo "GEMINI_API_KEY=sua_chave_aqui" > .env.local

# Rode o projeto
npm run dev