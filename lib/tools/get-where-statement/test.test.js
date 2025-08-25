//GET WHERE STATEMENT TESTS

const getWhereStatement = require('./index');
import { describe, test, expect } from "vitest";

describe('getWhereStatement tests', () =>
{
	test('should return an empty string if the where is undefined', () =>
	{
        const { query, values } = getWhereStatement(undefined);
		expect(query).toBe('');
		expect(values).toEqual({});
	});

	test('should return an empty string if the where is an empty object', () =>
	{
        const { query, values } = getWhereStatement({});
		expect(query).toBe('');
		expect(values).toEqual({});
	});
    
    test('should return the correct where statement for a single column', () =>
    {
        const { query, values } = getWhereStatement({ name: 'John' });
        expect(query).toBe('WHERE name = @whr1');
        expect(values).toEqual({ '@whr1': 'John' });
    });

    test('should return the correct where statement for a single column with a value that is an array', () =>
    {
        const { query, values } = getWhereStatement(['name', '>', 3]);
        expect(query).toBe('WHERE name > @whr1');
        expect(values).toEqual({ '@whr1': 3 });
    });

    test('should return the correct where statement for a AND sentence', () =>
    {
        const { query, values } = getWhereStatement({ AND: [{ name: 'John' }, { age: 30 }] });
        expect(query).toBe('WHERE (name = @whr1 AND age = @whr2)');
        expect(values).toEqual({ '@whr1': 'John', '@whr2': 30 });
    });

    test('should return the correct where statement for a OR sentence', () =>
    {
        const { query, values } = getWhereStatement({ OR: [{ name: 'John' }, { age: 30 }] });
        expect(query).toBe('WHERE (name = @whr1 OR age = @whr2)');
        expect(values).toEqual({ '@whr1': 'John', '@whr2': 30 });
    });

    test('should return the correct where statement for a AND sentence with a value that is an array', () =>
    {
        const { query, values } = getWhereStatement({ AND: [{ name: 'John' }, ["age", ">", 40]] });
        expect(query).toBe('WHERE (name = @whr1 AND age > @whr2)');
        expect(values).toEqual({ '@whr1': 'John', '@whr2': 40 });
    }); 
});