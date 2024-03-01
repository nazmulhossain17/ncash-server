const express = require("express");
const { createAdmin, loginAdmin } = require("../controller/admin.controller");

const adminRoute = express.Router();


adminRoute.post('/create-admin', createAdmin);
adminRoute.post('/login', loginAdmin);


module.exports = adminRoute