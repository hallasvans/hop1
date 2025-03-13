import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../psw/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Ná í allar umsagnir um tiltekinn þátt
router.get("/:showId", async (req, res) => {
  const { showId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { showId: Number(showId) },
      include: { user: { select: { email: true } } } // Sýna netfang notanda sem gaf umsögn
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Villa við að sækja umsagnir" });
  }
});

// 📌 Bæta við umsögn fyrir þátt
router.post("/", verifyToken, async (req, res) => {
  const { showId, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: req.user.id,
        showId
      }
    });
    res.status(201).json({ message: "Umsögn skráð!", review });
  } catch (error) {
    res.status(400).json({ error: "Ekki tókst að skrá umsögn" });
  }
});

// 📌 Eyða umsögn (bara eigandi eða admin má eyða)
router.delete("/:reviewId", verifyToken, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) }
    });

    if (!review) return res.status(404).json({ error: "Umsögn fannst ekki" });

    // Bara eigandi eða admin má eyða umsögn
    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Þú hefur ekki leyfi til að eyða þessari umsögn" });
    }

    await prisma.review.delete({ where: { id: Number(reviewId) } });
    res.json({ message: "Umsögn hefur verið eytt" });
  } catch (error) {
    res.status(400).json({ error: "Ekki tókst að eyða umsögn" });
  }
});

export default router;
