// app/(tools)/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Calendar, 
  CalendarClock,
  CheckSquare,
  TrendingUp,
  Brain,
  Menu,
  X,
  User,
  Activity,
  Type,
  CirclePoundSterlingIcon,
  LayoutDashboard,
  TrendingDown,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const tools = [
  { name: 'Currículo IA', href: 'curriculo-ia', icon: FileText, category: 'IA' },
  { name: 'Bio LinkedIn', href: 'bio-linkedin', icon: User, category: 'IA' },
  { name: 'Organizador Estudos', href: 'organizador-estudos', icon: Brain, category: 'IA' },
  { name: 'Planner Semanal', href: 'planner-semanal', icon: Calendar, category: 'Produtividade' },
  { name: 'Streak Hábitos', href: 'streak-habitos', icon: CalendarClock, category: 'Produtividade' },
  { name: 'Checklist', href: 'checklist', icon: CheckSquare, category: 'Produtividade' },
  { name: 'Controle de gastos', href: 'controle-gastos', icon: CirclePoundSterlingIcon, category: 'Financas' },
  { name: 'Calculadora Juros', href: 'juros', icon: TrendingUp, category: 'Financas' },
  { name: 'Calculadora IMC', href: 'imc', icon: Activity, category: 'Saúde' },
  { name: 'Contador Caracteres', href: 'contador-caracteres', icon: Type, category: 'Utilidades' },
];

// Categorias para o menu inferior (mobile)
const categories = [
  { 
    id: 'profissional', 
    name: 'Profissional', 
    icon: Brain, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-50',
    tools: tools.filter(t => t.category === 'IA')
  },
  { 
    id: 'produtividade', 
    name: 'Produtividade', 
    icon: Calendar, 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    hoverBg: 'hover:bg-green-50',
    tools: tools.filter(t => t.category === 'Produtividade')
  },
  { 
    id: 'financas', 
    name: 'Finanças', 
    icon: TrendingDown, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-50',
    tools: tools.filter(t => t.category === 'Financas')
  },
  { 
    id: 'ferramentas', 
    name: 'Ferramentas', 
    icon: LayoutDashboard, 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50',
    hoverBg: 'hover:bg-gray-50',
    tools: tools.filter(t => t.category === 'Saúde' || t.category === 'Utilidades')
  },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleCategory = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b max-[640px]:border-b-0 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botão do menu lateral - só aparece em desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r rounded-lg">
                <img src='../../favicon.ico' alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg text-gray-400">LifeProd</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Olá, visitante!</span>
          </div>
        </div>

        {/* Menu suspenso para mobile - aparece quando uma categoria é selecionada */}
        {activeCategory && (
          <div className="lg:hidden border-t bg-white shadow-lg max-h-80 overflow-y-auto">
            {categories.find(c => c.id === activeCategory)?.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setActiveCategory(null)}
                className={`
                  flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition
                  ${pathname === tool.href 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <tool.icon className="w-5 h-5" />
                <span className="text-sm flex-1">{tool.name}</span>
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${tool.category === 'IA' ? 'bg-purple-100 text-purple-700' :
                    tool.category === 'Produtividade' ? 'bg-green-100 text-green-700' :
                    tool.category === 'Financas' ? 'bg-blue-100 text-blue-700' :
                    tool.category === 'Saúde' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }
                `}>
                  {tool.category === 'IA' ? 'IA' :
                   tool.category === 'Produtividade' ? 'Produtividade' :
                   tool.category === 'Financas' ? 'Finanças' :
                   tool.category === 'Saúde' ? 'Saúde' : 'Utilidades'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar (apenas desktop) - escondido em mobile */}
        <aside className={`
          hidden lg:block fixed lg:static inset-y-0 left-0 z-30
          w-72 bg-white border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 flex justify-between items-center border-b lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-60px)]">
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Início</span>
            </Link>
            
            <div className="pt-4 mt-4 border-t">
  
              {/* Categoria: Profissional (IA) */}
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 mt-2">
                Profissional
              </p>
              {tools.filter(tool => tool.category === 'IA').map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition
                    ${pathname === tool.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="text-sm">{tool.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto bg-purple-100 text-purple-700">
                    IA
                  </span>
                </Link>
              ))}

              {/* Categoria: Produtividade */}
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 mt-4">
                Produtividade
              </p>
              {tools.filter(tool => tool.category === 'Produtividade').map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition
                    ${pathname === tool.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="text-sm">{tool.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto bg-green-100 text-green-700">
                    Produtividade
                  </span>
                </Link>
              ))}

              {/* Categoria: Finanças */}
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 mt-4">
                Finanças
              </p>
              {tools.filter(tool => tool.category === 'Financas').map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition
                    ${pathname === tool.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="text-sm">{tool.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto bg-blue-100 text-blue-700">
                    Finanças
                  </span>
                </Link>
              ))}

              {/* Categoria: Ferramentas (Saúde + Utilidades) */}
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 mt-4">
                Ferramentas
              </p>
              {tools.filter(tool => tool.category === 'Saúde' || tool.category === 'Utilidades').map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition
                    ${pathname === tool.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="text-sm">{tool.name}</span>
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded-full ml-auto
                    ${tool.category === 'Saúde' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {tool.category === 'Saúde' ? 'Saúde' : 'Utilidades'}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - apenas em dispositivos móveis */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${category.hoverBg}`}
            >
              <category.icon className={`w-5 h-5 ${category.color}`} />
              <span className="text-xs text-gray-600">{category.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}