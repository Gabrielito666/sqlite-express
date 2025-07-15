const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const exist = require('./index');
const Options = require('../class-options');

describe('exist function', () => {
    const dbPath = path.join(__dirname, 'test-exist.db');
    const db = new sqlite3.Database(dbPath);
    const mockContext = {};
    // @ts-ignore
    let dbType = undefined;
    dbType = {
        sqliteDb: db,
        waitingList: {
            database: undefined, // se asigna después
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
                    active BOOLEAN DEFAULT 1
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

        // Insertar datos de prueba
        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users (name, age, city, active) VALUES 
                ('John Doe', 25, 'New York', 1),
                ('Jane Smith', 30, 'Los Angeles', 1),
                ('Bob Johnson', 35, 'Chicago', 0),
                ('Alice Brown', 28, 'Boston', 1),
                ('Charlie Wilson', 42, 'Miami', 1),
                ('Diana Davis', 33, 'Seattle', 0),
                ('Eve Miller', 29, 'Denver', 1)
            `, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    describe('Basic Existence Checks', () => {
        test('should return true when record exists', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return false when record does not exist', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'NonExistentUser' },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(false);
        });

        test('should return true when multiple records match condition', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { age: { operator: '>', value: 30 } },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return true when checking for active users', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { active: 1 },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return true when checking for inactive users', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { active: 0 },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });
    });

    describe('Complex Where Conditions', () => {
        test('should return true with AND condition', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: {
                    age: { operator: '>=', value: 25 },
                    city: 'New York'
                },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return false with AND condition when no match', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: {
                    age: { operator: '>', value: 50 },
                    city: 'New York'
                },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(false);
        });

        test('should return true with OR condition', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: {
                    OR: [
                        { age: { operator: '<', value: 30 } },
                        { age: { operator: '>', value: 40 } }
                    ]
                },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return true with nested AND/OR conditions', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: {
                    OR: [
                        {
                            AND: [
                                { age: { operator: '>', value: 25 } },
                                { city: 'New York' }
                            ]
                        },
                        {
                            AND: [
                                { age: { operator: '<', value: 30 } },
                                { active: 1 }
                            ]
                        }
                    ]
                },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('should return true when where is empty object (all records)', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: {},
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should return false when table is empty', async () => {
            // Delete all records first
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM users', (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(false);
        });

        test('should handle LIKE operator', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: { operator: 'LIKE', value: '%John%' } },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should handle IN operator', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { city: { operator: 'IN', value: ['New York', 'Los Angeles'] } },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should handle NOT IN operator', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { city: { operator: 'NOT IN', value: ['NonExistentCity'] } },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });

        test('should handle IS NULL operator', async () => {
            // Insert a record with NULL city
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO users (name, age, city, active) VALUES (?, ?, ?, ?)', 
                    ['Null City User', 25, null, 1], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { city: { operator: 'IS', value: null } },
                connector: 'AND',
                logQuery: false
            });

            const result = await exist(options);

            expect(result).toBe(true);
        });
    });

    describe('Error Handling', () => {
        test('should reject when table does not exist', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'nonexistent_table',
                where: { id: 1 },
                connector: 'AND',
                logQuery: false
            });

            await expect(exist(options)).rejects.toThrow();
        });

        test('should reject when column does not exist', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { nonexistent_column: 'value' },
                connector: 'AND',
                logQuery: false
            });

            await expect(exist(options)).rejects.toThrow();
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: true
            });

            await exist(options);

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            await exist(options);

            expect(mockLog).not.toHaveBeenCalled();

            console.log = originalConsoleLog;
        });
    });

    describe('Performance and Accuracy', () => {
        test('should return correct result after data changes', async () => {
            // Check that John Doe exists
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });
            let result = await exist(options);
            expect(result).toBe(true);

            // Delete John Doe
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM users WHERE name = ?', ['John Doe'], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });

            // Check that John Doe no longer exists
            result = await exist(options);
            expect(result).toBe(false);
        });

        test('should handle multiple existence checks efficiently', async () => {
            const options1 = new Options(mockContext, '/test');
            options1.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            const options2 = new Options(mockContext, '/test');
            options2.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'Jane Smith' },
                connector: 'AND',
                logQuery: false
            });

            const options3 = new Options(mockContext, '/test');
            options3.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                where: { name: 'NonExistentUser' },
                connector: 'AND',
                logQuery: false
            });

            const results = await Promise.all([
                exist(options1),
                exist(options2),
                exist(options3)
            ]);

            expect(results).toEqual([true, true, false]);
        });
    });
});
