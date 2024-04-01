### SQLite-Express Version 4

sqlite-express is an npm package designed to make interaction with sqlite3 simpler. It has a promise-based design and without as much paraphernalia as the original package.

The third version of SQLite-Express is much more comfortable and powerful, since it has gone from being a simple object with methods to a full-fledged class.

Since the fourth version that does not allow single parameters and only works by means of objects as a single parameter.

#### Installation

To install, execute the following command in your terminal:

```bash
npm i sqlite-express
```

#### Initialization

To instantiate the package, start with these lines:

```javascript
const SqliteExpress = require('./index');
const session = new SqliteExpress();
```

With this new instance, you can execute all the previous methods in the same way you used to.

if you are using an environment with complex path handling such as next.js or react-router, it is recommended to instantiate the class with a parameter with the root path from which you are instantiating the class.

This avoids conflicts, however in simple applications it is not necessary.

```javascript
const SqliteExpress = require('./index');
const session = new SqliteExpress('my/root/path');
```

#### Key Features

1. **Queue System:** The most substantial improvement is the integration of a queue to serialize operations. This avoids conflicts with the order of operations and prevents database overload. Thus, you're free to use loops.

2. **Default Options Property:** Another added feature is the `defaultOptions` property. It eliminates the need to repeatedly pass the same arguments to methods. Now, all the properties you use in methods can be set in this object. Below is a list of these properties. If a value is already assigned (`=`), it's the default:

```javascript
rootPath = (path from where you instantiate the class)
emptyResult = undefined
route
db
key
table
where
join
columns
select = '*'
connector = 'AND'
update
row
processColumns = true
processRows = true
logQuery = true
```

You can modify these values individually or with the `set` method:

```javascript
session.defaultOptions.table = 'the_table';
session.defaultOptions.db = 'dataBase1';
// ... and so on

session.defaultOptions.set({
    table: 'the_table',
    db: 'dataBase1',
    route: './nuevaCarpeta/my_database.db',
    logQuery: false
});
```

width set method yo don't need put all default options. Just the ones you want.


# Methods

All of the following methods can either accept parameters in a specific order or receive an object as an argument.

## createDB

The `createDB` method allows you to create a new SQLite database or connect to an existing one. You need to specify both a relative path (based on the path from which the class was instantiated) and a unique key that identifies the database.

### Usage

To create or connect to a database, use the following syntax:

```javascript
session.createDB({ route: './data.db', key: 'dataBase1' });
```

In the example above, `createDB` is invoked with a route of "./data.db", which refers to a new SQLite database file named "data.db" in the directory relative to where the class was instantiated. The key 'dataBase1' serves as a unique identifier for the database.

If a database file with the same name already exists at the specified path, `createDB` will establish a connection to that existing database.

It's important to note:
- If the `route` is not provided, an error will be thrown.
- If the `key` is not specified, a hexadecimal string will be generated and used as the default key.

The method returns the key, allowing you to store it as demonstrated below:

**Using an explicit key:**

```javascript
const db = session.createDB({ route: './data.db', key: 'dataBase1' });
```

**Using a generated hexadecimal key:**

```javascript
const db = session.createDB({ route: './data.db' });
```

It's important not to use the same key for different databases because this would cause an error.

## Using Databases with Methods

Every subsequent method requires specifying a database (`db`). If you are using only one database, it's advantageous to set it as the default.

To reference a database in methods, you can either use the explicit `key` as a string or the return value from the `createDB` method.

### Using the Key Explicitly

First, create or connect to the database:

```javascript
session.createDB({ route: './data.db', key: 'dataBase1' });

//Then, use the key to reference the database in other methods:
session.createTable({ db: 'dataBase1' /* ... other parameters ... */ });
```

### Using the Return Value of `createDB`

Create or connect to the database and store the return value:

```javascript
const db = session.createDB({ route: './data.db', key: 'dataBase1' });

//Then, use this stored value in other methods:
session.createTable({ db: db /* ... other parameters ... */ });
```

This approach mirrors the method employed in version 2 of this package. As observed, there's no need to save the return value of `createDB` to a variable if you're using an explicit key. However, if you do not provide an explicit key and rely on the generated hexadecimal key, you will need to store the return value for future references.

## createTable

The `createTable` method is used to create a new table in an SQLite database by specifying the database object, the table name as a string, and an object representing the column names and their respective data types.

### Usage

To create a table in the database, use the following syntax:

```javascript
const objectToCreateTable = {
    db : 'dataBase1',
    table : "the_table",
    columns : { name: "text", age: "integer", city: "text" }
}
session.createTable( objectToCreateTable );

```

