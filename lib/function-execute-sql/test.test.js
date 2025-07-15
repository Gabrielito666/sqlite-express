// @ts-nocheck
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const executeSQL = require('./index');
const Options = require('../class-options');

describe('executeSQL function', () => {
    const dbPath = path.join(__dirname, 'test-execute-sql.db');
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
        // Create test database
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER,
                    city TEXT,
                    active BOOLEAN DEFAULT 1,
                    salary REAL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
                // Remove database file
                if (fs.existsSync(dbPath)) {
                    fs.unlinkSync(dbPath);
                }
                resolve(true);
            });
        });
    });

    beforeEach(async () => {
        // Clear table before each test
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM users', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        // Reset autoincrement
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM sqlite_sequence WHERE name="users"', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        // Insert test data
        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users (name, age, city, active, salary) VALUES 
                ('John Doe', 25, 'New York', 1, 50000.50),
                ('Jane Smith', 30, 'Los Angeles', 1, 60000.75),
                ('Bob Johnson', 35, 'Chicago', 0, 45000.25),
                ('Alice Brown', 28, 'Boston', 1, 55000.00),
                ('Charlie Wilson', 42, 'Miami', 1, 70000.00)
            `, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    describe('SELECT Queries', () => {
        test('should execute SELECT query with expected "rows"', async () => {
            console.log('=== DEBUG TEST ===');
            console.log('Query:', 'SELECT * FROM users WHERE age > @age');
            console.log('Parameters:', { age: 25 });
            console.log('Parameters keys:', Object.keys({ age: 25 }));
            
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > @age',
                parameters: { age: 25 },
                expected: 'rows',
                type: 'select',
                logQuery: true  // Enable logging to see what's happening
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('name');
        });

        test('should execute SELECT query with expected "row"', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT name, age FROM users WHERE id = @id',
                parameters: { id: 1 },
                expected: 'row',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('name', 'John Doe');
            expect(result).toHaveProperty('age', 25);
        });

        test('should execute SELECT query with expected "column"', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT name FROM users WHERE active = @active',
                parameters: { active: 1 },
                expected: 'column',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain('John Doe');
        });

        test('should execute SELECT query with expected "celd"', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT name FROM users WHERE id = @id',
                parameters: { id: 1 },
                expected: 'celd',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('string');
            expect(result).toBe('John Doe');
        });

        test('should execute SELECT query with explicit type', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users LIMIT 1',
                type: 'select',
                expected: 'row',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });
    });

    describe('INSERT Queries', () => {
        test('should execute INSERT query and return lastID', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'INSERT INTO users (name, age, city) VALUES (@name, @age, @city)',
                parameters: { name: 'New User', age: 29, city: 'Seattle' },
                type: 'insert',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        test('should execute INSERT query with auto-detection', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'INSERT INTO users (name, age) VALUES (@name, @age)',
                parameters: { name: 'Auto User', age: 31 },
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('UPDATE Queries', () => {
        test('should execute UPDATE query and return affected rows', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'UPDATE users SET age = @newAge WHERE age = @oldAge',
                parameters: { newAge: 26, oldAge: 25 },
                type: 'update',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        test('should execute UPDATE query with auto-detection', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'UPDATE users SET city = @city WHERE name = @name',
                parameters: { city: 'San Francisco', name: 'John Doe' },
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });
    });

    describe('DELETE Queries', () => {
        test('should execute DELETE query and return affected rows', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'DELETE FROM users WHERE age = @age',
                parameters: { age: 25 },
                type: 'delete',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });

        test('should execute DELETE query with auto-detection', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'DELETE FROM users WHERE name = @name',
                parameters: { name: 'Jane Smith' },
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });
    });

    describe('CREATE Queries', () => {
        test('should execute CREATE query and return void', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'CREATE TABLE test_table (id INTEGER PRIMARY KEY, name TEXT)',
                type: 'create',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(result).toBeUndefined();
        });

        test('should execute CREATE query with auto-detection', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'CREATE TABLE auto_test (id INTEGER, value TEXT)',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(result).toBeUndefined();
        });
    });

    describe('Other Queries', () => {
        test('should execute PRAGMA query', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'PRAGMA table_info(users)',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
        });

        test('should execute transaction queries', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'BEGIN TRANSACTION',
                expected: 'rows',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('number');
        });
    });

    describe('Parameter Processing', () => {
        test('should process internal parameters with ?-param-? syntax', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > ?-30-?',
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        test('should process internal parameters with @-param-@ syntax', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > @-25-@',
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        test('should process internal parameters with $-param-$ syntax', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > $-28-$',
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        test('should process null values in internal parameters', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE city IS ?-null-?',
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
        });

        test('should process numeric values in internal parameters', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > ?-25-?',
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
        });

        test('should process string values in internal parameters', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE name = ?-John Doe-?',
                expected: 'row',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });
    });

    describe('Error Handling', () => {
        test('should throw error for malformed parameters', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age > ?-30',
                expected: 'rows',
                logQuery: false
            });
            await expect(executeSQL(options)).rejects.toThrow('Syntax error: bad parameters detected in query');
        });

        test('should throw error for invalid SQL syntax', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM non_existent_table',
                expected: 'rows',
                logQuery: false
            });
            await expect(executeSQL(options)).rejects.toThrow();
        });

        test('should throw error for invalid table in INSERT', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'INSERT INTO non_existent_table (name) VALUES (@name)',
                parameters: { name: 'Test' },
                expected: 'rows',
                logQuery: false
            });
            await expect(executeSQL(options)).rejects.toThrow();
        });

        test('should throw error for invalid column in UPDATE', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'UPDATE users SET non_existent_column = @value WHERE id = @id',
                parameters: { value: 'test', id: 1 },
                expected: 'rows',
                logQuery: false
            });
            await expect(executeSQL(options)).rejects.toThrow();
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users LIMIT 1',
                expected: 'rows',
                logQuery: true
            });
            await executeSQL(options);

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        test('should not log query when logQuery is false', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users LIMIT 1',
                expected: 'rows',
                logQuery: false
            });
            await executeSQL(options);

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty result set', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE id = @id',
                parameters: { id: 999 },
                expected: 'row',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(result).toBeNull();
        });

        test('should handle complex WHERE conditions', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users WHERE age BETWEEN @minAge AND @maxAge AND active = @active',
                parameters: { minAge: 25, maxAge: 35, active: 1 },
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
        });

        test('should handle ORDER BY and LIMIT', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT * FROM users ORDER BY age DESC LIMIT @limit',
                parameters: { limit: 2 },
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
        });

        test('should handle aggregate functions', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: 'SELECT COUNT(*) as count FROM users WHERE active = @active',
                parameters: { active: 1 },
                expected: 'row',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('count');
        });
    });

    describe('Performance and Large Queries', () => {
        test('should handle large parameter sets', async () => {
            /** @type {{ [key: string]: number }} */
            const largeParams = {};
            const conditions = [];
            for (let i = 1; i <= 50; i++) {
                largeParams[`param${i}`] = i;
                conditions.push(`id > @param${i}`);
            }
            const whereClause = conditions.join(' OR ');
            const query = `SELECT COUNT(*) as count FROM users WHERE ${whereClause}`;

            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query,
                parameters: largeParams,
                expected: 'row',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(typeof result).toBe('object');
        });

        test('should handle complex nested queries', async () => {
            const options = new Options(mockContext, '/test');
            options.set({
                // @ts-ignore
                db: dbType,
                query: `
                    SELECT u.name, u.age, 
                           (SELECT COUNT(*) FROM users WHERE age > u.age) as older_count
                    FROM users u 
                    WHERE u.active = @active
                `,
                parameters: { active: 1 },
                expected: 'rows',
                type: 'select',
                logQuery: false
            });
            const result = await executeSQL(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });
});
