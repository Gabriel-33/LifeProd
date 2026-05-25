// app/(tools)/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Calculator, 
  Calendar, 
  CalendarClock,
  CheckSquare,
  TrendingUp,
  Brain,
  Menu,
  X,
  User,
  Activity,
  Type
} from 'lucide-react';
import { Button } from '../components/ui/button';

const tools = [
  { name: 'Currículo IA', href: 'curriculo-ia', icon: FileText, category: 'IA' },
  { name: 'Bio LinkedIn', href: 'bio-linkedin', icon: User, category: 'IA' },
  { name: 'Organizador Estudos', href: 'organizador-estudos', icon: Brain, category: 'IA' },
  { name: 'Planner Semanal', href: 'planner-semanal', icon: Calendar, category: 'Produtividade' },
  { name: 'Streak Hábitos', href: 'streak-habitos', icon: CalendarClock, category: 'Produtividade' },
  { name: 'Checklist', href: 'checklist', icon: CheckSquare, category: 'Produtividade' },
  { name: 'Calculadora Juros', href: 'juros', icon: TrendingUp, category: 'Utilidades' },
  { name: 'Calculadora IMC', href: 'imc', icon: Activity, category: 'Utilidades' },
  { name: 'Contador Caracteres', href: 'contador-caracteres', icon: Type, category: 'Utilidades' },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="font-bold text-lg">LifeProd</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Olá, visitante!</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 bg-white border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 flex justify-between items-center border-b lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-1">
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

              {/* Categoria: Ferramentas (Saúde + Finanças + Utilidades) */}
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 mt-4">
                 Ferramentas
              </p>
              {tools.filter(tool => tool.category === 'Saúde' || tool.category === 'Finanças' || tool.category === 'Utilidades').map((tool) => (
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
                      tool.category === 'Finanças' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {tool.category === 'Saúde' ? 'Saúde' :
                    tool.category === 'Finanças' ? 'Finanças' : 'Utilidades'}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="w-full max-w-[900px] mx-auto px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}