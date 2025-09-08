#### Pensar en si implementar un mapeador de querys de un directorio:

```js
const dir = await sqliteExpress.mapDir("./the/path");

const stmt1 = dir.getStatement("create-users-table.sql");
const stmt2 = dir.getStatement("insert-user.sql");
const stmt3 = dir.getStatement("selects/select-user.sql");
```