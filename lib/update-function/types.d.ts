import { Database } from "sqlite3";
import { Where } from "../types/index";

type updateFunctionParam = <T>(value:T) => T;
type UpdateParam = {[key: string]: (string|number|boolean|updateFunctionParam|object)};

export type UpdateFunction = (params: {
    db: Database;
    table: string;
    update: UpdateParam;
    where: Where;
    connector: "AND"|"OR";
    logQuery: boolean;
}) => Promise<number>;