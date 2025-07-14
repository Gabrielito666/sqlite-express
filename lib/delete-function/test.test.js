const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const deleteFunc = require('./index');

describe('delete function', () => {
    const dbPath = path.join(__dirname, 'test-delete.db');
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

    describe('Basic Delete Operations', () => {
        test('should delete single record by id', async () => {
            // Verificar que el registro existe antes de eliminar
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(1);

            // Ejecutar delete
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            // Verificar que el registro fue eliminado
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should delete multiple records with age condition', async () => {
            // Verificar registros antes de eliminar
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE age > ?', [30], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBeGreaterThan(0);

            // Ejecutar delete
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { age: { operator: '>', value: 30 } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBeGreaterThan(0);

            // Verificar que los registros fueron eliminados
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE age > ?', [30], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should delete inactive users', async () => {
            // Verificar registros inactivos antes de eliminar
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE active = ?', [0], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(2); // Bob y Diana están inactivos

            // Ejecutar delete
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { active: 0 },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(2);

            // Verificar que los registros inactivos fueron eliminados
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE active = ?', [0], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });
    });

    describe('Complex Where Conditions', () => {
        test('should delete with AND condition', async () => {
            // Verificar registros que cumplen la condición
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE age >= ? AND city = ?', [25, 'New York'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(1); // Solo John Doe

            // Ejecutar delete
            const result = await deleteFunc({
                db,
                table: 'users',
                where: {
                    age: { operator: '>=', value: 25 },
                    city: 'New York'
                },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(1);

            // Verificar eliminación
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE name = ?', ['John Doe'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should delete with OR condition', async () => {
            // Verificar registros que cumplen la condición OR
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE age < ? OR age > ?', [30, 40], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBeGreaterThan(0);

            // Ejecutar delete con OR
            const result = await deleteFunc({
                db,
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

            expect(result).toBeGreaterThan(0);

            // Verificar que los registros fueron eliminados
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE age < ? OR age > ?', [30, 40], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should delete with nested AND/OR conditions', async () => {
            // Verificar registros que cumplen la condición compleja
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get(`
                    SELECT COUNT(*) as count FROM users 
                    WHERE (age > 25 AND city = 'New York') OR (age < 30 AND active = 1)
                `, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBeGreaterThan(0);

            // Ejecutar delete con condición compleja
            const result = await deleteFunc({
                db,
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

            expect(result).toBeGreaterThan(0);

            // Verificar eliminación
            const afterDelete = await new Promise((resolve, reject) => {
                db.get(`
                    SELECT COUNT(*) as count FROM users 
                    WHERE (age > 25 AND city = 'New York') OR (age < 30 AND active = 1)
                `, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });
    });

    describe('Edge Cases', () => {
        test('should return 0 when no records match condition', async () => {
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { name: 'NonExistentUser' },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(0);
        });

        test('should delete all records when where is empty object', async () => {
            // Verificar total de registros antes
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(7);

            // Ejecutar delete con where vacío
            const result = await deleteFunc({
                db,
                table: 'users',
                where: {},
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(7);

            // Verificar que todos los registros fueron eliminados
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should handle LIKE operator', async () => {
            // Verificar registros que contienen 'John'
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE name LIKE ?', ['%John%'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(2); // John Doe y Bob Johnson

            // Ejecutar delete con LIKE
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { name: { operator: 'LIKE', value: '%John%' } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(2);

            // Verificar eliminación
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE name LIKE ?', ['%John%'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });

        test('should handle IN operator', async () => {
            // Verificar registros en la lista
            const beforeDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE city IN (?, ?)', ['New York', 'Los Angeles'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(beforeDelete.count).toBe(2);

            // Ejecutar delete con IN
            const result = await deleteFunc({
                db,
                table: 'users',
                where: { city: { operator: 'IN', value: ['New York', 'Los Angeles'] } },
                connector: 'AND',
                logQuery: false
            });

            expect(result).toBe(2);

            // Verificar eliminación
            const afterDelete = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE city IN (?, ?)', ['New York', 'Los Angeles'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            expect(afterDelete.count).toBe(0);
        });
    });

    describe('Error Handling', () => {
        test('should reject when table does not exist', async () => {
            await expect(deleteFunc({
                db,
                table: 'nonexistent_table',
                where: { id: 1 },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();
        });

        test('should reject when column does not exist', async () => {
            await expect(deleteFunc({
                db,
                table: 'users',
                where: { nonexistent_column: 'value' },
                connector: 'AND',
                logQuery: false
            })).rejects.toThrow();
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            await deleteFunc({
                db,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: true
            });

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const logs = [];
            console.log = jest.fn((...args) => {
                logs.push(args.join(' '));
            });

            await deleteFunc({
                db,
                table: 'users',
                where: { name: 'John Doe' },
                connector: 'AND',
                logQuery: false
            });

            expect(logs.length).toBe(0);

            console.log = originalConsoleLog;
        });
    });
}); 