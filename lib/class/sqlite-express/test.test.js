// Sqlite Express class tests:
import { describe, expect, test, afterAll } from "vitest";
const SqliteExpress = require("./index");
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
		const sqliteExpress = new SqliteExpress({ logQuery: false });

		const db = sqliteExpress.createDB({ route: testPath });

		expect(fs.existsSync(testPath)).toBe(true);

		const table = await db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" } });
						
		await table.insert({ row: { name: "John", age: 28 } });

		expect(await table.count()).toBe(1);

		//@ts-ignore
		await sqliteExpress.update({ db, table, update: { age : x => (x+1) } });

		expect(await table.count({ where: ["age", "=", 28] })).toBe(0);
		expect(await table.count({ where: ["age", "=", 29] })).toBe(1);
		
		await sqliteExpress.delete({ db, table });

		expect(await table.count()).toBe(0);

		await db.close();
	});
});
