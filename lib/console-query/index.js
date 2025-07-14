/**
 * @typedef {import('./types').ConsoleQuery} ConsoleQuery
 */

const colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightBlue: '\x1b[94m'
};

/** @type {ConsoleQuery} */
const consoleQuery = (str, params = {}) =>
{
    let newStr = str.replace(/@param\d+/g, (match) =>
    {
        if (params[match] !== undefined)
        {
            return params[match];
        }
        return match;
    });

    newStr = newStr
        .replace(/\bCREATE\b/gi, `${colors.cyan}CREATE${colors.reset}`)
        .replace(/\bSELECT\b/gi, `${colors.blue}SELECT${colors.reset}`)
        .replace(/\bDELETE\b/gi, `${colors.red}DELETE${colors.reset}`)
        .replace(/\bUPDATE\b/gi, `${colors.brightBlue}UPDATE${colors.reset}`)
        .replace(/\sWHERE\s/gi, `${colors.gray}\nWHERE\n\t${colors.reset}`)
        .replace(/\sCASE\s/gi, `${colors.green}\nCASE ${colors.reset}`)
        .replace(/\sWHEN\s/gi, `${colors.magenta}\n\tWHEN ${colors.reset}`)
        .replace(/\bWHEN\b/gi, `${colors.magenta}\n\tWHEN ${colors.reset}`)
        .replace(/\bELSE\b/gi, `${colors.yellow}\n\tELSE ${colors.reset}`)
        .replace(/\bEND\b/gi, `${colors.red}\nEND ${colors.reset}`);

    console.log(`the query generated is:\n${newStr}\n\n`);
}

module.exports = consoleQuery;