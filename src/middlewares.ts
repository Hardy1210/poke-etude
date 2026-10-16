import {type NextFunction, type Request, type Response} from "express";
import pino from "pino";

const logger = pino(pino.destination("./app.log"))

export const loggerMiddleware = function (req: Request, res: Response, next: NextFunction) {
    res.on("finish",
        () => {
            logger.info({method: req.method, url: req.url, status: res.statusCode}, "request");
        })
    next()
}

export const errorHandler = function (req: Request, res: Response, next: NextFunction) {
    if (res.statusCode === 405) {
        res.json({error: 'Unautorized method'});
    }

    if (res.statusCode === 404) {
        res.json({error: "Route not found"});
    }

}