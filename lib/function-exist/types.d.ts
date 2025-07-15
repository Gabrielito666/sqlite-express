import { OptionsType, ExpectedParam, TypeParam } from "../class-options/types";

export type ExistFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<boolean>;