require("dotenv").config();
const jwtKey = process.env.JWT_SECRET;

module.exports = {jwtKey}