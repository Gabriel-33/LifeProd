// app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import {
  FileText,
  Brain,
  TrendingUp,
  Calendar,
  CheckSquare,
  User,
  FolderGitIcon,
  X,
  Mail,
  Activity,
  Type,
  CalendarClock,
  ArrowRight,
  Sparkles,
  Flame,
  DollarSign,
  HeartPulse,
  CirclePoundSterlingIcon
} from 'lucide-react';

const tools = [
  { name: 'Currículo IA', href: 'tools/curriculo-ia', icon: FileText, color: 'bg-blue-500', category: 'IA' },
  { name: 'Bio LinkedIn', href: 'tools/bio-linkedin', icon: FolderGitIcon, color: 'bg-blue-700', category: 'IA' },
  { name: 'Organizador Estudos', href: 'tools/organizador-estudos', icon: Brain, color: 'bg-purple-500', category: 'IA' },
  { name: 'Planner Semanal', href: 'tools/planner-semanal', icon: Calendar, color: 'bg-orange-500', category: 'Produtividade' },
  { name: 'Checklist', href: 'tools/checklist', icon: CheckSquare, color: 'bg-teal-500', category: 'Produtividade' },
  { name: 'Streak de hábitos', href: 'tools/streak-habitos', icon: CalendarClock, color: 'bg-red-500', category: 'Produtividade' },
  { name: 'Controle de gastos', href: 'tools/controle-gastos', icon: CirclePoundSterlingIcon, color: 'bg-green-500', category: 'Financas' },
  { name: 'Calculadora Juros', href: 'tools/juros', icon: TrendingUp, color: 'bg-green-500', category: 'Financas' },
  { name: 'Calculadora IMC', href: 'tools/imc', icon: Activity, color: 'bg-emerald-500', category: 'Utilidades' },
  { name: 'Contador Caracteres', href: 'tools/contador-caracteres', icon: Type, color: 'bg-gray-500', category: 'Utilidades' },
];

