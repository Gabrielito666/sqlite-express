//TABLE CLASS TESTS
const DB = require("../db");
const Table = require(".");

import { describe, expect, test, afterAll } from "vitest";
const path = require("path");
const {randomBytes} = require("crypto");
const fs = require("fs");


/**@type {string[]}*/
const testPaths = [];

afterAll(() =>
{
	testPaths.forEach(p => fs.unlinkSync(p));
});


const getTestPath = () =>
{
	const p = path.resolve(__dirname, `testDB-${randomBytes(10).toString("hex")}.db`);
	testPaths.push(p);
	return p;
};

describe("Test for main lib class", () =>
{
	test("General test",async()=>
	{
		const testPath = getTestPath();
		const db = new DB({ route: testPath, logQuery: false });

        const table = new Table("users", db);

        //creamos la tabla con el sql
		await db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" } });
		
		await table.insert({ row: { name: "John", age: 28 } });

		expect(await table.count()).toBe(1);

        //@ts-ignore
		await table.update({ update: { age : x => (x+1) } });

		expect(await table.count({ where: ["age", "=", 28] })).toBe(0);
		expect(await table.count({ where: ["age", "=", 29] })).toBe(1);
		
		await table.delete();

		expect(await table.count()).toBe(0);

		await db.close();
	});
});
