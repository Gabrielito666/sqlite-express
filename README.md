### SQLite-Express Version 5

sqlite-express is an npm package designed to simplify interaction with sqlite3. It has a promise-based design and is less complex than the original package.

#### Installation

To install, run the following command in your terminal:

```bash
npm i sqlite-express
```

#### Initialization

To instantiate the package, start with these lines:

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress();
```

With this new instance, you can execute all methods. The SqliteExpress constructor accepts a parameter with the root path you want to use; this will be `process.cwd()` by default.

```javascript
const SqliteExpress = require('./index');
const path = require("path");
const dataDir = path.resolve(process.cwd(), "data");
const sqliteExpress = new SqliteExpress(dataDir);
```

#### Key Features

1. **Queue System:** The most substantial feature is the integration of a queue to serialize operations. This prevents conflicts with the order of operations and prevents database overload. Thus, you are free to use loops.

2. **Transaction System:** It is an additional queuing system to the previous one that strictly protects the order of a series of interactions with the database. This system protects operations that must be serial despite having simultaneous asynchronous processes like two promises with loops or similar situations.

3. **Default Options Property:** Another feature is the `defaultOptions` property. It eliminates the need to repeatedly pass the same arguments to methods you always use. All properties you use in methods can be set in this object. Below is a list of these properties.

+-----------+-----------+
| option    | default   |
+-----------+-----------+
|route      | undefined |
+-----------+-----------+
|db         | undefined |
+-----------+-----------+
|table      | undefined |
+-----------+-----------+
|where      | undefined |
+-----------+-----------+
|columns    | undefined |
+-----------+-----------+
|select     | '*'       |
+-----------+-----------+
|connector  | "AND"     |
+-----------+-----------+
|update     | undefined |
+-----------+-----------+
|row        | undefined |
+-----------+-----------+
|logQuery   | true      |
+-----------+-----------+
|query      | undefined |
+-----------+-----------+
|expected   | "rows"    |
+-----------+-----------+
|parameters | undefined |
+-----------+-----------+
|type       | 'any'     |
+-----------+-----------+

You can modify these values individually or with the `set` method:

```javascript
session.defaultOptions.table = 'the_table';
session.defaultOptions.db = Db;
// ... and so on

