# SQLite-Express
SQLite-Express is a package designed to simplify working with SQLite3 in Node.js. It provides an object that encapsulates various methods for efficient interaction with SQLite databases.

With SQLite-Express, you can perform common database operations such as creating tables, inserting data, querying data, updating records, and deleting data, all with a simplified and intuitive interface.

The package aims to streamline the process of working with SQLite3 in Node.js, allowing you to focus on your application's logic rather than dealing with the intricacies of low-level database operations. By abstracting away the complexity, SQLite-Express enables you to accelerate development and improve productivity when working with SQLite databases.

Whether you are building a small-scale application or a complex system, SQLite-Express can be a valuable tool in your Node.js project, providing an efficient and convenient way to work with SQLite databases.

## install

To install `sqlite-express` and use it in your Node.js project, follow these steps:

1. Open your terminal or command prompt.

2. Navigate to your project directory where you want to install `sqlite-express`.

3. Run the following command to install the package from npm:

```
npm install sqlite-express
```

This will download the package from the npm registry and install it locally in your project.

4. Once the installation is complete, you can require `sqlite-express` in your JavaScript files to start using it:

```javascript
const sqliteExpress = require('sqlite-express');
```

# Methods
All of the following methods can receive parameters in order or an object.

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
or
```javascript
const objectToCreateTable = {
    db : data,
    name : "the_table",
    columns : {name: "text", age: "integer", city: "text"}
}
sqliteExpress.createTable(objectToCreateTable);

```

In the example above, createTable is called with the database object data, the table name "la_tabla", and an object representing the column names and their data types. The column names and data types are defined within the object as key-value pairs. In this case, the table will have three columns: nombre of type text, edad of type integer, and ciudad of type text.

## insert

The `insert` method is used to insert data into a specific table in an SQLite database. It requires three parameters: the database object, the table name as a string, and an object representing the column names and the corresponding values to be inserted.

### Usage

To insert data into a table in the database, use the following syntax:

```javascript
sqliteExpress.insert(data, "the_table", {name: "Jhon", age: 27, city: "New York"});
```
or
```javascript
const rowToInsert = {
    db : data,
    table : "the_teble",
    row : {name: "Jhon", age: 27, city: "New York"}
}
sqliteExpress.insert(rowToInsert);
```
In the example above, insert is called with the database object data, the table name "the_table", and an object representing the column names and their corresponding values. The object consists of key-value pairs, where the keys represent the column names and the values represent the data to be inserted into those columns. In this case, the name column will have the value "Jhon", the age column will have the value 27, and the city column will have the value "New York".

This method includes the possibility of saving automatically srtingify objects and arrays in a column of type text:
```javascript
const rowToInsert = {
    db : data,
    table : "the_teble",
    row : {
        name: "Jhon",
        age: 27,
        city: ["New York", "Paris"]
    }
}
sqliteExpress.insert(rowToInsert);
```
you should not stop the booleans to text either. The program understands that you want to convert them to text and saves them without any problems.

## where constructor

The last 3 methods (update, delete and select) have among their possible parameters the where.

the basic use of the where constructor is the one already shown but it offers many more options.
```javascript
const where = {age : 27} //WHERE age = 27
```
By default it assumes that the comparison operator you want to use is "=". But if you need another type of operator you can use the following format:

```javascript
const where = {
    age : {
        operator : ">",
        value : 27
    }
    } //WHERE age > 27
```

In addition, several conditions can be added:

```javascript
const where = {
    age : {
        operator : ">",
        value : 27
    },
    name : "Alex"
    } //WHERE age > 27 AND name = Alex
```

When there is more than one condition the program assumes that the connector is "AND", if you want to use another one you have 2 options. The connector property represents the lowest connector of the logic:

```javascript
const conector = "OR"
const where = {
    age : {
        operator : ">",
        value : 27
    },
    name : "Alex"
    } //WHERE age > 27 OR name = Alex
```
All 3 methods accept this parameter, but you can also structure series of conditions from within where, so you can create more complex conditions. If you want to create a block of conditions whose connector is "OR" you must create an OR property and the same with AND:

