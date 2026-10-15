import express, {type Express} from "express";

//logger pino
import {captureRouter, pokedexRouter, wildRouter} from "./router.js";
import {loggerMiddleware} from "./middlewares.js";

export const app: Express = express();

//logger pino
app.use(loggerMiddleware)

app.get("/wild", wildRouter)
app.post('/capture/:id', captureRouter)
app.get("/pokedex", pokedexRouter);

app.all('/capture/:id', (req, res) => {
    res.status(405).json({error: "Unautorized method"})
})

app.all("/wild", (req, res) => {
    res.status(405).json({error: 'Unautorized method'});
})
app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
})