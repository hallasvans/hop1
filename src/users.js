import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../psw/auth.js";

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = "leyndarmalstoken";

// Notendaskráning
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    console.log("🔍 Request body:", req.body);
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Vantar notandanafn, netfang eða lykilorð" });
    }
  
    try {
      // Athuga hvort notandi sé þegar til
      const existingUser = await prisma.user.findUnique({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({ error: "Notandi með þetta netfang er þegar til" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword }
      });
  
      res.status(201).json({ message: "Notandi búinn til!", user: newUser.username });
  
    } catch (error) {
      console.error("Villa við að búa til notanda:", error);
      res.status(500).json({ error: "Ekki tókst að búa til notanda" });
    }
  });
  
  

// Notendainnskráning
router.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
  
    console.log("Innskráningar beiðni:", email, password);
  
    if (!email || !password) {
      return res.status(400).json({ error: "Vantar netfang eða lykilorð" });
    }
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      console.log("Fann notanda í DB:", user);  
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("Rangt netfang eða lykilorð"); 
        return res.status(401).json({ error: "Rangt netfang eða lykilorð" });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
  
      res.json({ message: "Innskráning tókst!", token });
    } catch (error) {
      console.error("Villa við innskráningu:", error);
      res.status(500).json({ error: "Villa við innskráningu" });
    }
  });
  

// Notandaprofile (krefst auðkenningar)
router.get("/profile", verifyToken, async (req, res) => {
    try {
      
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, email: true, role: true }
      });
  
      if (!user) {
        return res.status(404).json({ error: "Notandi fannst ekki" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("Villa við að sækja notanda:", error);
      res.status(500).json({ error: "Villa við að sækja notanda" });
    }
  });
  

export default router;
