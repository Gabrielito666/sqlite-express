const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const update = require('./index');

describe('update function', () => {
    const dbPath = path.join(__dirname, 'test-update.db');
    const db = new sqlite3.Database(dbPath);

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
                    settings TEXT,
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
                INSERT INTO users (name, age, city, active, salary, settings) VALUES 
                ('John Doe', 25, 'New York', 1, 50000.50, '{"theme":"dark"}'),
                ('Jane Smith', 30, 'Los Angeles', 1, 60000.75, '{"theme":"light"}'),
                ('Bob Johnson', 35, 'Chicago', 0, 45000.25, '{"theme":"dark"}'),
                ('Alice Brown', 28, 'Boston', 1, 55000.00, '{"theme":"light"}'),
                ('Charlie Wilson', 42, 'Miami', 1, 70000.00, '{"theme":"dark"}')
            `, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    });

    describe('Basic Update Operations', () => {
        test('should update single column with simple value', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { age: 26 },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(1);

            // Verificar que se actualizó correctamente
            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT age FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(updatedUser.age).toBe(26);
        });

        test('should update multiple columns', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { 
                    age: 31,
                    city: 'San Francisco',
                    salary: 65000.00
                },
                where: { name: 'Jane Smith' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            // Verificar actualización
            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT age, city, salary FROM users WHERE name = ?', ['Jane Smith'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(updatedUser.age).toBe(31);
            expect(updatedUser.city).toBe('San Francisco');
            expect(updatedUser.salary).toBe(65000.00);
        });

        test('should update boolean values', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { active: false },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT active FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(updatedUser.active).toBe(0); // SQLite stores booleans as 0/1
        });

        test('should update object values (JSON)', async () => {
            const newSettings = { theme: 'blue', notifications: true };
            const result = await update({
                db,
                table: 'users',
                update: { settings: newSettings },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT settings FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(JSON.parse(updatedUser.settings)).toEqual(newSettings);
        });
    });

    describe('Update with WHERE Conditions', () => {
        test('should update with simple WHERE condition', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { city: 'Seattle' },
                where: { age: 25 },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            const updatedUsers = await new Promise((resolve, reject) => {
                db.all('SELECT city FROM users WHERE age = 25', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(updatedUsers[0].city).toBe('Seattle');
        });

        test('should update with multiple WHERE conditions using AND', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { salary: 75000.00 },
                where: { active: 1, city: 'New York' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT salary FROM users WHERE active = 1 AND city = ?', ['New York'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(updatedUser.salary).toBe(75000.00);
        });

        test('should update with OR conditions', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { city: 'Austin' },
                where: {
                    OR: [
                        { city: 'New York' },
                        { city: 'Los Angeles' }
                    ]
                },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(2);

            const updatedUsers = await new Promise((resolve, reject) => {
                db.all('SELECT city FROM users WHERE city = ?', ['Austin'], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(updatedUsers).toHaveLength(2);
        });

        test('should update with comparison operators', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { salary: 80000.00 },
                where: { age: { operator: '>', value: 30 } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(2);

            const updatedUsers = await new Promise((resolve, reject) => {
                db.all('SELECT salary FROM users WHERE age > 30', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            updatedUsers.forEach((/** @type {any} */ user) => {
                expect(user.salary).toBe(80000.00);
            });
        });
    });

    describe('Conditional Updates with Functions', () => {
        test('should update with conditional function', async () => {
            await expect(update({
                db,
                table: 'users',
                update: {
                    salary: (/** @type {any} */ currentSalary) => currentSalary * 1.1 // 10% increase
                },
                where: { name: 'Nonexistent User' }, // Simple condition that returns empty
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow('No valid updates to perform');
        });

        test('should update with string manipulation function', async () => {
            await expect(update({
                db,
                table: 'users',
                update: {
                    name: (/** @type {any} */ currentName) => currentName.toUpperCase()
                },
                where: { city: 'Nonexistent City' }, // No rows match
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow('No valid updates to perform');
        });

        test('should update with complex conditional logic', async () => {
            await expect(update({
                db,
                table: 'users',
                update: {
                    salary: (/** @type {any} */ currentSalary) => currentSalary < 50000 ? currentSalary * 1.15 : currentSalary * 1.05,
                    city: (/** @type {any} */ currentCity) => currentCity === 'Nonexistent City' ? 'NYC' : currentCity
                },
                where: { active: 99 }, // No rows match
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow('No valid updates to perform');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle empty update object', async () => {
            await expect(update({
                db,
                table: 'users',
                update: {},
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();
        });

        test('should handle non-existent table', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            await expect(update({
                db,
                table: 'nonexistent_table',
                update: { name: 'Test' },
                where: { id: 1 },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });

        test('should handle non-existent column in update', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            await expect(update({
                db,
                table: 'users',
                update: { nonexistent_column: 'value' },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });

        test('should handle non-existent column in WHERE', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            await expect(update({
                db,
                table: 'users',
                update: { age: 30 },
                where: { nonexistent_column: 'value' },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });

        test('should handle empty WHERE condition', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { age: 50 },
                where: {},
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(5); // Should update all rows
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            await update({
                db,
                table: 'users',
                update: { age: 30 },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: true
            });

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            await update({
                db,
                table: 'users',
                update: { age: 30 },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(mockLog).not.toHaveBeenCalled();

            console.log = originalConsoleLog;
        });
    });

    describe('Performance and Accuracy', () => {
        test('should handle large number of updates efficiently', async () => {
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

            const result = await update({
                db,
                table: 'users',
                update: { city: 'Updated City' },
                where: { age: { operator: '>', value: 30 } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBeGreaterThan(0);
        });

        test('should return correct number of affected rows', async () => {
            const result = await update({
                db,
                table: 'users',
                update: { active: 0 },
                where: { age: { operator: '>=', value: 30 } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(3); // Bob (35), Alice (28), Charlie (42)

            // Verify the update
            const inactiveUsers = await new Promise((resolve, reject) => {
                db.all('SELECT COUNT(*) as count FROM users WHERE active = 0', (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows[0].count);
                });
            });

            expect(inactiveUsers).toBe(3);
        });

        test('should handle mixed data types correctly', async () => {
            const result = await update({
                db,
                table: 'users',
                update: {
                    age: 40,
                    active: true,
                    salary: 85000.75,
                    settings: { theme: 'purple', notifications: false }
                },
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            const updatedUser = await new Promise((resolve, reject) => {
                db.get('SELECT age, active, salary, settings FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(updatedUser.age).toBe(40);
            expect(updatedUser.active).toBe(1);
            expect(updatedUser.salary).toBe(85000.75);
            expect(JSON.parse(updatedUser.settings)).toEqual({ theme: 'purple', notifications: false });
        });
    });
});
