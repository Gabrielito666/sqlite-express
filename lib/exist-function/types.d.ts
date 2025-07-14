import { Database } from "sqlite3";
import { Where, Connector } from "../types";

export type ExistFunction = (params:{   
    db:Database;
    table:string;
    where:Where;
    connector: Connector;
    logQuery:boolean;
}) => Promise<boolean>;