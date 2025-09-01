//SELECT FUNCTION TESTS

import { describe, test, expect } from "vitest";

const sqlite3 = require('sqlite3').verbose();
const select = require('./index');

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

describe("select api tests", ()=>
{
	test("should select items in correct expected formats", async() =>
	{
		const db = await createDB();
		const result1 = await select(db, { table: "users", logQuery: false });

		expect(result1).toEqual([
			{ id: 1, name: 'John', age: 27 },
			{ id: 2, name: 'Paul', age: 27 },
		  	{ id: 3, name: 'George', age: 28 },
		  	{ id: 4, name: 'Ringo', age: 29 }
		]);
		
		const result2 = await select.rows(db, { table: "users", logQuery: false });

		expect(result2).toEqual([
			{ id: 1, name: 'John', age: 27 },
			{ id: 2, name: 'Paul', age: 27 },
		  	{ id: 3, name: 'George', age: 28 },
		  	{ id: 4, name: 'Ringo', age: 29 }
		]);

		const result3 = await select.row(db, { table: "users", logQuery: false });

		expect(result3).toEqual({ id: 1, name: 'John', age: 27 });

		const result4 = await select.column(db, { table: "users", logQuery: false });

		expect(result4).toEqual([1, 2, 3, 4]);

		const result5 = await select.celd(db, { table: "users", logQuery: false });

		expect(result5).toBe(1);

		const result6 = await select.rows(db, {table: "users", where: { age: 27 }, logQuery: false});

		expect(result6).toEqual([
			{ id: 1, name: 'John', age: 27 },
			{ id: 2, name: 'Paul', age: 27 }
		]);

		const result7 = await select.row(db, {table: "users", where: {age: 27}, logQuery: false})

		expect(result7).toEqual({ id: 1, name: 'John', age: 27 });

		db.close();
	});
});
