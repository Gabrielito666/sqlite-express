import { OptionsType, ExpectedParam, TypeParam } from "../class-options/types";

export type UpdateFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<number>;