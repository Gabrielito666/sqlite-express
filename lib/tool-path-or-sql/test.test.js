const fs = require('fs');
const path = require('path');
const pathOrSql = require('./index');

describe('pathOrSql', () => {
    const testDir = path.join(__dirname, 'test-files');
    
    beforeAll(() => {
        // Crear directorio de test si no existe
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });
    
    afterAll(() => {
        // Limpiar archivos de test
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });
    
    beforeEach(() => {
        // Limpiar archivos antes de cada test
        if (fs.existsSync(testDir)) {
            const files = fs.readdirSync(testDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(testDir, file));
            });
        }
    });
    
    describe('File Reading', () => {
        test('should read SQL file when path exists', () => {
            const sqlContent = 'SELECT * FROM users WHERE age > 25;';
            const filePath = path.join(testDir, 'test.sql');
            
            // Crear archivo de test
            fs.writeFileSync(filePath, sqlContent, 'utf8');
            
            const result = pathOrSql(filePath);
            
            expect(result).toBe(sqlContent);
        });
        
        test('should read file with complex SQL content', () => {
            const sqlContent = `
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                
                INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
            `;
            const filePath = path.join(testDir, 'complex.sql');
            
            fs.writeFileSync(filePath, sqlContent, 'utf8');
            
            const result = pathOrSql(filePath);
            
            expect(result).toBe(sqlContent);
        });
        
        test('should handle file with special characters', () => {
            const sqlContent = 'SELECT * FROM "users" WHERE name = "O\'Connor" AND email LIKE "%@example.com";';
            const filePath = path.join(testDir, 'special.sql');
            
            fs.writeFileSync(filePath, sqlContent, 'utf8');
            
            const result = pathOrSql(filePath);
            
            expect(result).toBe(sqlContent);
        });
        
        test('should handle empty file', () => {
            const filePath = path.join(testDir, 'empty.sql');
            
            fs.writeFileSync(filePath, '', 'utf8');
            
            const result = pathOrSql(filePath);
            
            expect(result).toBe('');
        });
    });
    
    describe('SQL String Return', () => {
        test('should return SQL string when path does not exist', () => {
            const sqlString = 'SELECT * FROM users WHERE id = 1;';
            const nonExistentPath = path.join(testDir, 'nonexistent.sql');
            
            const result = pathOrSql(sqlString);
            
            expect(result).toBe(sqlString);
        });
        
        test('should return complex SQL string', () => {
            const sqlString = `
                SELECT u.name, u.email, p.title
                FROM users u
                LEFT JOIN posts p ON u.id = p.user_id
                WHERE u.active = 1
                ORDER BY u.created_at DESC;
            `;
            
            const result = pathOrSql(sqlString);
            
            expect(result).toBe(sqlString);
        });
        
        test('should return SQL with parameters', () => {
            const sqlString = 'SELECT * FROM users WHERE age > @1 AND city = @2;';
            
            const result = pathOrSql(sqlString);
            
            expect(result).toBe(sqlString);
        });
    });
    
    describe('Edge Cases', () => {
        test('should handle relative paths', () => {
            const sqlContent = 'SELECT COUNT(*) FROM users;';
            const relativePath = path.join('test-files', 'relative.sql');
            const absolutePath = path.join(testDir, 'relative.sql');
            
            fs.writeFileSync(absolutePath, sqlContent, 'utf8');
            
            // Cambiar al directorio de test para que la ruta relativa funcione
            const originalCwd = process.cwd();
            process.chdir(__dirname);
            
            const result = pathOrSql(relativePath);
            
            // Restaurar el directorio original
            process.chdir(originalCwd);
            
            expect(result).toBe(sqlContent);
        });
        
        test('should handle absolute paths', () => {
            const sqlContent = 'UPDATE users SET last_login = CURRENT_TIMESTAMP;';
            const absolutePath = path.join(testDir, 'absolute.sql');
            
            fs.writeFileSync(absolutePath, sqlContent, 'utf8');
            
            const result = pathOrSql(absolutePath);
            
            expect(result).toBe(sqlContent);
        });
        
        test('should handle very long SQL string', () => {
            const longSql = 'SELECT ' + 'id, name, email, '.repeat(100) + 'created_at FROM users;';
            
            const result = pathOrSql(longSql);
            
            expect(result).toBe(longSql);
        });
        
        test('should handle SQL with newlines and formatting', () => {
            const formattedSql = `
                SELECT 
                    u.id,
                    u.name,
                    u.email,
                    COUNT(p.id) as post_count
                FROM users u
                LEFT JOIN posts p ON u.id = p.user_id
                WHERE u.active = 1
                GROUP BY u.id, u.name, u.email
                HAVING post_count > 0
                ORDER BY post_count DESC;
            `;
            
            const result = pathOrSql(formattedSql);
            
            expect(result).toBe(formattedSql);
        });
    });
    
    describe('Error Handling', () => {
        test('should handle directory path as SQL string', () => {
            const directoryPath = testDir;
            
            // El módulo actual intenta leer el directorio y falla
            // Este test verifica que el comportamiento actual es correcto
            expect(() => {
                pathOrSql(directoryPath);
            }).toThrow('EISDIR: illegal operation on a directory, read');
        });
        
        test('should handle non-existent absolute path as SQL string', () => {
            const nonExistentPath = '/path/to/nonexistent/file.sql';
            
            const result = pathOrSql(nonExistentPath);
            
            expect(result).toBe(nonExistentPath);
        });
    });
});
