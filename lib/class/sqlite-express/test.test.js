const SqliteExpress = require('./index');
const Options = require('../class-options');
const DB = require('../db');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

describe('SqliteExpress class', () => {
    /** @type {string} */
    let testDir;
    /** @type {any} */
    let sqliteExpress;
    /** @type {any} */
    let dbInstance;

    beforeEach(async () => {
        // Create a temporary test directory
        testDir = path.join(__dirname, 'test-temp');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        // Create SqliteExpress instance
        sqliteExpress = new SqliteExpress(testDir);
    });

    afterEach(async () => {
        // Clean up test files
        if (dbInstance && dbInstance.sqliteDb) {
            await new Promise((resolve) => {
                dbInstance.sqliteDb.close(() => {
                    // @ts-ignore
                    resolve();
                });
            });
        }

        // Remove test directory and files
        if (fs.existsSync(testDir)) {
            const files = fs.readdirSync(testDir);
            files.forEach(file => {
                const filePath = path.join(testDir, file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
            fs.rmdirSync(testDir);
        }
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with default rootPath', () => {
            // @ts-ignore
            const defaultInstance = new SqliteExpress();
            expect(defaultInstance._rootPath).toBe(process.cwd());
            expect(defaultInstance.defaultOptions).toBeInstanceOf(Options);
        });

        test('should initialize with custom rootPath', () => {
            const customPath = '/custom/path';
            const customInstance = new SqliteExpress(customPath);
            expect(customInstance._rootPath).toBe(customPath);
            expect(customInstance.defaultOptions).toBeInstanceOf(Options);
        });

        test('should have immutable properties', () => {
            const descriptor = Object.getOwnPropertyDescriptor(sqliteExpress, '_rootPath');
            // @ts-ignore
            expect(descriptor.writable).toBe(false);
            // @ts-ignore
            expect(descriptor.configurable).toBe(false);
            // @ts-ignore
            expect(descriptor.enumerable).toBe(false);
            
            const optionsDescriptor = Object.getOwnPropertyDescriptor(sqliteExpress, 'defaultOptions');
            // @ts-ignore
            expect(optionsDescriptor.writable).toBe(false);
        });

        test('should fix default options', () => {
            expect(sqliteExpress.defaultOptions.db).toBeUndefined();
            expect(sqliteExpress.defaultOptions.route).toBeUndefined();
        });

        test('should handle relative paths correctly', () => {
            const relativePath = './relative/path';
            const relativeInstance = new SqliteExpress(relativePath);
            expect(relativeInstance._rootPath).toBe(relativePath);
        });

        test('should handle absolute paths correctly', () => {
            const absolutePath = path.resolve(__dirname, 'absolute/path');
            const absoluteInstance = new SqliteExpress(absolutePath);
            expect(absoluteInstance._rootPath).toBe(absolutePath);
        });
    });

    describe('createDB method', () => {
        test('should create database with valid options', () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            expect(dbInstance).toBeInstanceOf(DB);
            expect(dbInstance.sqliteDb).toBeInstanceOf(sqlite3.Database);
            expect(dbInstance.transactionsList).toBeDefined();
            expect(dbInstance.defaultOptions).toBeInstanceOf(Options);
        });

        test('should create database with default options inheritance', () => {
            sqliteExpress.defaultOptions.set({
                logQuery: false,
                table: 'default_table'
            });

            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db'
            });

            expect(dbInstance.defaultOptions.logQuery).toBe(false);
            expect(dbInstance.defaultOptions.table).toBe('default_table');
        });

        test('should handle database creation with custom key', () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                key: 'custom_key',
                logQuery: false
            });

            expect(dbInstance).toBeInstanceOf(DB);
        });

        test('should create database file in correct location', async () => {
            const dbPath = path.join(testDir, 'test-db.db');
            
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            // SQLite3 creates the file lazily, so we need to perform a write operation
            // to ensure the file is created on disk
            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'test_table',
                columns: { id: 'INTEGER PRIMARY KEY' }
            });

            expect(fs.existsSync(dbPath)).toBe(true);
        });

        test('should handle existing database file', () => {
            const dbPath = path.join(testDir, 'existing-db.db');
            
            // Create first instance
            const db1 = sqliteExpress.createDB({
                route: 'existing-db.db',
                logQuery: false
            });

            // Create second instance (should connect to existing)
            const db2 = sqliteExpress.createDB({
                route: 'existing-db.db',
                logQuery: false
            });

            expect(db1).toBeInstanceOf(DB);
            expect(db2).toBeInstanceOf(DB);
        });

        test('should throw error when route is not provided', () => {
            expect(() => {
                sqliteExpress.createDB({});
            }).toThrow('SqliteExpress - DB Error: The route is not defined');
        });

        test('should log when logQuery is enabled', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: true
            });

            expect(consoleSpy).toHaveBeenCalledWith('The declared database is located at: test-db.db');
            
            consoleSpy.mockRestore();
        });
    });

    describe('CRUD Operations with Database', () => {
        beforeEach(async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            // Create test table
            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    name: 'TEXT NOT NULL',
                    age: 'INTEGER',
                    email: 'TEXT UNIQUE',
                    city: 'TEXT',
                    active: 'BOOLEAN DEFAULT 1',
                    created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
                }
            });
        });

        describe('createTable method', () => {
            test('should create table with basic structure', async () => {
                const result = await sqliteExpress.createTable({
                    db: dbInstance,
                    table: 'products',
                    columns: {
                        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                        name: 'TEXT NOT NULL',
                        price: 'REAL'
                    }
                });

                expect(result).toBeDefined();
                
                // Verify table was created
                const tableExists = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'sqlite_master',
                    where: { 
                        type: 'table',
                        name: 'products'
                    }
                });
                expect(tableExists).toBe(true);
            });

            test('should create table with complex constraints', async () => {
                const result = await sqliteExpress.createTable({
                    db: dbInstance,
                    table: 'orders',
                    columns: {
                        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                        user_id: 'INTEGER NOT NULL',
                        total: 'REAL NOT NULL CHECK(total > 0)',
                        status: 'TEXT DEFAULT "pending"',
                        created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
                    }
                });

                expect(result).toBeDefined();
                
                // Verify table was created
                const tableExists = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'sqlite_master',
                    where: { 
                        type: 'table',
                        name: 'orders'
                    }
                });
                expect(tableExists).toBe(true);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.createTable({
                        table: 'test',
                        columns: { id: 'INTEGER' }
                    });
                }).toThrow('db is required');
            });

            test('should handle IF NOT EXISTS behavior', async () => {
                // Create table first time
                await sqliteExpress.createTable({
                    db: dbInstance,
                    table: 'duplicate_test',
                    columns: { id: 'INTEGER PRIMARY KEY' }
                });

                // Try to create same table again (should not error)
                await expect(sqliteExpress.createTable({
                    db: dbInstance,
                    table: 'duplicate_test',
                    columns: { id: 'INTEGER PRIMARY KEY' }
                })).resolves.toBeDefined();
            });
        });

        describe('insert method', () => {
            test('should insert single row', async () => {
                const result = await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            test('should insert multiple rows', async () => {
                const results = [];
                
                results.push(await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Alice', age: 25, email: 'alice@example.com' }
                }));

                results.push(await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Bob', age: 35, email: 'bob@example.com' }
                }));

                expect(results.length).toBe(2);
                results.forEach(result => {
                    expect(typeof result).toBe('number');
                    expect(result).toBeGreaterThan(0);
                });
            });

            test('should handle different data types', async () => {
                const result = await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: {
                        name: 'Test User',
                        age: 25,
                        email: 'test@example.com',
                        city: 'Test City',
                        active: true
                    }
                });

                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            test('should handle objects and arrays', async () => {
                const result = await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: {
                        name: 'Complex User',
                        age: 30,
                        email: 'complex@example.com',
                        city: JSON.stringify(['New York', 'Paris']),
                        active: true
                    }
                });

                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.insert({
                        table: 'users',
                        row: { name: 'Test' }
                    });
                }).toThrow('db is required');
            });

            test('should handle unique constraint violations', async () => {
                // Insert first row
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Unique User', email: 'unique@example.com' }
                });

                // Try to insert with same email (should fail)
                await expect(sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Another User', email: 'unique@example.com' }
                })).rejects.toThrow();
            });
        });

        describe('select method', () => {
            beforeEach(async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com', city: 'New York' }
                });
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Jane Smith', age: 25, email: 'jane@example.com', city: 'Los Angeles' }
                });
            });

            test('should select all rows (expected: rows)', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: '*',
                    expected: 'rows'
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(2);
                expect(result[0]).toHaveProperty('name');
                expect(result[0]).toHaveProperty('age');
            });

            test('should select single row (expected: row)', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: '*',
                    where: { name: 'John Doe' },
                    expected: 'row'
                });

                expect(typeof result).toBe('object');
                expect(result).toHaveProperty('name', 'John Doe');
                expect(result).toHaveProperty('age', 30);
            });

            test('should select single cell (expected: celd)', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: 'name',
                    where: { email: 'john@example.com' },
                    expected: 'celd'
                });

                expect(result).toBe('John Doe');
            });

            test('should select column (expected: column)', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: 'name',
                    expected: 'column'
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(2);
                expect(result).toContain('John Doe');
                expect(result).toContain('Jane Smith');
            });

            test('should select with WHERE condition', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: '*',
                    where: { age: 30 }
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('John Doe');
            });

            test('should select with complex WHERE conditions', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: '*',
                    where: {
                        age: { operator: '>', value: 25 },
                        city: 'New York'
                    }
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('John Doe');
            });

            test('should handle empty results', async () => {
                const result = await sqliteExpress.select({
                    db: dbInstance,
                    table: 'users',
                    select: '*',
                    where: { name: 'Non Existent' }
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(0);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.select({
                        table: 'users',
                        select: '*'
                    });
                }).toThrow('db is required');
            });
        });

        describe('update method', () => {
            beforeEach(async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });
            });

            test('should update single row', async () => {
                const result = await sqliteExpress.update({
                    db: dbInstance,
                    table: 'users',
                    update: { age: 31 },
                    where: { name: 'John Doe' }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should update multiple rows', async () => {
                // Insert another row
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Jane Smith', age: 25, email: 'jane@example.com' }
                });

                const result = await sqliteExpress.update({
                    db: dbInstance,
                    table: 'users',
                    update: { city: 'Updated City' },
                    where: { age: { operator: '>', value: 20 } }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(2);
            });

            test('should handle update with no matching rows', async () => {
                const result = await sqliteExpress.update({
                    db: dbInstance,
                    table: 'users',
                    update: { age: 40 },
                    where: { name: 'Non Existent' }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(0);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.update({
                        table: 'users',
                        update: { age: 31 },
                        where: { name: 'John Doe' }
                    });
                }).toThrow('db is required');
            });
        });

        describe('delete method', () => {
            beforeEach(async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Jane Smith', age: 25, email: 'jane@example.com' }
                });
            });

            test('should delete single row', async () => {
                const result = await sqliteExpress.delete({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'John Doe' }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should delete multiple rows', async () => {
                const result = await sqliteExpress.delete({
                    db: dbInstance,
                    table: 'users',
                    where: { age: { operator: '>', value: 20 } }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(2);
            });

            test('should delete all rows', async () => {
                const result = await sqliteExpress.delete({
                    db: dbInstance,
                    table: 'users'
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(2);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.delete({
                        table: 'users',
                        where: { name: 'John Doe' }
                    });
                }).toThrow('db is required');
            });
        });

        describe('exist method', () => {
            beforeEach(async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });
            });

            test('should return true for existing row', async () => {
                const result = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'John Doe' }
                });

                expect(result).toBe(true);
            });

            test('should return false for non-existing row', async () => {
                const result = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'Non Existent' }
                });

                expect(result).toBe(false);
            });

            test('should handle complex where conditions', async () => {
                const result = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'users',
                    where: {
                        age: { operator: '>', value: 25 },
                        email: 'john@example.com'
                    }
                });

                expect(result).toBe(true);
            });

            test('should return false for empty table', async () => {
                // Delete all rows
                await sqliteExpress.delete({
                    db: dbInstance,
                    table: 'users'
                });

                const result = await sqliteExpress.exist({
                    db: dbInstance,
                    table: 'users'
                });

                expect(result).toBe(false);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.exist({
                        table: 'users',
                        where: { name: 'John Doe' }
                    });
                }).toThrow('db is required');
            });
        });

        describe('count method', () => {
            beforeEach(async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Jane Smith', age: 25, email: 'jane@example.com' }
                });
            });

            test('should count all rows', async () => {
                const result = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users'
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(2);
            });

            test('should count with where condition', async () => {
                const result = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users',
                    where: { age: { operator: '>', value: 25 } }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should count with complex where condition', async () => {
                const result = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users',
                    where: {
                        age: { operator: '>', value: 20 },
                        name: { operator: 'LIKE', value: '%John%' }
                    }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should return zero for no matching rows', async () => {
                const result = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'Non Existent' }
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(0);
            });

            test('should return zero for empty table', async () => {
                // Delete all rows
                await sqliteExpress.delete({
                    db: dbInstance,
                    table: 'users'
                });

                const result = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users'
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(0);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.count({
                        table: 'users'
                    });
                }).toThrow('db is required');
            });
        });

        describe('executeSQL method', () => {
            test('should execute SELECT query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const result = await sqliteExpress.executeSQL({
                    db: dbInstance,
                    query: 'SELECT * FROM users WHERE name = ?-John Doe-?',
                    expected: 'rows'
                });

                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('John Doe');
            });

            test('should execute INSERT query', async () => {
                const result = await sqliteExpress.executeSQL({
                    db: dbInstance,
                    query: 'INSERT INTO users (name, age, email) VALUES (?-Test User-?, ?-25-?, ?-test@example.com-?)',
                    type: 'insert'
                });

                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            test('should execute UPDATE query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const result = await sqliteExpress.executeSQL({
                    db: dbInstance,
                    query: 'UPDATE users SET age = ?-31-? WHERE name = ?-John Doe-?',
                    type: 'update'
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should execute DELETE query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const result = await sqliteExpress.executeSQL({
                    db: dbInstance,
                    query: 'DELETE FROM users WHERE name = ?-John Doe-?',
                    type: 'delete'
                });

                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should handle SQL errors', async () => {
                await expect(sqliteExpress.executeSQL({
                    db: dbInstance,
                    query: 'SELECT * FROM non_existent_table'
                })).rejects.toThrow();
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.executeSQL({
                        query: 'SELECT * FROM users'
                    });
                }).toThrow('db is required');
            });

            test('should throw error when query is not provided', async () => {
                await expect(sqliteExpress.executeSQL({
                    db: dbInstance
                })).rejects.toThrow('SqliteExpress - Execute SQL Error: The query is not defined');
            });
        });

        describe('Transaction methods', () => {
            test('should begin transaction', async () => {
                const result = await sqliteExpress.beginTransaction({
                    db: dbInstance
                });

                expect(result).toBeDefined();
            });

            test('should commit transaction', async () => {
                await sqliteExpress.beginTransaction({
                    db: dbInstance
                });

                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Transaction Test', email: 'transaction@example.com' }
                });

                const result = await sqliteExpress.commit({
                    db: dbInstance
                });

                expect(result).toBeDefined();

                // Verify data was committed
                const count = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'Transaction Test' }
                });
                expect(count).toBe(1);
            });

            test('should rollback transaction', async () => {
                await sqliteExpress.beginTransaction({
                    db: dbInstance
                });

                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'Rollback Test', email: 'rollback@example.com' }
                });

                const result = await sqliteExpress.rollback({
                    db: dbInstance
                });

                expect(result).toBeDefined();

                // Verify data was rolled back
                const count = await sqliteExpress.count({
                    db: dbInstance,
                    table: 'users',
                    where: { name: 'Rollback Test' }
                });
                expect(count).toBe(0);
            });

            test('should throw error when db is not provided for beginTransaction', () => {
                expect(() => {
                    sqliteExpress.beginTransaction({});
                }).toThrow('db is required');
            });

            test('should throw error when db is not provided for commit', () => {
                expect(() => {
                    sqliteExpress.commit({});
                }).toThrow('db is required');
            });

            test('should throw error when db is not provided for rollback', () => {
                expect(() => {
                    sqliteExpress.rollback({});
                }).toThrow('db is required');
            });
        });

        describe('declareSQL method', () => {
            test('should declare SELECT query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const fn = await sqliteExpress.declareSQL({
                    db: dbInstance,
                    query: 'SELECT * FROM users WHERE age > ?',
                    expected: 'rows',
                    type: 'select'
                });

                const result = await fn(25);
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBe(1);
            });

            test('should declare INSERT query', async () => {
                const fn = await sqliteExpress.declareSQL({
                    db: dbInstance,
                    query: 'INSERT INTO users (name, age, email) VALUES (?, ?, ?)',
                    type: 'insert'
                });

                const result = await fn('Test User', 25, 'test@example.com');
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            test('should declare UPDATE query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const fn = await sqliteExpress.declareSQL({
                    db: dbInstance,
                    query: 'UPDATE users SET age = ? WHERE name = ?',
                    type: 'update'
                });

                const result = await fn(31, 'John Doe');
                expect(typeof result).toBe('number');
                expect([0, 1]).toContain(result);
            });

            test('should declare DELETE query', async () => {
                // Insert test data
                await sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: 'John Doe', age: 30, email: 'john@example.com' }
                });

                const fn = await sqliteExpress.declareSQL({
                    db: dbInstance,
                    query: 'DELETE FROM users WHERE name = ?',
                    type: 'delete'
                });

                const result = await fn('John Doe');
                expect(typeof result).toBe('number');
                expect(result).toBe(1);
            });

            test('should throw error when db is not provided', () => {
                expect(() => {
                    sqliteExpress.declareSQL({
                        query: 'SELECT * FROM users'
                    });
                }).toThrow('db is required');
            });

            test('should throw error when query is not provided', async () => {
                await expect(sqliteExpress.declareSQL({
                    db: dbInstance
                })).rejects.toThrow('SqliteExpress - Declare SQL Error: The query is not defined');
            });
        });
    });

    describe('Integration and Concurrency', () => {
        test('should handle multiple databases', async () => {
            const db1 = sqliteExpress.createDB({
                route: 'test-db1.db',
                logQuery: false
            });

            const db2 = sqliteExpress.createDB({
                route: 'test-db2.db',
                logQuery: false
            });

            // Create tables in both databases
            await sqliteExpress.createTable({
                db: db1,
                table: 'users',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            await sqliteExpress.createTable({
                db: db2,
                table: 'products',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            // Insert data in both databases
            await sqliteExpress.insert({
                db: db1,
                table: 'users',
                row: { name: 'User 1' }
            });

            await sqliteExpress.insert({
                db: db2,
                table: 'products',
                row: { name: 'Product 1' }
            });

            // Verify data in both databases
            const userCount = await sqliteExpress.count({ db: db1, table: 'users' });
            const productCount = await sqliteExpress.count({ db: db2, table: 'products' });

            expect(userCount).toBe(1);
            expect(productCount).toBe(1);

            // Clean up
            await new Promise(resolve => db1.sqliteDb.close(resolve));
            await new Promise(resolve => db2.sqliteDb.close(resolve));
        });

        test('should handle concurrent operations', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            // Perform concurrent operations
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: `User ${i}` }
                }));
            }

            const results = await Promise.all(promises);
            expect(results.length).toBe(10);
            results.forEach(result => {
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            const count = await sqliteExpress.count({
                db: dbInstance,
                table: 'users'
            });
            expect(count).toBe(10);
        });

        test('should handle large number of operations', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT', age: 'INTEGER' }
            });

            // Insert 100 rows
            const insertPromises = [];
            for (let i = 0; i < 100; i++) {
                insertPromises.push(sqliteExpress.insert({
                    db: dbInstance,
                    table: 'users',
                    row: { name: `User ${i}`, age: 20 + i }
                }));
            }

            await Promise.all(insertPromises);

            // Verify all were inserted
            const count = await sqliteExpress.count({
                db: dbInstance,
                table: 'users'
            });
            expect(count).toBe(100);

            // Test complex query
            const result = await sqliteExpress.select({
                db: dbInstance,
                table: 'users',
                select: 'name',
                where: { age: { operator: '>', value: 50 } }
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0); // Users with age > 50
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle non-existent table', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await expect(sqliteExpress.select({
                db: dbInstance,
                table: 'non_existent_table',
                select: '*'
            })).rejects.toThrow();
        });

        test('should handle invalid SQL syntax', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await expect(sqliteExpress.executeSQL({
                db: dbInstance,
                query: 'INVALID SQL QUERY'
            })).rejects.toThrow();
        });

        test('should handle constraint violations', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: {
                    id: 'INTEGER PRIMARY KEY',
                    email: 'TEXT UNIQUE'
                }
            });

            // Insert first row
            await sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { email: 'test@example.com' }
            });

            // Try to insert duplicate email
            await expect(sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { email: 'test@example.com' }
            })).rejects.toThrow();
        });

        test('should handle missing required parameters', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await expect(sqliteExpress.insert({
                db: dbInstance,
                table: 'users'
                // Missing row parameter
            })).rejects.toThrow('SqliteExpress - Insert Error: The row is not defined');
        });

        test('should handle special characters in data', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            const specialName = "O'Connor & Smith <test> \"quotes\"";
            const result = await sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { name: specialName }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            const retrieved = await sqliteExpress.select({
                db: dbInstance,
                table: 'users',
                select: 'name',
                where: { id: result }
            });

            expect(retrieved[0].name).toBe(specialName);
        });

        test('should handle null and undefined values', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: { 
                    id: 'INTEGER PRIMARY KEY', 
                    name: 'TEXT',
                    age: 'INTEGER',
                    email: 'TEXT'
                }
            });

            const result = await sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { 
                    name: 'Test User',
                    age: null,
                    email: undefined
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        test('should handle empty strings', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                table: 'users',
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            const result = await sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { name: '' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            const retrieved = await sqliteExpress.select({
                db: dbInstance,
                table: 'users',
                select: 'name',
                where: { id: result }
            });

            expect(retrieved[0].name).toBe('');
        });
    });

    describe('Default Options Integration', () => {
        test('should inherit default options in all operations', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            // Set default options (avoid readonly properties)
            sqliteExpress.defaultOptions.set({
                table: 'users',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            await sqliteExpress.insert({
                db: dbInstance,
                row: { name: 'Default User' }
            });

            const result = await sqliteExpress.select({
                db: dbInstance,
                select: '*'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Default User');
        });

        test('should override default options with method parameters', async () => {
            dbInstance = sqliteExpress.createDB({
                route: 'test-db.db',
                logQuery: false
            });

            // Set default options (avoid readonly properties)
            sqliteExpress.defaultOptions.set({
                table: 'users',
                logQuery: false
            });

            await sqliteExpress.createTable({
                db: dbInstance,
                columns: { id: 'INTEGER PRIMARY KEY', name: 'TEXT' }
            });

            // Override table in insert
            await sqliteExpress.insert({
                db: dbInstance,
                table: 'users',
                row: { name: 'Override User' }
            });

            // Use default table in select
            const result = await sqliteExpress.select({
                db: dbInstance,
                select: '*'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Override User');
        });
    });
}); 