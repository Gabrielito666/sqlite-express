const consoleQuery = require('./index');

// Mock console.log to capture output
const originalConsoleLog = console.log;
/** @type {string[]} */
let consoleOutput = [];

beforeEach(() => {
    consoleOutput = [];
    console.log = jest.fn((...args) => {
        consoleOutput.push(args.join(' '));
    });
});

afterEach(() => {
    console.log = originalConsoleLog;
});

describe('consoleQuery', () => {
    describe('Parameter Replacement', () => {
        test('should replace @param1 with value from params object', () => {
            const query = 'SELECT * FROM users WHERE name = @param1';
            const params = { '@param1': 'John' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('name = John');
        });

        test('should replace multiple @param placeholders', () => {
            const query = 'SELECT * FROM users WHERE name = @param1 AND age = @param2';
            const params = { '@param1': 'John', '@param2': '25' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('name = John AND age = 25');
        });

        test('should handle @param with numbers greater than 9', () => {
            const query = 'SELECT * FROM users WHERE id = @param10 AND name = @param1';
            const params = { '@param10': '100', '@param1': 'John' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('id = 100 AND name = John');
        });

        test('should keep @param unchanged if not found in params', () => {
            const query = 'SELECT * FROM users WHERE name = @param1 AND age = @param2';
            const params = { '@param1': 'John' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('name = John AND age = @param2');
        });

        test('should handle empty params object', () => {
            const query = 'SELECT * FROM users WHERE name = @param1';
            const params = {};
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('name = @param1');
        });

        test('should handle undefined params', () => {
            const query = 'SELECT * FROM users WHERE name = @param1';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toContain('name = @param1');
        });

        test('should handle null values in params', () => {
            const query = 'SELECT * FROM users WHERE deleted_at IS @param1';
            const params = { '@param1': null };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('deleted_at IS null');
        });

        test('should handle boolean values in params', () => {
            const query = 'SELECT * FROM users WHERE active = @param1';
            const params = { '@param1': true };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('active = true');
        });
    });

    describe('SQL Keyword Coloring', () => {
        test('should color CREATE keyword', () => {
            const query = 'CREATE TABLE users (id INTEGER)';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toContain('\x1b[36mCREATE\x1b[0m');
        });

        test('should color SELECT keyword', () => {
            const query = 'SELECT * FROM users';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toContain('\x1b[34mSELECT\x1b[0m');
        });

        test('should color DELETE keyword', () => {
            const query = 'DELETE FROM users WHERE id = @param1';
            const params = { '@param1': '1' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('\x1b[31mDELETE\x1b[0m');
        });

        test('should color UPDATE keyword', () => {
            const query = 'UPDATE users SET name = @param1 WHERE id = @param2';
            const params = { '@param1': 'John', '@param2': '1' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('\x1b[94mUPDATE\x1b[0m');
        });

        test('should format WHERE clause with newlines and indentation', () => {
            const query = 'SELECT * FROM users WHERE name = @param1';
            const params = { '@param1': 'John' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('\x1b[90m\nWHERE\n\t\x1b[0m');
        });

        test('should format CASE statement', () => {
            const query = 'SELECT CASE WHEN age > @param1 THEN "adult" ELSE "minor" END FROM users';
            const params = { '@param1': '18' };
            
            consoleQuery(query, params);
            // Solo verifica el color de CASE
            expect(consoleOutput[0]).toContain('\x1b[32m'); // CASE
        });
    });

    describe('Complex Queries', () => {
        test('should handle complex query with multiple features', () => {
            const query = `
                SELECT 
                    CASE 
                        WHEN age > @param1 THEN "adult" 
                        ELSE "minor" 
                    END as status,
                    name,
                    age
                FROM users 
                WHERE name LIKE @param2 AND age >= @param3
            `;
            const params = { 
                '@param1': '18', 
                '@param2': '%John%', 
                '@param3': '21' 
            };
            
            consoleQuery(query, params);
            
            const output = consoleOutput[0];
            expect(output).toContain('adult');
            expect(output).toContain('%John%');
            expect(output).toContain('21');
            expect(output).toContain('\x1b[34mSELECT\x1b[0m');
            expect(output).toContain('\x1b[32m\nCASE \x1b[0m');
            expect(output).toContain('\x1b[90m\nWHERE\n\t\x1b[0m');
        });

        test('should handle IN clause with multiple parameters', () => {
            const query = 'SELECT * FROM users WHERE id IN (@param1, @param2, @param3)';
            const params = { '@param1': '1', '@param2': '2', '@param3': '3' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('id IN (1, 2, 3)');
        });

        test('should handle mixed case SQL keywords', () => {
            const query = 'select * from users where name = @param1';
            const params = { '@param1': 'John' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('\x1b[34mSELECT\x1b[0m');
            expect(consoleOutput[0]).toContain('\x1b[90m\nWHERE\n\t\x1b[0m');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty string query', () => {
            consoleQuery('');
            
            expect(consoleOutput[0]).toContain('the query generated is:');
        });

        test('should handle query with no parameters', () => {
            const query = 'SELECT * FROM users';
            
            consoleQuery(query);
            // Normaliza y trimea espacios para comparación, y elimina ANSI
            /**
             * @type {(s: string) => string}
             */
            const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '');
            const normalized = stripAnsi(consoleOutput[0].replace(/\s+/g, ' ').trim());
            expect(normalized.includes('SELECT * FROM users')).toBe(true);
        });

        test('should handle query with only @param placeholders but no params', () => {
            const query = 'SELECT * FROM users WHERE id = @param1 AND name = @param2';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toContain('id = @param1 AND name = @param2');
        });

        test('should handle special characters in parameter values', () => {
            const query = 'SELECT * FROM users WHERE name = @param1';
            const params = { '@param1': "O'Connor" };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain("name = O'Connor");
        });

        test('should handle numbers as strings in params', () => {
            const query = 'SELECT * FROM users WHERE age = @param1';
            const params = { '@param1': '25' };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('age = 25');
        });

        test('should handle object values in params', () => {
            const query = 'SELECT * FROM users WHERE data = @param1';
            const params = { '@param1': { key: 'value' } };
            
            consoleQuery(query, params);
            
            expect(consoleOutput[0]).toContain('data = [object Object]');
        });
    });

    describe('Output Format', () => {
        test('should include "the query generated is:" prefix', () => {
            const query = 'SELECT * FROM users';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toContain('the query generated is:');
        });

        test('should add newlines around the query', () => {
            const query = 'SELECT * FROM users';
            
            consoleQuery(query);
            
            expect(consoleOutput[0]).toMatch(/the query generated is:\n.*\n\n/);
        });
    });
});
