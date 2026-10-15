import {randomInt} from "node:crypto";
import {type Request, type Response} from "express";
import PokemonService from "./services/pokeApiService.js";
import {v4 as uuidv4} from 'uuid';

const pokemonService = new PokemonService();
const capturedHistory: number[] = [];
let lastEncounter = 0;

export const wildRouter = async function (req: Request, res: Response) {
    const randomId = randomInt(1, 1025);
    lastEncounter = randomId;
    const randomPoke = await pokemonService.callPoke(randomId);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(randomPoke));
    return;
}

export const captureRouter = async function (req: Request, res: Response) {
    const id = req.params.id;
    const luck = randomInt(1, 100);
    const captureRate = randomInt(1, 100);
    res.setHeader('Content-Type', 'application/json');

    if (!(Number(id) || Number(id) > 1025) || (Number(id) !== lastEncounter)) {
        res.status(400).json("invalide id");
    } else {
        res.statusCode = 200;
        if (luck >= captureRate) {
            if (!capturedHistory.includes(Number(id))) {
                capturedHistory.unshift(Number(id));
            }
            res.statusCode = 201;
            const curPoke = await pokemonService.callPoke(lastEncounter);
            const resultat = {
                "success": true,
                "captured": {
                    "uuid": uuidv4(),
                    "pokemonId": lastEncounter,
                    "name": curPoke.pokemon.name,
                    "nickname": curPoke.pokemon.name,
                    "capturedAt": new Date().toISOString()
                }
            }
            res.end(JSON.stringify(resultat));
            return;
        } else {
            const resultat = {"success": false, "message": "Oh non ! Le Pokémon s'est échappé !"}
            res.statusCode = 200;
            res.end(JSON.stringify(resultat));
            return;
        }
    }
}

export const pokedexRouter = async function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    const resultat: any[] = [];

    for (const id of capturedHistory) {
        resultat.push(await pokemonService.callPoke(Number(id)));
    }

    res.statusCode = 200;
    res.end(JSON.stringify(resultat));
    return;
}