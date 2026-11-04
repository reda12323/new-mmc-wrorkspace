const admin = require("../config/firebaseAdmin");
const EmailList = require("../models/EmailList");

// POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    // 1) Get the Google login proof (token) sent by the frontend
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "missing-token" });

    // 2) Firebase tells us which Google email this really is
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    if (!email || !decoded.email_verified) {
      return res.status(403).json({ error: "not-authorized" });
    }

    // 3) Is that email in the list?
    const entry = await EmailList.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

    // Shows in your terminal: which email, which database/collection, found or not
    console.log(
      `Login: ${email} | db: ${EmailList.db.name} | collection: ${EmailList.collection.name} | found: ${!!entry}`
    );

    if (!entry) return res.status(403).json({ error: "not-authorized" });

    return res.json({ authorized: true, email });
  } catch (err) {
    console.error("googleLogin error:", err.message);
    const status = err.code?.startsWith("auth/") ? 401 : 500;
    return res.status(status).json({ error: "login-failed" });
  }
};