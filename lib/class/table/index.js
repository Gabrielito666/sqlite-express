/**
 * @typedef {import("./types").TableType} TableType
 * @typedef {import("./types").TableClass} TableClass
 */

/**@type {TableClass}*/
const Table = class
{
    /**
     * @this {TableType}
     * @param {ConstructorParameters<TableClass>[0]} table
     * @param {ConstructorParameters<TableClass>[1]} db
    */
    constructor(tableName, db)
    {
        if (!db) throw new Error('DB is not set');
        this.db = db;
        this.tableName = tableName;
    }

    /**@type {TableType["select"]}*/
    select(args)
    {
        return this.db.select({table: this.tableName, ...args});
    }

    /**@type {TableType["insert"]}*/
    insert(args)
    {
        return this.db.insert({table: this.tableName, ...args});
    }

    /**@type {TableType["update"]}*/
    update(args)
    {
        return this.db.update({table: this.tableName, ...args});
    }

    /**@type {TableType["delete"]}*/
    delete(args)
    {
        return this.db.delete({table: this.tableName, ...args});
    }

    /**@type {TableType["exist"]}*/
    exist(args)
    {
        return this.db.exist({table: this.tableName, ...args});
    }

    /**@type {TableType["count"]}*/
    count(args)
    {
        return this.db.count({table: this.tableName, ...args});
    }
}

module.exports = Table;