//DELETE FUNCTION TESTS
const deleteFunction = require('./index');
const sqlite3 = require('sqlite3');
import { describe, test, expect } from "vitest";

describe('deleteFunction tests', () => {
    test('should delete a row', async() => {
        const db = await new sqlite3.Database(':memory:');

        await new Promise((resolve) => {
            db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, age INTEGER)", (err) => {
                if(err) throw err;
                resolve(void 0);
            });
        });

        await new Promise((resolve) => {

            db.run("INSERT INTO users (name, age) VALUES ('John', 20)", (err) => {
                if(err) throw err;
                resolve(void 0);
            });
        });

        const deleteNum = await deleteFunction(db, {table: "users", where: {name: "John"}, logQuery: false});
        expect(deleteNum).toBe(1);

        db.close();
    });
});