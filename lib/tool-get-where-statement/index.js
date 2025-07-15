/**
 * @typedef {import('../class-options/types').WhereParam} WhereParam
 * @typedef {import('../class-options/types').ConnectorParam} ConnectorParam
 * @typedef {import('./types').PositionRef} PositionRef
 * @typedef {import('./types').ValuesObject} ValuesObject
 * @typedef {import('./types').ProcessWhereFunction} ProcessWhereFunction
 * @typedef {import('./types').QueryResult} QueryResult
 * @typedef {import('./types').GetWhereStatementFunction} GetWhereStatementFunction
*/

/** @type {ProcessWhereFunction} */
const processWhere = (where, connector="AND", positionRef, values, isTopLevel = true) =>
{
	if(where === undefined || where === null)
	{
		return '';
	}
	else if(typeof where !== 'object' || where === null)
	{
		throw new Error('Where must be an object');
	}
	else if(where.AND)
	{
		const andArray = /** @type {WhereParam[]} */ (where.AND);
		if (andArray.length === 0) 
		{
			return '()';
		}
		const joined = andArray.map(
			subWhere => 
			{
				const result = processWhere(subWhere, "AND", positionRef, values, false);
				return result.startsWith('(') && result.endsWith(')') ? result : `(${result})`;
			}
		).join(" AND ");
		return isTopLevel ? joined : `(${joined})`;
	}
	else if(where.OR)
	{
		const orArray = /** @type {WhereParam[]} */ (where.OR);
		if (orArray.length === 0) 
		{
			return '()';
		}
		const joined = orArray.map(
			subWhere => 
			{
				const result = processWhere(subWhere, "OR", positionRef, values, false);
				return result.startsWith('(') && result.endsWith(')') ? result : `(${result})`;
			}
		).join(" OR ");
		return isTopLevel ? joined : `(${joined})`;
	}
	else
	{
		const conditions = Object.keys(where).map(columnName =>
		{
			const columnValue = /** @type {any} */ (where)[columnName];
			
			if(typeof columnValue === "string" || typeof columnValue === "number")
			{
				positionRef.current++;
				values[`@whr${positionRef.current}`] = columnValue;
				return `${columnName} = @whr${positionRef.current}`;
			}
			else if(typeof columnValue === 'object' && columnValue !== null && !Array.isArray(columnValue))
			{
				const objValue = columnValue;
				if(objValue.operator && objValue.value !== undefined)
				{
					// Manejo especial para operador IN
					if(objValue.operator.toUpperCase() === 'IN' && Array.isArray(objValue.value))
					{
						const placeholders = objValue.value.map(/** @type {(val: any) => string} */ (val) =>
						{
							positionRef.current++;
							values[`@whr${positionRef.current}`] = val;
							return `@whr${positionRef.current}`;
						}).join(', ');
						
						
						return `${columnName} IN (${placeholders})`;
					}
					else if(objValue.operator.toUpperCase() === 'NOT IN' && Array.isArray(objValue.value))
					{
						const placeholders = objValue.value.map(/** @type {(val: any) => string} */ (val) => {
							positionRef.current++;
							values[`@whr${positionRef.current}`] = val;
							return `@whr${positionRef.current}`;
						}).join(', ');
						return `${columnName} NOT IN (${placeholders})`;
					}
					else
					{
						positionRef.current++;
						values[`@whr${positionRef.current}`] = objValue.value;
						return `${columnName} ${objValue.operator} @whr${positionRef.current}`;
					}
				}
			}
			
			throw new Error(`Invalid column value: ${JSON.stringify(columnValue)}`);
		});

		// Si no hay condiciones, devolver cadena vacía
		if(conditions.length === 0)
		{
			return '';
		}

		return conditions.join(` ${connector} `);
	}

}

/** @type {GetWhereStatementFunction} */
const getWhereStatement = (where, connector="AND") =>
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
		const whereClause = processWhere(where, connector, positionRef, values, true);
		return {
			query: whereClause ? `WHERE ${whereClause}` : '',
			values
		}
	}
}

module.exports = getWhereStatement;