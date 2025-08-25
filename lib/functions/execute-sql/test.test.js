//EXECUTE SQL FUNCTION TESTS

const executeSQL = require("./index");
const sqlite3 = require("sqlite3")
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

describe("executeSQL function tests:", () =>
{
    test("proof a statmens:", async () =>
    {
        const db = new sqlite3.Database(":memory:");

        db.once("trace", (sql) =>
        {
            expect(sql).toBe(query1);
        })
        await executeSQL.justRun(db, { query: query1, logQuery: false });

        db.close();
    })

    test("proof a execute with parameters:", async () =>
    {
        const db = new sqlite3.Database(":memory:");

        await executeSQL.justRun(db, { query: query1, logQuery: false });

        db.once("trace", (sql) =>
        {
            expect(sql).toBe(query2.replace("@name", "'John'").replace("@age", "20"));
        });

        await executeSQL.justRun(db, { query: query2, parameters: { name: "John", age: 20 }, logQuery: false });
        
        db.once("trace", (sql) =>
        {
            expect(sql).toBe(query2.replace("@name", "'Jane'").replace("@age", "21"));
        })

        await executeSQL.justRun(db, { query: query2, parameters: { name: "Jane", age: 21 }, logQuery: false });

        db.close();
    });

    test("proof a select execute:", async () =>
    {
        const db = new sqlite3.Database(":memory:");

        await executeSQL.justRun(db, { query: query1, logQuery: false });

        await executeSQL.justRun(db, { query: query2, parameters: { name: "John", age: 20 }, logQuery: false });
        await executeSQL.justRun(db, { query: query2, parameters: { name: "Jane", age: 20 }, logQuery: false });

        const rows = await executeSQL.select(db, { query: query3, parameters : { name: "John" },logQuery: false });

        expect(rows).toEqual([{ name: "John", age: 20 }]);

        const rows2 = await executeSQL.select.rows(db, { query: query3, parameters : { name: "Jane" },logQuery: false });
        expect(rows2).toEqual([{ name: "Jane", age: 20 }]);

        const row = await executeSQL.select.row(db, { query: query3, parameters : { name: "John" },logQuery: false });
        expect(row).toEqual({ name: "John", age: 20 });

        const column = await executeSQL.select.column(db, { query: query3, parameters : { name: "John" },logQuery: false });
        expect(column).toEqual(["John"]);

        const celd = await executeSQL.select.celd(db, { query: query3, parameters : { name: "John" },logQuery: false });
        expect(celd).toBe("John");

        db.close();
    })

    test("proof insert, update and delete statement", async() =>
    {
        const db = new sqlite3.Database(":memory:");

        await executeSQL.justRun(db, { query: query1, logQuery: false });

        const lastInsertRowid = await executeSQL.insert(db, { query: query2, parameters: { name: "John", age: 20 }, logQuery: false });
        expect(lastInsertRowid).toBe(1);

        const lastInsertRowid2 = await executeSQL.insert(db, { query: query2, parameters: { name: "Jane", age: 20 }, logQuery: false });
        expect(lastInsertRowid2).toBe(2);


        const changes = await executeSQL.update(db, { query: query4, parameters: { newName: "Jessie", ageCondition: 20 }, logQuery: false });
        expect(changes).toBe(2);

        const deleteNum = await executeSQL.delete(db, { query: query5, logQuery: false });
        expect(deleteNum).toBe(2);

        db.close();
    });
});