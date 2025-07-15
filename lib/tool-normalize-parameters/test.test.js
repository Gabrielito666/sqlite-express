const normalizeParameters = require('./index');

describe('normalizeParameters', () => {
    test('should return object with only @ keys', () => {
        const originalParams = { '@age': 25, '@name': 'John' };
        const normalized = normalizeParameters(originalParams);
        
        expect(normalized['@age']).toBe(25);
        expect(normalized['@name']).toBe('John');
        // Acceso sin @ debe ser undefined
        expect(normalized.age).toBeUndefined();
        expect(normalized.name).toBeUndefined();
    });
    
    test('should normalize keys without @', () => {
        const originalParams = { '@age': 25, name: 'John', '@city': 'NYC' };
        const normalized = normalizeParameters(originalParams);
        
        expect(normalized['@age']).toBe(25);
        expect(normalized['@name']).toBe('John');
        expect(normalized['@city']).toBe('NYC');
        // Las claves originales sin @ no existen
        expect(normalized.name).toBeUndefined();
        expect(normalized.city).toBeUndefined();
    });
    
    test('should return undefined for non-existent properties', () => {
        const originalParams = { '@age': 25 };
        const normalized = normalizeParameters(originalParams);
        
        expect(normalized['@nonexistent']).toBeUndefined();
        expect(normalized.nonexistent).toBeUndefined();
    });
    
    test('should work with Object.keys', () => {
        const originalParams = { '@age': 25, name: 'John' };
        const normalized = normalizeParameters(originalParams);
        
        // Object.keys solo debe devolver claves con @
        expect(Object.keys(normalized)).toEqual(['@age', '@name']);
    });
}); 