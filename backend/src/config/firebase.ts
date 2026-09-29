import admin from "firebase-admin";

import { env } from "./env.js";

const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const privateKey = env.FIREBASE_PRIVATE_KEY;
const hasFirebaseCredentials =
  Boolean(projectId) &&
  Boolean(clientEmail) &&
  Boolean(privateKey) &&
  privateKey.includes("BEGIN PRIVATE KEY") &&
  privateKey.includes("END PRIVATE KEY");

if (hasFirebaseCredentials && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;
