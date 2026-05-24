// app/(tools)/juros/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { TrendingUp, Copy, RotateCcw } from 'lucide-react';

export default function JurosPage() {
  const [valor, setValor] = useState('');
  const [taxa, setTaxa] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [resultado, setResultado] = useState<{ montante: number; juros: number } | null>(null);

  function calcularJuros() {
    const p = parseFloat(valor);
    const i = parseFloat(taxa) / 100;
    const n = parseInt(periodo);
    
    if (!p || !i || !n) return;
    
    const montante = p * Math.pow(1 + i, n);
    const juros = montante - p;
    
    setResultado({ montante, juros });
  }

  function limpar() {
    setValor('');
    setTaxa('');
    setPeriodo('');
    setResultado(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calculadora de Juros Compostos</h1>
        <p className="text-gray-500 mt-1">Simule investimentos e financiamentos</p>
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Dados da simulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Valor inicial (R$)</Label>
              <Input
                type="number"
                step="100"
                placeholder="Ex: 1000"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa de juros (% ao mês)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 1.5"
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Período (meses)</Label>
              <Input
                type="number"
                step="1"
                placeholder="Ex: 12"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={calcularJuros} className="flex-1 bg-green-600 hover:bg-green-700">
                Calcular
              </Button>
              <Button onClick={limpar} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Montante final</p>
                <p className="text-3xl font-bold text-green-700">
                  R$ {resultado.montante.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Juros totais</p>
                <p className="text-2xl font-bold text-blue-700">
                  R$ {resultado.juros.toFixed(2)}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copiar resultado
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}