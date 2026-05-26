// app/page.tsx
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
  BarChart2,
  HeartPulse,
} from 'lucide-react';

const tools = [
  { name: 'Currículo IA', href: 'tools/curriculo-ia', icon: FileText, color: 'bg-blue-500', category: 'IA' },
  { name: 'Bio LinkedIn', href: 'tools/bio-linkedin', icon: FolderGitIcon, color: 'bg-blue-700', category: 'IA' },
  { name: 'Organizador Estudos', href: 'tools/organizador-estudos', icon: Brain, color: 'bg-purple-500', category: 'IA' },
  { name: 'Planner Semanal', href: 'tools/planner-semanal', icon: Calendar, color: 'bg-orange-500', category: 'Produtividade' },
  { name: 'Checklist', href: 'tools/checklist', icon: CheckSquare, color: 'bg-teal-500', category: 'Produtividade' },
  { name: 'Streek de hábitos', href: 'tools/streak-habitos', icon: CalendarClock, color: 'bg-red-500', category: 'Produtividade' },
  { name: 'Calculadora Juros', href: 'tools/juros', icon: TrendingUp, color: 'bg-green-500', category: 'Utilidades' },
  { name: 'Calculadora IMC', href: 'tools/imc', icon: Activity, color: 'bg-emerald-500', category: 'Utilidades' },
  { name: 'Contador Caracteres', href: 'tools/contador-caracteres', icon: Type, color: 'bg-gray-500', category: 'Utilidades' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LifeProd
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#ferramentas" className="text-gray-600 hover:text-gray-900">Ferramentas</a>
              <a href="#habitos" className="text-gray-600 hover:text-gray-900">Hábitos</a>
              <a href="#curriculo" className="text-gray-600 hover:text-gray-900">Currículo</a>
              <a href="#financas" className="text-gray-600 hover:text-gray-900">Finanças</a>
              <a href="#saude" className="text-gray-600 hover:text-gray-900">Saúde</a>
              <a href="#sobre" className="text-gray-600 hover:text-gray-900">Sobre</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900">Contato</a>
            </nav>
            <Button variant="outline" size="sm">Entrar</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Seu hub pessoal de produtividade
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ferramentas inteligentes para organizar sua vida. De currículos com IA a planejamento financeiro.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Começar Grátis
            </Button>
            <Button size="lg" variant="outline">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Ferramentas */}
      <section id="ferramentas" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-gray-800 font-bold text-center mb-12">Ferramentas</h2>

          {/* IA */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-gray-800">Inteligência Artificial</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.category === 'IA').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{tool.name}</CardTitle>
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
              <h3 className="text-2xl font-semibold text-gray-800">Produtividade</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.category === 'Produtividade').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{tool.name}</CardTitle>
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

          {/* Utilidades */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gray-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-gray-800">Utilidades</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.category === 'Utilidades').map((tool) => (
                <Link href={tool.href} key={tool.name}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{tool.name}</CardTitle>
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

      {/* ─────────────────────────────────────────
          SEÇÃO: HÁBITOS
      ───────────────────────────────────────── */}
      <section id="habitos" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Por que criar hábitos muda sua vida?</h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Hábitos são a base de qualquer mudança duradoura. Pesquisas mostram que cerca de 40% das nossas
            ações diárias são automáticas — ou seja, não são decisões conscientes, mas hábitos enraizados.
            Isso significa que quem domina seus hábitos, domina seu tempo e sua energia.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            O segredo não está em ter força de vontade infinita, mas em criar <strong>sequências consistentes</strong>.
            Quando você registra um hábito todos os dias e acompanha sua <em>streak</em> — a sequência de dias
            consecutivos — seu cérebro libera dopamina a cada check-in. Isso cria um ciclo positivo: quanto
            maior a sequência, maior o incentivo para não quebrá-la.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Seja beber mais água, praticar exercícios, estudar um idioma ou meditar: qualquer hábito fica mais
            fácil de manter quando você o torna visível. Nossa ferramenta de Streak de Hábitos foi criada
            exatamente para isso — te ajudar a visualizar seu progresso dia a dia e manter o ritmo.
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

      {/* ─────────────────────────────────────────
          SEÇÃO: CURRÍCULO
      ───────────────────────────────────────── */}
      <section id="curriculo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Como criar um currículo que realmente funciona</h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            A maioria dos currículos é descartada em menos de 7 segundos. Recrutadores analisam dezenas por dia
            e buscam palavras-chave específicas antes mesmo de ler o conteúdo. Por isso, um currículo moderno
            precisa ser otimizado para sistemas ATS (Applicant Tracking Systems) — softwares que filtram
            candidatos automaticamente antes de chegarem a um humano.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Um bom currículo não é o mais bonito, mas o mais <strong>relevante e objetivo</strong>. Ele deve
            responder em segundos: quem é você, o que você já fez e qual valor você traz. Evite blocos de
            texto longos, objetivos genéricos e informações desatualizadas.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Com o <strong>Currículo IA</strong> do LifeProd, você preenche suas informações e a inteligência
            artificial monta um currículo profissional, objetivo e otimizado — pronto para enviar em minutos,
            sem precisar formatar do zero.
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

      {/* ─────────────────────────────────────────
          SEÇÃO: FINANÇAS
      ───────────────────────────────────────── */}
      <section id="financas" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Juros compostos: o poder do dinheiro no tempo</h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Einstein teria chamado os juros compostos de "a oitava maravilha do mundo". Brincadeiras à parte,
            entender como os juros compostos funcionam é uma das habilidades financeiras mais importantes que
            existe — tanto para investir quanto para evitar dívidas que crescem exponencialmente.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            A lógica é simples: nos juros compostos, os juros de cada período são calculados sobre o valor
            acumulado, não apenas sobre o capital inicial. Isso cria um efeito de <strong>crescimento
            exponencial</strong>. Quanto antes você começa a investir, mais tempo o dinheiro tem para
            multiplicar — mesmo que os aportes sejam pequenos.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Use nossa calculadora para simular quanto seu dinheiro pode render com diferentes taxas e prazos,
            ou calcule o custo real de um parcelamento antes de fechar negócio.
          </p>

          <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-lg">Simule seus investimentos agora</p>
              <p className="text-gray-500 text-sm">Descubra quanto seu dinheiro pode render com juros compostos.</p>
            </div>
            <Link href="tools/juros">
              <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap">
                <div className='flex'>
                  Calcular juros <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SEÇÃO: SAÚDE / IMC
      ───────────────────────────────────────── */}
      <section id="saude" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">O que é IMC e como interpretar o seu resultado</h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            O Índice de Massa Corporal (IMC) é uma medida internacional usada para avaliar se o peso de uma
            pessoa está dentro de uma faixa saudável em relação à sua altura. Ele é calculado dividindo o peso
            (em kg) pelo quadrado da altura (em metros) e é amplamente utilizado por profissionais de saúde
            como um indicador inicial de risco.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Os resultados são classificados em faixas: abaixo de 18,5 indica <strong>abaixo do peso</strong>;
            entre 18,5 e 24,9, <strong>peso normal</strong>; entre 25 e 29,9, <strong>sobrepeso</strong>;
            acima de 30, algum grau de <strong>obesidade</strong>. É importante lembrar que o IMC é um
            indicador geral — fatores como massa muscular e biotipo não são considerados nesse cálculo.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Conhecer seu IMC é o primeiro passo para entender seu estado de saúde atual e tomar decisões mais
            conscientes sobre alimentação, exercício e qualidade de vida.
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
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre o LifeProd</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                <span className="text-xl font-bold">LifeProd</span>
              </div>
              <p className="text-gray-400 text-sm">Ferramentas inteligentes para organizar sua vida.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/tools/curriculo-ia" className="hover:text-white">Currículo IA</Link></li>
                <li><Link href="/tools/planner-semanal" className="hover:text-white">Planner Semanal</Link></li>
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
                  <Mail className="w-4 h-4" />
                  <span>contato@lifeprod.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>github/lifeprod</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>@lifeprod</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 LifeProd. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}