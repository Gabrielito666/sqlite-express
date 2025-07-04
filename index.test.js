const SqliteExpress = require(".");

const sqliteExpress = new SqliteExpress(__dirname);

sqliteExpress.defaultOptions.set({
    db: "data-key",
    route: "test-data.db",
    table: "users"
})

const main = async() =>
{
    sqliteExpress.createDB();
    await sqliteExpress.createTable({ columns: { name : "TEXT", age: "INTEGER", city: "TEXT" } });

    await sqliteExpress.insert({ row: { name: "Jhon", age: 10, city: "Newyork" } });

    const row = await sqliteExpress.select({ select:"age", where: {name: "Jhon"}, processColumns: false, processRows: false });
    console.log(row);
}

main();