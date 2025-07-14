import { Database } from "sqlite3";

export interface DBPrototype
{
    addOperation(method:function, parameters:object): Promise<any>;
    runWaitingList():void;
};

export interface DBType extends DBPrototype
{
    sqliteDb:Database;
    key:string;
    waitingList:(()=>Promise<void>)[];
    isRunning: boolean;
}


export interface DBConstructor
{
    new(sqliteDb:Database, key:string):DBType;
    prototype: DBPrototype;
};

export type dbConstructorFunc = (sqliteDb:Database, key:string) => DBType;
export type dbAddOperationMethod = (method:function, parameters:object) => Promise<any>;