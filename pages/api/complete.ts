// pages/api/complete.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseBody = { generated_text: string };

// We no longer call out to HF at all.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ generated_text: 'true' });
  }

  const { prompt } = req.body as { prompt: string };

  console.log('Mock /api/complete prompt:', prompt);

  // Simple heuristic mock: if prompt mentions "Duration > 1", filter on that
  let mockExpr = 'true';
  if (prompt.includes('Duration > 1')) {
    mockExpr = 'Number(row.Duration) > 1';
  }
  if (prompt.includes('phase 2')) {
    mockExpr = mockExpr === 'true'
      ? "String(row.PreferredPhases).includes('2')"
      : `${mockExpr} && String(row.PreferredPhases).includes('2')`;
  }

  console.log('Mock generated_text:', mockExpr);

  return res.status(200).json({ generated_text: mockExpr });
}
