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

  let user = await prisma.user.findUnique({ where: { id: username } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { id: username, name: username, password: hashedPassword },
    });
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });
  }

  const token = signToken(user.id);
  return res.json({ token, user });
});
export default authRouter;
