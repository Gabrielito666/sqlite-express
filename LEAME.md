### SQLite-Express Versión 5

sqlite-express es un paquete npm diseñado para simplificar la interacción con sqlite3. Tiene un diseño basado en promesas y es menos complejo que el paquete original.

#### Instalación

Para instalar, ejecuta el siguiente comando en tu terminal:

```bash
npm i sqlite-express
```

#### Inicialización

Para instanciar el paquete, comienza con estas líneas:

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress();
```

Con esta nueva instancia, puedes ejecutar todos los métodos. El constructor de SqliteExpress admite un parámetro con la ruta raíz que deseas utilizar; esta será `process.cwd()` por defecto.

```javascript
const SqliteExpress = require('./index');
const path = require("path");
const dataDir = path.resolve(process.cwd(), "data");
const sqliteExpress = new SqliteExpress(dataDir);
```

#### Características Clave

1. **Sistema de Cola:** La característica más sustancial es la integración de una cola para serializar operaciones. Esto evita conflictos con el orden de operaciones y previene la sobrecarga de la base de datos. Así, eres libre de usar bucles.

2. **Sistema de Transacciones:** Es un sistema de encolado adicional al anterior que protege el orden de una serie de interacciones con la base de datos de forma estricta. Este sistema protege operaciones que deben ser seriales a pesar de tener procesos asincrónicos simultáneos como dos promesas con bucles o situaciones similares.

3. **Propiedad de Opciones por Defecto:** Otra característica es la propiedad `defaultOptions`. Elimina la necesidad de pasar repetidamente los mismos argumentos a los métodos que utilizas siempre. Todas las propiedades que usas en métodos pueden ser establecidas en este objeto. A continuación hay una lista de estas propiedades.

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

Puedes modificar estos valores individualmente o con el método `set`:

```javascript
session.defaultOptions.table = 'la_tabla';
session.defaultOptions.db = Db;
// ... y así sucesivamente

