// DB CLASS TESTS:
import { describe, expect, test, beforeEach, afterAll } from "vitest";
const DB = require("./index");
const path = require("path");
const {randomBytes} = require("crypto");
const fs = require("fs");
const Table = require("../table");

const getTestPath = () => path.resolve(__dirname, `testDB-${randomBytes(10).toString("hex")}.db`);

afterAll(() =>
{
	fs.readdirSync(__dirname).forEach(p => {if(path.extname(p) === "db") fs.rmSync(p)});
});

describe("DB class tests", () =>
{
	test("constructor test:", async() =>
	{
		const testPath = getTestPath();
		try
		{
			const db = new DB({ route: testPath, logQuery: false });

			expect(fs.existsSync(testPath)).toBe(true);

			const table = await db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" } });
			expect(table instanceof Table).toBe(true);

			await db.insert({ table: table, row: { name: "John", age: 27 } });
			await db.insert({ table, row: { name: "Paul", age: 27 } });

			const paul = await db.select.row({ table: table, where: { name: "Paul" } });

			expect(paul).toEqual({ name: "Paul", age: 27 });

			const changes = await db.update({ table, update: {age: (a=1) => (a+1)}, where: {name: "John"} });

			expect(changes).toBe(1);

			await db.close();
		}
		catch(err)
		{
			console.error(err);
		}
		finally
		{
			console.log("rmsynbc?")
			fs.rmSync(testPath);
		}
	});	
});
