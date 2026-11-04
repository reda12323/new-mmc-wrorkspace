const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

// Key must come from the SAME Firebase project as your frontend.
// "../" = server root. If you keep the key inside config/, use "./" instead.
const serviceAccount = require("../serviceAccountKey.json");

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}

// Keeps the controller's admin.auth().verifyIdToken(...) working unchanged
module.exports = { auth: () => getAuth() };