session.defaultOptions.set({
    table: 'la_tabla',
    db: Db,
    route: './nuevaCarpeta/mi_base_datos.db',
    logQuery: false
});
```

Con el método set no necesitas poner todas las opciones por defecto. Solo las que quieras.

## Tipos

Los tipos de datos para cada opción están definidos en el tipo Params. Puedes acceder al tipo de cualquier opción importando este, ej: `Params["where"]`. De todas formas, voy a hacer un pequeño repaso de los tipos de cada propiedad antes de hablar de los métodos:

#### route
Es una cadena correspondiente a una ruta en tu sistema de archivos que apunta a tu base-de-datos.db, se utiliza para crear la DB. Ej: `./data/database.db`.

#### db
Es un objeto que representa la base de datos; se crea con el método createDB de una instancia de SqliteExpress. Más adelante explicaré este objeto.

#### Table
Es una cadena con el nombre de una tabla o un objeto Table. Más adelante se explicará con detalle.

#### Where
Es un objeto con muchas posibilidades de formato; sirve para indicar condiciones en métodos como select, update, count o exist. Su versión más simple es:
```js
{ [column] : value }
```
En este caso se traduce en `WHERE [column] = [value]`. Es muy simple y útil en la mayoría de los casos. Utiliza por defecto el operador `=`. Si quieres utilizar otro, puedes hacer:
```js
{ [column] : {
    value: [value],
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT"| "IN" | "NOT IN";
} }
```
esto se traduce en `WHERE [column] [operator] [value]`.

Tanto en la primera como segunda opción, value puede ser un array de valores. En cuyo caso se concatenarán esas sentencias con un AND, ej:
```js
{
    nombre: {
        value: ["John", "David"],
        operator: "!="
    }
}
// RESULTADO: WHERE nombre != John AND nombre != David
```
Esto es especialmente útil en casos de uso para los operadores IN y NOT IN:
```js
{
    nombre: {
        value: ["John", "David"],
        operator: "IN"
    }
}
// RESULTADO: WHERE nombre IN("John", "David")
```
Finalmente, si quieres no depender del conector por defecto AND o quieres anidar condiciones de forma más avanzada, puedes envolver una sentencia anterior en un array y asignarlo a una propiedad AND u OR:
```js
{
    OR : [
        nombre: {
            value: ["John", "David"],
            operator: "IN"
        },
        AND: [
            { edad: 18 },
            { ciudad: "new york" }
        ]
    ]
}
// RESULTADO: WHERE (nombre IN ("John", "David") OR (edad = 18 AND ciudad = "new york" ))
```

#### columns
Sirve para declarar tablas; es un objeto con la propiedad como el nombre de la columna y el valor como el tipo de dato SQLite. Ej:
```js
{ nombre: "TEXT", edad: "INTEGER" }
```

#### select
Sirve para indicar lo que se desea seleccionar con el método select. Puede ser una cadena con el nombre de la columna o "*", puede ser un array con las diferentes columnas que se deseen o un objeto de objetos con propiedad as. Ej:
```js
const selectString = "myColumn";
const selectArray = ["myColumn", "myOtherColumn"];
const selectArrayWithAs = {
    myColumn: { as: "nombre" } ,
    myOtherColumn: { as: "edad" }
}
```
#### connector
Puede ser "AND" o "OR"; sirve para tener un valor inicial por defecto en una cláusula WHERE.

#### update
Es un objeto con propiedades para el nombre de columna y el valor a actualizar o una función actualizadora.
```js
const update1 = { nombre: "John" };
const update2 = { edad: (prevEdad) => (edad + 1) };
```
#### row
Es un objeto que representa una fila a insertar. Ej:
```js
const myRow = { nombre: "John", edad: 18 };
```
Es importante que coincidan con los tipos de datos que espera la tabla.

#### logQuery
Sirve para que un método imprima la consulta generada en la consola o no; es un booleano.

#### query
Es una cadena con texto SQL; algunos métodos te permiten ingresar consultas directamente.

#### expected
Sirve para que el método select te dé un tipo de respuesta u otro. Sus valores pueden ser "celd", "row", "column" o "rows".

#### parameters
Es un objeto que en consultas SQL te permite enviar parámetros. Si la consulta incluye @nombre, tu objeto parameters se vería así:
```js
{nombre: "David"}
```

#### type
Indica el tipo de consulta en métodos que aceptan texto SQL. Pueden ser "select", "insert", "update", "delete", "any" o "create". Por defecto será "any" y SqliteExpress tendrá que analizar el tipo de consulta para darte una respuesta apropiada, pero si se le pasa explícitamente el código será más robusto.

# Class SqliteExpress y sus Métodos



## sqliteExpress.createDB

El método `sqliteExpress.createDB` te permite crear una nueva base de datos SQLite o conectarte a una existente. Sus parámetros son: `route, logQuery` y retorna un objeto DB.

### Uso

Para crear o conectarte a una base de datos, usa la siguiente sintaxis:

```javascript
const db = sqliteExpress.createDB({ route: './data.db', logQuery: false });
```

En el ejemplo anterior, `createDB` es invocado con una ruta de "./data.db", que se refiere a un nuevo archivo de base de datos SQLite llamado "data.db" en el directorio relativo a donde la clase fue instanciada.

Si un archivo de base de datos con el mismo nombre ya existe en la ruta especificada, `createDB` establecerá una conexión a esa base de datos existente.

Es importante notar:
- Si la `route` no es proporcionada, se lanzará un error.

## sqliteExpress.createTable

El método `sqliteExpress.createTable` es usado para crear una nueva tabla en una base de datos SQLite, recibe `db, table, columns, logQuery` y retorna un objeto Table.

### Uso

Para crear una tabla en la base de datos, usa la siguiente sintaxis:

```javascript
const table = await sqliteExpress.createTable({
    db : db, //objeto creado con createDB
    table : "la_tabla", //string con el nombre de la tabla
    columns : { nombre: "TEXT", edad: "INTEGER", ciudad: "TEXT" }
});

```

En el ejemplo anterior, createTable es llamado con el objeto de base de datos, el nombre de tabla "la_tabla", y un objeto representando los nombres de columna y sus tipos de datos. Los nombres de columna y tipos de datos se definen dentro del objeto como pares clave-valor. En este caso, la tabla tendrá tres columnas: nombre de tipo text, edad de tipo integer, y ciudad de tipo text.

## sqliteExpress.insert

El método `sqliteExpress.insert` es usado para insertar datos en una tabla específica en una base de datos SQLite. Recibe `db, table, row, logQuery` y retorna el ID de la fila insertada si este es un número.

### Uso

Para insertar datos en una tabla en la base de datos, usa la siguiente sintaxis:

```javascript

