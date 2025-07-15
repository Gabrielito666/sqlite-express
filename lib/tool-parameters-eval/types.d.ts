import { CountParams, DeleteParams, ExecuteSQLParams, InsertParams, SelectParams, UpdateParams, ExistParams, CreateTableParams, ExpectedParam, TypeParam, CreateDbParams, OptionsType } from "../class-options/types";

export type ParametersEvalCreateDbFunction = (options: OptionsType<ExpectedParam, TypeParam>) => CreateDbParams;
export type ParametersEvalSelectFunction = (options: OptionsType<ExpectedParam, TypeParam>) => SelectParams;
export type ParametersEvalInsertFunction = (options: OptionsType<ExpectedParam, TypeParam>) => InsertParams;
export type ParametersEvalUpdateFunction = (options: OptionsType<ExpectedParam, TypeParam>) => UpdateParams;
export type ParametersEvalDeleteFunction = (options: OptionsType<ExpectedParam, TypeParam>) => DeleteParams;
export type ParametersEvalExistFunction = (options: OptionsType<ExpectedParam, TypeParam>) => ExistParams;
export type ParametersEvalCountFunction = (options: OptionsType<ExpectedParam, TypeParam>) => CountParams;
export type ParametersEvalExecuteSQLFunction = (options: OptionsType<ExpectedParam, TypeParam>) => ExecuteSQLParams;
export type ParametersEvalCreateTableFunction = (options: OptionsType<ExpectedParam, TypeParam>) => CreateTableParams;