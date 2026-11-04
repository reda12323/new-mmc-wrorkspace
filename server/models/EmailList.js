const mongoose = require("mongoose");

const EmailListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    // Without these two fields Mongoose silently ignores them on save
    uid: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// 3rd argument = the EXACT collection name in Atlas.
// Change "emaillist" if your collection is named differently.
module.exports = mongoose.model("EmailList", EmailListSchema, "emaillist");