const id = await sqliteExpress.insert({
    db : db,
    table : table,
    row : { nombre: "Juan", edad: 27, ciudad: "Nueva York" }
});
```
En el ejemplo anterior, insert es llamado con el objeto de base de datos, la tabla y un objeto representando los nombres de columna y sus valores correspondientes. El objeto consiste en pares clave-valor, donde las claves representan los nombres de columna y los valores representan los datos a ser insertados en esas columnas. En este caso, la columna nombre tendrá el valor "Juan", la columna edad tendrá el valor 27, y la columna ciudad tendrá el valor "Nueva York".

## sqliteExpress.update

El método `sqliteExpress.update` es usado para actualizar registros en una tabla específica en una base de datos SQLite. Recibe los parámetros `db, table, update, where, connector, logQuery` y retorna un número con la cantidad de filas afectadas.

### Uso

Para actualizar registros en una tabla basado en una condición específica, usa la siguiente sintaxis:

```javascript
const changes = await sqliteExpress.update({
    db : db,
    table : table,
    update : { nombre: "Alex" },
    where : { edad: 27 },
    connector : "OR"
});
```

En el ejemplo anterior, update es llamado con el objeto de base de datos, la tabla, un objeto representando la columna y los nuevos datos {nombre: "Alex"}, y un objeto representando la condición {edad: 27}. Esto significa que la columna nombre será actualizada a "Alex" si la columna edad coincide con el valor 27. Por ejemplo, si hay un registro con el nombre "Juan" y la edad 27, será actualizado a "Alex".

Una característica interesante que tiene este método es que algún valor de alguna columna de actualización puede ser una función:

```javascript
await sqliteExpress.update({
    db : db,
    table : table,
    update : { edad: (x) => (x + 1)},
    where : { nombre: "Alex" },
    connector : "OR"
});
```
En este caso seleccionará todas las filas cuya columna "nombre" contenga "Alex", tomará el valor actual de esa celda y añadirá 1.

## sqliteExpress.delete

El método `sqliteExpress.delete` es usado para eliminar registros de una tabla específica en una base de datos SQLite basado en una condición. Recibe `db, table, where, connector, logQuery` y retorna un número con la cantidad de filas eliminadas.

### Uso

Para eliminar filas de una tabla basado en una condición específica, usa la siguiente sintaxis:


```javascript
const changes = await sqliteExpress.delete({
    db : db,
    table : table,
    where : {edad: 27}
});
```

En el ejemplo anterior, delete es llamado con el objeto de base de datos, la tabla y un objeto representando la condición {edad: 27}. Esto significa que todos los registros en la tabla con una columna edad igual a 27 serán eliminados.

## sqliteExpress.select

El método `sqliteExpress.select` es usado para recuperar datos de una tabla específica en una base de datos SQLite basado en una condición. Recibe los parámetros `db, table, select, where, connector, expected, logQuery` y retorna una representación de los datos.

### Uso

Para seleccionar datos de una tabla basado en una condición específica, usa la siguiente sintaxis:

```javascript


const ciudad = await sqliteExpress.select({
    db: db,
    table: table,
    select: "ciudad",
    where: { nombre: "Alex" },
    expected: "celd"
});

console.log(ciudad) //el valor de la celda

