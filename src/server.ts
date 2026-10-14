import { createServer } from 'node:http';
import { randomInt } from 'node:crypto';
import {v4 as uuidv4} from 'uuid';
import PokemonService from "./services/pokeApiService.js";

const capturedHistory: number[] = [];
let lastEncounter = 0;
const pokemonService = new PokemonService();
export const server = createServer(async (req, res) => {
    const url = req.url ?? '';

    if (req.method === 'GET' && url === '/wild') {
        const randomId = randomInt(1,1025);
        lastEncounter = randomId;
        const randomPoke = await pokemonService.callPoke(randomId);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(randomPoke));
        return;
    }

    if (req.method === 'POST' && url.startsWith('/capture/')) {
        const luck = randomInt(1,100);
        const captureRate = randomInt(1,100);
        const id = url.replace("/capture/", "");
        res.setHeader('Content-Type', 'application/json');

        if (Number(id) !== lastEncounter){
            res.statusCode = 400;
            res.end(JSON.stringify("This Pokémon was not the last encounter."));
            return;
        }

        if (Number.isInteger(Number(id))) {
            res.statusCode = 200;
            if (luck >= captureRate){
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
                const resultat = { "success": false, "message": "Oh non ! Le Pokémon s'est échappé !" }
                res.statusCode = 200;
                res.end(JSON.stringify(resultat));
                return;
            }
        }
    }

    if (req.method === "GET" && url === "/pokedex") {
        res.setHeader('Content-Type', 'application/json');
        const resultat: any[] = [];

        for (const id of capturedHistory) {
            resultat.push(await pokemonService.callPoke(Number(id)));
        }

        res.statusCode = 200;
        res.end(JSON.stringify(resultat));
        return;
    }

    if (req.method === "GET" && url.startsWith('/pokedex/')) {
        res.setHeader('Content-Type', 'application/json');
    }
});
