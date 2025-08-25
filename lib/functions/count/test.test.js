import {describe, test, expect, afterAll} from "vitest";
const count = require("./index");
const sqlite3 = require("sqlite3");

/**@type {(db: sqlite3.Database, query: string, values: any[]) => Promise<boolean>}*/
const run = (db, query, values) => new Promise((resolve, reject) => {
    db.run(query, values, (err) => {
        if(err) reject(err);
        resolve(true);
    });
});

/**@type {() => Promise<sqlite3.Database>}*/
const getProofDB = async() =>
{
    const db = new sqlite3.Database(":memory:");
    await run(db, "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", []);
    await run(db, "INSERT INTO users (name) VALUES (?)", ["John"]);
    await run(db, "INSERT INTO users (name) VALUES (?)", ["Jane"]);
    return db;
}

const dbPromise = getProofDB();

afterAll(() => {
    dbPromise.then(db => db.close());
});

describe("count function", () => {
    test("should execute a normal case of use", async() => {
        const db = await dbPromise;
        
        const countPromise = count(db, {table: "users", logQuery: true});

        expect(await countPromise).toBe(2);
    });
    
    test("should manage where argument", async() => {
        const db = await dbPromise;
        const countPromise = count(db, {table: "users", where: {name: "John"}, logQuery: false});
        expect(await countPromise).toBe(1);
        const countPromise2 = count(db, {table: "users", where: {name: "Jane"}, logQuery: false});
        expect(await countPromise2).toBe(1);
        const countPromise3 = count(db, {table: "users", where: { AND: [{name: "John"}, {name: "Jane"}]}, logQuery: false});
        expect(await countPromise3).toBe(0);
        const countPromise4 = count(db, {table: "users", where: { OR: [{name: "John"}, {name: "Jane"}]}, logQuery: false});
        expect(await countPromise4).toBe(2);
       
        const countPromise5 = count(db, {
            table: "users",
            where: { OR: [{name: "John"}, {name: "Jane"}]},
            logQuery: false
        });
        expect(await countPromise5).toBe(2);

        await Promise.all([countPromise, countPromise2, countPromise3, countPromise4]);
    });
});