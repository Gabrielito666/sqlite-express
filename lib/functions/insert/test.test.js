// INSERT FUNCTION TESTS

import { describe, test, expect } from "vitest";

const sqlite3 = require('sqlite3').verbose();
const insert = require('./index');

/*@type {() => Promise<import("sqlite3").Database>}*/
const createTempDB = ()=> new Promise((resolve) =>
{
	const db = new sqlite3.Database(":memory:");
	db.run(
		"CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, city TEXT)",
		{},
		() => resolve(db)
	)
});

describe('insert function tests', () =>
{
	test("should insert a single row:", async() =>
	{
		const db = await createTempDB();
	
	        const eventPromise = new Promise((resolve) => {
	            	db.once("trace", (sql) => {
              		  	expect(sql).toBe("INSERT INTO users(name, age, city) VALUES('John', 27, 'newyork')");
                		resolve(true);
            		});
        	});
 	

		const rowId1 = await insert(db,
		{
			table: "users",
			row: { name: "John", age: 27, city: "newyork" },
			logQuery: false
		});
		expect(rowId1).toBe(1);
		
		const rowId2 = await insert(db,
		{
			table: "users",
			row: { name: "John", age: 27, city: "newyork" },
			logQuery: false
		});
		expect(rowId2).toBe(2);

		await eventPromise;
		db.close();
	});
	test("should insert multiple rows:", async() =>
	{
		const db = await createTempDB();
	
	        const eventPromise = new Promise((resolve) => {
	            	db.once("trace", (sql) => {
              		  	expect(sql).toBe("INSERT INTO users(name, age, city) VALUES('John', 27, 'newyork'), ('Paul', 32, 'liverpool')");
                		resolve(true);
            		});
        	});
 	

		const rowId1 = await insert(db,
		{
			table: "users",
			row: [
				{ name: "John", age: 27, city: "newyork" },
				{ name: "Paul", age: 32, city: "liverpool" }
			],
			logQuery: false
		});
		expect(rowId1).toBe(2);
		
		await eventPromise;
		db.close();
	});

});