In the example above, createTable is called with the database object data, the table name "la_tabla", and an object representing the column names and their data types. The column names and data types are defined within the object as key-value pairs. In this case, the table will have three columns: nombre of type text, edad of type integer, and ciudad of type text.

## insert

The `insert` method is used to insert data into a specific table in an SQLite database. It requires three parameters: the database object, the table name as a string, and an object representing the column names and the corresponding values to be inserted.

### Usage

To insert data into a table in the database, use the following syntax:

```javascript
const rowToInsert = {
    db : 'dataBase1',
    table : "the_teble",
    row : { name: "Jhon", age: 27, city: "New York" }
}
session.insert( rowToInsert );
```
In the example above, insert is called with the database object data, the table name "the_table", and an object representing the column names and their corresponding values. The object consists of key-value pairs, where the keys represent the column names and the values represent the data to be inserted into those columns. In this case, the name column will have the value "Jhon", the age column will have the value 27, and the city column will have the value "New York".

This method includes the possibility of saving automatically srtingify objects and arrays in a column of type text:
```javascript
const rowToInsert = {
    db : 'dataBase1',
    table : "the_teble",
    row : {
        name: "Jhon",
        age: 27,
        city: ["New York", "Paris"]
    }
}
session.insert( rowToInsert );
```
you should not stop the booleans to text either. The program understands that you want to convert them to text and saves them without any problems.

Since version 3.0.5 the method returns a promise that is resolved with a true and rejected with an error.

## where constructor

The last 3 methods (update, delete and select) have among their possible parameters the where.

the basic use of the where constructor is the one already shown but it offers many more options.
```javascript
const where = { age : 27 } //WHERE age = 27
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
const connector = "OR"
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
const instructionsToUpdate = {
    db : 'dataBase1',
    table : "the_table",
    update : {name: "Alex"},
    where : {age: 27},
    connector : "OR"
}
session.update(instructionsToUpdate);
```

In the example above, update is called with the database object data, the table name "the_table", an object representing the column and the new data {name: "Alex"}, and an object representing the condition {age: 27}. This means that the name column will be updated to "Alex" if the age column matches the value 27. For example, if there is a record with the name "Jhon" and the age 27, it will be updated to "Alex".

An interesting feature that this method has, is that some value of some update column can pass a funct

```javascript
const instructionsToUpdate = {
    db : 'dataBase1',
    table : "the_table",
    update : {age: (x)=>{return (x + 1)}},
    where : {name: "Alex"},
    connector : "OR"
}
session.update(instructionsToUpdate);
```
in this case it will select all the rows whose column "name" contains "Alex", it will take the current value of that cell and add 1. And it also works with arrays or objects. You can create functions that add an item to the array and return it for example.

```javascript
const instructionsToUpdate = {
    //imagine that there is only one "Alex" and his city columa contains ["New York, "Paris"]
    db : 'dataBase1',
    table : "the_table",
    update : {city: (x)=>{return [...x, "Londres"]}},
    where : {name: "Alex"},
    connector : "OR"
    //now your columa city will be ["New York, "Paris", "Londres"]
}
session.update(instructionsToUpdate);
```

since version 3.0.5 the method returns a promise that resolves to the number of modified rows.

## delete

The `delete` method is used to delete records from a specific table in an SQLite database based on a condition. It requires three parameters: the database object, the table name as a string, and an object representing the condition for the deletion.

### Usage

To delete rows from a table based on a specific condition, use the following syntax:


```javascript
const rowToDelete = {
    db : 'dataBase1',
    table : "the_table",
    where : {age: 27}
}
sqliteExpress.delete(rowToDelete);
```

In the example above, delete is called with the database object data, the table name "the_table", and an object representing the condition {age: 27}. This means that all records in the table with an age column equal to 27 will be deleted.

since version 3.0.5 the method returns a promise that resolves to the number of deleted rows.

## select

The `select` method is used to retrieve data from a specific table in an SQLite database based on a condition. It requires four primary parameters: the database identifier, the table name as a string, the column name as a string (currently only supports one column), and an object representing the condition for the selection. It returns a Promise that resolves to the selected data.

### Usage

To select data from a table based on a specific condition, use the following syntax:

```javascript
const objectToQuery = {
    db: 'dataBase1',
    table: "the_table",
    select: "city",
    where: {name: "Alex"}
}
async function theData() {
    console.log(await session.select(objectToQuery));
}
theData();
```

You can also use `.then` for handling the Promise:

```javascript
session.select(objectToQuery).then(data => {
    console.log(data);
});
```

In the examples above, the `select` method is called with the database identifier `dataBase1`, the table name "the_table", the column name "city", and an object representing the condition {name: "Alex"}. The method retrieves the values from the "city" column where the `name` column matches "Alex". The selected data is returned as a Promise, and it is logged to the console.

