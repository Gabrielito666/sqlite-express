const {
    parametersEvalCreateDb,
    parametersEvalSelect,
    parametersEvalInsert,
    parametersEvalUpdate,
    parametersEvalDelete,
    parametersEvalExist,
    parametersEvalCount,
    parametersEvalExecuteSQL,
    parametersEvalCreateTable
} = require('./index');
const Options = require('../class-options');

/**@typedef {import("../class-db/types").DBType} DBType*/

describe('tool-parameters-eval', () =>
{
    const sqlite3 = require('sqlite3').verbose();
    const realDb = new sqlite3.Database(':memory:');
    let mockDb = {};
    const waitingList = {
        list: [],
        isRunning: false,
        addOperation: async () => {},
        run: () => {}
    };
    mockDb.sqliteDb = realDb;
    mockDb.waitingList = waitingList;
    mockDb.defaultOptions = {};
    mockDb.createTable = jest.fn();
    mockDb.select = jest.fn();
    mockDb.insert = jest.fn();
    mockDb.update = jest.fn();
    mockDb.delete = jest.fn();
    mockDb.exist = jest.fn();
    mockDb.count = jest.fn();
    mockDb.executeSQL = jest.fn();
    // @ts-ignore
    waitingList.database = mockDb;

    const mockContext = {};

    describe('parametersEvalCreateDb', () =>
    {
        test('should extract route and logQuery from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                route: '/test/db',
                logQuery: true
            });

            const result = parametersEvalCreateDb(options);

            expect(result.route).toBe('/test/db');
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when route is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                logQuery: true
            });

            expect(() => parametersEvalCreateDb(options)).toThrow('The route is not defined');
        });

        test('should handle undefined logQuery', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                route: '/test/db'
            });

            const result = parametersEvalCreateDb(options);

            expect(result.route).toBe('/test/db');
            expect(result.logQuery).toBe(false);
        });
    });

    describe('parametersEvalSelect', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                select: ['id', 'name'],
                where: { active: 1 },
                connector: 'AND',
                logQuery: true,
                expected: 'rows'
            });

            const result = parametersEvalSelect(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.select).toEqual(['id', 'name']);
            expect(result.where).toEqual({ active: 1 });
            expect(result.connector).toBe('AND');
            expect(result.logQuery).toBe(true);
            expect(result.expected).toBe('rows');
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users',
                select: ['id'],
                expected: 'rows'
            });

            expect(() => parametersEvalSelect(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                select: ['id'],
                expected: 'rows'
            });

            expect(() => parametersEvalSelect(options)).toThrow('The table is not defined');
        });

        test('should throw error when select is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                expected: 'rows'
            });
            options.set({ select: undefined });
            expect(() => parametersEvalSelect(options)).toThrow('The select is not defined');
        });

        test('should throw error when expected is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                select: ['id']
            });
            options.set({ expected: undefined });
            expect(() => parametersEvalSelect(options)).toThrow('The expected is not defined');
        });
    });

    describe('parametersEvalInsert', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                row: { name: 'John', age: 30 },
                logQuery: true
            });

            const result = parametersEvalInsert(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.row).toEqual({ name: 'John', age: 30 });
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users',
                row: { name: 'John' }
            });

            expect(() => parametersEvalInsert(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                row: { name: 'John' }
            });

            expect(() => parametersEvalInsert(options)).toThrow('The table is not defined');
        });

        test('should throw error when row is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            // @ts-ignore
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users'
            });

            expect(() => parametersEvalInsert(options)).toThrow('The row is not defined');
        });
    });

    describe('parametersEvalUpdate', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                update: { age: 31 },
                where: { id: 1 },
                connector: 'AND',
                logQuery: true
            });

            const result = parametersEvalUpdate(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.update).toEqual({ age: 31 });
            expect(result.where).toEqual({ id: 1 });
            expect(result.connector).toBe('AND');
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users',
                update: { age: 31 }
            });

            expect(() => parametersEvalUpdate(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');

            options.set({
                // @ts-ignore
                db: mockDb,
                update: { age: 31 }
            });

            expect(() => parametersEvalUpdate(options)).toThrow('The table is not defined');
        });

        test('should throw error when update is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
                
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users'
            });

            expect(() => parametersEvalUpdate(options)).toThrow('The update is not defined');
        });
    });

    describe('parametersEvalDelete', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                where: { id: 1 },
                connector: 'AND',
                logQuery: true
            });

            const result = parametersEvalDelete(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.where).toEqual({ id: 1 });
            expect(result.connector).toBe('AND');
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users'
            });

            expect(() => parametersEvalDelete(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb
            });

            expect(() => parametersEvalDelete(options)).toThrow('The table is not defined');
        });
    });

    describe('parametersEvalExist', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                where: { id: 1 },
                connector: 'AND',
                logQuery: true
            });

            const result = parametersEvalExist(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.where).toEqual({ id: 1 });
            expect(result.connector).toBe('AND');
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users'
            });

            expect(() => parametersEvalExist(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb
            });

            expect(() => parametersEvalExist(options)).toThrow('The table is not defined');
        });
    });

    describe('parametersEvalCount', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                where: { active: 1 },
                connector: 'AND',
                logQuery: true
            });

            const result = parametersEvalCount(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.where).toEqual({ active: 1 });
            expect(result.connector).toBe('AND');
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users'
            });

            expect(() => parametersEvalCount(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb
            });

            expect(() => parametersEvalCount(options)).toThrow('The table is not defined');
        });
    });

    describe('parametersEvalExecuteSQL', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                query: 'SELECT * FROM users',
                parameters: { id: 1 },
                logQuery: true,
                expected: 'rows',
                type: 'select'
            });

            const result = parametersEvalExecuteSQL(options);

            expect(result.db).toBe(mockDb);
            expect(result.query).toBe('SELECT * FROM users');
            expect(result.parameters).toEqual({ id: 1 });
            expect(result.logQuery).toBe(true);
            expect(result.expected).toBe('rows');
            expect(result.type).toBe('select');
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                query: 'SELECT * FROM users'
            });

            expect(() => parametersEvalExecuteSQL(options)).toThrow('The database is not defined');
        });

        test('should throw error when query is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb
            });

            expect(() => parametersEvalExecuteSQL(options)).toThrow('The query is not defined');
        });
    });

    describe('parametersEvalCreateTable', () =>
    {
        test('should extract all required parameters from valid options', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users',
                columns: { id: 'INTEGER', name: 'TEXT' },
                logQuery: true
            });

            const result = parametersEvalCreateTable(options);

            expect(result.db).toBe(mockDb);
            expect(result.table).toBe('users');
            expect(result.columns).toEqual({ id: 'INTEGER', name: 'TEXT' });
            expect(result.logQuery).toBe(true);
        });

        test('should throw error when db is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            options.set({
                table: 'users',
                columns: { id: 'INTEGER' }
            });

            expect(() => parametersEvalCreateTable(options)).toThrow('The database is not defined');
        });

        test('should throw error when table is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                columns: { id: 'INTEGER' }
            });

            expect(() => parametersEvalCreateTable(options)).toThrow('The table is not defined');
        });

        test('should throw error when columns is not defined', () =>
        {
            const options = new Options(mockContext, '/test');
            
            options.set({
                // @ts-ignore
                db: mockDb,
                table: 'users'
            });

            expect(() => parametersEvalCreateTable(options)).toThrow('The columns is not defined');
        });
    });
}); 