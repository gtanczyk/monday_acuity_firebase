// import * as test from "firebase-functions-test";
const test = require("firebase-functions-test")();
import * as sinon from "sinon";
import * as admin from "firebase-admin";
import * as jwt from "jsonwebtoken";
import * as expect from "expect";

// test({ monday_acuity: { signature: "123" } })
test.mockConfig({ monday_acuity: { signature: "sign" } });
const adminInitStub = sinon.stub(admin, "initializeApp");

const myFunctions = require("../index"); // relative path to functions code

describe("verifyAndExtractMondayToken", function () {
  it("should be able to extract information from monday token", async function () {
    const payload = { userId: "123", accountId: "123", backToUrl: "someurl" };
    const token = jwt.sign(payload, "sign");
    const extractedToken = await myFunctions.verifyAndExtractMondayToken(token);

    // token has extra iat which we will just ignore
    expect(extractedToken).toMatchObject(payload);
  });
});
