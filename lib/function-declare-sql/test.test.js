const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const declareSQL = require('./index');
const Options = require('../class-options');

describe('declareSQL function', () => {
    const dbPath = path.join(__dirname, 'test-declare-sql.db');
    let db = new sqlite3.Database(dbPath);
    const dbType = /** @type {any} */ ({
        sqliteDb: db,
        waitingList: {
            list: [],
            isRunning: false,
            addOperation: async () => {},
            run: () => {}
        },
        defaultOptions: new Options([{ route: '/test' }])
    });

    beforeAll(async () => {
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER,
                    city TEXT,
                    active BOOLEAN DEFAULT 1
                )
            `, (err) => err ? reject(err) : resolve(true));
        });
    });

    afterAll(async () => {
        await new Promise((resolve) => {
            db.close((err) => {
                if (err) console.error('Error closing database:', err);
                if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
                resolve(true);
            });
        });
    });

    beforeEach(async () => {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM users', (err) => err ? reject(err) : resolve(true));
        });
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM sqlite_sequence WHERE name="users"', (err) => err ? reject(err) : resolve(true));
        });
        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users (name, age, city, active) VALUES 
                ('John Doe', 25, 'New York', 1),
                ('Jane Smith', 30, 'Los Angeles', 1),
                ('Bob Johnson', 35, 'Chicago', 0)
            `, (err) => err ? reject(err) : resolve(true));
        });
    });

    describe('SELECT queries', () => {
        test('should select all rows (expected: rows)', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT * FROM users',
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(Array.isArray(result)).toBe(true);
            // @ts-ignore - Test environment, we know the result structure
            expect(result.length).toBe(3);
        });
        test('should select single row (expected: row)', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT * FROM users WHERE id = @id',
                type: 'select',
                expected: 'row',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ '@id': 1 });
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            // @ts-ignore - Test environment, we know the result structure
            expect(result.name).toBe('John Doe');
        });
        test('should select single column (expected: column)', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT name FROM users',
                type: 'select',
                expected: 'column',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(Array.isArray(result)).toBe(true);
            expect(result).toContain('John Doe');
        });
        test('should select single value (expected: celd)', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT age FROM users WHERE name = @name',
                type: 'select',
                expected: 'celd',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ '@name': 'Jane Smith' });
            expect(typeof result === 'number').toBe(true);
            expect(result).toBe(30);
        });
    });

    describe('INSERT queries', () => {
        test('should insert a row and return lastID', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'INSERT INTO users (name, age, city, active) VALUES (@name, @age, @city, @active)',
                type: 'insert',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const params = { '@name': 'Alice', '@age': 28, '@city': 'Boston', '@active': 1 };
            const result = await fn(params);
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('UPDATE queries', () => {
        test('should update a row and return changes', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'UPDATE users SET city = @city WHERE name = @name',
                type: 'update',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const params = { '@city': 'San Francisco', '@name': 'John Doe' };
            const result = await fn(params);
            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });
    });

    describe('DELETE queries', () => {
        test('should delete a row and return changes', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'DELETE FROM users WHERE name = @name',
                type: 'delete',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const params = { '@name': 'Bob Johnson' };
            const result = await fn(params);
            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });
    });

    describe('CREATE queries', () => {
        test('should create a new table and return void', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'CREATE TABLE IF NOT EXISTS test_table (id INTEGER)',
                type: 'create',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(result).toBeUndefined();
        });
    });

    describe('Transaction queries', () => {
        test('should begin a transaction and return void', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'BEGIN TRANSACTION',
                type: 'create',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(result).toBeUndefined();
        });
        test('should commit a transaction and return void', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'COMMIT',
                type: 'create',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(result).toBeUndefined();
        });
        test('should rollback a transaction and return void', async () => {
            // Primero iniciar una transacción
            await new Promise((resolve, reject) => db.run('BEGIN TRANSACTION', (err) => err ? reject(err) : resolve(true)));
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'ROLLBACK',
                type: 'create',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({});
            expect(result).toBeUndefined();
        });
    });

    describe('Error handling', () => {
        test('should reject on SQL error during execution or prepare', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT FROM', // Consulta inválida
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            await expect(declareSQL(options)).rejects.toThrow();
        });
        
        test('should reject on malformed parameters during execution or prepare', async () => {
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT * FROM users WHERE', // Consulta inválida
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            await expect(declareSQL(options)).rejects.toThrow();
        });
    });

    describe('Logging', () => {
        test('should log query when logQuery is true', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: 'SELECT * FROM users',
                type: 'select',
                expected: 'rows',
                logQuery: true
            });
            const fn = await declareSQL(options);
            await fn({});
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Path-based SQL Queries', () => {
        const sqlFilesDir = path.join(__dirname, 'sql-files');
        
        beforeAll(() => {
            // Crear directorio para archivos SQL si no existe
            if (!fs.existsSync(sqlFilesDir)) {
                fs.mkdirSync(sqlFilesDir, { recursive: true });
            }
        });
        
        afterAll(() => {
            // Limpiar archivos SQL de test
            if (fs.existsSync(sqlFilesDir)) {
                fs.rmSync(sqlFilesDir, { recursive: true, force: true });
            }
        });
        
        beforeEach(() => {
            // Limpiar archivos antes de cada test
            if (fs.existsSync(sqlFilesDir)) {
                const files = fs.readdirSync(sqlFilesDir);
                files.forEach(file => {
                    fs.unlinkSync(path.join(sqlFilesDir, file));
                });
            }
        });

        test('should declare SELECT query from SQL file', async () => {
            const sqlContent = 'SELECT * FROM users WHERE age > @age AND active = @active';
            const sqlFilePath = path.join(sqlFilesDir, 'select-users.sql');
            
            fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: sqlFilePath,
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ '@age': 25, '@active': 1 });

            expect(Array.isArray(result)).toBe(true);
            expect(result).not.toBeNull();
            // @ts-ignore - Test environment, we know the result structure
            if (result && Array.isArray(result)) {
                expect(result.length).toBeGreaterThan(0);
                expect(result[0]).toHaveProperty('id');
                expect(result[0]).toHaveProperty('name');
            }
        });

        test('should declare INSERT query from SQL file', async () => {
            const sqlContent = 'INSERT INTO users (name, age, city, active) VALUES (@name, @age, @city, @active)';
            const sqlFilePath = path.join(sqlFilesDir, 'insert-user.sql');
            
            fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: sqlFilePath,
                type: 'insert',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ 
                '@name': 'File User', 
                '@age': 33, 
                '@city': 'Portland', 
                '@active': 1 
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
            
            // Verificar que el usuario se insertó correctamente
            const verifyOptions = new Options([{ route: '/test' }]);
            verifyOptions.set({
                db: dbType,
                query: 'SELECT * FROM users WHERE name = @name',
                type: 'select',
                expected: 'row',
                logQuery: false
            });
            const verifyFn = await declareSQL(verifyOptions);
            const verifyResult = await verifyFn({ '@name': 'File User' });
            
            expect(verifyResult).not.toBeNull();
            if (verifyResult && typeof verifyResult === 'object') {
                // @ts-ignore - Test environment, we know the result structure
                expect(verifyResult.name).toBe('File User');
                // @ts-ignore - Test environment, we know the result structure
                expect(verifyResult.age).toBe(33);
            }
        });

        test('should declare complex SQL from file with formatting', async () => {
            const sqlContent = `
                SELECT 
                    u.name,
                    u.age,
                    u.city,
                    CASE 
                        WHEN u.age < 30 THEN 'Young'
                        WHEN u.age < 40 THEN 'Middle-aged'
                        ELSE 'Senior'
                    END as age_group
                FROM users u
                WHERE u.active = @active
                ORDER BY u.age DESC
                LIMIT @limit
            `;
            const sqlFilePath = path.join(sqlFilesDir, 'complex-query.sql');
            
            fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: sqlFilePath,
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ '@active': 1, '@limit': 2 });

            expect(Array.isArray(result)).toBe(true);
            // @ts-ignore - Test environment, we know the result structure
            expect(result.length).toBeGreaterThan(0);
            // @ts-ignore - Test environment, we know the result structure
            expect(result.length).toBeLessThanOrEqual(2);
            // @ts-ignore - Test environment, we know the result structure
            expect(result[0]).toHaveProperty('age_group');
        });

        test('should declare UPDATE query from SQL file', async () => {
            const sqlContent = 'UPDATE users SET city = @city, age = @age WHERE name = @name';
            const sqlFilePath = path.join(sqlFilesDir, 'update-user.sql');
            
            fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: sqlFilePath,
                type: 'update',
                logQuery: false
            });
            const fn = await declareSQL(options);
            const result = await fn({ 
                '@city': 'Seattle', 
                '@age': 26, 
                '@name': 'John Doe' 
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(1);
            
            // Verificar que se actualizó correctamente
            const verifyOptions = new Options([{ route: '/test' }]);
            verifyOptions.set({
                db: dbType,
                query: 'SELECT city, age FROM users WHERE name = @name',
                type: 'select',
                expected: 'row',
                logQuery: false
            });
            const verifyFn = await declareSQL(verifyOptions);
            const verifyResult = await verifyFn({ '@name': 'John Doe' });
            
            // @ts-ignore - Test environment, we know the result structure
            expect(verifyResult.city).toBe('Seattle');
            // @ts-ignore - Test environment, we know the result structure
            expect(verifyResult.age).toBe(26);
        });

        test('should handle non-existent file path as SQL string', async () => {
            const nonExistentPath = path.join(sqlFilesDir, 'non-existent.sql');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: nonExistentPath,
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            
            // Debe fallar porque el path no existe y se trata como SQL string inválido
            await expect(declareSQL(options)).rejects.toThrow();
        });

        test('should handle empty SQL file', async () => {
            const sqlFilePath = path.join(sqlFilesDir, 'empty.sql');
            fs.writeFileSync(sqlFilePath, '', 'utf8');
            
            const options = new Options([{ route: '/test' }]);
            options.set({
                db: dbType,
                query: sqlFilePath,
                type: 'select',
                expected: 'rows',
                logQuery: false
            });
            
            // declareSQL devuelve una función incluso con archivo vacío
            const fn = await declareSQL(options);
            expect(typeof fn).toBe('function');
            
            // Pero la ejecución debe fallar
            await expect(fn({})).rejects.toThrow();
        });
    });
}); 