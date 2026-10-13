const { createServer } = require('node:http');
const { randomInt } = require('node:crypto');
import {v4 as uuidv4} from 'uuid';

const hostname = '127.0.0.1';
const port = 3000;
const capturedHistory: number[] = [];
const team
let lastEncounter = 0;
const server = createServer(async (req, res) => {

    async function callPoke(id : number){
        const getpoke = await fetch('https://pokeapi.co/api/v2/pokemon/'+id);
            const data = await getpoke.json();

            const poke = {
                            "pokemon": {
                                "id": data.id,
                                "name": data.name,
                                // "sprite": data.,
                                "types": data.types,
                                "stats": data.stats
                            },
                            // "captureRate": 190
                        };
        return poke;
    }

    if (req.method === 'GET' && req.url === '/hello') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }

    if (req.method === 'GET' && req.url === '/wild') {
        const randomId = randomInt(1,1025);
        lastEncounter = randomId;
        const randomPoke = await callPoke(randomId)

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(randomPoke));
    }

    if (req.method === 'POST' && req.url.startsWith('/capture/')) {
        const luck = randomInt(1,100);
        const captureRate = randomInt(1,100);
        const id = req.url.replace("/capture/", "");
        res.setHeader('Content-Type', 'application/json');

        if (id != lastEncounter){
            res.statusCode = 400;
                res.end(JSON.stringify("This Pokémon was not the last encounter."))
        }

        if (Number.isInteger(Number(id))) {
            res.statusCode = 200;
            if (luck >= captureRate){                
                if (!capturedHistory.includes(Number(id))) {
                    capturedHistory.unshift(Number(id));
                }
                res.statusCode = 201;
                const curPoke = await callPoke(lastEncounter);
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
            } else{
            const resultat = { "success": false, "message": "Oh non ! Le Pokémon s'est échappé !" }
            res.end(JSON.stringify(resultat));}
        } else {
            res.statusCode = 400;
            res.end(JSON.stringify("Invalid Pokémon ID"));
        }
    }

    if (req.method === "GET" && req.url === "/pokedex") {
        res.setHeader('Content-Type', 'application/json');
        const resultat: any[] = [];

        for (const id of capturedHistory) {
            resultat.push(await callPoke(Number(id)));
        }

        res.statusCode = 200;
        res.end(JSON.stringify(resultat));
    }

    if (req.method === "GET" && req.url.startsWith('/pokedex/')) {
        res.setHeader('Content-Type', 'application/json');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

