import { AppError } from "@/common/domain/erros/app-erro";
import { NextFunction, Request, Response } from "express";

export function errorHandler (err: Error, req: Request, res: Response, _next: NextFunction): Response {
    // verifica se o erro é uma instacia da classe erro
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ 
            status: 'error', 
            message: err.message,    
        })       
    }

    console.error(err)

    return res.status(500).json({ stasus: 'error', message: 'Internal Server Error' })
}