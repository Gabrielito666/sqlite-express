const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const createTable = require('./index');

describe('createTable function', () => {
    const dbPath = path.join(__dirname, 'test-create-table.db');
    const db = new sqlite3.Database(dbPath);

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
        // Limpiar todas las tablas antes de cada test
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("SELECT name FROM sqlite_master WHERE type='table'", 
                    /**
                     * @param {Error|null} err
                     * @param {any} rows
                     */
                    (err, rows) => {
                    if (err) reject(err);
                    else {
                        db.all("SELECT name FROM sqlite_master WHERE type='table'", 
                            /**
                             * @param {Error|null} err
                             * @param {any[]} tables
                             */
                            (err, tables) => {
                            if (err) reject(err);
                            else {
                                const dropPromises = tables
                                    .filter(table => table.name !== 'sqlite_sequence')
                                    .map(table => new Promise((resolve, reject) => {
                                        db.run(`DROP TABLE IF EXISTS ${table.name}`, (err) => {
                                            if (err) reject(err);
                                            else resolve(true);
                                        });
                                    }));
                                Promise.all(dropPromises).then(() => resolve(true)).catch(reject);
                            }
                        });
                    }
                });
            });
        });
    });

    describe('Basic Table Creation', () => {
        test('should create simple table with basic columns', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                age: 'INTEGER',
                email: 'TEXT'
            };

            await createTable({
                db,
                table: 'users',
                columns,
                logQuery: false
            });

            // Verificar que la tabla fue creada
            const tableExists = await new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            expect(tableExists).toBe(true);

            // Verificar estructura de la tabla
            const tableInfo = await new Promise((resolve, reject) => {
                db.all("PRAGMA table_info(users)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(tableInfo).toHaveLength(4);
            expect(tableInfo[0].name).toBe('id');
            expect(tableInfo[0].type).toBe('INTEGER');
            expect(tableInfo[1].name).toBe('name');
            expect(tableInfo[1].type).toBe('TEXT');
            expect(tableInfo[2].name).toBe('age');
            expect(tableInfo[2].type).toBe('INTEGER');
            expect(tableInfo[3].name).toBe('email');
            expect(tableInfo[3].type).toBe('TEXT');
        });

        test('should create table with complex column definitions', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                username: 'TEXT UNIQUE NOT NULL',
                email: 'TEXT UNIQUE NOT NULL',
                password_hash: 'TEXT NOT NULL',
                created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
                updated_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
                is_active: 'BOOLEAN DEFAULT 1',
                profile_data: 'TEXT'
            };

            await createTable({
                db,
                table: 'accounts',
                columns,
                logQuery: false
            });

            // Verificar que la tabla fue creada
            const tableExists = await new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'", (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            expect(tableExists).toBe(true);

            // Verificar estructura de la tabla
            const tableInfo = await new Promise((resolve, reject) => {
                db.all("PRAGMA table_info(accounts)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(tableInfo).toHaveLength(8);
            expect(tableInfo[0].name).toBe('id');
            expect(tableInfo[1].name).toBe('username');
            expect(tableInfo[2].name).toBe('email');
            expect(tableInfo[3].name).toBe('password_hash');
            expect(tableInfo[4].name).toBe('created_at');
            expect(tableInfo[5].name).toBe('updated_at');
            expect(tableInfo[6].name).toBe('is_active');
            expect(tableInfo[7].name).toBe('profile_data');
        });

        test('should create multiple tables', async () => {
            const usersColumns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                email: 'TEXT UNIQUE'
            };

            const postsColumns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                user_id: 'INTEGER NOT NULL',
                title: 'TEXT NOT NULL',
                content: 'TEXT',
                created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            };

            await createTable({
                db,
                table: 'users',
                columns: usersColumns,
                logQuery: false
            });

            await createTable({
                db,
                table: 'posts',
                columns: postsColumns,
                logQuery: false
            });

            // Verificar que ambas tablas fueron creadas
            const tables = await new Promise((resolve, reject) => {
                db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            // @ts-ignore
            const tableNames = tables.map(t => t.name).filter(name => name !== 'sqlite_sequence');
            expect(tableNames).toContain('users');
            expect(tableNames).toContain('posts');
        });
    });

    describe('IF NOT EXISTS Behavior', () => {
        test('should not error when creating table that already exists', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            // Primera creación
            await createTable({
                db,
                table: 'test_table',
                columns,
                logQuery: false
            });

            // Segunda creación (debería no fallar)
            await expect(createTable({
                db,
                table: 'test_table',
                columns,
                logQuery: false
            })).resolves.toBeUndefined();

            // Verificar que la tabla sigue existiendo
            const tableExists = await new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='test_table'", (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            expect(tableExists).toBe(true);
        });

        test('should preserve existing table structure when recreating', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                age: 'INTEGER'
            };

            // Primera creación
            await createTable({
                db,
                table: 'preserve_test',
                columns,
                logQuery: false
            });

            // Insertar algunos datos
            await new Promise((resolve, reject) => {
                db.run("INSERT INTO preserve_test (name, age) VALUES (?, ?)", ['John', 25], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });

            // Segunda creación (debería preservar los datos)
            await createTable({
                db,
                table: 'preserve_test',
                columns,
                logQuery: false
            });

            // Verificar que los datos siguen ahí
            const data = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM preserve_test WHERE name = ?", ['John'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(data).toBeDefined();
            expect(data.name).toBe('John');
            expect(data.age).toBe(25);
        });
    });

    describe('Column Types and Constraints', () => {
        test('should handle different SQLite data types', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                text_field: 'TEXT',
                integer_field: 'INTEGER',
                real_field: 'REAL',
                blob_field: 'BLOB',
                boolean_field: 'BOOLEAN'
            };

            await createTable({
                db,
                table: 'data_types',
                columns,
                logQuery: false
            });

            const tableInfo = await new Promise((resolve, reject) => {
                db.all("PRAGMA table_info(data_types)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(tableInfo).toHaveLength(6);
            expect(tableInfo[0].type).toBe('INTEGER');
            expect(tableInfo[1].type).toBe('TEXT');
            expect(tableInfo[2].type).toBe('INTEGER');
            expect(tableInfo[3].type).toBe('REAL');
            expect(tableInfo[4].type).toBe('BLOB');
            expect(tableInfo[5].type).toBe('BOOLEAN');
        });

        test('should handle constraints and defaults', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                email: 'TEXT UNIQUE NOT NULL',
                age: 'INTEGER CHECK (age >= 0)',
                status: 'TEXT DEFAULT "active"',
                created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            };

            await createTable({
                db,
                table: 'constraints_test',
                columns,
                logQuery: false
            });

            const tableInfo = await new Promise((resolve, reject) => {
                db.all("PRAGMA table_info(constraints_test)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(tableInfo).toHaveLength(6);
            
            // Verificar que las restricciones se aplicaron
            // @ts-ignore
            const nameColumn = tableInfo.find(col => col.name === 'name');

            // @ts-ignore
            const emailColumn = tableInfo.find(col => col.name === 'email');
            // @ts-ignore
            const statusColumn = tableInfo.find(col => col.name === 'status');

            expect(nameColumn.notnull).toBe(1);
            expect(emailColumn.notnull).toBe(1);
            expect(statusColumn.dflt_value).toBe('"active"');
        });
    });

    describe('Error Handling', () => {
        test('should reject with invalid column definition', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                invalid_col: 'TEXT DEFAULT "value" CHECK (invalid_syntax)'
            };

            await expect(createTable({
                db,
                table: 'invalid_table',
                columns,
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });

        test('should reject with empty columns object', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const columns = {};

            await expect(createTable({
                db,
                table: 'empty_table',
                columns,
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });

        test('should reject with invalid table name', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT'
            };

            await expect(createTable({
                db,
                table: '123invalid_name',
                columns,
                logQuery: false
            })).rejects.toThrow();

            console.error = originalConsoleError;
        });
    });

    describe('Query Logging', () => {
        test('should log query when logQuery is true', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            await createTable({
                db,
                table: 'logging_test',
                columns,
                logQuery: true
            });

            expect(mockLog).toHaveBeenCalled();

            console.log = originalConsoleLog;
        });

        test('should not log query when logQuery is false', async () => {
            const originalConsoleLog = console.log;
            const mockLog = jest.fn();
            console.log = mockLog;

            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            await createTable({
                db,
                table: 'no_logging_test',
                columns,
                logQuery: false
            });

            expect(mockLog).not.toHaveBeenCalled();

            console.log = originalConsoleLog;
        });
    });

    describe('Edge Cases', () => {
        test('should handle table name with special characters', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            await createTable({
                db,
                table: 'test_table_with_underscores',
                columns,
                logQuery: false
            });

            const tableExists = await new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='test_table_with_underscores'", (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            expect(tableExists).toBe(true);
        });

        test('should handle very long column definitions', async () => {
            const longConstraint = 'TEXT CHECK (LENGTH(name) > 0 AND LENGTH(name) < 1000 AND name LIKE "%test%" AND name NOT LIKE "%invalid%")';
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: longConstraint
            };

            await createTable({
                db,
                table: 'long_constraints',
                columns,
                logQuery: false
            });

            const tableExists = await new Promise((resolve, reject) => {
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='long_constraints'", (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            expect(tableExists).toBe(true);
        });

        test('should handle table with many columns', async () => {
            const columns = {};
            for (let i = 1; i <= 50; i++) {
                // @ts-ignore
                columns[`column_${i}`] = 'TEXT';
            }
            columns.id = 'INTEGER PRIMARY KEY AUTOINCREMENT';

            await createTable({
                db,
                table: 'many_columns',
                columns,
                logQuery: false
            });

            const tableInfo = await new Promise((resolve, reject) => {
                db.all("PRAGMA table_info(many_columns)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(tableInfo).toHaveLength(51); // 50 columns + id
        });
    });

    describe('Performance and Accuracy', () => {
        test('should handle concurrent table creation', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(createTable({
                    db,
                    table: `concurrent_table_${i}`,
                    columns,
                    logQuery: false
                }));
            }

            await Promise.all(promises);

            // Verificar que todas las tablas fueron creadas
            const tables = await new Promise((resolve, reject) => {
                db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            // @ts-ignore
            const tableNames = tables.map((t) => t.name).filter((name) => name !== 'sqlite_sequence');
            for (let i = 0; i < 5; i++) {
                expect(tableNames).toContain(`concurrent_table_${i}`);
            }
        });

        test('should return void promise', async () => {
            const columns = {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL'
            };

            const result = await createTable({
                db,
                table: 'void_test',
                columns,
                logQuery: false
            });

            expect(result).toBeUndefined();
        });
    });
});
