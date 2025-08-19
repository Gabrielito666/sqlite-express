export interface Scope
{
    end():void;
}

export interface ScopePrivate
{
    events:Events;
    startPromise:Promise<void>;
    endPromise:Promise<void>;
    startMethod:() => void;
    endMethod:() => void;
    isEnded:boolean;
    isStarted:boolean;
    timer:NodeJS.Timeout|null;
}

export interface ScopeClass
{
    new(): Scope;
    private:WeakMap<Scope, ScopePrivate>;
    getPrivate(scope:Scope):ScopePrivate;
    setPrivate(scope:Scope, pc:ScopePrivate):void;
}

export interface ScopesQueue
{
    communityScope:Scope;
    isClosed:boolean;
    listUserScopes:Scope[];
    newScope():Scope;
    close():Promise<void>;
}

export interface ScopesQueueClass
{
    Scope:ScopeClass;
    awaitScopeStart(scope?:Scope, scopesQueue:ScopesQueue):Promise<void>;
    new():ScopesQueue;
}