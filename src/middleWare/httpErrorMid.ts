import { ErrorRequestHandler } from "express";
import { HttpError } from "../error/httpError";

export const HttpErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if(error instanceof HttpError){
        res.status(error.status).json({message: error.message})
    } else if (error instanceof Error) {
        res.status(500).json(error.message)
    } else {
        res.status(500).json(error.message)
    }
}