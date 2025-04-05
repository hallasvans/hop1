// src/myndir.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import verifyToken from '../psw/auth.js' // ef ekki þegar importað


const prisma = new PrismaClient();
const router = express.Router();

// GET /api/myndir
router.get('/', async (req, res) => {
  try {
    const myndir = await prisma.myndir.findMany({
      orderBy: { created: 'desc' },
    });
    res.json(myndir);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/myndir
router.post('/', verifyToken, async (req, res) => {
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const mynd = await prisma.myndir.create({
      data: {
        title,
        description,
        url,
        userId: req.user.id,
      },
    });

    res.status(201).json(mynd);
  } catch (e) {
    console.error('Villa við að skrá mynd:', e);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
