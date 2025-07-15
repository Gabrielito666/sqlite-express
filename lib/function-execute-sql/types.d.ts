import { OptionsType, ExpectedParam, TypeParam, ExpectedResult } from "../class-options/types";

export type ExecuteSQLFunction<T extends TypeParam, E extends ExpectedParam> = (
    options:OptionsType<E, T>
) => Promise<
    T extends "select" ? ExpectedResult<E> : 
    T extends "insert" ? number :
    T extends "update" ? number :
    T extends "delete" ? number :
    T extends "create" ? void :
    T extends "any" ? ExpectedResult<E>|number :
    never
>;