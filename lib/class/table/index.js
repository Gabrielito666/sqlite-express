/**
 * @typedef {import("./types").Table} TableType
 * @typedef {import("./types").TableClass} TableClass
 */

/**@type {TableClass}*/
const Table = class
{
    /**
     * @this {TableType}
     * @param {ConstructorParameters<TableClass>[0]} tableName
     * @param {ConstructorParameters<TableClass>[1]} db
    */
    constructor(tableName, db)
    {
        if(!tableName) throw new Error('Table name is not set');
        if (!db) throw new Error('DB is not set');

        this.db = db;
        this.tableName = tableName;
    }

    /**
     * @type {TableType["insert"]}
     * @this {TableType}
    */
    insert(args)
    {
        return this.db.insert({table: this, ...args});
    }

    /**
     * @type {TableType["update"]}
     * @this {TableType}
    */
    update(args)
    {
        return this.db.update({table: this, ...args});
    }

    /**
     * @type {TableType["delete"]}
     * @this {TableType}
    */
    delete(args)
    {
        return this.db.delete({table: this, ...args});
    }

    /**
     * @type {TableType["exist"]}
     * @this {TableType}
    */
    exist(args)
    {
        return this.db.exist({table: this, ...args});
    }

    /**
     * @type {TableType["count"]}
     * @this {TableType}
    */
    count(args)
    {
        return this.db.count({table: this, ...args});
    }
}


/**
 * @type {TableType["select"]}
 * @this {TableType}
 */
const selectImplementation = function(args)
{
    return this.db.select({table: this, ...args});
}
/**
 * @type {TableType["select"]["rows"]}
 * @this {TableType}
*/
selectImplementation.rows = function(args)
{
    return this.db.select.rows({table: this, ...args});
}
/**
 * @type {TableType["select"]["row"]}
 * @this {TableType}
 */

selectImplementation.row = function(args)
{
    return this.db.select.row({table: this, ...args});
}
/**
 * @type {TableType["select"]["celd"]}
 * @this {TableType}
 */
selectImplementation.celd = function(args)
{
    return this.db.select.celd({table: this, ...args});
}
/**
 * @type {TableType["select"]["column"]}
 * @this {TableType}
 */
selectImplementation.column = function(args)
{
    return this.db.select.column({table: this, ...args});
}

Table.prototype.select = selectImplementation;

module.exports = Table;