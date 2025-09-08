### SQLite-Express Versión 6

**sqlite-express** es un paquete de npm diseñado para simplificar la interacción con **sqlite3**. Tiene un diseño basado en **promesas** y es menos complejo que el paquete original.

#### Instalación

Para instalar, ejecuta en tu terminal:

```bash
npm i sqlite-express
```

#### Inicialización

Para instanciar el paquete, comienza con estas líneas:

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress();
```

Con esta nueva instancia, puedes ejecutar todos los métodos. El constructor de **SqliteExpress** admite un parámetro opcional para indicar si se imprimen o no las consultas en la consola.

```javascript
const SqliteExpress = require('./index');
const sqliteExpress = new SqliteExpress({ logQuery: false });
```

---

## Tipos

Los tipos de datos para cada opción están definidos en el tipo **Params**. Puedes acceder al tipo de cualquier opción importando este, por ejemplo: `Params["where"]`. Aun así, haré un pequeño repaso de los tipos de cada propiedad antes de hablar de los métodos:

#### route
Cadena que corresponde a una ruta en tu sistema de archivos y apunta a tu base de datos (`.db`). Se utiliza para crear o abrir la DB. Ej.: `./data/database.db`.

#### db
Objeto que representa la base de datos; se crea con el método `createDB` de una instancia de **SqliteExpress**. Más adelante se explica este objeto.

#### tableName
Cadena que representa el nombre de una tabla.

#### table
Cadena con el nombre de una tabla o un objeto **Table**. Más adelante se detalla.

#### where
Objeto flexible que sirve para indicar condiciones en métodos como `select`, `update`, `count` o `exist`. Es siempre opcional. Su versión más simple es:

```javascript
{ [column]: value }
```

En este caso se traduce a `WHERE [column] = [value]`. Por defecto utiliza el operador `=`. Si quieres utilizar otro, puedes usar el formato:

```javascript
[column, operator, value]
// operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT" | "IN" | "NOT IN"
```

Esto se traduce a `WHERE [column] [operator] [value]`.

En el caso de `IN` y `NOT IN`, el tercer elemento del arreglo puede ser un arreglo:

```javascript
["nombre", "IN", ["John", "David"]];
// Resultado: WHERE nombre IN ("John", "David")
```

Finalmente, si quieres unir más de una sentencia con conectores `AND` u `OR`, o anidar condiciones, puedes envolver una sentencia anterior en un arreglo y asignarlo a una propiedad `AND` u `OR`:

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
// Resultado: WHERE (nombre IN ("John", "David") OR (edad = 18 AND ciudad = "new york"))
```

#### columns
Sirve para declarar tablas; es un objeto con la propiedad como nombre de la columna y el valor como el tipo de dato SQLite. Ej.:

```javascript
{ nombre: "TEXT", edad: "INTEGER" }
```

#### select
Indica qué se desea seleccionar con el método `select` (opcional). Puede ser una cadena con el nombre de la columna o `"*"`, un arreglo con columnas, o un objeto con alias:

```javascript
const selectString = "myColumn";
const selectArray = ["myColumn", "myOtherColumn"];
const selectArrayWithAs = {
  myColumn: { as: "nombre" },
  myOtherColumn: { as: "edad" }
};
```

#### update
Objeto con las columnas a actualizar o una **función actualizadora**:

```javascript
const update1 = { nombre: "John" };
const update2 = { edad: (prevEdad) => prevEdad + 1 };
```

#### row
Objeto que representa una fila a insertar. Ej.:

```javascript
const myRow = { nombre: "John", edad: 18 };
```

Es importante que coincida con los tipos de datos que espera la tabla.

#### logQuery
Booleano que permite imprimir o no la consulta generada en la consola. Es opcional y está en todos los métodos. Además, en la instanciación de **SqliteExpress** puedes pasarlo como parámetro para que se propague como _default_ a los métodos que no lo expliciten.

#### query
Cadena con texto SQL; algunos métodos permiten ingresar consultas directamente.

