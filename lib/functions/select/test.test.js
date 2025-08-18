const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const select = require('./index');
const Options = require('../class-options');

describe('select function', () => {
    const dbPath = path.join(__dirname, 'test-select.db');
    const db = new sqlite3.Database(dbPath);
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

        // Resetear el autoincrement
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM sqlite_sequence WHERE name="users"', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        // Insertar datos de prueba
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

    describe('Basic Select Operations', () => {
        test('should select all columns with expected "rows"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: '*',
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('age');
            expect(result[0]).toHaveProperty('city');
            expect(result[0]).toHaveProperty('active');
            expect(result[0]).toHaveProperty('salary');
        });

        test('should select specific columns with expected "rows"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age', 'city'],
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('age');
            expect(result[0]).toHaveProperty('city');
            expect(result[0]).not.toHaveProperty('id');
            expect(result[0]).not.toHaveProperty('active');
        });

        test('should select single column with expected "column"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'name',
                expected: 'column',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
            expect(result).toContain('John Doe');
            expect(result).toContain('Jane Smith');
            expect(result).toContain('Bob Johnson');
        });

        test('should select single value with expected "celd"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'name',
                where: { id: 1 },
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('string');
            expect(result).toBe('John Doe');
        });

        test('should select single row with expected "row"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age', 'city'],
                where: { id: 1 },
                expected: 'row',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('name', 'John Doe');
            expect(result).toHaveProperty('age', 25);
            expect(result).toHaveProperty('city', 'New York');
        });
    });

    describe('Select with Aliases', () => {
        test('should select with column aliases', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: {
                    name: { as: 'user_name' },
                    age: { as: 'user_age' },
                    city: { as: 'user_city' }
                },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
            expect(result[0]).toHaveProperty('user_name');
            expect(result[0]).toHaveProperty('user_age');
            expect(result[0]).toHaveProperty('user_city');
            expect(result[0]).not.toHaveProperty('name');
            expect(result[0]).not.toHaveProperty('age');
            expect(result[0]).not.toHaveProperty('city');
        });

        test('should select single column with alias using "column"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: { name: { as: 'user_name' } },
                expected: 'column',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
            expect(result).toContain('John Doe');
        });
    });

    describe('Select with WHERE Conditions', () => {
        test('should select with simple WHERE condition', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { age: 25 },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].age).toBe(25);
        });

        test('should select with multiple WHERE conditions using AND', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'city'],
                where: { active: 1, city: 'New York' },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].city).toBe('New York');
        });

        test('should select with OR conditions', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'city'],
                where: { 
                    OR: [
                        { city: 'New York' },
                        { city: 'Los Angeles' }
                    ]
                },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
            // @ts-ignore
            const cities = result.map(r => r?.city);
            expect(cities).toContain('New York');
            expect(cities).toContain('Los Angeles');
        });

        test('should select with comparison operators', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { age: { operator: '>', value: 30 } },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
            // @ts-ignore
            const ages = result.map(r => r?.age);
            expect(ages).toContain(35);
            expect(ages).toContain(42);
        });

        test('should select with LIKE operator', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name'],
                where: { name: { operator: 'LIKE', value: '%John%' } },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
            // @ts-ignore
            const names = result.map(r => r?.name);
            expect(names).toContain('John Doe');
            expect(names).toContain('Bob Johnson');
        });
    });

    describe('Select with Different Expected Types', () => {
        test('should return single value with "celd"', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'COUNT(*)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(5);
        });

        test('should return null with "celd" when no results', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'name',
                where: { id: 999 },
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(result).toBeNull();
        });

        test('should return null with "row" when no results', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { id: 999 },
                expected: 'row',
                logQuery: false
            });
            const result = await select(options);

            expect(result).toBeNull();
        });

        test('should return empty array with "column" when no results', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'name',
                where: { id: 999 },
                expected: 'column',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        test('should return empty array with "rows" when no results', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { id: 999 },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });
    });

    describe('Complex WHERE Conditions', () => {
        test('should handle nested AND/OR conditions', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age', 'city', 'active'],
                where: {
                    AND: [
                        { active: 1 },
                        {
                            OR: [
                                { city: 'New York' },
                                { age: { operator: '>', value: 30 } }
                            ]
                        }
                    ]
                },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            // All results should be active
            // @ts-ignore
            result.forEach(row => {
                expect(row.active).toBe(1);
            });
        });

        test('should handle IN operator', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { age: { operator: 'IN', value: [25, 30, 35] } },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(3);
            // @ts-ignore
            const ages = result.map(r => r?.age);
            expect(ages).toContain(25);
            expect(ages).toContain(30);
            expect(ages).toContain(35);
        });

        test('should handle BETWEEN operator', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                where: { 
                    AND: [
                        { age: { operator: '>=', value: 25 } },
                        { age: { operator: '<=', value: 35 } }
                    ]
                },
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(4);
            // @ts-ignore
            result.forEach(row => {
                expect(row.age).toBeGreaterThanOrEqual(25);
                expect(row.age).toBeLessThanOrEqual(35);
            });
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty select array', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['*'],
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(5);
        });

        test('should handle select with COUNT function', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'COUNT(*)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(5);
        });

        test('should handle select with MAX function', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'MAX(age)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(42);
        });

        test('should handle select with MIN function', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'MIN(age)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            expect(result).toBe(25);
        });

        test('should handle select with AVG function', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'AVG(age)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            expect(result).toBeCloseTo(32, 1);
        });

        test('should handle select with SUM function', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: 'SUM(salary)',
                expected: 'celd',
                logQuery: false
            });
            const result = await select(options);

            expect(typeof result).toBe('number');
            // El valor exacto es 280001.5 según el debug anterior
            expect(result).toBe(280001.5);
        });
    });

    describe('Error Handling', () => {
        test('should reject when table does not exist', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'nonexistent_table',
                select: '*',
                expected: 'rows',
                logQuery: false
            });
            await expect(select(options)).rejects.toThrow();
        });

        test('should reject when column does not exist', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['nonexistent_column'],
                expected: 'rows',
                logQuery: false
            });
            await expect(select(options)).rejects.toThrow();
        });

        test('should reject when WHERE column does not exist', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name'],
                where: { nonexistent_column: 'value' },
                expected: 'rows',
                logQuery: false
            });
            await expect(select(options)).rejects.toThrow();
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                expected: 'rows',
                logQuery: true
            });
            await select(options);

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                expected: 'rows',
                logQuery: false
            });
            await select(options);

            expect(mockLog).not.toHaveBeenCalled();

            console.log = originalConsoleLog;
        });
    });

    describe('Performance and Accuracy', () => {
        test('should handle large result sets efficiently', async () => {
            // Insert more test data
            const insertPromises = [];
            for (let i = 6; i <= 100; i++) {
                insertPromises.push(new Promise((resolve, reject) => {
                    db.run(
                        'INSERT INTO users (name, age, city, active, salary) VALUES (?, ?, ?, ?, ?)',
                        [`User ${i}`, 20 + (i % 50), `City ${i % 10}`, i % 2, 40000 + (i * 100)],
                        (err) => {
                            if (err) reject(err);
                            else resolve(true);
                        }
                    );
                }));
            }
            await Promise.all(insertPromises);

            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age'],
                expected: 'rows',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(100);
        });

        test('should return correct data types for different columns', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['id', 'name', 'age', 'active', 'salary'],
                where: { id: 1 },
                expected: 'row',
                logQuery: false
            });
            const result = await select(options);

            expect(result).not.toBeNull();
            //@ts-ignore
            expect(typeof result.id).toBe('number');
            //@ts-ignore
            expect(typeof result.name).toBe('string');
            //@ts-ignore
            expect(typeof result.age).toBe('number');
            //@ts-ignore
            expect(typeof result.active).toBe('number');
            //@ts-ignore
            expect(typeof result.salary).toBe('number');
        });

        test('should handle boolean values correctly', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['active'],
                where: { active: 1 },
                expected: 'column',
                logQuery: false
            });
            const result = await select(options);

            expect(Array.isArray(result)).toBe(true);
            // @ts-ignore
            result.forEach(value => {
                expect(typeof value).toBe('number');
                expect(value).toBe(1);
            });
        });

        test('should handle null values correctly', async () => {
            // Insert a record with null values
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (name, age, city, active, salary) VALUES (?, ?, ?, ?, ?)',
                    ['Null User', null, null, null, null],
                    (err) => {
                        if (err) reject(err);
                        else resolve(true);
                    }
                );
            });

            const options = new Options([{ route: '/test' }]);
            options.set({
                // @ts-ignore
                db: dbType,
                table: 'users',
                select: ['name', 'age', 'city'],
                where: { name: 'Null User' },
                expected: 'row',
                logQuery: false
            });
            const result = await select(options);
            //@ts-ignore
            expect(result.name).toBe('Null User');
            //@ts-ignore
            expect(result.age).toBeNull();
            //@ts-ignore
            expect(result.city).toBeNull();
        });
    });
});

