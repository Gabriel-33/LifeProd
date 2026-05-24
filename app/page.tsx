// app/page.tsx
import Link from 'next/link';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { 
  Calculator, 
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
  Type
} from 'lucide-react';

const tools = [
  { name: 'Currículo IA', href: 'tools/curriculo-ia', icon: FileText, color: 'bg-blue-500', category: 'IA' },
  { name: 'Bio LinkedIn', href: 'tools/bio-linkedin', icon: FolderGitIcon, color: 'bg-blue-700', category: 'IA' },
  { name: 'Organizador Estudos', href: 'tools/organizador-estudos', icon: Brain, color: 'bg-purple-500', category: 'IA' },
  { name: 'Planner Semanal', href: 'tools/planner-semanal', icon: Calendar, color: 'bg-orange-500', category: 'Produtividade' },
  { name: 'Checklist', href: 'tools/checklist', icon: CheckSquare, color: 'bg-teal-500', category: 'Produtividade' },
  { name: 'Calculadora Juros', href: 'tools/juros', icon: TrendingUp, color: 'bg-green-500', category: 'Finanças' },
  { name: 'Calculadora IMC', href: 'tools/imc', icon: Activity, color: 'bg-emerald-500', category: 'Saúde' },
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
          <h2 className="text-3xl font-bold text-center mb-12">Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.name}>
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>Clique para usar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {tool.category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
                <li><Link href="/curriculo-ia" className="hover:text-white">Currículo IA</Link></li>
                <li><Link href="/planner-semanal" className="hover:text-white">Planner Semanal</Link></li>
                <li><Link href="/juros" className="hover:text-white">Calculadora Juros</Link></li>
                <li><Link href="/imc" className="hover:text-white">Calculadora IMC</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre nós</a></li>
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