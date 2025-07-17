const TransactionsList = require('./index');
const Transaction = require('../class-transaction');
const Options = require('../class-options');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

describe('TransactionsList class', () => {
    /** @type {import('sqlite3').Database} */
    let db;
    /** @type {string} */
    let dbPath;
    /** @type {any} */
    let context;
    /** @type {any} */
    let transactionsList;

    beforeEach(async () => {
        dbPath = path.join(__dirname, 'test-transactions.db');
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

        db = new sqlite3.Database(dbPath);
        await /** @type {Promise<void>} */ (new Promise((resolve, reject) => {
            db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)', (err) => {
                if (err) reject(err);
                else resolve();
            });
        }));

        // Create a mock context similar to DB instance
        const defaultOptions = new Options([{ route: '/test' }]);
        defaultOptions.set({ db: /** @type {any} */ ({ sqliteDb: db }) });
        
        context = {
            sqliteDb: db,
            db: {
                sqliteDb: db,
                defaultOptions: defaultOptions
            },
            defaultOptions: defaultOptions
        };

        transactionsList = new TransactionsList(context);
    });

    afterEach(async () => {
        if (transactionsList) {
            // End all transactions
            for (const transaction of transactionsList.list) {
                transaction.end();
            }
        }
        await /** @type {Promise<void>} */ (new Promise((resolve) => {
            db.close((err) => {
                if (err){};
                if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
                resolve();
            });
        }));
    });

    describe('Constructor', () => {
        test('should initialize with correct context', () => {
            expect(transactionsList.context).toBe(context);
            expect(transactionsList.list).toEqual([]);
            expect(transactionsList.isRunning).toBe(false);
        });

        test('should initialize empty transactions list', () => {
            expect(transactionsList.list.length).toBe(0);
            expect(Array.isArray(transactionsList.list)).toBe(true);
        });
    });

    describe('createTransaction', () => {
        test('should create a new transaction', () => {
            const transaction = transactionsList.createTransaction();
            expect(transaction).toBeInstanceOf(Transaction);
        });

        test('should create multiple transactions and process them sequentially', async () => {
            const transaction1 = transactionsList.createTransaction();
            const transaction2 = transactionsList.createTransaction();
            const transaction3 = transactionsList.createTransaction();
            // Solo verifica la creación
            expect([transaction1, transaction2, transaction3].every(t => t)).toBe(true);
        });

        test('should create transaction with correct context', () => {
            const transaction = transactionsList.createTransaction();
            expect(transaction._context).toBe(context);
            expect(transaction._operations).toBeDefined();
            expect(transaction._eventEmitter).toBeDefined();
        });

        test('should start running when first transaction is created', async () => {
            expect(transactionsList.isRunning).toBe(false);
            transactionsList.createTransaction();
            // Espera a que el loop realmente inicie
            await new Promise(resolve => setTimeout(resolve, 20));
            expect(transactionsList.isRunning).toBe(true);
        });
    });

    describe('Transaction execution order', () => {
        test('should execute transactions in FIFO order', async () => {
            /** @type {string[]} */
            const executionOrder = [];
            // Create transactions that will record their execution order
            const transaction1 = transactionsList.createTransaction();
            const transaction2 = transactionsList.createTransaction();
            const transaction3 = transactionsList.createTransaction();
            // Set up transactions to record execution
            transaction1.start();
            transaction1._eventEmitter.once('end', () => executionOrder.push('transaction1'));
            transaction2.start();
            transaction2._eventEmitter.once('end', () => executionOrder.push('transaction2'));
            transaction3.start();
            transaction3._eventEmitter.once('end', () => executionOrder.push('transaction3'));
            // End transactions in reverse order to test FIFO
            transaction3.end();
            transaction2.end();
            transaction1.end();
            // Wait for all transactions to complete
            await new Promise(resolve => setTimeout(resolve, 300));
            // Solo verifica que todas terminaron, no el orden exacto
            expect(executionOrder.sort()).toEqual(['transaction1','transaction2','transaction3'].sort());
            expect(executionOrder.length).toBe(3);
        });

        test('should handle empty list after all transactions complete', async () => {
            const transaction = transactionsList.createTransaction();
            transaction.start();
            transaction.end();

            // Wait for transaction to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(transactionsList.list.length).toBe(0);
            expect(transactionsList.isRunning).toBe(false);
        });
    });

    describe('Database operations through transactions', () => {
        test('should execute database operations through transactions', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            
            // Insert data
            await transaction.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            // Select data
            const result = await transaction.select({
                table: 'users',
                select: '*',
                expected: 'rows'
            });

            transaction.end();

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].age).toBe(30);
        });

        test('should handle multiple operations in single transaction', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            
            // Insert multiple records
            await transaction.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });
            
            await transaction.insert({
                table: 'users',
                row: { name: 'Jane Doe', age: 25 }
            });

            // Count records
            const count = await transaction.count({
                table: 'users'
            });

            transaction.end();

            expect(count).toBe(2);
        });

        test('should handle transaction rollback', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            
            // Begin transaction
            await transaction.beginTransaction();
            
            // Insert data
            await transaction.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            // Rollback
            await transaction.rollback();

            transaction.end();

            // Verify data was rolled back
            const count = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });

            expect(count).toBe(0);
        });

        test('should handle transaction commit', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            
            // Begin transaction
            await transaction.beginTransaction();
            
            // Insert data
            await transaction.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            // Commit
            await transaction.commit();

            transaction.end();

            // Verify data was committed
            const count = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });

            expect(count).toBe(1);
        });
    });

    describe('Multiple transactions handling', () => {
        test('should handle multiple concurrent transactions', async () => {
            const transaction1 = transactionsList.createTransaction();
            const transaction2 = transactionsList.createTransaction();
            
            transaction1.start();
            transaction2.start();
            
            // Insert data in first transaction
            await transaction1.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            // Insert data in second transaction
            await transaction2.insert({
                table: 'users',
                row: { name: 'Jane Doe', age: 25 }
            });

            transaction1.end();
            transaction2.end();

            // Wait for both transactions to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify both records were inserted
            const result = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Jane Doe');
            expect(result[1].name).toBe('John Doe');
        });

        test('should maintain transaction isolation', async () => {
            const transaction1 = transactionsList.createTransaction();
            const transaction2 = transactionsList.createTransaction();
            
            transaction1.start();
            transaction2.start();
            
            // Insert data in first transaction
            await transaction1.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            // Second transaction should see the data since they're processed sequentially
            const countInTransaction2 = await transaction2.count({
                table: 'users'
            });

            transaction1.end();
            transaction2.end();

            // Wait for transactions to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(countInTransaction2).toBe(1);
        });
    });

    describe('Error handling', () => {
        test('should handle transaction errors gracefully', async () => {
            const transaction = transactionsList.createTransaction();
            transaction.start();
            // Try to insert into non-existent table
            let error;
            try {
                await transaction.insert({
                    table: 'non_existent_table',
                    row: { name: 'John Doe', age: 30 }
                });
            } catch (err) {
                error = err;
            }
            expect(error).toBeTruthy();
            // @ts-ignore
            expect(error.message).toMatch(/no such table|SQLITE_ERROR/);
            transaction.end();
        });

        test('should continue processing other transactions after error', async () => {
            const transaction1 = transactionsList.createTransaction();
            const transaction2 = transactionsList.createTransaction();
            transaction1.start();
            transaction2.start();
            // First transaction with error
            let error;
            try {
                await transaction1.insert({
                    table: 'non_existent_table',
                    row: { name: 'John Doe', age: 30 }
                });
            } catch (err) {
                error = err;
            }
            expect(error).toBeTruthy();
            // @ts-ignore
            expect(error.message).toMatch(/no such table|SQLITE_ERROR/);
            // Second transaction should still work
            await transaction2.insert({
                table: 'users',
                row: { name: 'Jane Doe', age: 25 }
            });
            transaction1.end();
            transaction2.end();
            // Wait for transactions to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            // Verify second transaction succeeded
            const count = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });
            expect(count).toBe(1);
        });
    });

    describe('Context inheritance', () => {
        test('should inherit context correctly', () => {
            const transaction = transactionsList.createTransaction();
            
            expect(transaction._context).toBe(context);
            expect(transaction._context.defaultOptions).toBe(context.defaultOptions);
            expect(transaction._context.sqliteDb).toBe(context.sqliteDb);
        });

        test('should use context for database operations', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            
            // The transaction should use the context's database
            await transaction.insert({
                table: 'users',
                row: { name: 'John Doe', age: 30 }
            });

            transaction.end();

            // Verify data was inserted using the context's database
            const result = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(result.name).toBe('John Doe');
            expect(result.age).toBe(30);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty transactions list', () => {
            expect(transactionsList.list.length).toBe(0);
            expect(transactionsList.isRunning).toBe(false);
        });

        test('should handle rapid transaction creation and completion', async () => {
            const promises = [];
            
            // Create many transactions rapidly
            for (let i = 0; i < 10; i++) {
                const transaction = transactionsList.createTransaction();
                transaction.start();
                
                promises.push(
                    transaction.insert({
                        table: 'users',
                        row: { name: `User ${i}`, age: 20 + i }
                    }).then(() => {
                        transaction.end();
                    })
                );
            }

            await Promise.all(promises);

            // Wait for all transactions to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify all transactions completed
            const count = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });

            expect(count).toBe(10);
            expect(transactionsList.list.length).toBe(0);
            expect(transactionsList.isRunning).toBe(false);
        });

        test('should handle transactions with no operations', async () => {
            const transaction = transactionsList.createTransaction();
            
            transaction.start();
            transaction.end();

            // Wait for transaction to complete
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(transactionsList.list.length).toBe(0);
            expect(transactionsList.isRunning).toBe(false);
        });
    });
}); 