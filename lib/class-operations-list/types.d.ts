import { Functions } from "../types/functions";
import { Params } from "../types/params";
import { OptionsType } from "../class-options/types";

export type MethodsUnion<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
> =
| Functions["createTable"]
| Functions<E>["select"]
| Functions["insert"]
| Functions["update"]
| Functions["delete"]
| Functions["exist"]
| Functions["count"]
| Functions<E, T>["executeSQL"]
;

export interface OperationsListType<
    M extends MethodsUnion<T, E> = MethodsUnion<T, E>,
    T extends Params["type"] = Params["type"],
    E extends Params["expected"] = Params["expected"]
>
{
    list: (() => Promise<any>)[];
    isRunning: boolean;
    isEnded: boolean;
    addOperation(method: M, parameters: OptionsType<E, T>): ReturnType<M<E, T>>;
    run(): void;
    end(): void;
}

export interface OperationsListClass
{
    new():OperationsListType;
};