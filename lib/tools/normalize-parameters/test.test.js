import {describe, test, expect, vi} from "vitest";
const normalizeParameters = require(".");

describe("normalize parameters tests", () =>
{
	test("should normalize parameters: ", ()=>
	{
		const normalized = normalizeParameters({
			"@with": "value1",
			whit_out: "value2"
		});
		
		expect(normalized).toEqual({ '@with': 'value1', '@whit_out': 'value2' });
	});
});
