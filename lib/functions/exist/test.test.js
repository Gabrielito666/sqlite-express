//EXIST FUNCTION TESTS

const sqlite3 = require('sqlite3').verbose();
const exist = require('./index');
import { describe, test, expect } from "vitest";

describe('exist function tests', () =>
{
	test("should confirm existence:", async() =>
	{
		const db = new sqlite3.Database(":memory:");
		await new Promise(resolve => db.run(
			"CREATE TABLE users (name TEXT, age INTEGER, city TEXT)",
			{},
			resolve
		));
		await new Promise(resolve => db.run(
			"INSERT INTO users(name, age, city) values(?, ?, ?)",
			["John", 27, "newyork"],
			resolve
		));
		const existence1 = await exist(db, { table: "users", where: {name: "John"}, logQuery: false});
		expect(existence1).toBe(true);

		const existence2 = await exist(db, { table: "users", where: { age: 28 }, logQuery: false});
		expect(existence2).toBe(false);

		const existence3 = await exist(db, { table: "users", where: { AND: [{name: "John"}, {age: 28}] }, logQuery: false });
		expect(existence3).toBe(false);

		const existence4 = await exist(db, { table: "users", where: { OR: [{name: "John"}, {age: 28}] }, logQuery: false });
		expect(existence4).toBe(true);

		const existence5 = await exist(db, { table: "users", where: ["name", "IN",["John", "Paul"]], logQuery: false });
		expect(existence5).toBe(true);

		db.close();
	});
});
