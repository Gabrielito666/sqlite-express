
import {describe, test, expect, afterAll} from "vitest";
const pathOrSQL = require(".");
const fs = require("fs");
const path = require("path");

const tempFilepath = path.resolve(process.cwd(), "temp-path-or-sql-file.sql");
const tempContent = "SELECT * FROM USERS";

afterAll(() => fs.rmSync(tempFilepath));
fs.writeFileSync(tempFilepath, tempContent, "utf-8");

describe("path or sql tests", ()=>
{
	test("should recognize:", () =>
	{
		expect(pathOrSQL(tempFilepath)).toBe(tempContent);
		expect(pathOrSQL(tempContent)).toBe(tempContent);
	});
});
