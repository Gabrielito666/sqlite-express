const getWhereString = require('./index');

describe('getWhereString', () => {
	describe('Basic Conditions (Condition type)', () => {
		test('should handle simple string value', () => {
			const where = { name: 'John' };
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE name = @whr1');
			expect(result.values).toEqual({ '@whr1': 'John' });
		});

		test('should handle simple number value', () => {
			const where = { age: 25 };
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE age = @whr1');
			expect(result.values).toEqual({ '@whr1': 25 });
		});

		test('should handle multiple simple conditions', () => {
			const where = { name: 'John', age: 25, city: 'New York' };
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE name = @whr1 AND age = @whr2 AND city = @whr3');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 25, '@whr3': 'New York' });
		});

		test('should handle complete condition with operator', () => {
            /**@type {import('.').Where}**/
			const where = { age: { operator : ">", value: 18 } };
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE age > @whr1');
			expect(result.values).toEqual({ '@whr1': 18 });
		});

		test('should handle multiple complete conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				age: { operator: '>=', value: 18 },
				salary: { operator: '>', value: 50000 },
				status: { operator: 'LIKE', value: 'active' }
			};
            
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE age >= @whr1 AND salary > @whr2 AND status LIKE @whr3');
			expect(result.values).toEqual({ '@whr1': 18, '@whr2': 50000, '@whr3': 'active' });
		});

		test('should handle mixed simple and complete conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				name: 'John',
				age: { operator: '>', value: 18 },
				city: 'New York'
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE name = @whr1 AND age > @whr2 AND city = @whr3');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 'New York' });
		});
	});

	describe('AND Conditions (ConditionsList type)', () => {
		test('should handle simple AND array', () => {
            /**@type {import('.').Where}**/
			const where = {
				AND: [
					{ name: 'John' },
					{ age: 25 }
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND (age = @whr2)');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 25 });
		});

		test('should handle AND with complete conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				AND: [
					{ name: 'John' },
					{ age: { operator: '>', value: 18 } },
					{ city: 'New York' }
				]
			};
            
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND (age > @whr2) AND (city = @whr3)');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 'New York' });
		});

		test('should handle nested AND conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				AND: [
					{ name: 'John' },
					{
						AND: [
							{ age: { operator: '>', value: 18 } },
							{ city: 'New York' }
						]
					}
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND ((age > @whr2) AND (city = @whr3))');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 'New York' });
		});
	});

	describe('OR Conditions (ConditionsList type)', () => {
		test('should handle simple OR array', () => {
            /**@type {import('.').Where}**/
			const where = {
				OR: [
					{ name: 'John' },
					{ name: 'Jane' }
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) OR (name = @whr2)');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 'Jane' });
		});

		test('should handle OR with complete conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				OR: [
					{ age: { operator: '<', value: 18 } },
					{ age: { operator: '>', value: 65 } }
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (age < @whr1) OR (age > @whr2)');
			expect(result.values).toEqual({ '@whr1': 18, '@whr2': 65 });
		});

		test('should handle nested OR conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				OR: [
					{ name: 'John' },
					{
						OR: [
							{ age: { operator: '<', value: 18 } },
							{ age: { operator: '>', value: 65 } }
						]
					}
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) OR ((age < @whr2) OR (age > @whr3))');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 65 });
		});
	});

	describe('Complex Nested Conditions', () => {
		test('should handle AND with nested OR', () => {
            /**@type {import('.').Where}**/
			const where = {
				AND: [
					{ name: 'John' },
					{
						OR: [
							{ age: { operator: '<', value: 18 } },
							{ age: { operator: '>', value: 65 } }
						]
					}
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND ((age < @whr2) OR (age > @whr3))');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 65 });
		});

		test('should handle OR with nested AND', () => {
            /**@type {import('.').Where}**/
			const where = {
				OR: [
					{ name: 'John' },
					{
						AND: [
							{ age: { operator: '>=', value: 18 } },
							{ city: 'New York' }
						]
					}
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) OR ((age >= @whr2) AND (city = @whr3))');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 'New York' });
		});

		test('should handle deeply nested conditions', () => {
            /**@type {import('.').Where}**/
			const where = {
				AND: [
					{ name: 'John' },
					{
						OR: [
							{ age: { operator: '<', value: 18 } },
							{
								AND: [
									{ age: { operator: '>=', value: 18 } },
									{ city: 'New York' }
								]
							}
						]
					}
				]
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND ((age < @whr2) OR ((age >= @whr3) AND (city = @whr4)))');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 18, '@whr4': 'New York' });
		});
	});

	describe('Different Operators', () => {
		test('should handle all comparison operators', () => {
            /**@type {import('.').Where}**/
			const where = {
				age: { operator: '=', value: 25 },
				salary: { operator: '!=', value: 50000 },
				height: { operator: '>', value: 170 },
				weight: { operator: '<', value: 80 },
				score: { operator: '>=', value: 7.5 },
				rating: { operator: '<=', value: 5 }
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE age = @whr1 AND salary != @whr2 AND height > @whr3 AND weight < @whr4 AND score >= @whr5 AND rating <= @whr6');
			expect(result.values).toEqual({ '@whr1': 25, '@whr2': 50000, '@whr3': 170, '@whr4': 80, '@whr5': 7.5, '@whr6': 5 });
		});

		test('should handle LIKE operators', () => {
            /**@type {import('.').Where}**/
			const where = {
				name: { operator: 'LIKE', value: '%John%' },
				email: { operator: 'NOT LIKE', value: '%spam%' }
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE name LIKE @whr1 AND email NOT LIKE @whr2');
			expect(result.values).toEqual({ '@whr1': '%John%', '@whr2': '%spam%' });
		});

		test('should handle IN operators', () => {
            /**@type {import('.').Where}**/
			    const where = {
				status: { operator: 'IN', value: ['active', 'pending'] },
				category: { operator: 'NOT IN', value: ['deleted', 'archived'] }
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE status IN (@whr1, @whr2) AND category NOT IN (@whr3, @whr4)');
			expect(result.values).toEqual({ '@whr1': 'active', '@whr2': 'pending', '@whr3': 'deleted', '@whr4': 'archived' });
		});

		test('should handle IS operators', () => {
            /**@type {import('.').Where}**/
			const where = {
				deleted_at: { operator: 'IS', value: null },
				updated_at: { operator: 'IS NOT', value: null }
			};
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE deleted_at IS @whr1 AND updated_at IS NOT @whr2');
			expect(result.values).toEqual({ '@whr1': null, '@whr2': null });
		});
	});

	describe('Edge Cases and Error Handling', () => {
		test('should return empty query for null input', () => {
			const result = getWhereString();
			expect(result.query).toBe('');
			expect(result.values).toEqual({});
		});

		test('should return empty query for undefined input', () => {
			const result = getWhereString(undefined);
			expect(result.query).toBe('');
			expect(result.values).toEqual({});
		});

		test('should throw error for non-object input', () => {
			//@ts-ignore
			expect(() => getWhereString('string')).toThrow('Where must be an object');
			//@ts-ignore
			expect(() => getWhereString(123)).toThrow('Where must be an object');
			//@ts-ignore
			expect(() => getWhereString(true)).toThrow('Where must be an object');
		});

		test('should throw error for invalid column value', () => {
			const where = { name: [] }; // Array is not valid
			expect(() => getWhereString(where)).toThrow('Invalid column value: []');
		});

		test('should throw error for object without operator/value', () => {
			const where = { name: { invalid: 'property' } };
			//@ts-ignore
			expect(() => getWhereString(where)).toThrow('Invalid column value: {"invalid":"property"}');
		});

		test('should handle empty object', () => {
			const where = {};
			//@ts-ignore
			const result = getWhereString(where);
			expect(result.query).toBe('');
			expect(result.values).toEqual({});
		});

		test('should handle empty AND array', () => {
			const where = { AND: [] };
			const result = getWhereString(where);
			expect(result.query).toBe('WHERE ()');
			expect(result.values).toEqual({});
		});

		test('should handle empty OR array', () => {
			const where = { OR: [] };
			const result = getWhereString(where);
			expect(result.query).toBe('WHERE ()');
			expect(result.values).toEqual({});
		});
	});

	describe('Custom Connector', () => {
		test('should use custom AND connector', () => {
			const where = { name: 'John', age: 25 };
			const result = getWhereString(where, 'AND');
			
			expect(result.query).toBe('WHERE name = @whr1 AND age = @whr2');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 25 });
		});

		test('should use custom OR connector', () => {
			const where = { name: 'John', age: 25 };
			const result = getWhereString(where, 'OR');
			
			expect(result.query).toBe('WHERE name = @whr1 OR age = @whr2');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 25 });
		});
	});

	describe('Position Counter', () => {
		test('should increment position counter correctly', () => {
			const where = {
				AND: [
					{ name: 'John' },
					{ age: 25 },
					{ city: 'New York' }
				]
			};
			//@ts-ignore
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND (age = @whr2) AND (city = @whr3)');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 25, '@whr3': 'New York' });
		});

		test('should handle complex nested position counting', () => {
			const where = {
				AND: [
					{ name: 'John' },
					{
						OR: [
							{ age: { operator: '<', value: 18 } },
							{ age: { operator: '>', value: 65 } }
						]
					},
					{ city: 'New York' }
				]
			};
			//@ts-ignore
			const result = getWhereString(where);
			
			expect(result.query).toBe('WHERE (name = @whr1) AND ((age < @whr2) OR (age > @whr3)) AND (city = @whr4)');
			expect(result.values).toEqual({ '@whr1': 'John', '@whr2': 18, '@whr3': 65, '@whr4': 'New York' });
		});
	});
});