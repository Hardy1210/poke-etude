import express, {type Express} from "express";

//logger pino
import {captureRouter, pokedexRouter, wildRouter} from "./router.js";
import {errorHandler, loggerMiddleware} from "./middlewares.js";

export const app: Express = express();

//logger pino
app.use(loggerMiddleware)

app.get("/wild", wildRouter)
app.post('/capture/:id', captureRouter)
app.get("/pokedex", pokedexRouter);

app.use(errorHandler);

