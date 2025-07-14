const expectedSwitch = require('./index');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

describe('expectedSwitch function', () => {
    const dbPath = path.join(__dirname, 'test-expected-switch.db');
    const db = new sqlite3.Database(dbPath);

    beforeAll((done) => {
        db.serialize(() => {
            db.run(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                city TEXT,
                active BOOLEAN DEFAULT 1,
                salary REAL,
                settings TEXT
            )`);

            db.run(`CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL,
                category TEXT,
                stock INTEGER DEFAULT 0
            )`);

            // Insert test data
            const insertUsers = db.prepare('INSERT INTO users (name, age, city, active, salary, settings) VALUES (?, ?, ?, ?, ?, ?)');
            insertUsers.run(['John Doe', 30, 'New York', 1, 50000, '{"theme": "dark"}']);
            insertUsers.run(['Jane Smith', 25, 'Los Angeles', 1, 45000, '{"theme": "light"}']);
            insertUsers.run(['Bob Johnson', 35, 'Chicago', 0, 60000, '{"theme": "blue"}']);
            insertUsers.run(['Alice Brown', 28, 'New York', 1, 55000, '{"theme": "green"}']);
            insertUsers.run(['Charlie Wilson', 42, 'Boston', 0, 70000, '{"theme": "red"}']);
            insertUsers.finalize();

            const insertProducts = db.prepare('INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)');
            insertProducts.run(['Laptop', 999.99, 'Electronics', 10]);
            insertProducts.run(['Mouse', 29.99, 'Electronics', 50]);
            insertProducts.run(['Book', 19.99, 'Books', 100]);
            insertProducts.run(['Chair', 199.99, 'Furniture', 5]);
            insertProducts.finalize();

            done();
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
        // Limpiar tablas antes de cada test
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM users', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM products', (err) => {
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

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM sqlite_sequence WHERE name="products"', (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        // Insertar datos de prueba
        await new Promise((resolve, reject) => {
            const insertUsers = db.prepare('INSERT INTO users (name, age, city, active, salary, settings) VALUES (?, ?, ?, ?, ?, ?)');
            insertUsers.run(['John Doe', 30, 'New York', 1, 50000, '{"theme": "dark"}']);
            insertUsers.run(['Jane Smith', 25, 'Los Angeles', 1, 45000, '{"theme": "light"}']);
            insertUsers.run(['Bob Johnson', 35, 'Chicago', 0, 60000, '{"theme": "blue"}']);
            insertUsers.run(['Alice Brown', 28, 'New York', 1, 55000, '{"theme": "green"}']);
            insertUsers.run(['Charlie Wilson', 42, 'Boston', 0, 70000, '{"theme": "red"}']);
            insertUsers.finalize((err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });

        await new Promise((resolve, reject) => {
            const insertProducts = db.prepare('INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)');
            insertProducts.run(['Laptop', 999.99, 'Electronics', 10]);
            insertProducts.run(['Mouse', 29.99, 'Electronics', 50]);
            insertProducts.run(['Book', 19.99, 'Books', 100]);
            insertProducts.run(['Chair', 199.99, 'Furniture', 5]);
            insertProducts.finalize((err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    describe('Basic Expected Types', () => {
        test('should return single value with "celd"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: false
            });

            expect(result).toBe('John Doe');
        });

        test('should return null with "celd" when no results', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 999 },
                expected: 'celd',
                logQuery: false
            });

            expect(result).toBeNull();
        });

        test('should return single row with "row"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT * FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'row',
                logQuery: false
            });

            expect(result).toEqual({
                id: 1,
                name: 'John Doe',
                age: 30,
                city: 'New York',
                active: 1,
                salary: 50000,
                settings: '{"theme": "dark"}'
            });
        });

        test('should return null with "row" when no results', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT * FROM users WHERE id = ?',
                parameters: { 1: 999 },
                expected: 'row',
                logQuery: false
            });

            expect(result).toBeNull();
        });

        test('should return column array with "column"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users ORDER BY id LIMIT 3',
                parameters: {},
                expected: 'column',
                logQuery: false
            });

            expect(result).toEqual(['John Doe', 'Jane Smith', 'Bob Johnson']);
        });

        test('should return empty array with "column" when no results', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 999 },
                expected: 'column',
                logQuery: false
            });

            expect(result).toEqual([]);
        });

        test('should return rows array with "rows"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT * FROM users ORDER BY id LIMIT 2',
                parameters: {},
                expected: 'rows',
                logQuery: false
            });

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('John Doe');
            expect(result[1].name).toBe('Jane Smith');
        });

        test('should return empty array with "rows" when no results', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT * FROM users WHERE id = ?',
                parameters: { 1: 999 },
                expected: 'rows',
                logQuery: false
            });

            expect(result).toEqual([]);
        });
    });

    describe('Data Type Handling', () => {
        test('should handle different data types with "celd"', async () => {
            const nameResult = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: false
            });
            expect(typeof nameResult).toBe('string');

            const ageResult = await expectedSwitch({
                db,
                query: 'SELECT age FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: false
            });
            expect(typeof ageResult).toBe('number');

            const activeResult = await expectedSwitch({
                db,
                query: 'SELECT active FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: false
            });
            expect(typeof activeResult).toBe('number'); // SQLite stores booleans as integers
        });

        test('should handle JSON strings in "row"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT settings FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'row',
                logQuery: false
            });

            expect(result?.settings).toBe('{"theme": "dark"}');
        });
    });

    describe('Complex Queries', () => {
        test('should handle WHERE conditions with "celd"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT COUNT(*) FROM users WHERE age > ?',
                parameters: { 1: 30 },
                expected: 'celd',
                logQuery: false
            });

            expect(result).toBe(2); // Bob (35) and Charlie (42)
        });

        test('should handle JOIN queries with "rows"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT u.name, p.name as product FROM users u, products p WHERE u.id = ? AND p.id = ?',
                parameters: { 1: 1, 2: 1 },
                expected: 'rows',
                logQuery: false
            });

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].product).toBe('Laptop');
        });

        test('should handle aggregate functions with "celd"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT AVG(age) FROM users',
                parameters: {},
                expected: 'celd',
                logQuery: false
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty result set with "celd"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE 1 = 0',
                parameters: {},
                expected: 'celd',
                logQuery: false
            });

            expect(result).toBeNull();
        });

        test('should handle single column result with "column"', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'column',
                logQuery: false
            });

            expect(result).toEqual(['John Doe']);
        });

        test('should handle multiple columns with "column" (returns first column)', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT name, age FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'column',
                logQuery: false
            });

            expect(result).toEqual(['John Doe']);
        });
    });

    describe('Error Handling', () => {
        test('should reject when table does not exist', async () => {
            await expect(expectedSwitch({
                db,
                query: 'SELECT * FROM nonexistent_table',
                parameters: {},
                expected: 'rows',
                logQuery: false
            })).rejects.toThrow();
        });

        test('should reject when column does not exist', async () => {
            await expect(expectedSwitch({
                db,
                query: 'SELECT nonexistent_column FROM users',
                parameters: {},
                expected: 'rows',
                logQuery: false
            })).rejects.toThrow();
        });

        test('should reject with invalid SQL syntax', async () => {
            await expect(expectedSwitch({
                db,
                query: 'SELECT * FROM users WHERE',
                parameters: {},
                expected: 'rows',
                logQuery: false
            })).rejects.toThrow();
        });
    });

    describe('Query Logging', () => {
        test('should log when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: true
            });

            expect(mockLog).toHaveBeenCalledWith('Query executed successfully');

            console.log = originalConsoleLog;
        });

        test('should not log when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'celd',
                logQuery: false
            });

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

            const result = await expectedSwitch({
                db,
                query: 'SELECT name FROM users WHERE age > ?',
                parameters: { 1: 30 },
                expected: 'column',
                logQuery: false
            });

            expect(result.length).toBeGreaterThan(0);
        });

        test('should return correct data types for different columns', async () => {
            const result = await expectedSwitch({
                db,
                query: 'SELECT id, name, age, active, salary FROM users WHERE id = ?',
                parameters: { 1: 1 },
                expected: 'row',
                logQuery: false
            });

            expect(typeof result?.id).toBe('number');
            expect(typeof result?.name).toBe('string');
            expect(typeof result?.age).toBe('number');
            expect(typeof result?.active).toBe('number');
            expect(typeof result?.salary).toBe('number');
        });

        test('should handle null values correctly', async () => {
            // Insert a user with null values
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO users (name, age, city) VALUES (?, ?, ?)', 
                    ['Null User', null, null], 
                    (err) => {
                        if (err) reject(err);
                        else resolve(true);
                    }
                );
            });

            const result = await expectedSwitch({
                db,
                query: 'SELECT age, city FROM users WHERE name = ?',
                parameters: { 1: 'Null User' },
                expected: 'row',
                logQuery: false
            });

            expect(result?.age).toBeNull();
            expect(result?.city).toBeNull();
        });
    });
});
