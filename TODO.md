Probar los siguientes psoibles errores:

# 1
```js
sqliteExpress.createTable({
    table: "persona",
    columns: { nombre: "TEXT", edad: "INTEGER" }
})

sqliteExpress.insert({
    table: "persona",
    row: { nombre: "Gabriel", edad: 25 }
})
```
No debiese haber error de que la fila no esté creada porque la lista de operaciones debe esperar la primera instrucción antes de ejecutar la segunda.

debe probarse también con una la instancia de DB.

# 2

```js
sqliteExpress.createTable({
    table: "persona",
    columns: { nombre: "TEXT", edad: "INTEGER" }
});

const stmt = sqliteExpress.declareSQL({
    query : "INSERT INTO persona nombre, edad VALUES(Gabriel, 25)"
});
```

No debiese haber problema con esto al igual que la primera versión
La lógica me dice que al revez tampóco debiese haber problema porque estoy declarando una función, no ejecutandola pero eso hay que consultarlo.

# 6.0.0 :'D

Hay una evidente sobrecomplejización de concurrencia encolada.

como el paquete se basa en promesas y sqlite ya tiene metodos nativos de serializar operaciones (BEGIN y COMMIT) me parece que hay que usar await simplemente y ya está.

```js
const q = db.queue();

await db.insert({
    table: "table",
    row : { col: "value" },
    queue: q
});
await db.insert({
    table: "table",
    row : { col: "value" },
    queue: q
});

q.end();
```
Esto ejecuta solo las llamadas que estén marcadas con la queue que se esté ejecutando.


# Entonces

- Eiminar waiting list y transaction
- Db.scope()
- Eliminar Options
- añadir .setInit o beforeMethods a las class.
- Simplificar el sistema de tipos
- select expected está bien
- executeSQL y defineSQL tiene que solo recibir type y no expected y el tipe puede ser `"select-row"|"select-column"|"select-celd"|"select-rows"|"insert"|"update"|"delete"|"just-run"`

```js
class DB{
    constructor()
    {
        this.#beforeAllPromises = [];
        this.#queuesList = [];
    }
    async beforeAll(func){
        const resultPromise = func();
        this.#beforeAllPromises.push(resultPromise);

        await resultPromise;
        this.#beforeAllPeomises.remove(resultPromise); //no es remove

    }
    createScope()
    {
        const scope = {
            startPromise,
            end(){
	    	emitirEvento
	    }
            //algo asi
        }
        const scopePromise = new Promise((res, rej) =>
        {
            this.#queuesList.push(q);
	    onEnd(resolve);
        });

        queuePromise.then(() =>
        {
            this.#queuesList.remove(queuePromise);
        })

        return sym;
    }

    async insert({ table, row, queue })
    {
        await Promise.all(this.#beforeAllPromises);
        if(queue)
        {
            // si hay queue esperamos que esta arranque
            await queue.startPromise;
        }
        else
        {
            // si no hay las esperamos todas.
            await Promise.all(this.#queuesList);
        }
        console.log("insert bla bla bla");
    }
}
```

Algo así permitiría esperar solo las promesas no resueltas y gestionar queues que deben bloquear metodos no marcados o marcados con otra queue.
