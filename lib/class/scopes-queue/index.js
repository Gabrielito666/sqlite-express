const { EventEmitter } = require('events');

/**@typedef {import("./types").Scope} Scope */
/**@typedef {import("./types").ScopeClass} ScopeClass */
/**@typedef {import("./types").ScopePrivate} ScopePrivate */
/**@typedef {import("./types").ScopesQueue} ScopesQueue */
/**@typedef {import("./types").ScopesQueueClass} ScopesQueueClass */

/**@type {ScopeClass} */
const Scope = class
{
    /**@type {ScopeClass["private"]} */
    static private = new WeakMap();
    /**@type {ScopeClass["getPrivate"]} */
    static getPrivate(scope)
    {
        const pc = Scope.private.get(scope);
        if(!pc) throw new Error('SqliteExpress - Scope Error: The private camps are not defined, this is so strange');
        return pc;
    }
    /**@type {ScopeClass["setPrivate"]} */
    static setPrivate(scope, pc)
    {
        if(Scope.private.has(scope)) throw new Error('SqliteExpress - Scope Error: The private camps are already defined');
        Scope.private.set(scope, pc);
    }

    /**
     * @this {Scope}
    */
    constructor()
    {
        const privateCamps = /**@type {ScopePrivate}*/({});
        privateCamps.timer = null;

        privateCamps.events = new EventEmitter();
        privateCamps.startPromise = new Promise((resolve) => {
            privateCamps.events.once('start', resolve);
        });
        privateCamps.endPromise = new Promise((resolve) => {
            privateCamps.events.once('end', resolve);
        });
        privateCamps.startMethod = () => {
            if(privateCamps.isStarted)
            {
                throw new Error('SqliteExpress - Scope Error: The scope has already started');
            }
            privateCamps.isStarted = true;
            privateCamps.events.emit('start');

            privateCamps.timer = setInterval(() =>
            {
                if(!privateCamps.isEnded)
                {
                    console.warn('SqliteExpress - Scope Warning: Scope has been open for more than 10s. Long transactions are fine, but remember to call scope.end() when done.');
                }
            }, 1000*10);
        };
        privateCamps.endMethod = () => {
            privateCamps.isEnded = true;
            privateCamps.events.emit('end');
            clearInterval(privateCamps.timer || 0);
        };
        privateCamps.isEnded = false;
        privateCamps.isStarted = false;

        Scope.setPrivate(this, privateCamps);
    }
    /**
     * @type {Scope["end"]}
     * @this {Scope}
    */
    end()
    {
        Scope.getPrivate(this).endMethod();
    }
}

/**@type {ScopesQueueClass} */
const ScopesQueue = class
{
    /**@type {ScopesQueueClass["Scope"]} */
    static Scope = Scope;

    /**
     * @type {ScopesQueueClass["awaitScopeStart"]}
    */
    static awaitScopeStart(scope, scopesQueue)
    {
        scope = scope || scopesQueue.communityScope;
        const privateCampsScope = Scope.getPrivate(scope);

        if(privateCampsScope.isEnded)
        {
            throw new Error('SqliteExpress - ScopesQueue Error: The provided scope has already ended');
        }
        return privateCampsScope.startPromise;
    }

    /**
     * @this {ScopesQueue}
     */
    constructor()
    {
        this.communityScope = new Scope();
        this.isClosed = false;
	this.isRunning = false;
        this.listScopes = /**@type {ScopesQueue["listScopes"]}*/[this.communityScope];

	this.run();
    }
    /**
     * @type {ScopesQueue["newScope"]}
     * @this {ScopesQueue}
    */
    newScope()
    {
        if(this.isClosed)
        {
            throw new Error('SqliteExpress - ScopesQueue Error: The scopes queue has been closed, you cannot create new scopes');
        }

        // se crea el nuevo user scope y el nuevo community scope
        const newUserScope = new Scope();
        const oldCommunityScope = this.communityScope;
        const newCommunityScope = new Scope();

        // se agrega el nuevo user scope a la lista de user scopes
        this.listScopes.push(newUserScope);
	this.listScopes.push(newCommunityScope);

        // se reemplaza el community scope actual por el nuevo
        this.communityScope = newCommunityScope;
        oldCommunityScope.end();

	this.run();

        return newUserScope;
    };
    run()
    {
	if(this.isRunning) return;
	this.isRunning = true;
	(async()=>
	{
		while(this.listScopes.length > 0)
		{
			const currentScope = this.listScopes.shift();
			if(currentScope)
			{
				Scope.getPrivate(currentScope).startMethod();
				await Scope.getPrivate(currentScope).endPromise;
			}
		}
		this.isRunning = false;
	})();
    }
    /**
     * @type {ScopesQueue["close"]}
     * @this {ScopesQueue}
    */
    close()
    {
        this.isClosed = true;
        this.communityScope.end();
        const promisesToEnd = new Set([
            ...this.listScopes.map(scope => Scope.getPrivate(scope).endPromise),
            Scope.getPrivate(this.communityScope).endPromise
        ]);

        return Promise.all(promisesToEnd).then(() => {
            this.listScopes = /**@type {ScopesQueue["listScopes"]}*/([]);
        });
    }
}

module.exports = ScopesQueue;