export default function Home() {
  return (
    // ← REMOVA o overflow-x-hidden daqui
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r rounded-lg flex-shrink-0">
                <img src='../../favicon.ico' className="w-full h-full object-contain" alt="Logo" />
              </div>
              <span className="font-bold text-lg text-gray-500">LifeProd</span>
            </div>
            <nav className="hidden md:flex space-x-2">
              <a href="#ferramentas" className="text-gray-600 hover:text-gray-900 px-2">Ferramentas</a>
              <a href="#habitos" className="text-gray-600 hover:text-gray-900 px-2">Hábitos</a>
              <a href="#curriculo" className="text-gray-600 hover:text-gray-900 px-2">Currículo</a>
              <a href="#organizador-estudos" className="text-gray-600 hover:text-gray-900 px-2">Estudo</a>
              <a href="#financas" className="text-gray-600 hover:text-gray-900 px-2">Finanças</a>
              <a href="#saude" className="text-gray-600 hover:text-gray-900 px-2">Saúde</a>
              <a href="#sobre" className="text-gray-600 hover:text-gray-900 px-2">Sobre</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900 px-2">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-20">
        {/* ← REMOVA overflow-x-hidden daqui também */}
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Seu hub pessoal de produtividade
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ferramentas inteligentes para organizar sua vida. De currículos com IA a planejamento financeiro.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="#ferramentas">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Começar Grátis
              </Button>
            </Link>
            <Link href="#habitos">
              <Button size="lg" className="bg-gray-600 hover:bg-green-700">
                Nosso Propósito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ferramentas */}
      <section id="ferramentas" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl text-gray-800 font-bold text-center mb-8 md:mb-12">Ferramentas</h2>

          {/* IA */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Inteligência Artificial</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tools.filter(t => t.category === 'IA').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{tool.name}</CardTitle>
                      <CardDescription>Gerado com IA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">IA</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Produtividade */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-green-500 rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Produtividade</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tools.filter(t => t.category === 'Produtividade').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{tool.name}</CardTitle>
                      <CardDescription>Organize seu dia</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Produtividade</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Finanças */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-green-500 rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Finanças</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tools.filter(t => t.category === 'Financas').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{tool.name}</CardTitle>
                      <CardDescription>Gerencie suas finanças</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-blue-700">Finanças</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Utilidades */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gray-500 rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Utilidades</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tools.filter(t => t.category === 'Utilidades').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{tool.name}</CardTitle>
                      <CardDescription>Ferramentas rápidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Utilidades</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção Hábitos */}
      <section id="habitos" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Por que criar hábitos muda sua vida?</h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Hábitos são a base de qualquer mudança duradoura. Pesquisas mostram que cerca de 40% das nossas
            ações diárias são automáticas — ou seja, não são decisões conscientes, mas hábitos enraizados.
            Isso significa que quem domina seus hábitos, domina seu tempo e sua energia.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Comece sua sequência hoje</p>
              <p className="text-gray-500 text-sm">Crie seu primeiro hábito e acompanhe seu progresso dia a dia.</p>
            </div>
            <Link href="tools/streak-habitos">
              <Button className="bg-red-500 hover:bg-red-600 text-white whitespace-nowrap">
                <div className='flex'>
                  Criar minha streak<ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Currículo */}
      <section id="curriculo" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Como criar um currículo que realmente funciona</h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            A maioria dos currículos é descartada em menos de 7 segundos. Recrutadores analisam dezenas por dia e buscam palavras-chave específicas antes mesmo de ler o conteúdo. Por isso, um currículo moderno precisa ser otimizado para sistemas ATS (Applicant Tracking Systems) — softwares que filtram candidatos automaticamente antes de chegarem a um humano.

            Um bom currículo não é o mais bonito, mas o mais relevante e objetivo. Ele deve responder em segundos: quem é você, o que você já fez e qual valor você traz. Evite blocos de texto longos, objetivos genéricos e informações desatualizadas.

            Com o Currículo IA do LifeProd, você preenche suas informações e a inteligência artificial monta um currículo profissional, objetivo e otimizado — pronto para enviar em minutos, sem precisar formatar do zero.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Gere seu currículo com IA agora</p>
              <p className="text-gray-500 text-sm">Preencha suas informações e receba um currículo profissional em segundos.</p>
            </div>
            <Link href="tools/curriculo-ia">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                <div className='flex'>
                  Criar meu currículo <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Organizador de Estudos */}
      <section id="organizador-estudos" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Como organizar seus estudos de forma eficiente</h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Estudar sem planejamento é como tentar chegar a um destino sem mapa. Você até avança, mas perde tempo, energia e muitas vezes estuda o que não precisa. Um bom plano de estudos considera suas dificuldades, o tempo disponível e a data da prova, distribuindo as matérias de forma inteligente.

            A técnica de revisão espaçada e a distribuição proporcional de horas por dificuldade são estratégias comprovadas para melhorar a retenção de conteúdo. Matérias mais difíceis merecem mais tempo, mas também precisam de revisões frequentes para fixar o aprendizado.

            Com o Organizador de Estudos com IA do LifeProd, você informa suas matérias, horas disponíveis e data da prova. A inteligência artificial cria um cronograma personalizado, com revisões espaçadas e distribuição de tempo baseada na dificuldade de cada matéria.
          </p>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Crie seu plano de estudos com IA</p>
              <p className="text-gray-500 text-sm">Informe suas matérias e receba um cronograma personalizado.</p>
            </div>
            <Link href="tools/organizador-estudos">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                <div className='flex'>
                  Criar meu plano <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Finanças */}
      <section id="financas" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Controle de Gastos: o primeiro passo para a saúde financeira</h2>
          </div>
          
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Você sabe exatamente para onde vai o seu dinheiro no fim do mês? Pequenos gastos do dia a dia, como 
            café, transporte e lanches, muitas vezes passam despercebidos — mas somados, podem comprometer 
            todo o seu orçamento. O primeiro passo para organizar as finanças é justamente esse: <strong>enxergar 
            para onde o dinheiro está indo</strong>.
          </p>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Com o <strong>Controle de Gastos</strong> do LifeProd, você registra todas as suas receitas e despesas 
            de forma simples e rápida. Categorize seus gastos por tipo (alimentação, transporte, lazer, etc.), 
            acompanhe seu saldo mensal e veja exatamente onde dá para cortar despesas. Tudo é salvo automaticamente 
            no seu navegador, sem necessidade de cadastro.
          </p>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
            O segredo para uma vida financeira saudável não é ganhar mais, é <strong>gastar com consciência</strong>. 
            Pequenos ajustes no dia a dia, como reduzir gastos supérfluos ou planejar melhor as compras, podem 
            gerar uma economia significativa no fim do ano. Comece hoje mesmo a tomar controle do seu dinheiro.
          </p>

          <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Organize suas finanças agora</p>
              <p className="text-gray-500 text-sm">Registre suas receitas e despesas e tenha o controle total do seu dinheiro.</p>
            </div>
            <Link href="tools/controle-gastos">
              <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap">
                <div className='flex'>
                  Controlar gastos <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Saúde */}
      <section id="saude" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">O que é IMC e como interpretar o seu resultado</h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            O Índice de Massa Corporal (IMC) é uma medida internacional usada para avaliar se o peso de uma pessoa está dentro de uma faixa saudável em relação à sua altura. Ele é calculado dividindo o peso (em kg) pelo quadrado da altura (em metros) e é amplamente utilizado por profissionais de saúde como um indicador inicial de risco.

            Os resultados são classificados em faixas: abaixo de 18,5 indica abaixo do peso; entre 18,5 e 24,9, peso normal; entre 25 e 29,9, sobrepeso; acima de 30, algum grau de obesidade. É importante lembrar que o IMC é um indicador geral — fatores como massa muscular e biotipo não são considerados nesse cálculo.

            Conhecer seu IMC é o primeiro passo para entender seu estado de saúde atual e tomar decisões mais conscientes sobre alimentação, exercício e qualidade de vida.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Calcule seu IMC agora</p>
              <p className="text-gray-500 text-sm">Descubra sua classificação e o que ela significa para sua saúde.</p>
            </div>
            <Link href="tools/imc">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
                <div className='flex'>
                  Calcular IMC <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Sobre o LifeProd</h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            O LifeProd nasceu da ideia de reunir em um só lugar ferramentas práticas para o dia a dia —
            sem precisar abrir dezenas de abas ou assinar vários serviços. Combinando inteligência artificial
            com utilidades simples e diretas, nosso objetivo é te ajudar a ser mais produtivo, organizado
            e consciente das suas escolhas.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg">
                  <img src='../../favicon.ico' className="w-full h-full object-contain" alt="Logo" />
                </div>
                <span className="font-bold">LifeProd</span>
              </div>
              <p className="text-gray-400 text-sm">Ferramentas inteligentes para organizar sua vida.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/tools/curriculo-ia" className="hover:text-white">Currículo IA</Link></li>
                <li><Link href="/tools/planner-semanal" className="hover:text-white">Planner Semanal</Link></li>
                <li><Link href="/tools/streak-habitos" className="hover:text-white">Streak de Hábitos</Link></li>
                <li><Link href="/tools/juros" className="hover:text-white">Calculadora Juros</Link></li>
                <li><Link href="/tools/imc" className="hover:text-white">Calculadora IMC</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#sobre" className="hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">gabrielennosdev@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">github/Gabriel-33</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">Linkedin/Gabriel-ennos</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 LifeProd. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}