```
Aquí toma relevancia expected: si le pasas "celd" retornará solo un valor escalar, como una cadena o número por ejemplo. Si le pasas "row" retornará un objeto de valores escalares tipo { [columnName]: [scalarValue] }, si le pasas "column" retornará un array de valores escalares representando todos los resultados de una sola columna y si le pasas "rows" retornará un array de filas.

## sqliteExpress.exist

El método `sqliteExpress.exist` es usado para saber si hay una fila en una tabla que cumple una condición dada. Recibe `db, table, where, connector, logQuery` y retorna una promesa que se resuelve a un booleano.

### Uso

Para verificar si hay al menos una fila que cumple la condición puedes usar la siguiente sintaxis:

```javascript
const verificacion = await sqliteExpress.exist({
    db: db,
    table: table,
    where: {nombre: "Alex"}
});
```

Si en la tabla de la base de datos hay al menos una fila cuya columna 'nombre' tiene como valor 'Alex', el código retornará una promesa que se resolverá a true. Si por el contrario no hay ninguna fila que cumpla esta condición, la promesa retornada se resolverá a false.

## sqliteExpress.count

El método `sqliteExpress.count` es usado para saber el número de filas que cumplen una condición. Recibe `db, table, where, connector, logQuery` y retorna una promesa que se resuelve a un número.

### Uso

Para saber el número de filas que cumplen una condición puedes usar la siguiente sintaxis:

```javascript
    const quantity = await sqliteExpress.count({
    db: db,
    table: table,
    where: { nombre: "Alex" }
});
```

Este código verificará la tabla en la base de datos y contará las filas cuyo valor en la columna 'nombre' es 'Alex'. Luego retornará una promesa que se resolverá al número encontrado.

## sqliteExpress.executeSQL

Este método permite el uso directo de SQL permitiendo al paquete alcanzar su máxima versatilidad.

Recibe los parámetros `db, query, logQuery, expected, type, parameters` y retorna una promesa que puede resolverse diferente según el tipo de consulta pasado en type. Expected se utiliza en el caso de type="select".

### Uso

```javascript

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: "SELECT * FROM mi_tabla WHERE nombre = ?-Juan-?",
        type: "select",
        expected: "row"
    })
    console.log(result);
```
Si no paso type, el código detectará qué tipo de consulta es observando el primer comando que en este caso es "SELECT". Sin embargo, es mejor saltarse este paso de inferencia y pasarlo en type.

Nota el uso de __?- -?__: estas "claves" son usadas para reemplazar los marcadores de posición típicos.

Siempre he encontrado que los marcadores de posición son engorrosos, añaden parámetros a los métodos y no es claro lo que estás tratando de hacer de un vistazo.

Con este método la declaración SQL es más clara. Sin embargo, para resistir la inyección SQL y aumentar la seguridad, mi sistema usa los marcadores de posición tradicionales por detrás. Por lo tanto, debes marcar las partes de la declaración que vienen de afuera con __?- -?__.

```javascript
    const mis_datos = { nombre: "John" };

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: `SELECT * FROM mi_tabla WHERE nombre = ?-${ mis_datos.nombre }-?`
        type: "select",
        expected: "row"
    })
    console.log(result);
```

De todas formas, si prefieres no utilizar esta forma de añadir parámetros externos, hay otra forma más directa y es por medio del argumento parameters:

```javascript
    const mis_datos = { nombre: "John" };

    const result = await sqliteExpress.executeSQL({
        db: db,
        query: `SELECT * FROM mi_tabla WHERE nombre = @nombre`,
        type: "select",
        expected: "row"
        parameters: mis_datos
    })
    console.log(result);
```

Otra consideración importante es que dada la arquitectura de SQLite3, no puedes mezclar consultas SELECT con otras consultas en el primer nivel.

Si vas a hacer un select, debes hacer solo un select y tu declaración debe comenzar con SELECT.

Si no vas a hacer ningún select en el primer nivel, puedes hacer lo que quieras con el resto de las cláusulas. (Si haces un select en una consulta que no comienza con `SELECT`, no habrá error, pero no se retornarán filas).

## sqliteExpress.declareSQL

Este método es similar al anterior pero tiene mejoras de rendimiento y sirve para tener una arquitectura de consultas más robusta en algunos casos. Recibe `db, query, logQuery, expected, type` y retorna una función reutilizable que solo recibe parameters como argumento.

```javascript
    const selectByNameFunc = await sqliteExpress.declareSQL({
        db: db,
        query: `SELECT * FROM mi_tabla WHERE nombre = @nombre`,
        type: "select",
        expected: "row"
    })
    //y luego:

    const johnRow = await selectByNameFunc({ nombre: "John" });
