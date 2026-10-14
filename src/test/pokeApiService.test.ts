import {describe, it, expect, beforeEach, afterEach, vi} from "vitest";
import type { AddressInfo } from "node:net";
import PokemonService from "../services/pokeApiService.js";
const { randomIntMock } = vi.hoisted(() => ({
    randomIntMock: vi.fn<(min: number, max: number) => number>(),
}));


vi.mock("node:crypto", async (importOriginal) => {
    const actual = await importOriginal<typeof import("node:crypto")>();
    randomIntMock.mockImplementation((min, max) => actual.randomInt(min, max));
    return { ...actual, randomInt: randomIntMock };
});

import { server } from "../server.js";

describe("PokemonService.callPoke", () => {
    it("returns the requested pokemon", async () => {
        const sut = new PokemonService();

        const result = await sut.callPoke(25);

        expect(result.pokemon.id).toBe(25);
        expect(result.pokemon.name).toBe("pikachu");
        expect(result.pokemon.types[0].type.name).toBe("electric");
    });
});

describe("GET /wild", () => {
    let baseUrl: string;

    beforeEach(async () => {
        await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });

    afterEach(async () => {
        await new Promise<void>((resolve, reject) =>
            server.close((err) => (err ? reject(err) : resolve()))
        );
    });

    it("returns a pokemon with status 200", async () => {
        const response = await fetch(`${baseUrl}/wild`);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.pokemon.id).toBeTypeOf("number");
    });
});

describe("POST /capture/:id", () => {
    let baseUrl: string;

    beforeEach(async () => {
        await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
        const {port} = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });

    afterEach(async () => {
        await new Promise<void>((resolve, reject) =>
            server.close((err) => (err ? reject(err) : resolve()))
        );
    });

    it("returns 400 when the pokemon is not the last encounter", async () => {
        const wild = await fetch(`${baseUrl}/wild`);
        const {pokemon} = await wild.json();
        const otherId = pokemon.id + 1;

        const response = await fetch(`${baseUrl}/capture/${otherId}`, {method: "POST"});
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toBe("This Pokémon was not the last encounter.");
    });

    it("returns 201 and the captured pokemon when the capture succeeds", async () => {
        randomIntMock
            .mockReturnValueOnce(25)  // /wild → randomId
            .mockReturnValueOnce(80)  // /capture → luck
            .mockReturnValueOnce(10); // /capture → captureRate
        await fetch(`${baseUrl}/wild`);

        const response = await fetch(`${baseUrl}/capture/25`, {method: "POST"});
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body).toMatchObject({
            success: true,
            captured: {
                pokemonId: 25,
                name: "pikachu",
                nickname: "pikachu",
                uuid: expect.any(String),
                capturedAt: expect.any(String),
            },
        });
    })

    it('return 200 if pokemon escape', async () =>{
        randomIntMock
            .mockReturnValueOnce(25)  // /wild → randomId
            .mockReturnValueOnce(10)  // /capture → luck
            .mockReturnValueOnce(80); // /capture → captureRate
        await fetch(`${baseUrl}/wild`);

        const response = await fetch(`${baseUrl}/capture/25`, {method: "POST"});
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toMatchObject({"success": false, "message": "Oh non ! Le Pokémon s'est échappé !"})

    })
})
