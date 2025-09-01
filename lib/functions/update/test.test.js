//UPDATE FUNCTION TESTS

import { describe, test, expect } from "vitest";

const sqlite3 = require('sqlite3').verbose();
const update = require('./index');

const query1 = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    )
`

const createDB = () => new Promise((resolve) =>
{
	const db = new sqlite3.Database(":memory:");
	db.serialize(()=>
	{
		db.run(query1, {});
		db.run("INSERT INTO users (name, age) VALUES ('John', 27)", []);
		db.run("INSERT INTO users (name, age) VALUES ('Paul', 27)", []);
		db.run("INSERT INTO users (name, age) VALUES ('George', 28)", []);
		db.run("INSERT INTO users (name, age) VALUES ('Ringo', 29)", [], ()=>
		{
			resolve(db);
		});
	});
});


describe("update function tests", ()=>
{
	test("should update rows:", async()=>
	{
		const db = await createDB();

		
		const changes1 = await update(db,
		{
			table:
			"users",
			update: { age: (a) => (a+1) },
			logQuery: false
		});

		expect(changes1).toBe(4);

		const changes2 = await update(db, {table: "users", update: { age: 30 }, where: { age: 28 }, logQuery: false });

		expect(changes2).toBe(2);

		db.close();
	});
});
