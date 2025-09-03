import { EventEmitter } from "events";

export interface Scope
{
    close():void;
}

export interface ScopePrivateCamps
{
    isOpen: boolean;
    isMyTurn: boolean;

    events: EventEmitter;

    operationsList: Promise<any>[];

    myTurnStart: Promise<void>;
    userClose: Promise<void>;
    end: Promise<void>;

    addOperation<M extends Function>(method: M, arg1:Parameters<M>[0], arg2:Parameters<M>[1]):Promise<Awaited<ReturnType<M>>>;
    myTurnTrigger(): void;
    userCloseTrigger(): void;
}
export interface ScopePrivateCampsClass
{
    new(): ScopePrivateCamps;
}

export interface ScopeClass
{
    new(): Scope;
    private:WeakMap<Scope, ScopePrivateCamps>;
    getPrivate(scope:Scope):ScopePrivateCamps;
    setPrivate(scope:Scope, pc:ScopePrivateCamps):void;
}

export interface ScopesQueue
{
    communityScope:Scope;
    isClosed:boolean;
    isRunning:boolean;
    listScopes:Scope[];
    getScopeByArgs(scope: Scope|undefined):Scope;
    newScope():Scope;
    run():void;
    close():Promise<void>;
}

export interface ScopesQueueClass
{
    Scope:ScopeClass;
    new():ScopesQueue;
}
