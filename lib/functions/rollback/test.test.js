// ROLLBACK FUNCTION TESTS
import {describe, test, expect, vi} from "vitest";
const rollback = require("./index");
const sqlite3 = require("sqlite3");

/**@type {(db: sqlite3.Database) => Promise<boolean>}*/
const begin = (db) => new Promise((resolve, reject) =>
    {
        db.run("BEGIN DEFERRED TRANSACTION", [], (err) =>
        {
            if (err)reject(err);
            else resolve(true);
        });
    });
    
    /**@type {(stmt: sqlite3.Statement) => Promise<boolean>}*/
    const finalizeStmt = (stmt) => new Promise((resolve, reject) => {
        stmt.finalize((err) =>
        {
            if (err) reject(err);
            else resolve(true);
        })
    });

describe("commit function", () =>
{
    test("should be a function", () => {
        expect(rollback).toBeInstanceOf(Function);
    });

    test("should return a promise", async() => {
        const db = new sqlite3.Database(":memory:");
        const stmt = db.prepare("ROLLBACK");

        await begin(db);
        const commitPromise = rollback(stmt);
        expect(commitPromise).toBeInstanceOf(Promise);
        await commitPromise;
        await finalizeStmt(stmt);
        db.close();
    });

    test("should use default logQuery: true", async() => {
        const db = new sqlite3.Database(":memory:");
        const stmt = db.prepare("ROLLBACK");

        await begin(db);
        const consoleSpy = vi.spyOn(console, "log");
        await rollback(stmt, {});

        expect(consoleSpy).toHaveBeenCalledWith("the query generated is:\nROLLBACK\n\n");

        await begin(db);
        await rollback(stmt);
        expect(consoleSpy).toHaveBeenCalledWith("the query generated is:\nROLLBACK\n\n");

        await finalizeStmt(stmt);
        db.close();
    });

    test("should execute the statement with the given args", async() => {
        const db = new sqlite3.Database(":memory:");
        const stmt = db.prepare("ROLLBACK");
        await begin(db);

        const eventPromise = new Promise((resolve, reject) => {
            db.once("trace", (sql) => {
                expect(sql).toBe("ROLLBACK");
                resolve(true);
            });
        });
        
        await rollback(stmt, {logQuery:false});

        await eventPromise;

        await finalizeStmt(stmt);
        db.close();
    });
});
