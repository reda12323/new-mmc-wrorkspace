const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
      uid: { 
        type: String, 
        required: false, 
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    }, 
    Name: {
        type: String,
        required: true
    },
    departments: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model("Employee", EmployeeSchema);