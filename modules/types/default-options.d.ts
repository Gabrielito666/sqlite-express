import { ColumnType } from "./sqlite-express";

export interface DefaultOptionsProps {
  emptyResult?: any;
  route?: string;
  db?: string;
  key?: string;
  table?: string;
  where?: object;
  columns?: {[string]: ColumnType};
  select?: string | string[];
  connector?: "AND" | "OR";
  update?: object;
  row?: object;
  processColumns?: boolean;
  processRows?: boolean;
  logQuery?: boolean;
  query?: string;
  join?: object;
}

export interface DefaultOptionsPrototype
{
    set(options:DefaultOptionsProps):void;
    get rootPath():string;
    get emptyResult():any;
    get route():string;
    get db():string;
    get key(): string;
    get table(): string;
    get where(): object;
    get columns(): {[string]: ColumnType};
    get select(): string | string[];
    get connector(): "AND" | "OR";
    get update(): object;
    get row(): object;
    get processColumns(): boolean;
    get processRows(): boolean;
    get logQuery(): boolean;
    get query(): string;
    get join(): object;

    set rootPath(value:string):void;
    set emptyResult(value:any):void;
    set route(value:string):void;
    set db(value:string):void;
    set key(value: string):void;
    set table(value: string):void;
    set where(value: object):void;
    set columns(value: {[string]: ColumnType}):void;
    set select(value: string | string[]):void;
    set connector(value: "AND" | "OR"):void;
    set update(value: object):void;
    set row(value: object):void;
    set processColumns(value: boolean):void;
    set processRows(value: boolean):void;
    set logQuery(value: boolean):void;
    set query(value: string):void;
    set join(value: object):void;
}

export interface DefaultOptionsType extends DefaultOptionsPrototype
{
    private _rootPath?: string;
    private _emptyResult?: any;
    private _route?: string;
    private _db?: string;
    private _key?: string;
    private _table?: string;
    private _where?: object;
    private _columns?: {[string]: ColumnType};
    private _select?: string | string[];
    private _connector?: "AND" | "OR";
    private _update?: object;
    private _row?: object;
    private _processColumns?: boolean;
    private _processRows?: boolean;
    private _logQuery?: boolean;
    private _query?: string;
    private _join?: object;
};

export interface DefaultOptionsConstructor{
    new(route:string):DefaultOptionsType;
    prototype: DefaultOptionsPrototype;
}