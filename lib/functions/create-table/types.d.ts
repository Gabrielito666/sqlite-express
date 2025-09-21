import { ColumnsArg, LogQueryArg, TableNameArg } from "../../types/index";
import { Table } from "../../class/table/types";
import { DB } from "../../types/index";
import { Database } from "sqlite3";

/**
 * Recibe un array con dos firmas de database ya que la función las requirer pero la implementación de
 * DB.prototype.createTable() nesecita tener dos argumentos solamente
 */

export type CreateTableFunction = (dbs:[sqliteDb:Database, db:DB], args: (TableNameArg & ColumnsArg & LogQueryArg)) => Promise<Table>;
