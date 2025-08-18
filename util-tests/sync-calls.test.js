const SqliteExpress = require("..");
const sqliteExpress = new SqliteExpress(process.cwd());
const path = require("path");
const fs = require("fs");

const mockDatabasePath = path.resolve(process.cwd(), "mock-syncProof.db")

describe("sync-calls-test", () =>
{
    afterAll(() =>
    {
        fs.unlinkSync(mockDatabasePath);
    });
    test("list of not awaited commands must execute in order", async() =>
    {
        const db = sqliteExpress.createDB({ route: mockDatabasePath });

        console.log("create table start");
        sqliteExpress.createTable({
            db,
            table: "personas",
            columns: {
                nombre: "TEXT",
                edad: "INTEGER"
            }
        }).then(() =>
        {
            console.log("create table end");
        });

        const promiseInsert = sqliteExpress.insert({
            db,
            table: "personas",
            row : {
                nombre: "Gabriel",
                edad: 25
            }
        }).catch(err =>
        {
            console.error(err)
        });

        await expect(promiseInsert).resolves.not.toThrow();
    });
});