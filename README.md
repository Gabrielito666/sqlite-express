### SQLite-Express Version 6

**sqlite-express** is an npm package designed to simplify interaction with **sqlite3**. It has a **promise-based** design and is less complex than the original package.

#### Installation

Run in your terminal:

```bash
npm i sqlite-express
```

#### Initialization

To instantiate the package, start with:

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress();
```

With this new instance, you can call all methods. The **SqliteExpress** constructor accepts an optional parameter to control whether the generated SQL queries are printed to the console.

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress({ logQuery: false });
```

---

## Types

Data types for each option are defined in the **Params** type. You can access any option’s type by importing it, for example: `Params["where"]`. Even so, here’s a brief overview before we describe the methods:

#### route
A string path on your filesystem pointing to your database file (`.db`). Used to create or open the DB. Example: `./data/database.db`.

#### db
An object representing the database; it’s created with the `createDB` method of a **SqliteExpress** instance. Explained later in more detail.

#### tableName
A string representing the name of a table.

#### table
Either a string with the table name or a **Table** object. Detailed later.

#### where
A flexible object used to specify conditions in methods like `select`, `update`, `count`, or `exist`. Always optional. The simplest form is:

```javascript
{ [column]: value }
```

This translates to `WHERE [column] = [value]`. The default operator is `=`. If you want another operator, use the tuple form:

```javascript
[column, operator, value]
// operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT" | "IN" | "NOT IN"
```

This becomes `WHERE [column] [operator] [value]`.

For `IN` and `NOT IN`, the third element may be an array:

```javascript
["nombre", "IN", ["John", "David"]];
// Result: WHERE nombre IN ("John", "David")
```

Finally, if you want to combine multiple conditions with `AND`/`OR`, or nest conditions, wrap previous patterns inside an array and assign them to an `AND` or `OR` property:

```javascript
{
  OR: [
    ["nombre", "IN", ["John", "David"]],
    {
      AND: [
        { edad: 18 },
        { ciudad: "new york" }
      ]
    }
  ]
}
// Result: WHERE (nombre IN ("John", "David") OR (edad = 18 AND ciudad = "new york"))
```

#### columns
Used to declare tables; an object whose keys are column names and whose values are SQLite data types. Example:

```javascript
{ nombre: "TEXT", edad: "INTEGER" }
```

#### select
Indicates what to select with the `select` method (optional). It can be a string with a column name or `"*"`, an array of columns, or an object with `as` aliases:

```javascript
const selectString = "myColumn";
const selectArray = ["myColumn", "myOtherColumn"];
const selectArrayWithAs = {
  myColumn: { as: "nombre" },
  myOtherColumn: { as: "edad" }
};
```

#### update
An object with columns to update, or an **updater function**:

```javascript
const update1 = { nombre: "John" };
const update2 = { edad: (prevEdad) => prevEdad + 1 };
```

#### row
An object representing a row to insert. Example:

```javascript
const myRow = { nombre: "John", edad: 18 };
```

It’s important that the values match the data types expected by the table.

#### logQuery
Boolean flag to print (or not) the generated SQL in the console. Optional and available in all methods. You can also pass it to **SqliteExpress** on instantiation so it propagates as the default for methods that don’t set it explicitly.

#### query
A string with raw SQL; some methods let you pass SQL directly.

#### parameters
An object to pass parameters to raw SQL. If your query includes `@nombre`, your `parameters` object should look like:

```javascript
{ nombre: "David" }
```

---

# Class SqliteExpress and its methods

## sqliteExpress.createDB

Creates a new SQLite database or connects to an existing one. Parameters: `route`, `logQuery`. Returns a **DB** object.

### Usage

```javascript
const db = sqliteExpress.createDB({ route: './data.db' });
```

In the example, `createDB` receives a path (ideally absolute).  
If a database file already exists at that path, `createDB` will connect to it.

**Important:**
- If `route` is not provided, an error will be thrown.

## sqliteExpress.createTable

Creates a new table. Takes `db, tableName, columns, logQuery`. Returns a **Table** object.

### Usage

```javascript
const table = await sqliteExpress.createTable({
  db: db, // object created with createDB
  tableName: "la_tabla", // table name
  columns: { nombre: "TEXT", edad: "INTEGER", ciudad: "TEXT" }
});
```

## sqliteExpress.insert

Inserts data into a specific table. Takes `db, table, row, logQuery`. Returns the inserted row ID (if numeric).

### Usage

```javascript
const id = await sqliteExpress.insert({
  db: db,
  table: table,
  row: { nombre: "Juan", edad: 27, ciudad: "Nueva York" }
});
```

