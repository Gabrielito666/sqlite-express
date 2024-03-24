const determineQueryType = sql =>
{
    const simplifiedSql = sql.toLowerCase().trim().replace(/\s+/g, ' ');
    const firstTokenMatch = simplifiedSql.match(/^\(? *(select|insert|update|delete|create|alter|drop)/);
    if (firstTokenMatch) return firstTokenMatch[1];
    else return 'non-select';
};
module.exports = determineQueryType;