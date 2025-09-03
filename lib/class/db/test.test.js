// DB CLASS TESTS:
import { describe, expect, test, afterAll } from "vitest";
const DB = require("./index");
const path = require("path");
const {randomBytes} = require("crypto");
const fs = require("fs");
const Table = require("../table");

const getTestPath = () => path.resolve(__dirname, `testDB-${randomBytes(10).toString("hex")}.db`);

/**@type {string[]}*/
const testPaths = [];

afterAll(() =>
{
	testPaths.forEach(p => fs.unlinkSync(p));
});

describe("DB class tests", () =>
{
	test("constructor test:", async() =>
	{
		const testPath = getTestPath();
		testPaths.push(testPath);

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
	});
	test("scopes implement tests:", async() =>
	{
		const testPath = getTestPath();
		testPaths.push(testPath);

		const db = new DB({ route: testPath, logQuery: false });
		
		const table = db.getTable("users");
		const initScope = db.createScope();

		const insertPromise = db.insert({ table, row: [{ name: "John", age: 27 }, { name: "Paul", age: 28 }] });

		db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" }, scope: initScope });

		initScope.close();
		await insertPromise;

		const names = await db.select.column({ table, select: "name" });

		expect(names).toEqual(["John", "Paul"]);

		db.close();
	});
	test("parallel scopes:", async() =>
	{
		const testPath = getTestPath();
		testPaths.push(testPath);

		const db = new DB({ route: testPath, logQuery: false });
		
		const table = db.getTable("users");

		const initScope = db.createScope();
		const insessionsScope = db.createScope();
		const deletionsScope = db.createScope();

		const deletionsPromise = new Promise((resolve, reject) =>
		{
			/**@type {Promise<any>[]}*/
			const deletePromises = [];
			for(let i = 0; i < 100; i++)
			{
				const deletePromise = db.delete({
					table,
					where: { id: i },
					scope: deletionsScope
				});
				deletePromises.push(deletePromise);
			}
			Promise.all(deletePromises).then(resolve).catch(reject);
		});

		const inserssionsPromise = new Promise((resolve, reject) =>
		{
			/**@type {Promise<any>[]}*/
			const insertPromises = [];
			for(let i = 0; i < 100; i++)
			{
				const insertPromise = db.insert({
					table,
					row: { id: i, name: "Paul" },
					scope: insessionsScope,
				});
				insertPromises.push(insertPromise);
			}
			Promise.all(insertPromises).then(resolve).catch(reject);
		});

		db.createTable({
			tableName: "users",
			columns: { id: "INTEGER",name: "TEXT", age: "INTEGER" },
			scope: initScope
		});

		deletionsScope.close();
		insessionsScope.close();
		initScope.close();

		const changesArray = await deletionsPromise;
		await inserssionsPromise;
		expect(changesArray).toEqual(Array(100).fill(1));

		const finalCount = await db.count({ table });

		expect(finalCount).toBe(0);

		db.close();
	});
});