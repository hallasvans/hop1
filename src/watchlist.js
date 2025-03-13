import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../psw/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Sækja Watchlist fyrir innskráðan notanda
router.get("/", verifyToken, async (req, res) => {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: req.user.id },
      include: { show: true }
    });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Villa við að sækja watchlist" });
  }
});

// Bæta við þætti í Watchlist
router.post("/", verifyToken, async (req, res) => {
  const { showId } = req.body;
  try {
    const newEntry = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        showId
      }
    });
    res.status(201).json({ message: "Þáttur bættur við Watchlist!", watchlist: newEntry });
  } catch (error) {
    res.status(400).json({ error: "Ekki tókst að bæta við þátt" });
  }
});

// Eyða þætti úr Watchlist
router.delete("/:showId", verifyToken, async (req, res) => {
  const { showId } = req.params;
  try {
    await prisma.watchlist.deleteMany({
      where: {
        userId: req.user.id,
        showId: Number(showId)
      }
    });
    res.json({ message: "Þætti eytt úr Watchlist!" });
  } catch (error) {
    res.status(400).json({ error: "Ekki tókst að eyða þætti" });
  }
});

export default router;
