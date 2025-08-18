const Events = require('events');

const Scope = class
{
    #events = new Events();
    constructor()
    {
        this.#events = new Events();
        this.endPromise = new Promise((resolve, reject) => {
            this.#events.once('end', resolve);
        });
    }
    end()
    {
        this.#events.emit('end');
    }
}

module.exports = Scope;