session.defaultOptions.set({
    table: 'the_table',
    db: Db,
    route: './newFolder/my_database.db',
    logQuery: false
});
```

With the set method you don't need to put all default options. Just the ones you want.

## Types

The data types for each option are defined in the Params type. You can access the type of any option by importing this, e.g.: `Params["where"]`. Anyway, I'm going to make a brief review of the types of each property before talking about methods:

#### route
It is a string corresponding to a path in your file system pointing to your database.db, used to create the DB. E.g.: `./data/database.db`.

#### db
It is an object that represents the database; it is created with the createDB method of a SqliteExpress instance. I'll explain this object later.

#### Table
It is a string with the name of a table or a Table object. This will be explained in detail later.

#### Where
It is an object with many formatting possibilities; it serves to indicate conditions in methods like select, update, count or exist. Its simplest version is:
```js
{ [column] : value }
```
In this case it translates to `WHERE [column] = [value]`. It is very simple and useful in most cases. It uses the `=` operator by default. If you want to use another one, you can do:
```js
{ [column] : {
    value: [value],
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT"| "IN" | "NOT IN";
} }
```
this translates to `WHERE [column] [operator] [value]`.

In both the first and second option, value can be an array of values. In which case those statements will be concatenated with an AND, e.g.:
```js
{
    name: {
        value: ["John", "David"],
        operator: "!="
    }
}
// RESULT: WHERE name != John AND name != David
```
This is especially useful in use cases for the IN and NOT IN operators:
```js
{
    name: {
        value: ["John", "David"],
        operator: "IN"
    }
}
// RESULT: WHERE name IN("John", "David")
```
Finally, if you want not to depend on the default AND connector or want to nest conditions in a more advanced way, you can wrap a previous statement in an array and assign it to an AND or OR property:
```js
{
    OR : [
        name: {
            value: ["John", "David"],
            operator: "IN"
        },
        AND: [
            { age: 18 },
            { city: "new york" }
        ]
    ]
}
// RESULT: WHERE (name IN ("John", "David") OR (age = 18 AND city = "new york" ))
```

#### columns
Used to declare tables; it is an object with the property as the column name and the value as the SQLite data type. E.g.:
```js
{ name: "TEXT", age: "INTEGER" }
```

#### select
Used to indicate what you want to select with the select method. It can be a string with the column name or "*", it can be an array with the different columns you want or an object of objects with an as property. E.g.:
```js
const selectString = "myColumn";
const selectArray = ["myColumn", "myOtherColumn"];
const selectArrayWithAs = {
    myColumn: { as: "name" } ,
    myOtherColumn: { as: "age" }
}
```
#### connector
Can be "AND" or "OR"; used to have a default initial value in a WHERE clause.

#### update
It is an object with properties for the column name and the value to update or an updater function.
```js
const update1 = { name: "John" };
const update2 = { age: (prevAge) => (age + 1) };
```
#### row
It is an object that represents a row to insert. E.g.:
```js
const myRow = { name: "John", age: 18 };
```
It is important that they match the data types expected by the table.

#### logQuery
Used for a method to print the generated query to the console or not; it is a boolean.

#### query
It is a string with SQL text; some methods allow you to enter queries directly.

#### expected
Used for the select method to give you one type of response or another. Its values can be "celd", "row", "column" or "rows".

#### parameters
It is an object that in SQL queries allows you to send parameters. If the query includes @name, your parameters object would look like this:
```js
{name: "David"}
```

#### type
Indicates the query type in methods that accept SQL text. They can be "select", "insert", "update", "delete", "any" or "create". By default it will be "any" and SqliteExpress will have to analyze the query type to give you an appropriate response, but if passed explicitly the code will be more robust.

# Class SqliteExpress and its Methods



## sqliteExpress.createDB

The `sqliteExpress.createDB` method allows you to create a new SQLite database or connect to an existing one. Its parameters are: `route, logQuery` and returns a DB object.

### Usage

To create or connect to a database, use the following syntax:

```javascript
const db = sqliteExpress.createDB({ route: './data.db', logQuery: false });
```

In the example above, `createDB` is invoked with a route of "./data.db", which refers to a new SQLite database file called "data.db" in the directory relative to where the class was instantiated.

If a database file with the same name already exists at the specified path, `createDB` will establish a connection to that existing database.

It is important to note:
- If the `route` is not provided, an error will be thrown.

## sqliteExpress.createTable

The `sqliteExpress.createTable` method is used to create a new table in a SQLite database, receives `db, table, columns, logQuery` and returns a Table object.

### Usage

To create a table in the database, use the following syntax:

```javascript
const table = await sqliteExpress.createTable({
    db : db, //object created with createDB
    table : "the_table", //string with the table name
    columns : { name: "TEXT", age: "INTEGER", city: "TEXT" }
});

```

In the example above, createTable is called with the database object, the table name "the_table", and an object representing the column names and their data types. The column names and data types are defined within the object as key-value pairs. In this case, the table will have three columns: name of type text, age of type integer, and city of type text.

## sqliteExpress.insert

The `sqliteExpress.insert` method is used to insert data into a specific table in a SQLite database. It receives `db, table, row, logQuery` and returns the ID of the inserted row if it is a number.

### Usage

To insert data into a table in the database, use the following syntax:

```javascript

const id = await sqliteExpress.insert({
    db : db,
    table : table,
    row : { name: "John", age: 27, city: "New York" }
});
```
In the example above, insert is called with the database object, the table and an object representing the column names and their corresponding values. The object consists of key-value pairs, where the keys represent the column names and the values represent the data to be inserted into those columns. In this case, the name column will have the value "John", the age column will have the value 27, and the city column will have the value "New York".

## sqliteExpress.update

The `sqliteExpress.update` method is used to update records in a specific table in a SQLite database. It receives the parameters `db, table, update, where, connector, logQuery` and returns a number with the amount of affected rows.

### Usage

To update records in a table based on a specific condition, use the following syntax:

```javascript
const changes = await sqliteExpress.update({
    db : db,
    table : table,
    update : { name: "Alex" },
    where : { age: 27 },
    connector : "OR"
});
```

In the example above, update is called with the database object, the table, an object representing the column and the new data {name: "Alex"}, and an object representing the condition {age: 27}. This means that the name column will be updated to "Alex" if the age column matches the value 27. For example, if there is a record with the name "John" and age 27, it will be updated to "Alex".

An interesting feature this method has is that some value of some update column can be a function:

```javascript
await sqliteExpress.update({
    db : db,
    table : table,
    update : { age: (x) => (x + 1)},
    where : { name: "Alex" },
    connector : "OR"
});
```
In this case it will select all rows whose "name" column contains "Alex", take the current value of that cell and add 1.

## sqliteExpress.delete

The `sqliteExpress.delete` method is used to delete records from a specific table in a SQLite database based on a condition. It receives `db, table, where, connector, logQuery` and returns a number with the amount of deleted rows.

### Usage

To delete rows from a table based on a specific condition, use the following syntax:


```javascript
const changes = await sqliteExpress.delete({
    db : db,
    table : table,
    where : {age: 27}
});
```

In the example above, delete is called with the database object, the table and an object representing the condition {age: 27}. This means that all records in the table with an age column equal to 27 will be deleted.

## sqliteExpress.select

The `sqliteExpress.select` method is used to retrieve data from a specific table in a SQLite database based on a condition. It receives the parameters `db, table, select, where, connector, expected, logQuery` and returns a representation of the data.

### Usage

To select data from a table based on a specific condition, use the following syntax:

```javascript


