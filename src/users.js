import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../psw/auth.js"; // Notum auth middleware

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = "leyndarmalstoken"; // Betra að geyma í .env

// 📌 Notendaskráning
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if ( !email || !password) {
    return res.status(400).json({ error: "Vantar notandanafn, netfang eða lykilorð" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.status(201).json({ message: "Notandi búinn til!", user: newUser.username });
  } catch (error) {
    res.status(400).json({ error: "Ekki tókst að búa til notanda" });
  }
});

// 📌 Notendainnskráning
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Vantar netfang eða lykilorð" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Rangt netfang eða lykilorð" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Innskráning tókst!", token });
  } catch (error) {
    res.status(500).json({ error: "Villa við innskráningu" });
  }
});

// 📌 Notandaprófíl (krefst auðkenningar)
router.get("/profile", verifyToken, async (req, res) => {
    console.log("🟢 Token decode result:", req.user); // 🔍 Debug
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, role: true } // ATH: username er ekki í `schema.prisma`
      });
  
      if (!user) {
        return res.status(404).json({ error: "Notandi fannst ekki" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("🔴 Villa í /users/profile:", error);
      res.status(500).json({ error: "Villa við að sækja notanda" });
    }
  });
  

export default router;
