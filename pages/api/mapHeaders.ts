import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // call OpenAI to map headers
  res.status(200).json({});
}