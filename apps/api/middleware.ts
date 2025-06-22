import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleWare(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized - Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "Unauthorized - No token found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, {
      algorithms: ["RS256"]
    }) as JwtPayload;

    req.userId = decoded.sub as string;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}
