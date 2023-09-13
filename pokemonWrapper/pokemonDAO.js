const sqlite3 = require('sqlite3').verbose();

class PokemonDAO {
	constructor(dbPath) {
		this.db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				console.error('Error connecting to the database:', err.message);
			}
			else {
				console.log('Connected to the database');
				this.initDatabase();
			}
		});
	}

	initDatabase() {
		this.db.run(`
            CREATE TABLE IF NOT EXISTS pokemon_cache (
                name TEXT PRIMARY KEY,
                data TEXT
            )
        `);
	}

	async getCachedData(name) {
		return new Promise((resolve, reject) => {
			this.db.get('SELECT data FROM pokemon_cache WHERE name = ?', [name], (err, row) => {
				if (err) {
					reject(err);
				}
				else if (row) {
					resolve(JSON.parse(row.data));
				}
				else {
					resolve(null);
				}
			});
		});
	}

	async cacheData(name, data) {
		return new Promise((resolve, reject) => {
			this.db.run('INSERT OR REPLACE INTO pokemon_cache (name, data) VALUES (?, ?)',
				[name, JSON.stringify(data)], (err) => {
					if (err) {
						reject(err);
					}
					else {
						resolve();
					}
				});
		});
	}
}

module.exports = PokemonDAO;