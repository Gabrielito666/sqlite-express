// BEGIN FUNCTION TESTS
import { describe, test, expect, vi } from "vitest";
const begin = require("./index");
const sqlite3 = require("sqlite3");

/**@type {(db: sqlite3.Database) => Promise<boolean>}*/
const commit = (db) => new Promise((resolve, reject) =>
{
    db.run("COMMIT", [], (err) =>
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

describe("begin-transaction", () => {

    test("should be a function with methods inside", ()=>
    {
        expect(begin).toBeInstanceOf(Function);
        expect(begin.transaction).toBeInstanceOf(Function);
        expect(begin.deferredTransaction).toBeInstanceOf(Function);
        expect(begin.immediateTransaction).toBeInstanceOf(Function);
        expect(begin.exclusiveTransaction).toBeInstanceOf(Function);
    });

    test("should return a promise", async() =>
    {
        const db = new sqlite3.Database(":memory:");
        const stmt = db.prepare("BEGIN TRANSACTION");
        const beginPromise = begin(stmt, {logQuery:false});
        expect(beginPromise).toBeInstanceOf(Promise);
        expect(beginPromise).resolves.toBe(true);
        await beginPromise;
        await commit(db);
        await finalizeStmt(stmt);
        db.close();
    });

    test("sould accept default logQuery: true", async() =>
    {
        const db = new sqlite3.Database(":memory:");

        const stmt = db.prepare("BEGIN TRANSACTION");
        
        const consoleSpy = vi.spyOn(console, "log");

        const deferredLog = "the query generated is:\nBEGIN DEFERRED TRANSACTION\n\n";
        const immediateLog = "the query generated is:\nBEGIN IMMEDIATE TRANSACTION\n\n";
        const exclusiveLog = "the query generated is:\nBEGIN EXCLUSIVE TRANSACTION\n\n";

        await begin(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db);

        await begin(stmt);
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db);
        
        await begin.transaction(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db);
        
        await begin.transaction(stmt);
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db);
        
        await begin.deferredTransaction(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db);

        await begin.deferredTransaction(stmt);
        expect(consoleSpy).toHaveBeenCalledWith(deferredLog);
        await commit(db );

        await begin.immediateTransaction(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(immediateLog);
        await commit(db);

        await begin.immediateTransaction(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(immediateLog);
        await commit(db);
        
        await begin.immediateTransaction(stmt);
        expect(consoleSpy).toHaveBeenCalledWith(immediateLog);
        await commit(db);
        
        await begin.exclusiveTransaction(stmt, {});
        expect(consoleSpy).toHaveBeenCalledWith(exclusiveLog);
        await commit(db);

        await begin.exclusiveTransaction(stmt);
        expect(consoleSpy).toHaveBeenCalledWith(exclusiveLog);
        await commit(db);
        
        await finalizeStmt(stmt);
        db.close();
    });

    test("should execute the statement with the given args", async() =>
    {
        const db = new sqlite3.Database(":memory:");
        const stmt = db.prepare("BEGIN DEFERRED TRANSACTION");
        const eventPromise = new Promise((resolve, reject) => {
            db.once("trace", (sql) => {
                expect(sql).toBe("BEGIN DEFERRED TRANSACTION");
                resolve(true);
            });
        });
        const beginPromise = begin(stmt, {logQuery:false});

        await beginPromise;
        await commit(db);
        await eventPromise;
        await finalizeStmt(stmt);
        db.close();
    });
});