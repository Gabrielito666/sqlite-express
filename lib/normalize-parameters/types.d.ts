export type NormalizeParametersFunction =
(parameters: Record<string, any>) => ProxyHandler<Record<string, any>>;