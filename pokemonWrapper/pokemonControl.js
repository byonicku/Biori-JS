const fetch = require('node-fetch');
const PokemonDAO = require('./pokemonDAO.js');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const dbPath = 'cache.db';

class PokemonControl {
	constructor() {
		this.dao = new PokemonDAO(dbPath);
	}

	async getPokemon(name) {
		try {
			const cachedData = await this.dao.getCachedData(name);

			if (cachedData) {
				return cachedData;
			}
			else {
				const response = await (await fetch(`${BASE_URL}/${name}`)).json();
				await this.dao.cacheData(name, response);

				return response;
			}
		}
		catch (err) {
			console.error(err);
		}
	}
}

module.exports = PokemonControl;