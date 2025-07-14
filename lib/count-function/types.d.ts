import { Database } from "sqlite3";
import { Where } from "../get-where-statement";

export type CountFunction = (params:
{
    db:Database;
    table:string;
    where:Where;
    connector:"AND"|"OR";
    logQuery:boolean;
}) => Promise<number>;