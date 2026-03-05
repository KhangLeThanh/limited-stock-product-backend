import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();
export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Required" });

  const user = await prisma.user.findUnique({ where: { id: username } });
  if (!user)
    return res.status(404).json({ message: "User not found. Please sign up." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = signToken(user.id);
  return res.json({ token, user });
});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Required" });

  const existing = await prisma.user.findUnique({ where: { id: username } });
  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { id: username, name: username, password: hashedPassword },
  });

  const token = signToken(user.id);
  return res.status(201).json({ token, user });
});

export default authRouter;
