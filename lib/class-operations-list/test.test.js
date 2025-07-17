const OperationsList = require('./index');

describe('OperationsList class', () => {
    /** @type {import('./types').OperationsListType} */
    let operationsList;
    /** @type {any} */
    let mockDatabase;

    beforeEach(() => {
        // Simple mock database
        mockDatabase = {
            sqliteDb: {},
            waitingList: {},
            defaultOptions: {}
        };

        operationsList = new OperationsList();
    });

    describe('Constructor', () => {
        test('should initialize with empty list', () => {
            expect(operationsList.list).toEqual([]);
            expect(operationsList.isRunning).toBe(false);
            expect(operationsList.isEnded).toBe(false);
        });
    });

    describe('addOperation method', () => {
        test('should add operation and resolve with result', async () => {
            const mockMethod = jest.fn().mockResolvedValue('success');
            const mockParameters = { test: 'data' };
            //@ts-ignore
            const result = await operationsList.addOperation(mockMethod, mockParameters);

            expect(result).toBe('success');
            expect(mockMethod).toHaveBeenCalledWith(mockParameters);
        });

        test('should handle multiple operations', async () => {
            const mockMethod1 = jest.fn().mockResolvedValue('result1');
            const mockMethod2 = jest.fn().mockResolvedValue('result2');

            // @ts-ignore
            const promise1 = operationsList.addOperation(mockMethod1, {});
            // @ts-ignore
            const promise2 = operationsList.addOperation(mockMethod2, {});

            const [result1, result2] = await Promise.all([promise1, promise2]);

            expect(result1).toBe('result1');
            expect(result2).toBe('result2');
            expect(mockMethod1).toHaveBeenCalled();
            expect(mockMethod2).toHaveBeenCalled();
        });
    });

    describe('run method', () => {
        test('should execute operations in order', async () => {
            /** @type {number[]} */
            const results = [];
            const mockMethod1 = jest.fn().mockImplementation(() => {
                results.push(1);
                return Promise.resolve('result1');
            });
            const mockMethod2 = jest.fn().mockImplementation(() => {
                results.push(2);
                return Promise.resolve('result2');
            });

            // Add operations manually to test run method
            operationsList.list.push(() => mockMethod1({}));
            operationsList.list.push(() => mockMethod2({}));

            await operationsList.run();

            expect(results).toEqual([1, 2]);
            expect(operationsList.isRunning).toBe(false);
            expect(operationsList.list).toHaveLength(0);
        });

        test('should handle empty list', async () => {
            await operationsList.run();

            expect(operationsList.isRunning).toBe(false);
            expect(operationsList.list).toHaveLength(0);
        });
    });

    describe('Edge cases', () => {
        test('should handle operation that returns undefined', async () => {
            const mockMethod = jest.fn().mockResolvedValue(undefined);

            // @ts-ignore
            const result = await operationsList.addOperation(mockMethod, {});

            expect(result).toBeUndefined();
        });

        test('should handle operations with parameters', async () => {
            const params = { table: 'users', select: '*' };
            const mockMethod = jest.fn().mockResolvedValue('result');

            // @ts-ignore
            await operationsList.addOperation(mockMethod, params);

            expect(mockMethod).toHaveBeenCalledWith(params);
        });
    });
}); 