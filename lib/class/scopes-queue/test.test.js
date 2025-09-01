import { describe, test, expect } from "vitest";
const ScopesQueue = require("./index.js");

describe("ScopesQueue tests", () =>
{
	test("should create and await scopes", async() =>
	{
		const scopesQueue = new ScopesQueue();
		const firstComunityScope = scopesQueue.communityScope;
		const scope1 = scopesQueue.newScope();
	


		await new Promise(r => setTimeout(r, 200));

		//end al comunity y push el user y nuevo comunity scope, en run() se shift el primero
		expect(scopesQueue.listScopes.length).toBe(1);
		expect(firstComunityScope).not.toBe(scopesQueue.communityScope);

		const scope2 = scopesQueue.newScope();
		//el uno no ha terminado y se añaden 2
		expect(scopesQueue.listScopes.length).toBe(3);

		scope2.end();
		await new Promise(r => setTimeout(r, 200));
		expect(scopesQueue.listScopes).toContain(scope2);
		
		scope1.end();
		await new Promise(r => setTimeout(r, 200));
		expect(scopesQueue.listScopes.length).toBe(0);
	});
});
