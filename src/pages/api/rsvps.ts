import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const csvFilePath = path.resolve(process.cwd(), 'rsvps.csv');
interface RSVP {
    name: string;
    attending: 'yes' | 'no';
    starter: string;
    mainCourse: string;
    dessert: string;
}
let rsvps: RSVP[] = [];

// Load RSVPs from CSV file on startup
if (fs.existsSync(csvFilePath)) {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  rsvps = parse(fileContent, { columns: true });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(rsvps);
  } else if (req.method === 'POST') {
    const newRSVP = req.body;
    rsvps.push(newRSVP);
    
    // Save RSVPs to CSV file
    const csvContent = stringify(rsvps, { header: true });
    fs.writeFileSync(csvFilePath, csvContent);

    res.status(201).json(newRSVP);
  } else if (req.method === 'DELETE') {
    const { name } = req.body;
    rsvps = rsvps.filter(rsvp => rsvp.name !== name);
    
    // Save updated RSVPs to CSV file
    const csvContent = stringify(rsvps, { header: true });
    fs.writeFileSync(csvFilePath, csvContent);

    res.status(200).json({ message: 'RSVP deleted' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

