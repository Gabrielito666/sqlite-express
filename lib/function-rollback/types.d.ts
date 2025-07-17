import { OptionsType } from "../class-options/types";
import { Returns } from "lib/types/returns";

export type RollbackFunction = (options: OptionsType) => Returns["rollback"];