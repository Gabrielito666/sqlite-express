import { OptionsType, ExpectedParam, TypeParam } from "../class-options/types";

export type InsertFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<number>;