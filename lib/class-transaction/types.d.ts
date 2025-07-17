import { SqliteExpressType } from "lib/class-sqlite-express/types";
import { DBType } from "lib/class-db/types";
import { Params } from "lib/types/params";
import { Returns } from "lib/types/returns";
import { OptionalArgs } from "lib/types/args";

export interface TransactionType<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>
{
    _context: DBType;
    end(): void;
    start(): void;
    _endWaiter: Promise<void>;
    _startWaiter: Promise<void>;
    _operations: OperationsListType;

    createTable(args?: Omit<OptionalArgs["createTable"], "db">): Returns["createTable"];
    select(args?: Omit<OptionalArgs<E>["select"], "db">): Returns<E>["select"];
    insert(args?: Omit<OptionalArgs["insert"], "db">): Returns["insert"];
    update(args?: Omit<OptionalArgs["update"], "db">): Returns["update"];
    delete(args?: Omit<OptionalArgs["delete"], "db">): Returns["delete"];
    exist(args?: Omit<OptionalArgs["exist"], "db">): Returns["exist"];
    count(args?: Omit<OptionalArgs["count"], "db">): Returns["count"];
    executeSQL(args?: Omit<OptionalArgs<E, T>["executeSQL"], "db">): Returns<E, T>["executeSQL"];
    beginTransaction(args?: Omit<OptionalArgs["beginTransaction"], "db">): Returns["beginTransaction"];
    rollback(args?: Omit<OptionalArgs["rollback"], "db">): Returns["rollback"];
    commit(args?: Omit<OptionalArgs["commit"], "db">): Returns["commit"];
}

export interface TransactionClass
{
    new(context: DBType): TransactionType;
}