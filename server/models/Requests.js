const moongose = require("mongoose");
const bycrypt = require("bcryptjs");

const RequestsSchema = new moongose.Schema({
    senderEmail: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    receiverEmail: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantRole: {
        type: String,
        required: true
    },
    applicantDepartment: {
        type: String,
        required: true
    },
    requestCategory: {
        type: String,
        required: true
    },
    requestTitle: {
        type: String,
        required: true
    },
    requestDescription: {
        type: String,
        required: true
    },
    requestCurrency: {
        type: String,
        required: false,
    },
    requestAmount: {
        type: Number,
        required: false,
    },
    Attachment: {
        type: String,
        required: false,
    },
    requestStatus: {
        type: String,
        enum: ["Delivered","Pending", "Approved", "Rejected"],
        default: "Delivered"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Requests = moongose.model("Requests", RequestsSchema);