//DECLARE SQL FUNCTION TESTS

const declareSQL = require("./index");
const sqlite3 = require("sqlite3");
import { describe, test, expect } from "vitest";

const query1 = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    )
`
const query2 = `
    INSERT INTO users (name, age) VALUES (@name, @age)
`
const query3 = `
    SELECT name, age FROM users WHERE name = @name
`
const query4 = `
    UPDATE users SET name = @newName WHERE (age = @ageCondition)
`
const query5 = `
    DELETE FROM users
`

describe("declareSQL function tests:", () =>
{
	test("proof a statmens:", async () =>
    	{
        	const db = new sqlite3.Database(":memory:");
        	const statement = await declareSQL(db, { query: query1, logQuery: false });

		const eventPromise = new Promise(resolve =>
		{
			db.once("trace", (sql) =>
			{
				expect(sql).toBe(query1);
				resolve(void 0);
			});
		});

		await statement();

		await eventPromise;
		await statement.finalize().catch(console.error);
		    db.close((err) => {if(err)console.log(err)});
	})

	test("proof a statmens with parameters:", async () =>
    	{
		const db = new sqlite3.Database(":memory:");

		await new Promise((resolve) => {
		    db.run(query1, (err) =>
		    {
			if(err) throw err;
			resolve(void 0);
		    });
		});

		const statement = await declareSQL(db, { query: query2, logQuery: false });
		
		const eventPromise1 = new Promise(resolve =>
		{
			db.once("trace", (sql) =>
			{
				expect(sql).toBe(query2.replace("@name", "'John'").replace("@age", "20"));
				resolve(void 0);
			})
		});

		await statement({ name: "John", age: 20 });

		await eventPromise1;

		const eventPromise2 = new Promise(resolve =>
		{
			db.once("trace", (sql) =>
			{
				expect(sql).toBe(query2.replace("@name", "'Jane'").replace("@age", "21"));
				resolve(void 0);
			})
		});

		await statement({ "@name": "Jane", "@age": 21 });

		await eventPromise2;

		await statement.finalize();
		
		db.close();
    	});

	test("proof a select statement:", async () =>
    	{
		const db = new sqlite3.Database(":memory:");

		await new Promise((resolve) => {

		    db.run(query1, (err) =>
		    {
			if(err) throw err;
			resolve(void 0);
		    });
		});

		await new Promise((resolve) => {
		    let count = 0;
		    db.run(query2, { "@name": "John", "@age": 20 }, (err) =>
		    {
			if(err) throw err;
			count++;
			if(count === 2) resolve(void 0);
		    });
		    db.run(query2, { "@name": "Jane", "@age": 20 }, (err) =>
		    {
			if(err) throw err;
			count++;
			if(count === 2) resolve(void 0);
		    });
		});

		const statement = await declareSQL(db, { query: query3, logQuery: false });

		const rows = await statement.select({ name: "John" });
		expect(rows).toEqual([{ name: "John", age: 20 }]);
		const rows2 = await statement.select.rows({ name: "Jane" });
		expect(rows2).toEqual([{ name: "Jane", age: 20 }]);

		const row = await statement.select.row({ name: "John" });
		expect(row).toEqual({ name: "John", age: 20 });

		const column = await statement.select.column({ name: "John" });
		expect(column).toEqual(["John"]);

		const celd = await statement.select.celd({ name : "John" });
		expect(celd).toBe("John");

		await statement.finalize();
		db.close();
    })

    test("proof insert, update and delete statement", async() =>
    {
        const db = new sqlite3.Database(":memory:");

        await new Promise((resolve) => {

            db.run(query1, (err) =>
            {
                if(err) throw err;
                resolve(void 0);
            });
        });

        const statment0 = await declareSQL(db, {query: query2, logQuery: false});

        const lastInsertRowid = await statment0.insert({ name: "John", age: 20 });
        expect(lastInsertRowid).toBe(1);

        const lastInsertRowid2 = await statment0.insert({ name: "Jane", age: 20 });
        expect(lastInsertRowid2).toBe(2);


        const statement1 = await declareSQL(db, { query: query4, logQuery: false });

        const changes = await statement1.update({ newName: "Jessie", ageCondition: 20 });
        expect(changes).toBe(2);

        const statment2 = await declareSQL(db, {query: query5, logQuery: false});

        const deleteNum = await statment2.delete();
        expect(deleteNum).toBe(2);

        await statment0.finalize();
        await statement1.finalize();
        await statment2.finalize();

        db.close();
    });
});
