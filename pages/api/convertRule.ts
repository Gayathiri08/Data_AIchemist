import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY!);

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const prompt = `
Convert this English rule into JSON.  
Valid types: coRun, slotRestriction, loadLimit, phaseWindow, patternMatch, precedenceOverride.  
English: "${text}"  
JSON:`;
  const { generated_text } = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    inputs: prompt,
    parameters: { max_new_tokens: 100 }
  });
  // parse JSON safely
  const json = JSON.parse(generated_text.trim());
  return NextResponse.json(json);
}
