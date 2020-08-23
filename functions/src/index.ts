import * as functions from "firebase-functions";
import * as express from "express";
import * as jwt from "jsonwebtoken";

const app = express();

interface MondayToken {
  userId: string;
  accountId: string;
  backToUrl: string;
}
function isMondayToken(object: any): object is MondayToken {
  return "backToUrl" in object;
}

app.get("/", (req, res) => {
  const token = req.query.token;
  if (typeof token === "string") {
    const verifiedToken = jwt.verify(
      token,
      functions.config().monday_acuity.signature
    );
    if (isMondayToken(verifiedToken)) {
      const { userId, accountId, backToUrl } = verifiedToken;
      console.log({ userId, accountId, backToUrl });
    }
  }
  res.redirect("/auth.html");
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
