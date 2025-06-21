import type { Request, Response, NextFunction } from "express";

export function authMiddleWare(req:Request, res:Response, next:NextFunction) {
    const hesders = req.headers['authorization'];
    if(!hesders) {
        res.status(401).json({message:"Unauthorized"})
        return;
    }
    req.userId = "1";
    next();
}