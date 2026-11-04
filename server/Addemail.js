// HOW TO USE
// 1) Write the email(s) you want to allow in the list below
// 2) In the terminal, inside the server folder, run:  node addEmail.js

const EMAILS = [
  "bounnoureda@gmail.com", // <- put your email here (add more lines with commas)
];

// ---- you don't need to touch anything below ----
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const EmailList = require("./models/EmailList");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(
    `Connected. Database: ${mongoose.connection.name} | Collection: ${EmailList.collection.name}`
  );

  for (const raw of EMAILS) {
    const email = raw.toLowerCase().trim();
    const name = email.split("@")[0];

    // Add the email only if it is not already in the list
    const result = await EmailList.updateOne(
      { email },
      { $setOnInsert: { email, name } },
      { upsert: true }
    );

    console.log(
      result.upsertedCount ? `Added: ${email}` : `Already in the list: ${email}`
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});