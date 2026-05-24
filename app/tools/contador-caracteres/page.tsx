// app/(tools)/contador-caracteres/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Type, Copy, RotateCcw } from 'lucide-react';

export default function ContadorCaracteresPage() {
  const [texto, setTexto] = useState('');

  const stats = {
    caracteres: texto.length,
    caracteresSemEspacos: texto.replace(/\s/g, '').length,
    palavras: texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length,
    linhas: texto === '' ? 0 : texto.split(/\n/).length,
  };

  function limpar() {
    setTexto('');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contador de Caracteres</h1>
        <p className="text-gray-500 mt-1">Conte caracteres, palavras e linhas do seu texto</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-500" />
              Seu texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Digite ou cole seu texto aqui..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={10}
            />
            <div className="flex gap-3">
              <Button onClick={limpar} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copiar texto
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Caracteres</span>
              <span className="font-bold text-blue-600">{stats.caracteres}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Caracteres (sem espaços)</span>
              <span className="font-bold text-green-600">{stats.caracteresSemEspacos}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Palavras</span>
              <span className="font-bold text-purple-600">{stats.palavras}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Linhas</span>
              <span className="font-bold text-orange-600">{stats.linhas}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}