The select parameter accepts several formats for the columns. One is as a simple string, in this case if you want to call more than one column must be separated by commas, this format accepts the use of "AS" directly.

example:
```javascript
-'column_1, columns_2, column_3'
-'table_1.column_1, table_1.column_2, table_2.column_3'
-'column_1 AS newName, column_2'
```

an array with strings corresponding to the desired columns is also accepted as a parameter.

example:
```javascript
-[ 'column_1', 'columns_2', 'column_3' ]
-[ 'table_1.column_1', 'table_1.column_2', 'table_2.column_3' ]
-[ 'column_1 AS newName', 'column_2' ]
```

Finally, you can also use an array of objects for better handling of the "AS" clauses.

example:
```javascript
-[   { column : 'column_1' }, { column : 'columns_2' }, { column : 'column_3' } ]
-[
    { table : 'table_1', column : 'column_1' },
    { table : 'table_1', column : 'column_2' }, 
    { table : 'table_2', column : 'column_3' }
]
-[ { column : 'column_1', as : 'newName' }, { column : 'column_2' } ]
```
this last form is available as of version 3.0.5

The program detects if what is passed in is a stringified object and automatically handles it. The same goes for booleans. Additionally, if the method detects a single value being received, it directly provides the value to avoid the common situation of accessing a single-property object inside an array.

In this latest version, three more parameters were integrated for this method:

- `processColumns`: (default: true)  
- `processRows`: (default: true)  
- `emptyResult`: (default: undefines)  

By default, sqlite3's `select` method returns an array of objects. However, there are times when you might want to select just one column from one row, leading to repetitive code like `rows[0].nombre`. With these parameters, you can decide if you want to unwrap the result object.

If the number of selected rows is 1 and `processRows` is set to true, the method will return the row outside of the array. Similarly, if there's only one column and `processColumns` is set to true, the value of that column will be returned outside of the object.

Furthermore, if the `select` method's result doesn't match any rows with the query, it will return the value set in `emptyResult`. This can be useful in different scenarios. Depending on your requirements, you might want it to return an empty array, an empty string, an empty object, null, false, or any other value you specify.

### Join parameter

Since version 3.0.5 the join parameter is accepted for more complex selections. This parameter in its simplest form looks like this:

```javascript
const joinExample = { 
    table : 'secondary_table',
    on : 'common_column'
}
```

the resulting join would look similar to this:

```sql
INNER JOIN secondary_table ON main_table.common_column = secondary_table.common_column
```

this mode assumes that you want to join two tables that have a column with the same name, if you want to join using columns with different names you can use an array in `on` :

```javascript
const joinExample = { 
    table : 'secondary_table',
    on : [ 'main_table_column', 'secondary_table_column' ]
}
```

the resulting join would look similar to this:

```sql
INNER JOIN secondary_table ON main_table.main_table_column = secondary_table.secondary_table_column
```

as you can see, an `INNER JOIN` will be used by default. if you want another type of join you must add the type property in this way:

```javascript
const joinExample = { 
    table : 'secondary_table',
    type : 'LEFT',
    on : [ 'main_table_column', 'secondary_table_column' ]
}
```

the resulting join would look similar to this:

```sql
LEFT JOIN secondary_table ON main_table.main_table_column = secondary_table.secondary_table_column
```
so you can use the `INNER`, `LEFT` and `CROSS` joins.

These options assume that the operator you want to use is `=`. However if you want to use another one you will have to transform `on` into an object with the `columns` and `operator` properties as follows:

```javascript
const joinExample = { 
    table : 'secondary_table',
    type : 'LEFT',
    on : {
        columns :[ 'main_table_column', 'secondary_table_column' ],
        operator : '>'
    }
}
```

the resulting join would look similar to this:

```sql
LEFT JOIN secondary_table ON main_table.main_table_column > secondary_table.secondary_table_column
```

and finally, if you want to join more than two tables you can pass an array to the join property. This array must have objects like the previous ones:

```javascript
const joinExample = [
    { 
        table : 'secondary_table',
        type : 'LEFT',
        on : {
            columns :[ 'main_table_column', 'secondary_table_column' ],
            operator : '>'
        }
    },
    {
        table : 'other_secondary_table',
        on : [ 'main_table_column', 'other_secondary_table_column' ],

    }
]
```

the resulting join would look similar to this:

```sql
LEFT JOIN secondary_table 
    ON main_table.main_table_column > secondary_table.secondary_table_column
INNER JOIN other_secondary_table 
    ON main_table.main_table_column = other_secondary_table.secondary_table_column
```


