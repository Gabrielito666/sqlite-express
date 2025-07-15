const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const insert = require('./index');
const Options = require('../class-options');

describe('insert function', () => {
    const dbPath = path.join(__dirname, 'test-insert.db');
    const db = new sqlite3.Database(dbPath);
    const mockContext = {};
    // @ts-ignore
    let dbType = undefined;
    dbType = {
        sqliteDb: db,
        waitingList: {
            list: [],
            isRunning: false,
            addOperation: async () => {},
            run: () => {}
        },
        defaultOptions: new Options(mockContext, '/test')
    };

    beforeAll(() => {
        // Crear base de datos de prueba
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER,
                    city TEXT,
                    active BOOLEAN DEFAULT 1,
                    metadata TEXT
                )
            `, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    afterAll(() => {
        return new Promise((resolve) => {
            db.close((err) => {
                if (err) console.error('Error closing database:', err);
                // Eliminar archivo de base de datos
                if (fs.existsSync(dbPath)) {
                    fs.unlinkSync(dbPath);
                }
                resolve(true);
            });
        });
    });

    beforeEach(async () => {
        // Limpiar tabla antes de cada test
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM users', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    describe('Basic Insert Operations', () => {
        test('should insert single record and return ID', async () => {
            const row = {
                name: 'John Doe',
                age: 25,
                city: 'New York',
                active: 1
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verificar que el registro fue insertado
            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord).toBeDefined();
            expect(insertedRecord.name).toBe('John Doe');
            expect(insertedRecord.age).toBe(25);
            expect(insertedRecord.city).toBe('New York');
            expect(insertedRecord.active).toBe(1);
        });

        test('should insert record with only required fields', async () => {
            const row = {
                name: 'Jane Smith'
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verificar que el registro fue insertado
            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord).toBeDefined();
            expect(insertedRecord.name).toBe('Jane Smith');
            expect(insertedRecord.age).toBeNull();
            expect(insertedRecord.city).toBeNull();
        });

        test('should insert multiple records sequentially', async () => {
            const rows = [
                { name: 'Alice Brown', age: 28, city: 'Boston' },
                { name: 'Bob Johnson', age: 35, city: 'Chicago' },
                { name: 'Charlie Wilson', age: 42, city: 'Miami' }
            ];

            const results = [];
            for (const row of rows) {
                const options = new Options(mockContext, '/test');
                options.set({
                    // @ts-ignore
                    db: dbType,
                    table: 'users',
                    row,
                    logQuery: false
                });
                const result = await insert(options);
                results.push(result);
            }

            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            // Verificar que todos los registros fueron insertados
            const allRecords = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM users ORDER BY id', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(allRecords).toHaveLength(3);
            expect(allRecords[0].name).toBe('Alice Brown');
            expect(allRecords[1].name).toBe('Bob Johnson');
            expect(allRecords[2].name).toBe('Charlie Wilson');
        });
    });

    describe('Data Type Handling', () => {
        test('should handle string values correctly', async () => {
            const row = {
                name: 'String Test',
                city: 'Test City'
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.name).toBe('String Test');
            expect(insertedRecord.city).toBe('Test City');
        });

        test('should handle number values correctly', async () => {
            const row = {
                name: 'Number Test',
                age: 42
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.age).toBe(42);
        });

        test('should handle boolean values correctly', async () => {
            const row = {
                name: 'Boolean Test',
                active: false
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.active).toBe('false'); // Converted to string
        });

        test('should handle object values by converting to JSON', async () => {
            const metadata = {
                preferences: { theme: 'dark', language: 'en' },
                lastLogin: '2023-01-01'
            };

            const row = {
                name: 'Object Test',
                metadata
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.metadata).toBe(JSON.stringify(metadata));
        });

        test('should handle null values correctly', async () => {
            const row = {
                name: 'Null Test',
                age: null,
                city: null
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.age).toBeNull();
            expect(insertedRecord.city).toBeNull();
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty object (should fail)', async () => {
            const row = {};

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-expect-error - empty object is not allowed
                db: dbType,
                table: 'users',
                // @ts-ignore
                row,
                logQuery: false
            });

            await expect(insert(options)).rejects.toThrow();
        });

        test('should handle special characters in strings', async () => {
            const row = {
                name: "O'Connor",
                city: 'São Paulo'
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.name).toBe("O'Connor");
            expect(insertedRecord.city).toBe('São Paulo');
        });

        test('should handle very long strings', async () => {
            const longString = 'a'.repeat(1000);
            const row = {
                name: 'Long String Test',
                city: longString
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.city).toBe(longString);
        });

        test('should handle complex nested objects', async () => {
            const complexObject = {
                user: {
                    profile: {
                        personal: {
                            name: 'John',
                            age: 30
                        },
                        preferences: {
                            theme: 'dark',
                            notifications: true
                        }
                    },
                    settings: {
                        privacy: 'public',
                        language: 'en'
                    }
                },
                metadata: {
                    createdAt: '2023-01-01',
                    version: 1.0
                }
            };

            const row = {
                name: 'Complex Object Test',
                metadata: complexObject
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            const result = await insert(options);

            const insertedRecord = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE id = ?', [result], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(insertedRecord.metadata).toBe(JSON.stringify(complexObject));
        });
    });

    describe('Error Handling', () => {
        test('should reject when table does not exist', async () => {
            const row = { name: 'Test' };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'nonexistent_table',
                row,
                logQuery: false
            });

            await expect(insert(options)).rejects.toThrow();
        });

        test('should reject when column does not exist', async () => {
            const row = { 
                name: 'Test',
                nonexistent_column: 'value'
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            await expect(insert(options)).rejects.toThrow();
        });

        test('should reject when required field is missing', async () => {
            const row = { 
                age: 25,
                city: 'Test City'
                // Missing 'name' which is NOT NULL
            };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            await expect(insert(options)).rejects.toThrow();
        });

        test('should reject when constraint is violated', async () => {
            // Create a table with UNIQUE constraint
            await new Promise((resolve, reject) => {
                db.run(`
                    CREATE TABLE IF NOT EXISTS unique_test (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE NOT NULL
                    )
                `, (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });

            // First insert
            const options1 = new Options(mockContext, '/test');
            options1.set({
                // @ts-ignore
                db: dbType,
                table: 'unique_test',
                row: { email: 'test@example.com' },
                logQuery: false
            });
            await insert(options1);

            // Try to insert duplicate (should fail due to UNIQUE constraint)
            const options2 = new Options(mockContext, '/test');
            options2.set({
                // @ts-ignore
                db: dbType,
                table: 'unique_test',
                row: { email: 'test@example.com' },
                logQuery: false
            });
            await expect(insert(options2)).rejects.toThrow();

            // Clean up
            await new Promise((resolve, reject) => {
                db.run('DROP TABLE unique_test', (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const row = { name: 'Log Test', age: 25 };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: true
            });

            await insert(options);

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const row = { name: 'No Log Test', age: 25 };

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                row,
                logQuery: false
            });

            await insert(options);

            expect(mockLog).not.toHaveBeenCalled();

            console.log = originalConsoleLog;
        });
    });

    describe('Performance and Accuracy', () => {
        test('should return unique IDs for multiple inserts', async () => {
            const rows = [
                { name: 'User 1' },
                { name: 'User 2' },
                { name: 'User 3' },
                { name: 'User 4' },
                { name: 'User 5' }
            ];

            const results = [];
            for (const row of rows) {
                const options = new Options(mockContext, '/test');
                options.set({
                    // @ts-ignore
                    db: dbType,
                    table: 'users',
                    row,
                    logQuery: false
                });
                const result = await insert(options);
                results.push(result);
            }

            // Check that all IDs are unique
            const uniqueIds = new Set(results);
            expect(uniqueIds.size).toBe(results.length);

            // Check that IDs are sequential
            const sortedIds = [...results].sort((a, b) => a - b);
            expect(sortedIds).toEqual(results);
        });

        test('should handle concurrent inserts correctly', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                const options = new Options(mockContext, '/test');
                options.set({
                    // @ts-ignore
                    db: dbType,
                    table: 'users',
                    row: { name: `Concurrent User ${i}` },
                    logQuery: false
                });
                promises.push(insert(options));
            }

            const results = await Promise.all(promises);

            expect(results).toHaveLength(5);
            results.forEach(result => {
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThan(0);
            });

            // Verify all records were inserted
            const allRecords = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM users', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(allRecords).toHaveLength(5);
        });
    });
});