```

En este caso el sistema de placeholders con formato __?--?__ no funciona, así que solo debe ser utilizado por medio de parameters.

## sqliteExpress.beginTransaction, sqliteExpress.commit y sqliteExpress.rollback

Son funciones de utilidad que no reciben parámetros y ejecutan comandos rápidamente.

```js
await sqliteExpress.beginTransaction();
try
{
    const result = await sqliteExpres.select();
    await sqliteExpress.commit();
    console.log(result);
}
catch(err)
{
    await sqliteExpress.rollback();
    console.error(err);
}
```
Por detrás solo ejecutan sus respectivos comandos en SQL.

# Class DB y sus métodos

La clase DB representa objetos de base de datos. El método sqliteExpress.createDB retorna una instancia de DB que, como ya vimos, puedes usar como argumento en métodos de sqliteExpress. Sin embargo, DB tiene sus propios métodos. Todos los métodos de sqliteExpress están en DB (excepto createDB). En este caso, los métodos son iguales pero no reciben argumento db, simplemente usan su propia instancia como argumento.

```js
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

await db.createTable(/*bla bla bla*/);
```

## db.createTransaction

La instancia de db también tiene un método muy poderoso llamado db.createTransaction que crea una instancia de transaction.

```js
const transaction = db.createTransaction();
```

Esta comparte todos los métodos de la db, y tampoco necesita parámetro db en sus métodos. Pero tiene dos métodos extra: `start` y `end`.

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
Luego de ejecutar transaction.start(), el sistema esperará a que todas las transacciones que estén corriendo terminen antes de comenzar con la tuya. Luego ejecutará los métodos que utilice transaction bloqueando todas las llamadas de otras transacciones que se hagan asincrónicamente, garantizando un aislamiento total. Cuando llamas a transaction.end(), la transacción se desecha y sigue corriendo la lista de las próximas transacciones. (Por ende es importantísimo llamar a transaction.end() o bloquearás todas las llamadas siguientes).

Esto no es siempre necesario, pero en ocasiones particulares puede ser muy útil. No es muy compatible con el método declareSQL ya que la naturaleza de la transacción es efímera y pensada para no persistir.

# Class Table y sus métodos

Los métodos createTable de SqliteExpress o de DB retornan una instancia de Table. Este objeto, además de servir como parámetro table en los métodos de las otras clases, cuenta con los métodos simples: `select, insert, update, delete, exist y count` y por defecto ya incorporan el argumento table.

```js
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

const table = await db.createTable(/*bla bla bla*/);

await table.select(/*bla bla bla*/);
```

## Recomendaciones

- **Evita Referenciar la Misma Base de Datos desde Diferentes Instancias**: 
    No es aconsejable referenciar la misma base de datos desde dos instancias diferentes de `SqliteExpress`.

    ```javascript
    const instancia1 = new SqliteExpress();
    const instancia2 = new SqliteExpress();

    instancia1.createDB({route : '.la_misma_ruta/la_misma_BD.db'});
    instancia2.createDB({route : '.la_misma_ruta/la_misma_BD.db'});
    ```

    La clase está diseñada para manejar la lista de espera de una base de datos en orden. Sin embargo, con dos instancias apuntando al mismo archivo, podría haber un conflicto de asincronía, negando los beneficios del paquete.

## Versión 5

Desde la versión 5 en adelante se abandonan opciones antiguas de select: `processRows, processColumns y emptyResult`. Esto servía para formatear respuestas de select pero era un sistema más inestable; ahora con expected y sus diferentes opciones se consigue un manejo más robusto de las respuestas de select.

Anteriormente las bases de datos se referenciaban con una key de tipo string. Ahora key ya no es una opción y se utiliza directamente el objeto db.

Join era una opción para crear sentencias join en versiones anteriores. Dada la naturaleza de un join y sus múltiples capas de dificultad semántica, decidí quitar la opción. Solo añadía complejidad muy difícil de representar en formato de objeto JavaScript. Ahora, para obtener ese comportamiento se recomienda utilizar executeSQL o declareSQL.

# Licencia
Este software está licenciado bajo la Licencia ISC. La Licencia ISC es una licencia de software libre permisiva, permitiendo libertad para usar, modificar, y redistribuir el software, con algunas condiciones. Para los términos y condiciones completos, por favor ve el archivo LICENSE en el directorio raíz de este proyecto.