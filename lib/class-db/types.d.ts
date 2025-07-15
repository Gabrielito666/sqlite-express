import { Database } from "sqlite3";
import { WaitingListType } from "../class-waiting-list/types";
import { OptionsType } from "../options/types";
import { SqliteExpressType } from "../sqlite-express/types";

export interface DBType
{
    sqliteDb:Database;
    waitingList:WaitingListType;
    defaultOptions:OptionsType;
}

export interface DBClass
{
    new(params:{
        context:SqliteExpressType,
        route:string,
        logQuery:boolean
    }):DBType;
};

export interface DBConstructorMethod
{
    (params:{
        context:SqliteExpressType,
        route:string,
        logQuery:boolean
    }):DBType;
}