import { OptionsType, ExpectedParam, TypeParam } from "../class-options/types";

export type CreateTableFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<void>;