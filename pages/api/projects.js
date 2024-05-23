import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    await handleGetRequest(req, res);
  } else if (method === 'POST') {
    await handlePostRequest(req, res);
  } else {
    res.status(400).json({ success: false, message: 'Invalid HTTP method' });
  }
}

async function handleGetRequest(req, res) {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function handlePostRequest(req, res) {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ success: false, message: 'Bad Request' });
  }
}