#### parameters
Objeto que permite enviar parámetros a consultas SQL. Si tu consulta incluye `@nombre`, tu objeto `parameters` se vería así:

```javascript
{ nombre: "David" }
```

---

# Clase SqliteExpress y sus métodos

## sqliteExpress.createDB

El método `sqliteExpress.createDB` permite crear una nueva base de datos SQLite o conectarte a una existente. Sus parámetros son: `route`, `logQuery`, y retorna un objeto **DB**.

### Uso

Para crear o conectarte a una base de datos:

```javascript
const db = sqliteExpress.createDB({ route: './data.db' });
```

En el ejemplo anterior, `createDB` recibe una ruta (idealmente absoluta).  
Si ya existe un archivo de base de datos con el mismo nombre en la ruta especificada, `createDB` establecerá una conexión a esa base existente.

**Importante:**
- Si `route` no es proporcionada, se lanzará un error.

## sqliteExpress.createTable

Crea una nueva tabla en una base de datos SQLite. Recibe `db, tableName, columns, logQuery` y retorna un objeto **Table**.

### Uso

```javascript
const table = await sqliteExpress.createTable({
  db: db, // objeto creado con createDB
  tableName: "la_tabla", // nombre de la tabla
  columns: { nombre: "TEXT", edad: "INTEGER", ciudad: "TEXT" }
});
```

En el ejemplo, `createTable` es llamado con el objeto de base de datos, el nombre de tabla `"la_tabla"` y un objeto con los nombres de columna y sus tipos de datos.

## sqliteExpress.insert

Inserta datos en una tabla específica. Recibe `db, table, row, logQuery` y retorna el ID de la fila insertada si este es numérico.

### Uso

```javascript
const id = await sqliteExpress.insert({
  db: db,
  table: table,
  row: { nombre: "Juan", edad: 27, ciudad: "Nueva York" }
});
```

## sqliteExpress.update

Actualiza registros en una tabla específica. Recibe `db, table, update, where, logQuery` y retorna el número de filas afectadas.

### Uso

```javascript
const changes = await sqliteExpress.update({
  db: db,
  table: table,
  update: { nombre: "Alex" },
  where: { edad: 27 }
});
```

Una característica interesante es que el valor de alguna columna puede ser una función:

```javascript
await sqliteExpress.update({
  db: db,
  table: table,
  update: { edad: (x) => x + 1 },
  where: { nombre: "Alex" }
});
```

En este caso, se seleccionarán las filas cuyo `nombre` sea "Alex", se tomará el valor actual de `edad` y se le sumará 1.

## sqliteExpress.delete

Elimina registros de una tabla basada en una condición. Recibe `db, table, where, logQuery` y retorna el número de filas eliminadas.

### Uso

```javascript
const changes = await sqliteExpress.delete({
  db: db,
  table: table,
  where: { edad: 27 }
});
```

## sqliteExpress.select

Recupera datos de una tabla (con o sin condición). Recibe `db, table, select, where, logQuery` y retorna una representación de los datos.

### Uso

Por defecto, retorna un **array de objetos**:

```javascript
const data = await sqliteExpress.select({
  db: db,
  table: table,
  select: "*"
});
```

También puedes obtener otros tipos de retorno:

```javascript
const ciudad = await sqliteExpress.select.celd({
  db: db,
  table: table,
  select: "ciudad",
  where: { nombre: "Alex" }
});

console.log(ciudad); // valor de la celda
```

Opciones disponibles:
- `select` → por defecto se comporta como `select.rows`
- `select.rows` → retorna un array de objetos
- `select.row` → retorna un objeto
- `select.column` → retorna un array de valores escalares
- `select.celd` → retorna un valor escalar

## sqliteExpress.exist

Verifica si existe al menos una fila que cumpla una condición. Recibe `db, table, where, logQuery` y retorna una promesa que se resuelve a un **booleano**.

### Uso