```javascript
const where = {
    age : {
        operator : ">",
        value : 27
    },
    OR:{
        name : "Alex",
        city : "New York"
    }
} //WHERE age > 27 AND (name = Alex OR city = New York)
```
Ademas puedes asignar un array a los valores de las codiciones

```javascript
const where = {
    age : {
        operator : ">",
        value : 27
    },
    OR:{
        name : ["Alex", "John", "Paul"],
        city : "New York"
    }
} //WHERE age > 27 AND (name = Alex OR name = John OR name = Paul OR city = New York)
```
In this way we can create much more complex selectors.

## update

The `update` method is used to update records in a specific table in an SQLite database. It requires four parameters: the database object, the table name as a string, an object representing the column and the new data to be updated, and an object representing the condition for the update.

### Usage

To update records in a table based on a specific condition, use the following syntax:

```javascript
sqliteExpress.update(data, "the_table", {name: "Alex"}, {age: 27}, "OR");
```
or
```javascript
const instructionsToUpdate = {
    db : data,
    table : "the_table",
    update : {name: "Alex"},
    where : {age: 27},
    conector : "OR"
}
sqliteExpress.update(instructionsToUpdate);
```

In the example above, update is called with the database object data, the table name "the_table", an object representing the column and the new data {name: "Alex"}, and an object representing the condition {age: 27}. This means that the name column will be updated to "Alex" if the age column matches the value 27. For example, if there is a record with the name "Jhon" and the age 27, it will be updated to "Alex".

An interesting feature that this method has, is that some value of some update column can pass a funct

```javascript
const instructionsToUpdate = {
    db : data,
    table : "the_table",
    update : {age: (x)=>{return (x + 1)}},
    where : {name: "Alex"},
    conector : "OR"
}
sqliteExpress.update(instructionsToUpdate);
```
in this case it will select all the rows whose column "name" contains "Alex", it will take the current value of that cell and add 1. And it also works with arrays or objects. You can create functions that add an item to the array and return it for example.

```javascript
const instructionsToUpdate = {
    //imagine that there is only one "Alex" and his city columa contains ["New York, "Paris"]
    db : data,
    table : "the_table",
    update : {city: (x)=>{return [...x, "Londres"]}},
    where : {name: "Alex"},
    conector : "OR"
    //now your columa city will be ["New York, "Paris", "Londres"]
}
sqliteExpress.update(instructionsToUpdate);
```

## delete

The `delete` method is used to delete records from a specific table in an SQLite database based on a condition. It requires three parameters: the database object, the table name as a string, and an object representing the condition for the deletion.

### Usage

To delete rows from a table based on a specific condition, use the following syntax:

```javascript
sqliteExpress.delete(data, "the_table", {age: 27});
```
or
```javascript
const rowToDelete = {
    db : data,
    table : "the_table",
    where : {age: 27}
}
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
or
```javascript
const objectToQuery = {
    db : data,
    table : "the_table",
    columns : "city",
    where : {name: "Alex"}
}
async function theData() {
    console.log(await sqliteExpress.select(objectToQuery));
}

theData();
```

In the example above, select is called with the database object data, the table name "the_table", the column name "city", and an object representing the condition {name: "Alex"}. This means that the method will retrieve the values from the "city" column where the name column matches "Alex". The selected data is returned as a Promise, and in this example, it is logged to the console.

The program detects if what there is inside is a stringified object and it stops it automatically, the same with the booleans. Also the program detects if you are receiving only one value and it gives it directly to you so that we do not find ourselves with the typical situation that we have to enter in an array with an object of a single property. In the same way if we receive a single row this method will return an object with the columns and their values without the array.


### Return Value

The select method returns a Promise that resolves to the selected data from the specified column based on the provided condition.
