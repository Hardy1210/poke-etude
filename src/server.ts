const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;
const server = createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/hello') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }

    if (req.method === 'GET' && req.url === '/wild') {
        const getpoke = await fetch('https://pokeapi.co/api/v2/pokemon/6');
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

    if (req.method === 'POST' && req.url === '/capture') {
        const postpoke = await fetch('https://pokeapi.co/api/v2/pokemon/9');
        const data = await postpoke.json();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});