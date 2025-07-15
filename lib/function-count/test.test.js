const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const count = require('.');

describe('count function', () => {
	
	const testDbPath = path.join(__dirname, 'test-count.db');
	const db = new sqlite3.Database(testDbPath);
	
	beforeAll(async () => {
		// Crear base de datos de prueba
		
		
		// Crear tabla de prueba con datos
		await new Promise((resolve, reject) => {
			db.serialize(() => {
				// Crear tabla users
				db.run(`
					CREATE TABLE IF NOT EXISTS users (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						name TEXT NOT NULL,
						age INTEGER,
						city TEXT,
						email TEXT UNIQUE,
						status TEXT DEFAULT 'active',
						salary REAL,
						created_at DATETIME DEFAULT CURRENT_TIMESTAMP
					)
				`, (err) => {
					if (err) reject(err);
					else resolve(true);
				});

				// Crear tabla products
				db.run(`
					CREATE TABLE IF NOT EXISTS products (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						name TEXT NOT NULL,
						category TEXT,
						price REAL,
						stock INTEGER DEFAULT 0,
						active BOOLEAN DEFAULT 1
					)
				`, (err) => {
					if (err) reject(err);
					else resolve(true);
				});
			});
		});

		// Limpiar datos existentes
		await new Promise((resolve, reject) => {
			db.run('DELETE FROM users', (err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});

		await new Promise((resolve, reject) => {
			db.run('DELETE FROM products', (err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});

		// Insertar datos de prueba
		await new Promise((resolve, reject) => {
			db.run(`
				INSERT INTO users (name, age, city, email, status, salary) VALUES 
				('John Doe', 25, 'New York', 'john@example.com', 'active', 50000),
				('Jane Smith', 30, 'Los Angeles', 'jane@example.com', 'active', 60000),
				('Bob Johnson', 35, 'Chicago', 'bob@example.com', 'inactive', 45000),
				('Alice Brown', 28, 'New York', 'alice@example.com', 'active', 55000),
				('Charlie Wilson', 22, 'Boston', 'charlie@example.com', 'active', 40000),
				('Diana Davis', 40, 'Los Angeles', 'diana@example.com', 'active', 70000),
				('Eve Miller', 33, 'Chicago', 'eve@example.com', 'inactive', 48000),
				('Frank Garcia', 27, 'New York', 'frank@example.com', 'active', 52000)
			`, (err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});

		await new Promise((resolve, reject) => {
			db.run(`
				INSERT INTO products (name, category, price, stock, active) VALUES 
				('Laptop', 'Electronics', 999.99, 10, 1),
				('Mouse', 'Electronics', 29.99, 50, 1),
				('Keyboard', 'Electronics', 79.99, 25, 1),
				('Book', 'Books', 19.99, 100, 1),
				('Pen', 'Office', 2.99, 200, 1),
				('Desk', 'Furniture', 299.99, 5, 0),
				('Chair', 'Furniture', 149.99, 8, 1),
				('Monitor', 'Electronics', 299.99, 15, 1)
			`, (err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});
	});

	afterAll(async () => {
		// Cerrar base de datos y eliminar archivo
		await new Promise((resolve) => {
			db.close((err) => {
				if (err) console.error('Error closing database:', err);
				resolve(true);
			});
		});

		// Eliminar archivo de base de datos
		if (fs.existsSync(testDbPath)) {
			fs.unlinkSync(testDbPath);
		}
	});

	describe('Basic counting', () => {
		test('should count all records in a table', async () => {
			const result = await count({
				db,
				table: 'users',
				where: undefined,
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should count all records in products table', async () => {
			const result = await count({
				db,
				table: 'products',
				where: undefined,
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should return 0 for empty table', async () => {
			// Crear tabla vacía
			await new Promise((resolve, reject) => {
				db.run('CREATE TABLE IF NOT EXISTS empty_table (id INTEGER)', (err) => {
					if (err) reject(err);
					else resolve(true);
				});
			});

			const result = await count({
				db,
				table: 'empty_table',
				where: undefined,
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(0);
		});
	});

	describe('Simple conditions', () => {
		test('should count users with specific age', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { age: 25 },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(1);
		});

		test('should count users from specific city', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { city: 'New York' },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(3);
		});

		test('should count active users', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { status: 'active' },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(6);
		});

		test('should count products in specific category', async () => {
			const result = await count({
				db,
				table: 'products',
				where: { category: 'Electronics' },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(4);
		});
	});

	describe('Comparison operators', () => {
		test('should count users older than 30', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { age: { operator: '>', value: 30 } },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(3);
		});

		test('should count users with salary greater than or equal to 50000', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { salary: { operator: '>=', value: 50000 } },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(5);
		});

		test('should count products with price less than 100', async () => {
			const result = await count({
				db,
				table: 'products',
				where: { price: { operator: '<', value: 100 } },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(4); // Mouse, Keyboard, Book, Pen
		});

		test('should count users not from New York', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { city: { operator: '!=', value: 'New York' } },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(5);
		});
	});

	describe('Multiple conditions with AND', () => {
		test('should count active users from New York', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { 
					status: 'active',
					city: 'New York'
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(3);
		});

		test('should count users with age between 25 and 35', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {
					AND: [
						{ age: { operator: '>=', value: 25 } },
						{ age: { operator: '<=', value: 35 } }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(6); // John(25), Jane(30), Bob(35), Alice(28), Eve(33), Frank(27)
		});

		test('should count active electronics products with stock > 10', async () => {
			const result = await count({
				db,
				table: 'products',
				where: { 
					category: 'Electronics',
					active: 1,
					stock: { operator: '>', value: 10 }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(3); // Laptop, Mouse, Monitor
		});
	});

	describe('Multiple conditions with OR', () => {
		test('should count users from New York OR Los Angeles', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {
					OR: [
						{ city: 'New York' },
						{ city: 'Los Angeles' }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(5);
		});

		test('should count users with age < 25 OR age > 35', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {
					OR: [
						{ age: { operator: '<', value: 25 } },
						{ age: { operator: '>', value: 35 } }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(2); // Charlie(22), Diana(40)
		});
	});

	describe('Complex nested conditions', () => {
		test('should count active users from New York OR users with salary > 60000', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {
					OR: [
						{ status: 'active', city: 'New York' },
						{ salary: { operator: '>', value: 60000 } }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(6); // John, Alice, Frank (NY active) + Jane, Diana (salary > 60000)
		});

		test('should count users with (age > 30 AND city = Chicago) OR (status = inactive)', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {
					OR: [
						{
							AND: [
								{ age: { operator: '>', value: 30 } },
								{ city: 'Chicago' }
							]
						},
						{ status: 'inactive' }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(2); // Bob(inactive), Eve(inactive)
		});

		test('should count products with complex nested conditions', async () => {
			const result = await count({
				db,
				table: 'products',
				where: {
					AND: [
						{ active: 1 },
						{
							OR: [
								{ category: 'Electronics', price: { operator: '<', value: 500 } },
								{ category: 'Office' }
							]
						}
					]
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(7); // Mouse, Keyboard, Book, Pen, Chair, Monitor (todos activos y cumplen condiciones)
		});
	});

	describe('LIKE operators', () => {
		test('should count users with email containing @example.com', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { 
					email: { operator: 'LIKE', value: '%@example.com' }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should count users with name starting with J', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { 
					name: { operator: 'LIKE', value: 'J%' }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(2);
		});

		test('should count products with name containing "e"', async () => {
			const result = await count({
				db,
				table: 'products',
				where: { 
					name: { operator: 'LIKE', value: '%e%' }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(4); // Mouse, Keyboard, Book, Pen
		});
	});

	describe('IN operators', () => {
		test('should count users from specific cities', async () => {
			const result = await count({
				db,
				table: 'users',
				where: { 
					city: { operator: 'IN', value: ['New York', 'Los Angeles'] }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(5);
		});

		test('should count products in specific categories', async () => {
			const result = await count({
				db,
				table: 'products',
				where: { 
					category: { operator: 'IN', value: ['Electronics', 'Books'] }
				},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(5);
		});
	});

	describe('Edge cases and error handling', () => {
		test('should handle null where condition', async () => {
			const result = await count({
				db,
				table: 'users',
				where: null,
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should handle undefined where condition', async () => {
			const result = await count({
				db,
				table: 'users',
				where: undefined,
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should handle empty object where condition', async () => {
			const result = await count({
				db,
				table: 'users',
				where: {},
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(8);
		});

		test('should throw error for non-existent table', async () => {
			await expect(count({
				db,
				table: 'non_existent_table',
				where: undefined,
				connector: 'AND',
				logQuery: false
			})).rejects.toThrow();
		});

		test('should throw error for invalid column in where condition', async () => {
			await expect(count({
				db,
				table: 'users',
				where: { invalid_column: 'value' },
				connector: 'AND',
				logQuery: false
			})).rejects.toThrow();
		});
	});

	describe('Logging functionality', () => {
		test('should log when logQuery is true', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			
			const result = await count({
				db,
				table: 'users',
				where: { status: 'active' },
				connector: 'AND',
				logQuery: true
			});

			expect(result).toBe(6);
			expect(consoleSpy).toHaveBeenCalledWith('Count performed.');
			
			consoleSpy.mockRestore();
		});

		test('should not log when logQuery is false', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			
			const result = await count({
				db,
				table: 'users',
				where: { status: 'active' },
				connector: 'AND',
				logQuery: false
			});

			expect(result).toBe(6);
			expect(consoleSpy).not.toHaveBeenCalledWith('Count performed.');
			
			consoleSpy.mockRestore();
		});
	});

	describe('Performance tests', () => {
		test('should handle large number of conditions efficiently', async () => {
			const startTime = Date.now();
			
			const result = await count({
				db,
				table: 'users',
				where: {
					AND: [
						{ status: 'active' },
						{ age: { operator: '>', value: 20 } },
						{ salary: { operator: '>', value: 30000 } }
					]
				},
				connector: 'AND',
				logQuery: false
			});

			const endTime = Date.now();
			const executionTime = endTime - startTime;

			expect(result).toBe(6);
			expect(executionTime).toBeLessThan(1000); // Should complete in less than 1 second
		});
	});
}); 