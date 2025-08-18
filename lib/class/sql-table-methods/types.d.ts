export interface SqlTableMethods
{
    select(args:{
        table: Table|string,
        select: Select,
        where: Where,
        connector: Connector,
        expected: Expected,
        logQuery: LogQuery
    }):Returns["select"];
    insert(args:{
        table: Table|string,
        row: Row,
        logQuery: LogQuery
    }):Returns["insert"];
    update(args:{
        table: Table|string,
        update: Update,
        where: Where,
        connector: Connector,
        logQuery: LogQuery
    }):Returns["update"];
    exist(args:{
        table: Table|string,
        where: Where,
        connector: Connector,
        logQuery: LogQuery
    }):Returns["exist"];
    count(args:{
        table: Table|string,
    }):Returns["count"];
    delete(args:{
        table: Table|string,
        where: Where,
        connector: Connector,
        logQuery: LogQuery
    }):Returns["delete"];
}