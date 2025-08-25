/**
 * @typedef {import('../../types/index').Where} Where
 * @typedef {import('./types').PositionRef} PositionRef
 * @typedef {import('./types').ValuesObject} ValuesObject
 * @typedef {import('./types').ProcessWhereFunction} ProcessWhereFunction
 * @typedef {import('./types').QueryResult} QueryResult
 * @typedef {import('./types').GetWhereStatementFunction} GetWhereStatementFunction
*/

/**TODO
 * si el tipo es {columna: valor} y hay más de una columna hay que hacer un Warning
 */

/** @type {ProcessWhereFunction} */
const processWhere = (where, positionRef, values) =>
{
	if(where === undefined || where === null || Object.keys(where).length === 0)
	{
		return '';
	}
	else if(typeof where !== 'object' || where === null)
	{
		throw new Error('Where must be an object');
	}
	else if("AND" in where || "OR" in where)
	{
		const connector = where.AND ? "AND" : "OR";
		if(!Array.isArray(where[connector]))
		{
			throw new Error(`${connector} must be an array of sentences`);
		}
		if(typeof where[connector][0] === 'string')
		{
			throw new Error(`${connector} must be an array of sentences, not a single sentence`);
		}
	
		return `(${where[connector].map(subWhere => processWhere(subWhere, positionRef, values)).join(` ${connector} `)})`;
	}
	else
	{

		const [columnName, operator, value] = (() =>
		{
			if(Array.isArray(where))
			{
				if(where.length !== 3)
				{
					console.warn(`The array sentence must have 3 elements: columnName, operator, value`);
				}
				return where;
			}
			else
			{
				if(Object.keys(where).length !== 1)
				{
					console.warn(`The object sentence must have 1 element: columnName`);
				}
				const columnName = Object.keys(where)[0];
				const operator = "=";
				const value = where[columnName];
				return [columnName, operator, value];
			}
		})();

		if(operator === "IN" || operator === "NOT IN")
		{
			if(!Array.isArray(value))
			{
				throw new Error(`The value of the IN or NOT IN operator must be an array`);
			}


			const inParamsMarck = value.map(val =>
			{
				positionRef.current++;
				values[`@whr${positionRef.current}`] = val;
				return `@whr${positionRef.current}`;
			})

			return `${columnName} ${operator} (${inParamsMarck.join(', ')})`;
		}
		else
		{
			if(Array.isArray(value))
			{
				throw new Error(`The value of the ${operator} operator can't be an array`);
			}
			positionRef.current++;
			values[`@whr${positionRef.current}`] = value;
			return `${columnName} ${operator} @whr${positionRef.current}`;
		}
	}

}

/** @type {GetWhereStatementFunction} */
const getWhereStatement = (where) =>
{
	const positionRef = { current: 0 };
	const values = /** @type {ValuesObject} */ ({});
	if(where === undefined || where === null)
	{
		return {
			query: '',
			values: {}
		};
	}
	else
	{
		const whereClause = processWhere(where, positionRef, values);
		return {
			query: whereClause ? `WHERE ${whereClause}` : '',
			values
		}
	}
}

module.exports = getWhereStatement;