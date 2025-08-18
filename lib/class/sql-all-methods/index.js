const sqlAllMethods = {
    executeSQL: require('lib/functions/execute-sql'),
    declareSQL: require('lib/functions/declare-sql'),
    createTable: require('lib/functions/create-table'),
    select: require('lib/functions/select'),
    insert: require('lib/functions/insert'),
    update: require('lib/functions/update'),
    delete: require('lib/functions/delete'),
    exist: require('lib/functions/exist'),
    count: require('lib/functions/count'),
    beginTransaction: require('lib/functions/begin-transaction'),
    commit: require('lib/functions/commit'),
    rollback: require('lib/functions/rollback'),
};