```javascript
const existe = await sqliteExpress.exist({
  db: db,
  table: table,
  where: { nombre: "Alex" }
});
```

## sqliteExpress.count

Cuenta cuántas filas cumplen una condición. Recibe `db, table, where, logQuery` y retorna una promesa que se resuelve a un **número**.

### Uso

```javascript
const quantity = await sqliteExpress.count({
  db: db,
  table: table,
  where: { nombre: "Alex" }
});
```

## sqliteExpress.executeSQL

Permite el uso directo de SQL, maximizando la versatilidad del paquete.  
Recibe `db, query, logQuery, parameters` y retorna una promesa que se resuelve en el tipo `RunResult` de **sqlite3**. Este método está **enriquecido con submétodos** que cambian el tipo de retorno:

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

Opciones:
- `sqliteExpress.executeSQL` → variante por defecto igual a `.justRun`
- `sqliteExpress.executeSQL.justRun` → retorna `sqlite3.RunResult`
- `sqliteExpress.executeSQL.select` → por defecto igual a `.select.rows`
- `sqliteExpress.executeSQL.select.rows` → array de objetos
- `sqliteExpress.executeSQL.select.row` → objeto
- `sqliteExpress.executeSQL.select.column` → array de escalares
- `sqliteExpress.executeSQL.select.celd` → valor escalar
- `sqliteExpress.executeSQL.insert` → `number` (`lastRowId`)
- `sqliteExpress.executeSQL.update` → `number` (`changes`)
- `sqliteExpress.executeSQL.delete` → `number` (`changes`)

## sqliteExpress.declareSQL

Similar al anterior, pero con **mejoras de rendimiento** y pensado para una arquitectura de consultas más robusta en ciertos casos. Recibe `db, query, logQuery` y retorna una **función reutilizable** que solo recibe `parameters` como argumento.

```javascript
const selectByName = await sqliteExpress.declareSQL({
  db: db,
  query: "SELECT * FROM mi_tabla WHERE nombre = @nombre"
});

// Luego:
const johnRow = await selectByName.select.row({ nombre: "John" });
```

La función reutilizable (`statement`) expone las mismas variantes que `executeSQL`, para que recibas el tipo de retorno que necesites.

El *statement* puede finalizarse manualmente con `statement.finalize()` antes de cerrar la base de datos, esto lo dejará inutil pero liberará recursos. Si no los finaliza, `db.close()` lo hará


## sqliteExpress.begin, sqliteExpress.commit y sqliteExpress.rollback

Funciones de utilidad que no reciben parámetros (además de `logQuery`, opcional) y ejecutan comandos rápidamente.

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

Por detrás, solo ejecutan sus respectivos comandos en SQL.

`begin` además ofrece submétodos:
- `begin.transaction`
- `begin.inmediateTransaction`  // (nombre del submétodo tal cual en la librería)
- `begin.exclusiveTransaction`

Cada uno ejecuta en SQL su modalidad correspondiente.

---

# Clase DB y sus métodos

La clase **DB** representa objetos de base de datos. El método `sqliteExpress.createDB` retorna una instancia de **DB** que, como ya vimos, puedes usar como argumento en los métodos de **SqliteExpress**. Sin embargo, **DB** tiene sus propios métodos. Todos los métodos de **SqliteExpress** están en **DB** (excepto `createDB`). En este caso, los métodos son iguales pero **no** reciben el argumento `db`: usan la propia instancia.

```javascript
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

await db.createTable(/* ... */);
```

## db.createScope

La instancia de **db** también tiene un método muy potente llamado `db.createScope`, que crea una instancia de **Scope**:

```javascript
const scope = db.createScope();
```

Un *scope*, apenas se crea, se añade a una **cola de operaciones**. Esta cola espera a que todos los métodos llamados **con ese scope** terminen antes de comenzar el siguiente. Ejemplo:

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

