5) Testear
(PREPARE HAY QUE IMPLEMENTARLE UN FINALIZE::: ADEMAS db.prepare es sync... ojo con eso)

WHERE cambios: Ahora solo se permite:

sentencia con igaual por defecto:
{ [colName]: CellValue }

sentencia con operator comparision:
["colName", "="|"<"|etc..., value]

sentencia con operador de lista ("IN" y "NOT IN")
["colName", "IN"|"NOT IN", value]

union lógica de sentencias:
{
    AND: [Lista de sentencias como las anteriores]
}
{
    OR:  [Lista de sentencias como las anteriores]
}

ya no hay connector

# QUEDE EN EL TESD DE EXIST

6) Pensar en si implementar un mapeador de querys de un directorio onda

```js
const dir = await sqliteExpress.mapDir("./the/path");

const stmt1 = dir.getStatement("create-users-table.sql");
const stmt2 = dir.getStatement("insert-user.sql");
const stmt3 = dir.getStatement("selects/select-user.sql");
```

## Documentar claramente que el insert ya no parsea nada de lo que le pases.
