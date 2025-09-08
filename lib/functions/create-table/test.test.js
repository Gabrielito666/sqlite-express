//CREATE TABLE TESTS

const createTable = require('./index');
const sqlite3 = require('sqlite3');
import { describe, test, expect } from "vitest";

describe('createTable tests', () => {
    test('should create a table', async() => {
        const db = await new sqlite3.Database(':memory:');
        
        const sqliteExpressDBMock = {};

        db.once("trace", (sql) =>
        {
            expect(sql).toBe("CREATE TABLE IF NOT EXISTS users (name TEXT, age INTEGER)");
            db.close();
        })

        //@ts-ignore
        const table = await createTable([db, sqliteExpressDBMock], {
            tableName: "users",
            columns: { name: "TEXT", age: "INTEGER"},
            logQuery: false
        });
        expect(table).toBeDefined();        
    });
});