# SQLite-Express
SQLite-Express is a package designed to simplify working with SQLite3 in Node.js. It provides an object that encapsulates various methods for efficient interaction with SQLite databases.

With SQLite-Express, you can perform common database operations such as creating tables, inserting data, querying data, updating records, and deleting data, all with a simplified and intuitive interface.

The package aims to streamline the process of working with SQLite3 in Node.js, allowing you to focus on your application's logic rather than dealing with the intricacies of low-level database operations. By abstracting away the complexity, SQLite-Express enables you to accelerate development and improve productivity when working with SQLite databases.

Whether you are building a small-scale application or a complex system, SQLite-Express can be a valuable tool in your Node.js project, providing an efficient and convenient way to work with SQLite databases.

## Install

To install `sqlite-express` and use it in your Node.js project, follow these steps:

1. Open your terminal or command prompt.

2. Navigate to your project directory where you want to install `sqlite-express`.

3. Run the following command to install the package from npm:

```
npm i sqlite-express
```

This will download the package from the npm registry and install it locally in your project.

4. Once the installation is complete, you can require `sqlite-express` in your JavaScript files to start using it:

```javascript
const sqliteExpress = require('sqlite-express');
```

## createDB

The `createDB` method is used to create a new SQLite database or connect to an existing database by specifying the file path.

### Usage

To create or connect to a database, use the following syntax:

```javascript
const data = sqliteExpress.createDB("./data.db");
```

## createDB
The `createDB` method is used to create a new SQLite database or connect to an existing database by specifying the file path.

### Usage

To create or connect to a database, use the following syntax:

```javascript
const data = sqliteExpress.createDB("./data.db");
```

In the example above, createDB is called with the file path "./data.db", which creates a new SQLite database file named "data.db" in the current directory. If a database file with the same name already exists at the specified path, createDB will establish a connection to that existing database.

## createTable

The `createTable` method is used to create a new table in an SQLite database by specifying the database object, the table name as a string, and an object representing the column names and their respective data types.

### Usage

To create a table in the database, use the following syntax:

```javascript
sqliteExpress.createTable(data, "the_table", {name: "text", age: "integer", city: "text"});

```
In the example above, createTable is called with the database object data, the table name "la_tabla", and an object representing the column names and their data types. The column names and data types are defined within the object as key-value pairs. In this case, the table will have three columns: nombre of type text, edad of type integer, and ciudad of type text.

## insert

The `insert` method is used to insert data into a specific table in an SQLite database. It requires three parameters: the database object, the table name as a string, and an object representing the column names and the corresponding values to be inserted.

### Usage

To insert data into a table in the database, use the following syntax:

```javascript
sqliteExpress.insert(data, "the_table", {name: "Jhon", age: 27, city: "New York"});
```
In the example above, insert is called with the database object data, the table name "the_table", and an object representing the column names and their corresponding values. The object consists of key-value pairs, where the keys represent the column names and the values represent the data to be inserted into those columns. In this case, the name column will have the value "Jhon", the age column will have the value 27, and the city column will have the value "New York".

## update

The `update` method is used to update records in a specific table in an SQLite database. It requires four parameters: the database object, the table name as a string, an object representing the column and the new data to be updated, and an object representing the condition for the update.

### Usage

To update records in a table based on a specific condition, use the following syntax:

```javascript
sqliteExpress.update(data, "the_table", {name: "Alex"}, {age: 27});
```

In the example above, update is called with the database object data, the table name "the_table", an object representing the column and the new data {name: "Alex"}, and an object representing the condition {age: 27}. This means that the name column will be updated to "Alex" if the age column matches the value 27. For example, if there is a record with the name "Jhon" and the age 27, it will be updated to "Alex".

## delete

The `delete` method is used to delete records from a specific table in an SQLite database based on a condition. It requires three parameters: the database object, the table name as a string, and an object representing the condition for the deletion.

### Usage

To delete rows from a table based on a specific condition, use the following syntax:

```javascript
sqliteExpress.delete(data, "the_table", {age: 27});
```

In the example above, delete is called with the database object data, the table name "the_table", and an object representing the condition {age: 27}. This means that all records in the table with an age column equal to 27 will be deleted.

## select

The `select` method is used to retrieve data from a specific table in an SQLite database based on a condition. It requires four parameters: the database object, the table name as a string, the column name as a string (currently only supports one column), and an object representing the condition for the selection. It returns a Promise that resolves to the selected data.

### Usage

To select data from a table based on a specific condition, use the following syntax:

```javascript
async function theData() {
    console.log(await sqliteExpress.select(data, "the_table", "city", {name: "Alex"}));
}

theData();
```

In the example above, select is called with the database object data, the table name "the_table", the column name "city", and an object representing the condition {name: "Alex"}. This means that the method will retrieve the values from the "city" column where the name column matches "Alex". The selected data is returned as a Promise, and in this example, it is logged to the console.

If you need to select data based on multiple values for a column, you can pass an array of values in the condition object. Here's an example:

```javascript
async function theData() {
    console.log(await sqliteExpress.select(data, "the_table", "city", {name: ["Alex", "John"]}));
}

theData();
```
In this example, the method will retrieve the values from the "city" column where the name column matches either "Alex" or "John".

### Return Value

The select method returns a Promise that resolves to the selected data from the specified column based on the provided condition.
