const { createServer } = require('node:http');
const { randomInt } = require('node:crypto');

const hostname = '127.0.0.1';
const port = 3000;
const captured = [];
const server = createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/hello') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }

    if (req.method === 'GET' && req.url === '/wild') {
        const id = randomInt(1,1025);
        const getpoke = await fetch('https://pokeapi.co/api/v2/pokemon/'+id);
        const data = await getpoke.json();

        const randomPoke = {
                            "pokemon": {
                                "id": data.id,
                                "name": data.name,
                                // "sprite": data.,
                                "types": data.types,
                                "stats": data.stats
                            },
                            // "captureRate": 190
                            };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(randomPoke));
    }

    if (req.method === 'POST' && req.url.startsWith('/capture/')) {
        const luck = randomInt(1,100);
        const captureRate = randomInt(1,100);
        const id = req.url.replace("/capture/", "");
            res.setHeader('Content-Type', 'application/json');

        if (Number.isInteger(Number(id))) {
            res.statusCode = 200;
            if (luck >= captureRate){
                res.end(JSON.stringify("capture successful"));
            } else{
            res.end(JSON.stringify("capture missed"));}
        } else {
            res.statusCode = 400;
            res.end(JSON.stringify("Invalid Pokémon ID"));
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});