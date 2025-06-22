import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleWare(req:Request, res:Response, next:NextFunction) {
    const token = req.headers['authorization'];
    if(!token) {
        res.status(401).json({message:"Unauthorized"})
        return;
    }
    const decode = jwt.verify(token, JWT_PUBLIC_KEY)
    console.log(decode);
    if(!decode) {
        res.status(401).json({message:"Unauthorized"})
        return;
    }
    req.userId = decode.sub as string;
    next();
}