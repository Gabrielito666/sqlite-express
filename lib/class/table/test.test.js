const Table = require('./index');
const DB = require('../db');
const SqliteExpress = require('../sqlite-express');
const Options = require('../class-options');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

describe('Table class', () => {
    /** @type {import('sqlite3').Database} */
    let db;
    /** @type {string} */
    let dbPath;
    /** @type {any} */
    let sqliteExpress;
    /** @type {any} */
    let dbInstance;
    /** @type {any} */
    let table;

    beforeEach(async () => {
        dbPath = path.join(__dirname, 'test-table.db');
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

        // Create SqliteExpress instance
        sqliteExpress = new SqliteExpress(__dirname);
        
        // Create database
        dbInstance = sqliteExpress.createDB({
            route: 'test-table.db',
            logQuery: false
        });

        // Create test table
        await dbInstance.createTable({
            table: 'users',
            columns: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL',
                age: 'INTEGER',
                email: 'TEXT UNIQUE',
                created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            }
        });

        // Create table instance
        table = new Table('users', dbInstance);
    });

    afterEach(async () => {
        if (dbInstance && dbInstance.sqliteDb) {
            await new Promise((resolve) => {
                // @ts-ignore
                dbInstance.sqliteDb.close((err) => {
                    if (err) console.error('Error closing database:', err);
                    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
                    // @ts-ignore
                    resolve();
                });
            });
        }
    });

    describe('Constructor', () => {
        test('should initialize with correct table name and db instance', () => {
            expect(table.options.table).toBe('users');
            expect(table.options.db).toBe(dbInstance);
        });

        test('should inherit default options from db', () => {
            expect(table.options.route).toBe('test-table.db');
            expect(table.options.logQuery).toBe(false);
        });

        test('should throw error if db is not provided', () => {
            expect(() => {
                // @ts-ignore
                new Table('users', null);
            }).toThrow('DB is not set');
        });
    });

    describe('Select operations', () => {
        beforeEach(async () => {
            // Insert test data
            await table.insert({ row: { name: 'John Doe', age: 30, email: 'john@example.com' } });
            await table.insert({ row: { name: 'Jane Doe', age: 25, email: 'jane@example.com' } });
            await table.insert({ row: { name: 'Bob Smith', age: 35, email: 'bob@example.com' } });
        });

        test('should select all rows', async () => {
            const result = await table.select({
                select: '*',
                expected: 'rows'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('age');
            expect(result[0]).toHaveProperty('email');
        });

        test('should select specific columns', async () => {
            const result = await table.select({
                select: ['name', 'age'],
                expected: 'rows'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('age');
            expect(result[0]).not.toHaveProperty('email');
        });

        test('should select with where condition', async () => {
            const result = await table.select({
                select: '*',
                where: { name: 'John Doe' },
                expected: 'row'
            });

            expect(result).toBeDefined();
            expect(result.name).toBe('John Doe');
            expect(result.age).toBe(30);
        });

        test('should select with multiple where conditions', async () => {
            const result = await table.select({
                select: '*',
                where: { 
                    age: { value: 30, operator: '=' },
                    name: { value: 'John Doe', operator: '=' }
                },
                connector: 'AND',
                expected: 'row'
            });

            expect(result).toBeDefined();
            expect(result.name).toBe('John Doe');
            expect(result.age).toBe(30);
        });

        test('should select single cell', async () => {
            const result = await table.select({
                select: 'name',
                where: { age: 30 },
                expected: 'celd'
            });

            expect(typeof result).toBe('string');
            expect(result).toBe('John Doe');
        });

        test('should select column', async () => {
            const result = await table.select({
                select: 'name',
                expected: 'column'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);
            expect(result).toContain('John Doe');
            expect(result).toContain('Jane Doe');
            expect(result).toContain('Bob Smith');
        });

        test('should handle empty result', async () => {
            const result = await table.select({
                select: '*',
                where: { name: 'Non Existent' },
                expected: 'row'
            });

            expect(result).toBeNull();
        });

        test('should handle complex where conditions', async () => {
            const result = await table.select({
                select: '*',
                where: {
                    OR: [
                        { age: { value: 30, operator: '=' } },
                        { age: { value: 25, operator: '=' } }
                    ]
                },
                expected: 'rows'
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
    });

    describe('Insert operations', () => {
        test('should insert single row', async () => {
            const result = await table.insert({
                row: { name: 'John Doe', age: 30, email: 'john@example.com' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verify insertion
            const inserted = await table.select({
                select: '*',
                where: { id: result },
                expected: 'row'
            });

            expect(inserted.name).toBe('John Doe');
            expect(inserted.age).toBe(30);
            expect(inserted.email).toBe('john@example.com');
        });

        test('should insert with default values', async () => {
            const result = await table.insert({
                row: { name: 'John Doe' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verify default values
            const inserted = await table.select({
                select: '*',
                where: { id: result },
                expected: 'row'
            });

            expect(inserted.name).toBe('John Doe');
            expect(inserted.age).toBeNull();
            expect(inserted.email).toBeNull();
            expect(inserted.created_at).toBeDefined();
        });

        test('should handle unique constraint violation', async () => {
            // Insert first row
            await table.insert({
                row: { name: 'John Doe', email: 'john@example.com' }
            });

            // Try to insert duplicate email
            try {
                await table.insert({
                    row: { name: 'Jane Doe', email: 'john@example.com' }
                });
                fail('Should have thrown an error');
            } catch (error) {
                // @ts-ignore
                expect(error).toBeTruthy();
                // @ts-ignore
                expect(error.message).toMatch(/UNIQUE constraint failed|SQLITE_CONSTRAINT/);
            }
        });

        test('should handle null values', async () => {
            const result = await table.insert({
                row: { name: 'John Doe', age: null, email: null }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        test('should handle different data types', async () => {
            const result = await table.insert({
                row: { 
                    name: 'John Doe',
                    age: 30,
                    email: 'john@example.com'
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('Update operations', () => {
        beforeEach(async () => {
            await table.insert({ row: { name: 'John Doe', age: 30, email: 'john@example.com' } });
            await table.insert({ row: { name: 'Jane Doe', age: 25, email: 'jane@example.com' } });
        });

        test('should update single row', async () => {
            const result = await table.update({
                update: { age: 31 },
                where: { name: 'John Doe' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(1);

            // Verify update
            const updated = await table.select({
                select: '*',
                where: { name: 'John Doe' },
                expected: 'row'
            });

            expect(updated.age).toBe(31);
        });

        test('should update multiple rows', async () => {
            const result = await table.update({
                update: { age: 40 },
                where: { age: { value: 25, operator: '>=' } }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);

            // Verify updates
            const updated = await table.select({
                select: '*',
                where: { age: 40 },
                expected: 'rows'
            });

            expect(updated.length).toBe(2);
        });

        test('should update with complex where condition', async () => {
            const result = await table.update({
                update: { age: 35 },
                where: {
                    OR: [
                        { name: 'John Doe' },
                        { name: 'Jane Doe' }
                    ]
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);
        });

        test('should handle update with no matching rows', async () => {
            const result = await table.update({
                update: { age: 50 },
                where: { name: 'Non Existent' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(0);
        });

        test('should handle unique constraint violation in update', async () => {
            // Insert another row with different email
            await table.insert({ row: { name: 'Bob Smith', email: 'bob@example.com' } });

            // Try to update email to existing one
            try {
                await table.update({
                    update: { email: 'john@example.com' },
                    where: { name: 'Bob Smith' }
                });
                fail('Should have thrown an error');
            } catch (error) {
                // @ts-ignore
                expect(error).toBeTruthy();
                // @ts-ignore
                expect(error.message).toMatch(/UNIQUE constraint failed|SQLITE_CONSTRAINT/);
            }
        });
    });

    describe('Delete operations', () => {
        beforeEach(async () => {
            await table.insert({ row: { name: 'John Doe', age: 30, email: 'john@example.com' } });
            await table.insert({ row: { name: 'Jane Doe', age: 25, email: 'jane@example.com' } });
            await table.insert({ row: { name: 'Bob Smith', age: 35, email: 'bob@example.com' } });
        });

        test('should delete single row', async () => {
            const result = await table.delete({
                where: { name: 'John Doe' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(1);

            // Verify deletion
            const remaining = await table.select({
                select: '*',
                expected: 'rows'
            });

            expect(remaining.length).toBe(2);
        });

        test('should delete multiple rows', async () => {
            const result = await table.delete({
                where: { age: { value: 30, operator: '>=' } }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);

            // Verify deletion
            const remaining = await table.select({
                select: '*',
                expected: 'rows'
            });

            expect(remaining.length).toBe(1);
        });

        test('should delete with complex where condition', async () => {
            const result = await table.delete({
                where: {
                    OR: [
                        { name: 'John Doe' },
                        { name: 'Jane Doe' }
                    ]
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);
        });

        test('should handle delete with no matching rows', async () => {
            const result = await table.delete({
                where: { name: 'Non Existent' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(0);
        });

        test('should delete all rows', async () => {
            const result = await table.delete({});

            expect(typeof result).toBe('number');
            expect(result).toBe(3);

            // Verify all deleted
            const remaining = await table.select({
                select: '*',
                expected: 'rows'
            });

            expect(remaining.length).toBe(0);
        });
    });

    describe('Exist operations', () => {
        beforeEach(async () => {
            await table.insert({ row: { name: 'John Doe', age: 30, email: 'john@example.com' } });
        });

        test('should return true for existing row', async () => {
            const result = await table.exist({
                where: { name: 'John Doe' }
            });

            expect(typeof result).toBe('boolean');
            expect(result).toBe(true);
        });

        test('should return false for non-existing row', async () => {
            const result = await table.exist({
                where: { name: 'Non Existent' }
            });

            expect(typeof result).toBe('boolean');
            expect(result).toBe(false);
        });

        test('should handle complex where conditions', async () => {
            const result = await table.exist({
                where: { 
                    name: 'John Doe',
                    age: 30
                },
                connector: 'AND'
            });

            expect(typeof result).toBe('boolean');
            expect(result).toBe(true);
        });

        test('should return false for empty table', async () => {
            // Delete all rows
            await table.delete({});

            const result = await table.exist({
                where: { name: 'John Doe' }
            });

            expect(typeof result).toBe('boolean');
            expect(result).toBe(false);
        });
    });

    describe('Count operations', () => {
        beforeEach(async () => {
            await table.insert({ row: { name: 'John Doe', age: 30, email: 'john@example.com' } });
            await table.insert({ row: { name: 'Jane Doe', age: 25, email: 'jane@example.com' } });
            await table.insert({ row: { name: 'Bob Smith', age: 35, email: 'bob@example.com' } });
        });

        test('should count all rows', async () => {
            const result = await table.count({});

            expect(typeof result).toBe('number');
            expect(result).toBe(3);
        });

        test('should count with where condition', async () => {
            const result = await table.count({
                where: { age: { value: 30, operator: '>=' } }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);
        });

        test('should count with complex where condition', async () => {
            const result = await table.count({
                where: {
                    OR: [
                        { name: 'John Doe' },
                        { name: 'Jane Doe' }
                    ]
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(2);
        });

        test('should return zero for no matching rows', async () => {
            const result = await table.count({
                where: { name: 'Non Existent' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBe(0);
        });

        test('should return zero for empty table', async () => {
            // Delete all rows
            await table.delete({});

            const result = await table.count({});

            expect(typeof result).toBe('number');
            expect(result).toBe(0);
        });
    });

    describe('Error handling', () => {
        test('should throw error if db is not set', () => {
            expect(() => {
                // @ts-ignore
                new Table('users', null);
            }).toThrow('DB is not set');
        });

        test('should handle non-existent table', async () => {
            const nonExistentTable = new Table('non_existent_table', dbInstance);
            
            try {
                await nonExistentTable.select({ select: '*' });
            } catch (e) {
                // @ts-ignore
                expect(e).toBeTruthy();
                // @ts-ignore
                expect(e.message).toMatch(/no such table|SQLITE_ERROR/);
            }
        });

        test('should handle invalid SQL syntax', async () => {
            try {
                await table.select({ 
                    select: 'invalid_column',
                    where: { invalid_column: 'value' }
                });
            } catch (e) {
                // @ts-ignore
                expect(e).toBeTruthy();
                // @ts-ignore
                expect(e.message).toMatch(/no such column|SQLITE_ERROR/);
            }
        });

        test('should handle missing required parameters', async () => {
            try {
                await table.insert({ row: {} });
            } catch (e) {
                // @ts-ignore
                expect(e).toBeTruthy();
                // @ts-ignore
                expect(e.message).toMatch(/NOT NULL constraint failed|SQLITE_CONSTRAINT|Insert Error: row must have at least one property/);
            }
        });

        test('should handle invalid data types', async () => {
            try {
                await table.insert({ 
                    row: { 
                        name: 'John Doe',
                        age: 'invalid_age' // Should be number
                    }
                });
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }
        });
    });

    describe('Integration and edge cases', () => {
        test('should handle large number of operations', async () => {
            // Insert many rows
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(
                    table.insert({
                        row: { 
                            name: `User ${i}`,
                            age: 20 + i,
                            email: `user${i}@example.com`
                        }
                    })
                );
            }
            await Promise.all(promises);

            // Verify count
            const count = await table.count({});
            expect(count).toBe(10);

            // Update all
            const updateResult = await table.update({
                update: { age: 50 },
                where: { age: { value: 25, operator: '>=' } }
            });
            expect(updateResult).toBeGreaterThan(0);

            // Delete all
            const deleteResult = await table.delete({});
            expect(deleteResult).toBe(10);
        });

        test('should handle special characters in data', async () => {
            const result = await table.insert({
                row: { 
                    name: "John O'Connor",
                    age: 30,
                    email: 'john.o\'connor@example.com'
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verify retrieval
            const retrieved = await table.select({
                select: '*',
                where: { id: result },
                expected: 'row'
            });

            expect(retrieved.name).toBe("John O'Connor");
            expect(retrieved.email).toBe('john.o\'connor@example.com');
        });

        test('should handle null and undefined values', async () => {
            const result = await table.insert({
                row: { 
                    name: 'John Doe',
                    age: null,
                    email: null
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verify retrieval
            const retrieved = await table.select({
                select: '*',
                where: { id: result },
                expected: 'row'
            });

            expect(retrieved.name).toBe('John Doe');
            expect(retrieved.age).toBeNull();
            expect(retrieved.email).toBeNull();
        });

        test('should handle empty strings', async () => {
            const result = await table.insert({
                row: { 
                    name: '',
                    age: 30,
                    email: ''
                }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Verify retrieval
            const retrieved = await table.select({
                select: '*',
                where: { id: result },
                expected: 'row'
            });

            expect(retrieved.name).toBe('');
            expect(retrieved.email).toBe('');
        });

        test('should handle concurrent operations', async () => {
            // Start multiple operations concurrently
            const promises = [
                table.insert({ row: { name: 'User 1', email: 'user1@example.com' } }),
                table.insert({ row: { name: 'User 2', email: 'user2@example.com' } }),
                table.insert({ row: { name: 'User 3', email: 'user3@example.com' } })
            ];

            const results = await Promise.all(promises);
            expect(results.length).toBe(3);
            expect(results.every(r => typeof r === 'number' && r > 0)).toBe(true);

            // Verify all were inserted
            const count = await table.count({});
            expect(count).toBe(3);
        });

        test('should handle table with no columns except primary key', async () => {
            // Create a minimal table with at least one column
            await dbInstance.createTable({
                table: 'minimal_table',
                columns: {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    dummy: 'TEXT DEFAULT ""'
                }
            });

            const minimalTable = new Table('minimal_table', dbInstance);
            try {
                await minimalTable.insert({ row: {} });
                fail('Should have thrown an error');
            } catch (e) {
                // @ts-ignore
                expect(e).toBeTruthy();
                // @ts-ignore
                expect(e.message).toMatch(/Insert Error: row must have at least one property/);
            }
        });
    });

    describe('Options inheritance', () => {
        test('should inherit logQuery option from db', async () => {
            // Create db with logQuery enabled
            const logDbInstance = sqliteExpress.createDB({
                route: 'test-log.db',
                logQuery: true
            });

            await logDbInstance.createTable({
                table: 'log_users',
                columns: {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    name: 'TEXT'
                }
            });

            const logTable = new Table('log_users', logDbInstance);
            
            // The operation should work with inherited logQuery setting
            const result = await logTable.insert({
                row: { name: 'John Doe' }
            });

            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);

            // Clean up
            await new Promise((resolve) => {
                // @ts-ignore
                logDbInstance.sqliteDb.close((err) => {
                    if (err) console.error('Error closing log database:', err);
                    const logDbPath = path.join(__dirname, 'test-log.db');
                    if (fs.existsSync(logDbPath)) fs.unlinkSync(logDbPath);
                    // @ts-ignore
                    resolve();
                });
            });
        });

        test('should override inherited options with local options', async () => {
            const result = await table.select({
                select: '*',
                logQuery: false // Override inherited setting
            });

            expect(Array.isArray(result)).toBe(true);
        });
    });
}); 