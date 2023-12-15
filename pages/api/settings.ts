// Importa i moduli necessari
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.join(process.cwd(), 'public/data', 'settings.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`Received ${req.method} request to ${req.url}`);

    if (req.method === 'GET') {
      // Logica per gestire la richiesta GET
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        console.log('Read data from file:', data);
        res.status(200).json(JSON.parse(data));
      } else {
        console.log('File does not exist. Returning empty array.');
        res.status(200).json([]); // Restituisce un array vuoto se il file non esiste
      }
    } else if (req.method === 'POST') {
      // Logica per gestire la richiesta POST
      const currentData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
      const newData = req.body;

      if (!newData || typeof newData !== 'object') {
        console.error('Invalid JSON data received in POST request:', req.body);
        res.status(400).json({ error: 'Invalid JSON data' });
        return;
      }

      console.log('Received data in POST request:', newData);

      // Aggiungi o aggiorna l'oggetto esistente con lo stesso nome
      const updatedData = currentData.map((item: any) =>
        item.name === newData.name ? newData : item
      );

      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log('Data written to file:', updatedData);

      res.status(200).json({ success: true });
    } else if (req.method === 'PUT') {
      // Logica per gestire la richiesta PUT (aggiornamento generale)
      const updatedData = req.body;

      if (!updatedData || !Array.isArray(updatedData)) {
        console.error('Invalid JSON data received in PUT request:', req.body);
        res.status(400).json({ error: 'Invalid JSON data' });
        return;
      }

      console.log('Received data in PUT request:', updatedData);

      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log('Data written to file:', updatedData);

      res.status(200).json({ success: true });
    } else if (req.method === 'DELETE') {
      // Logica per gestire la richiesta DELETE
      const currentData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
      const idToDelete = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    
      if (!idToDelete) {
        console.error('Missing id parameter in DELETE request.');
        res.status(400).json({ error: 'Missing id parameter' });
        return;
      }
    
      console.log('Received id in DELETE request:', idToDelete);
    
      // Filtra gli oggetti eliminando quello con l'id corrispondente
      const updatedData = currentData.filter((item: any) => item.id !== parseInt(idToDelete, 10));
    
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log('Data written to file:', updatedData);
    
      res.status(200).json({ success: true });
    } else {
      // Gestire altri metodi se necessario
      console.error('Unsupported method:', req.method);
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}