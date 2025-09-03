const { EventEmitter } = require('events');

/**
 * @typedef {import("./types").Scope} Scope
 * @typedef {import("./types").ScopeClass} ScopeClass
 * @typedef {import("./types").ScopePrivateCamps} ScopePrivateCamps
 * @typedef {import("./types").ScopePrivateCampsClass} ScopePrivateCampsClass
 * @typedef {import("./types").ScopesQueue} ScopesQueue
 * @typedef {import("./types").ScopesQueueClass} ScopesQueueClass
*/

/**@type {ScopePrivateCampsClass}*/
const ScopePrivateCamps = class
{
    constructor()
    {
        this.isOpen = true;
        this.isMyTurn = false;

        this.events = new EventEmitter();

        this.operationsList = /**@type {ScopePrivateCamps["operationsList"]}*/([]);

        this.myTurnStart = new Promise(resolve => this.events.once("my-turn-start", resolve));
        this.userClose = new Promise(resolve => this.events.once("user-close", resolve));
        this.end = new Promise(resolve => this.events.once("end", resolve));

        //TOO MUCH TIME PASSED BWTWEEN MY-TURN AND END HANDLER
        this.myTurnStart.then(() =>
        {
            const timer = setInterval(() =>
            {
                console.warn("It has been a long time since the scope turn began and ended. Perhaps you forgot to call `scope.close();`");
            }, 5000);
            this.end.then(() =>
            {
                clearInterval(timer);
            });
        });

        //END EVENT AFTER USER CALL CLOSE MEHTOD AND AFTER THE OPERATIONS_LIST END
        //IS IN A FINALLY, THE ERRORS FOR TEH USER AND SCOPE ENDS WITH THE PROMISES
        this.userClose.then(() =>
        {
            Promise.allSettled(this.operationsList).finally(() =>
            {
                this.events.emit("end");
            });
        });
    }
    /**@type {ScopePrivateCamps["addOperation"]}*/
    addOperation(method, arg1, arg2)
    {
        if(this.isOpen)
        {
            const operation = this.myTurnStart.then(() => method(arg1, arg2));
            //ADD A OPERATION IN LIST. IS THE PROMISE OF METHOD THEN OF MY TURN START
            this.operationsList.push(operation);
            return operation;
        }
        else
        {
            return Promise.reject(Error("You can't add a operation in a closed scope"));
        }
    }
    myTurnTrigger()
    {
        if(!this.isMyTurn)
        {
            this.isMyTurn = true;
            this.events.emit("my-turn-start");
        }
    }
    userCloseTrigger()
    {
        if(this.isOpen)
        {
            this.isOpen = false;
            this.events.emit("user-close");
        }
        else
        {
            console.warn("You are calling the `scope.close()` method more than once. The second time was ignored because the scope can only be closed once.")
        }
    }
}


/**@type {ScopeClass} */
const Scope = class
{
    /**@type {ScopeClass["private"]}*/
    static private = new WeakMap();
    /**@type {ScopeClass["getPrivate"]}*/
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
        Scope.setPrivate(this, new ScopePrivateCamps());
    }
    /**
     * @type {Scope["close"]}
     * @this {Scope}
    */
    close()
    {
        Scope.getPrivate(this).userCloseTrigger();
    }
}

/**@type {ScopesQueueClass} */
const ScopesQueue = class
{
    /**@type {ScopesQueueClass["Scope"]} */
    static Scope = Scope;

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
     * @type {ScopesQueue["getScopeByArgs"]}
     * @this {ScopesQueue}
    */
    getScopeByArgs(scope)
    {
        return scope || this.communityScope;
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
        oldCommunityScope.close();

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
                    Scope.getPrivate(currentScope).myTurnTrigger();
                    //END PROMISE NO HAVE REJECT: AWAIT IS SAFED
                    await Scope.getPrivate(currentScope).end;
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
        this.communityScope.close();
        const promisesToEnd = new Set([
            ...this.listScopes.map(scope => Scope.getPrivate(scope).end),
            Scope.getPrivate(this.communityScope).end
        ]);

        return Promise.all(promisesToEnd).then(() => {
            this.listScopes = /**@type {ScopesQueue["listScopes"]}*/([]);
        });
    }
}

module.exports = ScopesQueue;
