import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.join(process.cwd(), 'public/data', 'settings.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Logica per gestire la richiesta GET
    const data = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json(JSON.parse(data));
  } else if (req.method === 'POST') {
    // Logica per gestire la richiesta POST
    const newData = req.body;
    fs.writeFileSync(filePath, JSON.stringify(newData));
    res.status(200).json({ success: true });
  } else {
    // Gestire altri metodi se necessario
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}