# since version 3.0.4 we have two new methods: 'exist' and 'count'.

## exist

The `exist` method is used to find out if there is a row in a table that meets a given condition, or not. It returns a Promise that resolves to a boolean. It requires as parameters the database as a string, the table name as a string, the condition as a where object and a connector if desired.

### Usage

to check if there is at least one row that meets the condition you can use the following syntax:

```javascript
const objectToQuery = {
    db: 'dataBase1',
    table: "the_table",
    where: {name: "Alex"}
}
async function theData() {
    console.log(await session.exist(objectToQuery));
}
theData();
```

You can also use `.then` for handling the Promise:

```javascript
session.exist(objectToQuery).then(data => {
    console.log(data);
});
```

if in the table 'the_table' of the database 'dataBase1' there is at least one row whose column 'name' has as value 'Alex'. The code will return a promise that will resolve to true, if on the contrary, there is no row that meets this condition, the returned promise will resolve to false.

## count

The `count` method is used to know the number of rows that meet a condition. It returns a Promise that resolves to a number. It requires as parameters the database as a string, the table name as a string, the condition as a where object and a connector if desired.

### Usage

to know the number of rows that meet a condition you can use the following syntax:

```javascript
const objectToQuery = {
    db: 'dataBase1',
    table: "the_table",
    where: {name: "Alex"}
}
async function theData() {
    console.log(await session.count(objectToQuery));
}
theData();
```

You can also use `.then` for handling the Promise:

```javascript
session.count(objectToQuery).then(data => {
    console.log(data);
});
```

This code will check the table 'the_table' in the database 'dataBase1' and will count the rows whose value in the column 'name' is 'Alex'. Then it will return a promise that will be resolved to the number found.

## executeSQL

This method allows the direct use of sql allowing the package to reach its maximum versatility.

it receives the parameters: 
- db
- query
- logQuery
- emptyResult
- processColumns
- processRows

and returns a promise that can resolve to rows (in case of using select) or the number of altered rows in case of using insert delete or upudate.

### Usage

```javascript
    const db = 'dataBase1'

    const query =
    `
    SELECT * FROM my_table WHERE name = ?-John-?
    `;

    const result = await session.executeSQL({ db, query })
    console.log(result);
```
note the use of __?- -?__
these "keys" are used to replace the typical placeholders.

I have always found placeholders to be cumbersome, it adds parameters to the methods and it is not clear what you are trying to do at a glance.

with this method the sql statement is clearer. however to resist sql injection and increase security... my system uses the traditional placeholders on the back... therefore you must mark the parts of the statement that come from outside with __?- -?__

```javascript
    const my_data = { /* data coming from outside */ }

    const db = 'dataBase1'
    const query =
    `
    SELECT * FROM my_table WHERE name = ?-${ my_data.name }-?
    `;

    const result = await session.executeSQL({ db, query })
    console.log(result);
```
Another important consideration is that given the sqlite3 architecture, you cannot mix SELECT queries with other queries at the first level.

If you are going to do a select, you must do only one select and your statement must begin with SELECT

if you are not going to do any select in the first level you can do whatever you want with the rest of the clauses (if you do a select in a query that does not start with ``SELECT`, there will be no error, but no rows will be returned)

## Recommendations

- **Avoid Referencing the Same Database from Different Instances**: 
    It's not advisable to reference the same database from two different `SqliteExpress` instances.

    ```javascript
    const instance1 = new SqliteExpress();
    const instance2 = new SqliteExpress();

    instance1.createDB({route : '.the_sameroute/the_same_DB.db'});
    instance2.createDB({route : '.the_sameroute/the_same_DB.db'});
    ```

    The class is designed to manage the waiting list of a database in order. However, with two instances pointing to the same file, there could be an asynchronicity conflict, negating the package's benefits.

- **Different Instances for Different Databases**: 
    It's generally a good idea to create different instances for different databases. This allows you to assign default values suitable for each instance. Nevertheless, the class is equipped to handle multiple databases if desired.

- **Utilize Default Values**: 
    Default values are handy and allow for cleaner subsequent code.

    note that since version 3.0.5 changed the order of the selcect parameters since join was added, so I recommend to use the parameters as objects.

- **The `logQuery` Parameter**: 
    In this version, all methods have a `logQuery` parameter which defaults to `true`. This prints the generated SQL query to the console for further analysis. If you'd prefer less information in the console, you can set its default value to `false` or pass a `false` value to the methods as you see fit.


# License
This software is licensed under the ISC License. The ISC License is a permissive free software license, allowing for freedom to use, modify, and redistribute the software, with some conditions. For the complete terms and conditions, please see the LICENSE file in the root directory of this project.