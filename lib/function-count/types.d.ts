import { OptionsType, ExpectedParam, TypeParam } from "../class-options/types";

export type CountFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<number>;