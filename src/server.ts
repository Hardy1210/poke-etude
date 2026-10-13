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

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});