## sqliteExpress.update

Updates records in a specific table. Takes `db, table, update, where, logQuery`. Returns the number of affected rows.

### Usage

```javascript
const changes = await sqliteExpress.update({
  db: db,
  table: table,
  update: { nombre: "Alex" },
  where: { edad: 27 }
});
```

You can also pass a function as the update value:

```javascript
await sqliteExpress.update({
  db: db,
  table: table,
  update: { edad: (x) => x + 1 },
  where: { nombre: "Alex" }
});
```

In this case, rows with `nombre = "Alex"` will be selected; the current `edad` value will be taken and incremented by 1.

## sqliteExpress.delete

Deletes records from a table based on a condition. Takes `db, table, where, logQuery`. Returns the number of deleted rows.

### Usage

```javascript
const changes = await sqliteExpress.delete({
  db: db,
  table: table,
  where: { edad: 27 }
});
```

## sqliteExpress.select

Retrieves data from a table (with or without conditions). Takes `db, table, select, where, logQuery`. Returns a representation of the data.

### Usage

By default, it returns an **array of objects**:

```javascript
const data = await sqliteExpress.select({
  db: db,
  table: table,
  select: "*"
});
```

You can also get other return types:

```javascript
const ciudad = await sqliteExpress.select.celd({
  db: db,
  table: table,
  select: "ciudad",
  where: { nombre: "Alex" }
});

console.log(ciudad); // cell value
```

Available options:
- `select` → by default behaves like `select.rows`
- `select.rows` → returns an array of objects
- `select.row` → returns a single object
- `select.column` → returns an array of scalar values
- `select.celd` → returns a scalar value

## sqliteExpress.exist

Checks whether at least one row matches a condition. Takes `db, table, where, logQuery`. Resolves to a **boolean**.

### Usage

```javascript
const exists = await sqliteExpress.exist({
  db: db,
  table: table,
  where: { nombre: "Alex" }
});
```

## sqliteExpress.count

Counts how many rows match a condition. Takes `db, table, where, logQuery`. Resolves to a **number**.

### Usage

```javascript
const quantity = await sqliteExpress.count({
  db: db,
  table: table,
  where: { nombre: "Alex" }
});
```

## sqliteExpress.executeSQL

Runs **raw SQL** to maximize versatility.  
Takes `db, query, logQuery, parameters`. Resolves to **sqlite3**’s `RunResult`. This method is **augmented with submethods** that change the return type:

```javascript
const runResult = await sqliteExpress.executeSQL({
  db: db,
  query: "INSERT INTO users(name, age) VALUES(@name, @age)",
  parameters: { name: "John", age: 28 }
});

const selectCeldResult = await sqliteExpress.executeSQL.select.celd({
  db: db,
  query: "SELECT column FROM tabla WHERE id = @id",
  parameters: { id: 1 }
});
```

Options:
- `sqliteExpress.executeSQL` → default variant equals `.justRun`
- `sqliteExpress.executeSQL.justRun` → returns `sqlite3.RunResult`
- `sqliteExpress.executeSQL.select` → default equals `.select.rows`
- `sqliteExpress.executeSQL.select.rows` → array of objects
- `sqliteExpress.executeSQL.select.row` → single object
- `sqliteExpress.executeSQL.select.column` → array of scalars
- `sqliteExpress.executeSQL.select.celd` → scalar value
- `sqliteExpress.executeSQL.insert` → `number` (`lastRowId`)
- `sqliteExpress.executeSQL.update` → `number` (`changes`)
- `sqliteExpress.executeSQL.delete` → `number` (`changes`)

## sqliteExpress.declareSQL

Similar to `executeSQL`, but with **performance improvements** and a more robust architecture for certain scenarios. Takes `db, query, logQuery` and returns a **reusable function** that only takes `parameters`.

```javascript
const selectByName = await sqliteExpress.declareSQL({
  db: db,
  query: "SELECT * FROM mi_tabla WHERE nombre = @nombre"
});

// Then:
const johnRow = await selectByName.select.row({ nombre: "John" });
```

The reusable function (`statement`) exposes the same variants as `executeSQL`, so you can choose the return type you need.

The *statement* can be manually finalized with `statement.finalize()` before closing the database. This will render it unusable but will free up resources. If you do not finalize them, `db.close()` will do so.

## sqliteExpress.begin, sqliteExpress.commit, and sqliteExpress.rollback

Utility functions with no required parameters (besides optional `logQuery`) that execute their SQL commands quickly.

