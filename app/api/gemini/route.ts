// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key do Gemini não configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // Inicializa o cliente igual ao seu projeto Angular
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usa o MESMO modelo que funciona no seu projeto Angular
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",  // ← mesmo modelo do Angular
      generationConfig: {
        temperature: 0.7,               // ← mesma config
        topK: 40,                       // ← mesma config
        topP: 0.95,                     // ← mesma config
        maxOutputTokens: 2048,          // ← mesma config
      }
    });
    
    console.log('Enviando prompt para Gemini...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Resposta recebida, extraindo JSON...');

    // Usa a MESMA lógica de extração JSON que funciona no Angular
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/```\n([\s\S]*?)\n```/) ||
                      responseText.match(/{[\s\S]*}/);
    
    if (!jsonMatch) {
      console.error('Resposta não contém JSON:', responseText);
      return NextResponse.json(
        { error: 'A IA não retornou um formato válido. Tente novamente.' },
        { status: 500 }
      );
    }

    // Limpa a string para fazer o parse
    let cleanJson = jsonMatch[0];
    if (jsonMatch[1]) {
      cleanJson = jsonMatch[1];
    }
    cleanJson = cleanJson.replace(/```json\n?|```/g, '');
    
    // Tenta fazer o parse do JSON
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', cleanJson);
      return NextResponse.json(
        { error: 'Formato de resposta inválido da IA' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsedData });
    
  } catch (error) {
    console.error('Erro na API Gemini:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar sua solicitação' },
      { status: 500 }
    );
  }
}