En el ejemplo, luego de crear el scope hay un `db.insert`. Si no usáramos un scope, se ejecutaría de inmediato; pero como hay un scope vigente, **no** se ejecutará hasta que dicho scope termine. Después se crea una tabla **dentro del scope**, por lo que sí comenzará a ejecutarse. Luego se llama a `scope.close()`, lo que cierra el ámbito; ya no podrás pasar ese scope a ningún otro método. Tras el `close` y cuando todos los procesos del scope terminen, este se quita de la cola y se elimina, dando paso al siguiente (en este caso, se hará el `insert` que estaba esperando su turno).

Si no pasas ningún scope, el método utilizará un **scope comunitario** que maneja los métodos sin scope.

**IMPORTANTE**  
Los scopes son muy útiles para garantizar el **orden** de ejecución sin que otros llamados en la misma conexión intervengan, pero hay que evitar **bloquear** la cola de operaciones. En el mismo ejemplo anterior, si pones `await` al `insert`:

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

La cola quedará atascada, porque `db.insert` está esperando que el scope termine para pasar a la siguiente línea, pero eso no ocurrirá nunca si `scope.close()` está debajo.

Otra cosa a cuidar es **cerrar siempre el scope**; de lo contrario, bloquearás otros scopes que estén esperando su turno. Lo recomendado es crear uno para una transacción **específica** (por ejemplo, en un endpoint de una API REST), cerrarlo y listo. Si **no** necesitas serialidad, **evítalo**. Úsalo cuando no quieras que otro `COMMIT` o `ROLLBACK` arruine tu serialización de operaciones.

## db.getTable

Método que permite crear una instancia de **Table** **sin** depender de `db.createTable`. Este método **asume** que ya creaste la tabla (con el método o con SQL directamente). Si no, tus consultas fallarán. Es útil si tienes un sistema de inicialización que garantiza que las tablas existan; como es **síncrono**, puedes obtener la tabla por su `tableName` sin problemas.

## db.close

Método que cierra la **conexión**. Es una buena práctica por razones de rendimiento y seguridad. Recuerda que, una vez que llames a `close()`, ya no podrás usar esta instancia de **db** ni ninguno de los **statements** creados con `declareSQL` asociados a esta conexión.
---

# Clase Table y sus métodos

Los métodos `createTable` de **SqliteExpress** o de **DB** retornan una instancia de **Table**. Este objeto, además de servir como parámetro `table` en los métodos de las otras clases, cuenta con los métodos simples: `select`, `insert`, `update`, `delete`, `exist` y `count`, que por defecto ya incorporan el argumento `table`.

```javascript
const SqliteExpress = require("sqlite-express");
const sqliteExpress = new SqliteExpress();
const db = sqliteExpress.createDB({ route: "./data.db" });

const table = await db.createTable({ tableName: "users", columns: { name: "TEXT", age: "INTEGER" } });

await table.select({ select: "*"});
```

---

## Recomendaciones

- **Evita referenciar la misma base de datos desde diferentes instancias**  
  No es aconsejable referenciar la misma base de datos desde dos instancias diferentes de **SqliteExpress**.

  ```javascript
  const instancia1 = new SqliteExpress();
  const instancia2 = new SqliteExpress();

  instancia1.createDB({ route: './la_misma_ruta/la_misma_BD.db' });
  instancia2.createDB({ route: './la_misma_ruta/la_misma_BD.db' });
  ```

  La clase está diseñada para manejar la **lista de espera** de una base de datos **en orden**. Con dos instancias apuntando al mismo archivo, podría haber **conflictos de asincronía**, anulando los beneficios del paquete.

  Pueden existir patrones de diseño en los que quieras abrir otra conexión y usar `BEGIN` y `COMMIT` para manejar transacciones. Pero para proyectos **medianos**, no lo recomiendo.

---

# Licencia

Este software está licenciado bajo la **Licencia ISC**. Es una licencia de software libre **permisiva**, que permite usar, modificar y redistribuir el software, con algunas condiciones. Para los términos completos, revisa el archivo **LICENSE** en el directorio raíz de este proyecto.