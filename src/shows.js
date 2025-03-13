import express from "express";
import { PrismaClient } from "@prisma/client";
import fileUpload from "express-fileupload";


const router = express.Router();
const prisma = new PrismaClient();

// 📌 Ná í alla þætti (með möguleika á genre filter)
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    let shows = category
      ? await prisma.show.findMany({ where: { category } })
      : await prisma.show.findMany();

    if (!shows.length) {
      return res.status(404).json({ error: "Engir þættir fundust" });
    }

    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: "Villa við að sækja þætti" });
  }
});
// 🔹 Bæta við nýjum þætti
router.post("/", async (req, res) => {
    const { title, platform, seasons, episodes, status, rating } = req.body;
  
    try {
      const newShow = await prisma.show.create({
        data: { title, platform, seasons, episodes, status, rating },
      });
      res.status(201).json(newShow);
    } catch (error) {
      console.error("Villa við að bæta við þátt:", error);
      res.status(400).json({ error: "Villa við að bæta við þátt" });
    }
  });

// 📌 Ná í stakan þátt
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const show = await prisma.show.findUnique({ where: { id: Number(id) } });
    if (!show) return res.status(404).json({ error: "Þáttur fannst ekki" });

    res.json(show);
  } catch (error) {
    res.status(500).json({ error: "Villa við að sækja þátt" });
  }
});

// 🔹 Uppfæra þátt eftir ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, platform, seasons, episodes, status, rating } = req.body;
  
    try {
      const updatedShow = await prisma.show.update({
        where: { id: Number(id) },
        data: { title, platform, seasons, episodes, status, rating }
      });
  
      res.json(updatedShow);
    } catch (error) {
      console.error("Villa við að uppfæra þátt:", error);
      res.status(400).json({ error: "Villa við að uppfæra þátt" });
    }
  });

  // 🔹 Eyða þætti eftir ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.show.delete({
        where: { id: Number(id) }
      });
  
      res.json({ message: "Þættinum hefur verið eytt" });
    } catch (error) {
      console.error("Villa við að eyða þætti:", error);
      res.status(400).json({ error: "Villa við að eyða þætti" });
    }
  });
  

export default router;
