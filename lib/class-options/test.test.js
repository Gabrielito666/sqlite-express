const Options = require('./index');

describe('Options class', () =>
{
    const mockContext = {};
    const route = '/test/route';

    describe('Constructor', () =>
    {
        test('should initialize with context and route', () =>
        {
            const options = new Options(mockContext, route);
            expect(options._context).toBe(mockContext);
            expect(options.rootPath).toBe(route);
        });

        test('should set default values', () =>
        {
            const options = new Options(mockContext, route);
            expect(options.select).toBe('*');
            expect(options.connector).toBe('AND');
            expect(options.expected).toBe('rows');
            expect(options.parameters).toEqual({});
            expect(options.type).toBe('any');
            expect(options.logQuery).toBe(false);
            expect(options.query).toBe("");
        });
    });

    describe('set() method', () =>
    {
        test('should set multiple properties at once', () =>
        {
            const options = new Options(mockContext, route);
            options.set({
                table: 'users',
                select: ['id', 'name'],
                where: { active: 1 },
                logQuery: true,
                expected: 'rows',
                type: 'select'
            });
            expect(options.table).toBe('users');
            expect(options.select).toEqual(['id', 'name']);
            expect(options.where).toEqual({ active: 1 });
            expect(options.logQuery).toBe(true);
            expect(options.expected).toBe('rows');
            expect(options.type).toBe('select');
        });

        test('should only set provided properties', () =>
        {
            const options = new Options(mockContext, route);
            options.set({ table: 'posts', logQuery: false });
            expect(options.table).toBe('posts');
            expect(options.logQuery).toBe(false);
            expect(options.select).toBe('*'); // default
            expect(options.connector).toBe('AND'); // default
        });

        test('should handle empty options object', () =>
        {
            const options = new Options(mockContext, route);
            options.set({});
            expect(options.table).toBeUndefined();
            expect(options.select).toBe('*');
        });
    });

    describe('combination() method', () =>
    {
        test('should combine multiple Options objects, first overwrites last', () =>
        {
            const options1 = new Options(mockContext, route);
            options1.set({ table: 'users', select: ['id'], logQuery: false });
            const options2 = new Options(mockContext, route);
            options2.set({ table: 'posts', select: ['id', 'title'], logQuery: true });
            const combined = options1.combination(options1, options2);
            expect(combined.table).toBe('users');
            expect(combined.select).toEqual(['id']);
            expect(combined.logQuery).toBe(false);
        });

        test('should combine Options and plain objects', () =>
        {
            const options1 = new Options(mockContext, route);
            options1.set({ table: 'users', select: ['id'] });
            const combined = options1.combination(
                { table: 'posts', select: ['id', 'title'], logQuery: true },
                { table: 'comments', logQuery: false },
                { select: ['id'] }
            );
            expect(combined.table).toBe('posts');
            expect(combined.select).toEqual(['id', 'title']);
            expect(combined.logQuery).toBe(true);
        });

        test('should ignore undefined or null options', () =>
        {
            const options = new Options(mockContext, route);
            options.set({ table: 'users', select: ['id'] });
            const combined = options.combination({ table: 'posts' });
            expect(combined.table).toBe('posts');
            expect(combined.select).toBe('*');
        });
    });

    describe('Edge cases', () =>
    {
        test('should allow setting and getting all properties', () =>
        {
            const sqlite3 = require('sqlite3').verbose();
            const realDb = new sqlite3.Database(':memory:');
            let fakeDb = {};
            const waitingList = {
                list: [],
                isRunning: false,
                addOperation: async () => {},
                run: () => {}
            };
            fakeDb.sqliteDb = realDb;
            fakeDb.waitingList = waitingList;
            fakeDb.defaultOptions = {};
            // @ts-ignore
            waitingList.database = fakeDb;
            const options = new Options(mockContext, route);
            options.set({
                route: '/other',
                // @ts-ignore
                db: fakeDb,
                table: 't',
                where: { id: 1 },
                columns: { id: 'INTEGER' },
                select: 'id',
                connector: 'OR',
                update: { name: 'Jane' },
                row: { name: 'John' },
                logQuery: true,
                query: 'SELECT 1',
                expected: 'row',
                parameters: { id: 1 },
                type: 'update'
            });
            expect(options.route).toBe('/other');
            expect(options.db).toEqual(fakeDb);
            expect(options.table).toBe('t');
            expect(options.where).toEqual({ id: 1 });
            expect(options.columns).toEqual({ id: 'INTEGER' });
            expect(options.select).toBe('id');
            expect(options.connector).toBe('OR');
            expect(options.update).toEqual({ name: 'Jane' });
            expect(options.row).toEqual({ name: 'John' });
            expect(options.logQuery).toBe(true);
            expect(options.query).toBe('SELECT 1');
            expect(options.expected).toBe('row');
            expect(options.parameters).toEqual({ id: 1 });
            expect(options.type).toBe('update');
        });
    });
}); 