const city = await sqliteExpress.select({
    db: db,
    table: table,
    select: "city",
    where: { name: "Alex" },
    expected: "celd"
});

console.log(city) //the cell value

```
Here expected becomes relevant: if you pass "celd" it will return only a scalar value, like a string or number for example. If you pass "row" it will return an object of scalar values like { [columnName]: [scalarValue] }, if you pass "column" it will return an array of scalar values representing all results from a single column and if you pass "rows" it will return an array of rows.

## sqliteExpress.exist

The `sqliteExpress.exist` method is used to know if there is a row in a table that meets a given condition. It receives `db, table, where, connector, logQuery` and returns a promise that resolves to a boolean.

### Usage

To verify if there is at least one row that meets the condition you can use the following syntax:

```javascript
const verification = await sqliteExpress.exist({
    db: db,
    table: table,
    where: {name: "Alex"}
});
```

If in the database table there is at least one row whose 'name' column has 'Alex' as a value, the code will return a promise that will resolve to true. If on the contrary there is no row that meets this condition, the returned promise will resolve to false.

## sqliteExpress.count

The `sqliteExpress.count` method is used to know the number of rows that meet a condition. It receives `db, table, where, connector, logQuery` and returns a promise that resolves to a number.

### Usage

To know the number of rows that meet a condition you can use the following syntax:

```javascript
    const quantity = await sqliteExpress.count({
    db: db,
    table: table,
    where: { name: "Alex" }
});
```

This code will check the table in the database and count the rows whose value in the 'name' column is 'Alex'. Then it will return a promise that will resolve to the number found.

## sqliteExpress.executeSQL

This method allows direct use of SQL allowing the package to reach its maximum versatility.

It receives the parameters `db, query, logQuery, expected, type, parameters` and returns a promise that can resolve differently according to the query type passed in type. Expected is used in the case of type="select".

### Usage

```javascript

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: "SELECT * FROM my_table WHERE name = ?-John-?",
        type: "select",
        expected: "row"
    })
    console.log(result);
```
If I don't pass type, the code will detect what type of query it is by observing the first command which in this case is "SELECT". However, it's better to skip this inference step and pass it in type.

Note the use of __?- -?__: these "keys" are used to replace typical placeholders.

I have always found placeholders to be cumbersome, they add parameters to methods and it's not clear what you're trying to do at a glance.

With this method the SQL statement is clearer. However, to resist SQL injection and increase security, my system uses traditional placeholders behind the scenes. Therefore, you must mark the parts of the statement that come from outside with __?- -?__.

```javascript
    const my_data = { name: "John" };

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: `SELECT * FROM my_table WHERE name = ?-${ my_data.name }-?`
        type: "select",
        expected: "row"
    })
    console.log(result);
```

Anyway, if you prefer not to use this way of adding external parameters, there is another more direct way and it is through the parameters argument:

```javascript
    const my_data = { name: "John" };

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: `SELECT * FROM my_table WHERE name = @name`,
        type: "select",
        expected: "row"
        parameters: my_data
    })
    console.log(result);
