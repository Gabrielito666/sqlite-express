const Options = require('../class-options');
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
    constructor(table, db)
    {
        this.options = new Options([db.defaultOptions]);

        this.options.set({ db, table });

        //Fix Options
        this.options.fix('db');
        this.options.fix('table');
    }

    /**@type {TableType["select"]}*/
    select(args)
    {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;

        if(!this.options.db) throw new Error('DB is not set');

        return this.options.db?.select(ops);
    }

    /**@type {TableType["insert"]}*/
    insert(args)
        {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;
        
        if(!this.options.db) throw new Error('DB is not set');
        
        return this.options.db.insert(ops);
    }

    /**@type {TableType["update"]}*/
    update(args)
    {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;
        
        if(!this.options.db) throw new Error('DB is not set');
        
        return this.options.db.update(ops);
    }

    /**@type {TableType["delete"]}*/
    delete(args)
    {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;
        
        if(!this.options.db) throw new Error('DB is not set');
        
        return this.options.db.delete(ops);
    }

    /**@type {TableType["exist"]}*/
    exist(args)
    {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;
        
        if(!this.options.db) throw new Error('DB is not set');
        
        return this.options.db.exist(ops);
    }

    /**@type {TableType["count"]}*/
    count(args)
    {
        const ops = new Options([args, this.options]);
        ops.table = this.options.table;
        ops.db = this.options.db;
        
        if(!this.options.db) throw new Error('DB is not set');
        
        return this.options.db.count(ops);
    }
}

module.exports = Table;