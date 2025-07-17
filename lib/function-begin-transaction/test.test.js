const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const beginTransaction = require('./index');
const Options = require('../class-options');

describe('beginTransaction function', () => {
    const dbPath = path.join(__dirname, 'test-begin-transaction.db');
    let db = new sqlite3.Database(dbPath);
    const dbType = {
        sqliteDb: db,
        waitingList: {
            list: [],
            isRunning: false,
            addOperation: async () => {},
            run: () => {}
        },
        defaultOptions: new Options([{ route: '/test' }])
    };

    beforeAll(async () => {
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS test_table (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    value TEXT
                )
            `, (err) => err ? reject(err) : resolve(true));
        });
    });

    afterAll(async () => {
        await new Promise((resolve) => {
            db.close((err) => {
                if (err) console.error('Error closing database:', err);
                if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
                resolve(true);
            });
        });
    });

    beforeEach(async () => {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM test_table', (err) => err ? reject(err) : resolve(true));
        });
    });

    test('should begin a transaction and allow rollback', async () => {
        // Iniciar transacción usando la función
        const options = new Options([{ route: '/test' }]);
        options.set({
            // @ts-ignore
            db: dbType,
            logQuery: false
        });
        const result = await beginTransaction(options);
        expect(result).toBe(true);

        // Insertar un registro dentro de la transacción
        await new Promise((resolve, reject) => db.run('INSERT INTO test_table (value) VALUES (?)', ['test-value'], (err) => err ? reject(err) : resolve(true)));

        // Hacer rollback manualmente
        await new Promise((resolve, reject) => db.run('ROLLBACK', (err) => err ? reject(err) : resolve(true)));

        // Verificar que el registro NO persiste después del rollback
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT value FROM test_table WHERE value = ?', ['test-value'], (err, row) => err ? reject(err) : resolve(row));
        });
        expect(row).toBeUndefined();
    });

    test('should reject if begin transaction fails', async () => {
        // Cerrar la base de datos para forzar un error
        await new Promise((resolve) => db.close(() => resolve(true)));

        const options = new Options([{ route: '/test' }]);
        options.set({
            // @ts-ignore
            db: dbType,
            logQuery: false
        });

        await expect(beginTransaction(options)).rejects.toBeDefined();

        // Reabrir la base de datos para otros tests
        db = new sqlite3.Database(dbPath);
        dbType.sqliteDb = db;
    });
}); 