```

Another important consideration is that given the SQLite3 architecture, you cannot mix SELECT queries with other queries at the first level.

If you are going to do a select, you must do only one select and your statement must begin with SELECT.

If you are not going to do any select at the first level, you can do whatever you want with the rest of the clauses. (If you do a select in a query that does not start with `SELECT`, there will be no error, but no rows will be returned).

## sqliteExpress.declareSQL

This method is similar to the previous one but has performance improvements and serves to have a more robust query architecture in some cases. It receives `db, query, logQuery, expected, type` and returns a reusable function that only receives parameters as an argument.

```javascript
    const selectByNameFunc = await sqliteExpress.declareSQL({
        db: db,
        query: `SELECT * FROM my_table WHERE name = @name`,
        type: "select",
        expected: "row"
    })
    //and then:

    const johnRow = await selectByNameFunc({ name: "John" });
```

In this case the placeholder system with __?--?__ format doesn't work, so it should only be used through parameters.

## sqliteExpress.beginTransaction, sqliteExpress.commit and sqliteExpress.rollback

These are utility functions that receive no parameters and execute commands quickly.

```js
await sqliteExpress.beginTransaction();
try
{
    const result = await sqliteExpress.select();
    await sqliteExpress.commit();
    console.log(result);
}
catch(err)
{
    await sqliteExpress.rollback();
    console.error(err);
}
```
Behind the scenes they only execute their respective SQL commands.

# Class DB and its methods

The DB class represents database objects. The sqliteExpress.createDB method returns a DB instance that, as we already saw, you can use as an argument in sqliteExpress methods. However, DB has its own methods. All sqliteExpress methods are in DB (except createDB). In this case, the methods are the same but they don't receive a db argument, they simply use their own instance as an argument.

```js
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

await db.createTable(/*bla bla bla*/);
```

## db.createTransaction

The db instance also has a very powerful method called db.createTransaction that creates a transaction instance.

```js
const transaction = db.createTransaction();
```

This shares all the methods of the db, and also doesn't need a db parameter in its methods. But it has two extra methods: `start` and `end`.

```js
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

const transactionFunc = () =>
{
    const transaction = db.createTransaction();
    transaction.start();
    await transaction.beginTransaction();
    try
    {
        const result = await transaction.select();
        await transaction.commit();
        console.log(result);
    }
    catch(err)
    {
        await transaction.rollback();
        console.error(err);
    }
    finally
    {
        transaction.end();
    }
}
```
After executing transaction.start(), the system will wait for all running transactions to finish before starting yours. Then it will execute the methods that use transaction blocking all calls from other transactions made asynchronously, guaranteeing total isolation. When you call transaction.end(), the transaction is discarded and the list of next transactions continues running. (Therefore it is very important to call transaction.end() or you will block all subsequent calls).

This is not always necessary, but in particular occasions it can be very useful. It is not very compatible with the declareSQL method since the nature of the transaction is ephemeral and designed not to persist.

# Class Table and its methods

The createTable methods of SqliteExpress or DB return a Table instance. This object, in addition to serving as a table parameter in the methods of other classes, has simple methods: `select, insert, update, delete, exist and count` and by default already incorporate the table argument.

```js
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

const table = await db.createTable(/*bla bla bla*/);

await table.select(/*bla bla bla*/);
```

## Recommendations

- **Avoid Referencing the Same Database from Different Instances**: 
    It is not advisable to reference the same database from two different `SqliteExpress` instances.

    ```javascript
    const instance1 = new SqliteExpress();
    const instance2 = new SqliteExpress();

    instance1.createDB({route : '.the_same_path/the_same_DB.db'});
    instance2.createDB({route : '.the_same_path/the_same_DB.db'});
    ```

    The class is designed to handle the waiting list of a database in order. However, with two instances pointing to the same file, there could be an asynchrony conflict, negating the package's benefits.

## Version 5

From version 5 onwards, old select options are abandoned: `processRows, processColumns and emptyResult`. This was used to format select responses but it was a more unstable system; now with expected and its different options a more robust handling of select responses is achieved.

Previously databases were referenced with a string type key. Now key is no longer an option and the db object is used directly.

Join was an option to create join statements in previous versions. Given the nature of a join and its multiple layers of semantic difficulty, I decided to remove the option. It only added complexity very difficult to represent in JavaScript object format. Now, to obtain that behavior it is recommended to use executeSQL or declareSQL.

# License
This software is licensed under the ISC License. The ISC License is a permissive free software license, allowing freedom to use, modify, and redistribute the software, with some conditions. For the complete terms and conditions, please see the LICENSE file in the root directory of this project.