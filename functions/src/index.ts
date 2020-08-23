import * as functions from "firebase-functions";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as admin from "firebase-admin";
admin.initializeApp();

const app = express();

interface MondayToken {
  userId: string;
  accountId: string;
  backToUrl: string;
}
function isMondayToken(object: any): object is MondayToken {
  return "backToUrl" in object;
}

export function saveMondayToken(token: MondayToken) {
  return admin.firestore().doc("/backToUrl").create(token);
}
export function verifyAndExtractMondayToken(token: any) {
  if (typeof token === "string") {
    const verifiedToken = jwt.verify(
      token,
      functions.config().monday_acuity.signature
    );
    if (isMondayToken(verifiedToken)) {
      return Promise.resolve(verifiedToken);
    } else {
      return Promise.reject(
        `not a valid monday token ${JSON.stringify(verifiedToken)}`
      );
    }
  } else {
    return Promise.reject("token is not supplied or not a string");
  }
}
app.get("/", (req, res) => {
  const token = req.query.token;

  return verifyMondayToken(token).then(() => {
    res.redirect("/auth.html");
  });
});

app.get("/timestamp", (req, res) => {
  res.send(`${new Date()}`);
});

app.post("/subscribe", (req, res) => {
  res.sendStatus(200);
});

app.post("/unsubscribe", (req, res) => {
  res.sendStatus(200);
});

app.get("/acuity-oauth2-callback", (req, res) => {
  res.send("Hello");
});

export const server = functions.https.onRequest(app);
