export type InsertFunction = (params: {
    db: Database;
    table: string;
    row: {[key:string]:string|number|boolean|Object|null};
    logQuery:boolean;
}) => Promise<number>;