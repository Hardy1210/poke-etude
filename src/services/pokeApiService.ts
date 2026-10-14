class PokemonService {

    public async callPoke(id: number) {
        const getpoke = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
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
}
export default PokemonService;
