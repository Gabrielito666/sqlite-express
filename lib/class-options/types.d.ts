import { Params } from "../types/params";


export interface OptionalOptions {
  route?: Params["route"];
  db?: Params["db"];
  table?: Params["table"];
  where?: Params["where"];
  columns?: Params["columns"];
  select?: Params["select"];
  connector?: Params["connector"];
  update?: Params["update"];
  row?: Params["row"];
  logQuery?: Params["logQuery"];
  query?: Params["query"];
  expected?: Params["expected"];
  parameters?: Params["parameters"];
  type?: Params["type"];
}


export interface OptionsType<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>
{
    route?: Params["route"];
    db?: Params["db"];
    table?: Params["table"];
    where: Params["where"];
    columns?: Params["columns"];
    select?: Params["select"];
    connector: Params["connector"];
    update?: Params["update"];
    row?: Params["row"];
    logQuery: Params["logQuery"];
    query?: Params["query"];
    expected: E;
    parameters: Params["parameters"];
    type: T;

    set(options: OptionalOptions): void;
    fix(opName: keyof OptionsType): void;
};

export interface OptionsClass
{
    new(options?: (OptionsType|OptionalOptions|undefined)[]):OptionsType;
}