const confirmDb = (dbKey, dataBasesList) =>
{
    if(!Object.keys(dataBasesList).includes(dbKey)) throw new Error('The database you have entered is not defined');
}
module.exports = confirmDb;