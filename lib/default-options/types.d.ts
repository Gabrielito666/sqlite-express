import { ColumnType, Where, Connector, UpdateParams } from "../types/index";

export interface DefaultOptionsSetParams {
  route?: string;
  db?: string;
  key?: string;
  table?: string;
  where?: Where;
  columns?: {[key: string]: ColumnType};
  select?: string | string[];
  connector?: Connector;
  update?: UpdateParams;
  row?: {[key:string]:string|number|boolean|Object|null};
  logQuery?: boolean;
  query?: string;
  expected?: string;
  parameters?: {[key: string]: any};
  type?: string;
}

export interface DefaultOptionsConstructorMethod
{
    (route:string):DefaultOptionsType;
}
export interface DefaultOptionsSetMethod
{
    (options:DefaultOptionsSetParams):void;
}


export interface DefaultOptionsType
{
    _rootPath?: string;
    _route?: string;
    _db?: string;
    _key?: string;
    _table?: string;
    _where?: Where;
    _columns?: {[key: string]: ColumnType};
    _select?: string | string[];
    _connector?: Connector;
    _update?: UpdateParams;
    _row?: {[key:string]:string|number|boolean|Object|null};
    _logQuery?: boolean;
    _query?: string;
    _expected?: string;
    _parameters?: {[key: string]: any};
    _type?: string;

    set(options: DefaultOptionsSetParams): void;
    get rootPath():string;
    get route():string;
    get db():string;
    get key(): string;
    get table(): string;
    get where(): Where;
    get columns(): {[key: string]: ColumnType};
    get select(): string | string[];
    get connector(): Connector;
    get update(): UpdateParams;
    get row(): {[key:string]:string|number|boolean|Object|null};
    get logQuery(): boolean;
    get query(): string;
    get expected(): string;
    get parameters(): {[key: string]: any};
    get type(): string;

    set rootPath(value:string):void;
    set route(value:string):void;
    set db(value:string):void;
    set key(value: string):void;
    set table(value: string):void;
    set where(value: Where):void;
    set columns(value: {[key: string]: ColumnType}):void;
    set select(value: string | string[]):void;
    set connector(value: Connector):void;
    set update(value: UpdateParams):void;
    set row(value: {[key:string]:string|number|boolean|Object|null}):void;
    set logQuery(value: boolean):void;
    set query(value: string):void;
    set expected(value: string):void;
    set parameters(value: {[key: string]: any}):void;
    set type(value: string):void;
};

export interface DefaultOptionsClass
{
    new(route:string):DefaultOptionsType;
}
