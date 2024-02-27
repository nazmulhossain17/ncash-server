const express = require("express");
const { createAdmin } = require("../controller/admin.controller");

const adminRoute = express.Router();


adminRoute.post('/create-admin', createAdmin);


module.exports = adminRoute