const DefaultOptionsClass = require('./index');

describe('DefaultOptionsClass', () => {
    const defaultOptions = new DefaultOptionsClass('/test/route');

    describe('Constructor', () => {
        test('should initialize with route parameter', () => {
            expect(defaultOptions.rootPath).toBe('/test/route');
        });

        test('should set default values', () => {
            expect(defaultOptions.select).toBe('*');
            expect(defaultOptions.connector).toBe('AND');
            expect(defaultOptions.expected).toBe('rows');
            expect(defaultOptions.parameters).toEqual({});
            expect(defaultOptions.type).toBe('any');
        });
    });

    describe('Setters and Getters', () => {
        test('should set and get route', () => {
            defaultOptions.route = '/new/route';
            expect(defaultOptions.route).toBe('/new/route');
        });

        test('should set and get db and key', () => {
            defaultOptions.db = 'testdb';
            expect(defaultOptions.db).toBe('testdb');
            expect(defaultOptions.key).toBe('testdb');
        });

        test('should set and get key and db', () => {
            defaultOptions.key = 'newkey';
            expect(defaultOptions.key).toBe('newkey');
            expect(defaultOptions.db).toBe('newkey');
        });

        test('should set and get table', () => {
            defaultOptions.table = 'users';
            expect(defaultOptions.table).toBe('users');
        });

        test('should set and get where', () => {
            const where = { id: 1, name: 'John' };
            defaultOptions.where = where;
            expect(defaultOptions.where).toEqual(where);
        });

        test('should set and get columns', () => {
            const columns = { id: 'INTEGER', name: 'TEXT' };
            //@ts-ignore
            defaultOptions.columns = columns;
            expect(defaultOptions.columns).toEqual(columns);
        });

        test('should set and get select as string', () => {
            defaultOptions.select = 'id, name';
            expect(defaultOptions.select).toBe('id, name');
        });

        test('should set and get select as array', () => {
            defaultOptions.select = ['id', 'name'];
            expect(defaultOptions.select).toEqual(['id', 'name']);
        });

        test('should set and get connector', () => {
            defaultOptions.connector = 'OR';
            expect(defaultOptions.connector).toBe('OR');
        });

        test('should set and get update', () => {
            const update = { update: { name: 'Jane', age: 25 } };
            defaultOptions.update = update;
            expect(defaultOptions.update).toEqual(update);
        });

        test('should set and get row', () => {
            const row = { name: 'John', age: 30, active: true };
            defaultOptions.row = row;
            expect(defaultOptions.row).toEqual(row);
        });

        test('should set and get logQuery', () => {
            defaultOptions.logQuery = true;
            expect(defaultOptions.logQuery).toBe(true);
        });

        test('should set and get query', () => {
            const query = 'SELECT * FROM users WHERE id = 1';
            defaultOptions.query = query;
            expect(defaultOptions.query).toBe(query);
        });

        test('should set and get expected', () => {
            defaultOptions.expected = 'row';
            expect(defaultOptions.expected).toBe('row');
        });

        test('should set and get parameters', () => {
            const parameters = { id: 1, name: 'John' };
            defaultOptions.parameters = parameters;
            expect(defaultOptions.parameters).toEqual(parameters);
        });

        test('should set and get type', () => {
            defaultOptions.type = 'select';
            expect(defaultOptions.type).toBe('select');
        });
    });

    describe('set() method', () => {
        test('should set multiple properties at once', () => {
            const options = {
                table: 'users',
                select: ['id', 'name'],
                where: { active: 1 },
                logQuery: true,
                expected: /**@type {"rows"}*/ ('rows'),
                type: /**@type {"select"}*/ ('select')
            };

            defaultOptions.set(options);

            expect(defaultOptions.table).toBe('users');
            expect(defaultOptions.select).toEqual(['id', 'name']);
            expect(defaultOptions.where).toEqual({ active: 1 });
            expect(defaultOptions.logQuery).toBe(true);
            expect(defaultOptions.expected).toBe('rows');
            expect(defaultOptions.type).toBe('select');
        });

        test('should only set provided properties', () => {
            const originalSelect = defaultOptions.select;
            const originalConnector = defaultOptions.connector;

            defaultOptions.set({
                table: 'posts',
                logQuery: false
            });

            expect(defaultOptions.table).toBe('posts');
            expect(defaultOptions.logQuery).toBe(false);
            expect(defaultOptions.select).toBe(originalSelect);
            expect(defaultOptions.connector).toBe(originalConnector);
        });

        test('should handle empty options object', () => {
            const originalTable = defaultOptions.table;
            const originalSelect = defaultOptions.select;

            defaultOptions.set({});

            expect(defaultOptions.table).toBe(originalTable);
            expect(defaultOptions.select).toBe(originalSelect);
        });

        test('should handle undefined options', () => {
            const originalTable = defaultOptions.table;
            const originalSelect = defaultOptions.select;

            defaultOptions.set({});

            expect(defaultOptions.table).toBe(originalTable);
            expect(defaultOptions.select).toBe(originalSelect);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty where', () => {
            defaultOptions.where = {};
            expect(defaultOptions.where).toEqual({});
        });

        test('should handle complex objects', () => {
            const complexWhere = {
                id: { value: 1, operator: '>' },
                name: { value: 'John', operator: 'LIKE' }
            };
            //@ts-ignore
            defaultOptions.where = complexWhere;
            expect(defaultOptions.where).toEqual(complexWhere);
        });

        test('should handle empty objects', () => {
            defaultOptions.parameters = {};
            expect(defaultOptions.parameters).toEqual({});
        });

        test('should handle boolean values', () => {
            defaultOptions.logQuery = false;
            expect(defaultOptions.logQuery).toBe(false);
        });
    });
}); 