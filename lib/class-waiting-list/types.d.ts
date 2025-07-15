import { Database } from "sqlite3";
import { DBType } from "../class-db/types";

export interface WaitingListType
{
    database:DBType;
    list:function[];
    isRunning: boolean;
    addOperation(method:function, parameters:object): Promise<any>;
    run():void;
};


export interface WaitingListClass
{
    new(database:DBType):WaitingListType;
};

export interface WaitingListConstructorMethod
{
    (database:DBType):WaitingListType;
};

export interface WaitingListRunMethod
{
    ():Promise<void>;
};


export type WaitingListAddMethod = (method:function, parameters:object) => Promise<any>;