import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { authentication } from "../helper/authentication.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//.env
const ACCESS_TOKEN_SECRET = "123123";
const REFRESH_TOKEN_SECRET = "321321";

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email ou password não fornecidas." });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          hashedPassword: true,
          salt: true,
        },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Credenciais de acesso inválidas" });
      }

      const { salt, hashedPassword } = user;
      const hashedInputPassword = authentication(salt, password);

      if (hashedInputPassword !== hashedPassword) {
        return res
          .status(401)
          .json({ message: "Credenciais de acesso inválidas." });
      }

      // Generate Access and Refresh Tokens
      const accessToken = jwt.sign(
        {
          userId: user.userId,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.userId },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );
      // Set the new refresh token as an HttpOnly cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken,
        user: {
          userId: user.userId,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async refresh(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      asyncHandler(async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const user = await prisma.user.findUnique({
          where: { userId: decoded.userId },
          select: {
            userId: true,
          },
        });

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            userId: user.userId,
          },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({
          accessToken,
          user: {
            userId: user.userId,
          },
        });
      })
    );
  }

  async logout(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
  }
}

export default new AuthController();
