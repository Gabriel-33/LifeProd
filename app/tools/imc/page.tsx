// app/(tools)/imc/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Activity, Copy } from 'lucide-react';

export default function IMCPage() {

  const [isFormValid, SetIsFormValid] = useState(true);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState<{ valor: number; classificacao: string; cor: string; dica: string } | null>(null);

  function calcularIMC() {

    const isFormValid = peso.length > 0 && altura.length > 0;

    if (!isFormValid) {
      SetIsFormValid(false);
      return;
    }

    SetIsFormValid(true);

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100;
    
    if (!pesoNum || !alturaNum) return;
    
    const imc = pesoNum / (alturaNum * alturaNum);
    
    let classificacao = '';
    let cor = '';
    let dica = '';
    
    if (imc < 18.5) {
      classificacao = 'Magreza';
      cor = 'text-yellow-600';
      dica = 'Considere aumentar sua ingestão calórica com alimentos nutritivos.';
    } else if (imc < 25) {
      classificacao = 'Normal';
      cor = 'text-green-600';
      dica = 'Parabéns! Mantenha uma alimentação equilibrada e pratique exercícios.';
    } else if (imc < 30) {
      classificacao = 'Sobrepeso';
      cor = 'text-orange-600';
      dica = 'Pequenas mudanças na dieta e atividade física podem ajudar.';
    } else {
      classificacao = 'Obesidade';
      cor = 'text-red-600';
      dica = 'Procure orientação médica para um plano de saúde adequado.';
    }
    
    setResultado({ valor: imc, classificacao, cor, dica });
  }

  function limpar() {
    setPeso('');
    setAltura('');
    setResultado(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calculadora IMC</h1>
        <p className="text-gray-500 mt-1">Calcule seu Índice de Massa Corporal</p>
      </div>

      <div className="space-y-1 grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Seus dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="mt-1"
              />
              {!isFormValid && peso.length == 0 && <Label className='text-red-900'>Insira o peso(númerico)*</Label>}

            </div>
            <div>
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                step="1"
                placeholder="Ex: 175"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="mt-1"
              />
              {!isFormValid && altura.length == 0 && <Label className='text-red-900'>Insira a altura(númerico)*</Label>}

            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={calcularIMC} title="Insira as informações" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Calcular IMC
              </Button>
              <Button onClick={limpar} variant="outline" className='hover:bg-purple-200 flex-1 justify-center'>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>Seu resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <span className="text-5xl font-bold">{resultado.valor.toFixed(1)}</span>
              </div>
              <div className={`text-center text-xl font-semibold ${resultado.cor}`}>
                {resultado.classificacao}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{resultado.dica}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copiar resultado
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {!resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tabela de referência IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Menos de 18,5</span>
                <span className="text-yellow-600">Magreza</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">18,5 - 24,9</span>
                <span className="text-green-600">Normal</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">25 - 29,9</span>
                <span className="text-orange-600">Sobrepeso</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Acima de 30</span>
                <span className="text-red-600">Obesidade</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}