```javascript
await sqliteExpress.begin();
try {
  const result = await sqliteExpress.select({ db, table, select: "*" });
  await sqliteExpress.commit();
  console.log(result);
} catch (err) {
  await sqliteExpress.rollback();
  console.error(err);
}
```

Under the hood they simply execute their respective SQL commands.

`begin` also provides submethods:
- `begin.transaction`
- `begin.inmediateTransaction`  // submethod name as in the library
- `begin.exclusiveTransaction`

Each one maps to its corresponding SQL mode.

---

# Class DB and its methods

The **DB** class represents database objects. The `sqliteExpress.createDB` method returns a **DB** instance which, as shown, you can pass to **SqliteExpress** methods. However, **DB** also exposes its **own** methods. All **SqliteExpress** methods exist on **DB** (except `createDB`). In this case, the methods are the same but **do not** take a `db` argument: they use the instance itself.

```javascript
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

await db.createTable(/* ... */);
```

## db.createScope

The **db** instance also provides a powerful method, `db.createScope`, which creates a **Scope** instance:

```javascript
const scope = db.createScope();
```

A scope, as soon as it’s created, is added to an **operation queue**. This queue waits for all methods called **with that scope** to finish before starting the next one. Example:

```javascript
const scope = db.createScope();

db.insert({ table: table, row: { name: "John", age: 28 } });

const table = db.createTable({
  tableName: "users",
  columns: { name: "TEXT", age: "INTEGER" },
  scope: scope
});

scope.close();
```

In this example, after creating the scope there’s a `db.insert`. Without a scope, it would execute immediately; but since a scope is active, it **won’t** run until that scope completes. Then we create a table **within the scope**, so it will start. Finally we call `scope.close()`, which closes the scope; you can’t pass that scope to any other method afterward. Once closed and when all operations within it end, the scope is removed from the queue, letting the next pending operations proceed (in this case, the waiting `insert`).

If you don’t pass any scope, the method will use a **community scope** that manages methods without a scope.

**IMPORTANT**  
Scopes are very useful for guaranteeing **execution order** without interference from other calls on the same connection, but you must avoid **blocking** the queue. In the previous example, if you put `await` on the `insert`:

```javascript
const scope = db.createScope();

await db.insert({ table: table, row: { name: "John", age: 28 } });

const table = db.createTable({
  tableName: "users",
  columns: { name: "TEXT", age: "INTEGER" },
  scope: scope
});

scope.close();
```

The queue will deadlock: `db.insert` is waiting for the scope to finish before continuing to the next line, but that won’t happen if `scope.close()` is below.

Another important point is to **always close the scope**; otherwise you’ll block other scopes waiting their turn. The recommendation is to create one for a **specific** transaction (e.g., in a REST API endpoint), then close it. If you **don’t** need serialization, **avoid** using scopes. Use them when you don’t want another `COMMIT` or `ROLLBACK` to break your serialized sequence of operations.

## db.getTable

Creates a **Table** instance **without** relying on `db.createTable`. This method **assumes** you already created the table (via the method or raw SQL). If not, your queries will fail. It’s useful when you have an initialization routine that guarantees tables exist; since it’s **synchronous**, you can fetch the table by its `tableName` right away.

Method that closes the **connection**. It’s a best practice for performance and security reasons. Note that once you call `close()`, you can no longer use this **db** instance or any **statements** created via `declareSQL` that are associated with this connection.
---

# Class Table and its methods

The `createTable` methods on **SqliteExpress** or **DB** return a **Table** instance. Besides being usable as the `table` parameter in other class methods, it includes the convenience methods: `select`, `insert`, `update`, `delete`, `exist`, and `count`, which implicitly set the `table` argument.

```javascript
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

const table = await db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" } });

await table.select({ select: "*" });
```

---

## Recommendations

- **Avoid referencing the same database from different instances**  
  It’s not advisable to reference the same DB file from two different **SqliteExpress** instances.

  ```javascript
  const instancia1 = new SqliteExpress();
  const instancia2 = new SqliteExpress();

  instancia1.createDB({ route: './la_misma_ruta/la_misma_BD.db' });
  instancia2.createDB({ route: './la_misma_ruta/la_misma_BD.db' });
  ```

  The class is designed to manage a **wait queue** in **order** for a database. With two instances pointing to the same file, you may encounter **asynchrony conflicts**, negating the package’s benefits.

  There are design patterns where you might intentionally open another connection and use `BEGIN` / `COMMIT` to manage transactions. For **medium-sized** projects, it’s generally not recommended.

---

# License

This software is licensed under the **ISC License**. It is a **permissive** free software license that allows use, modification, and redistribution with some conditions. For the full terms, see the **LICENSE** file at the project root.