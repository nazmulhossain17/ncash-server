const express = require("express");
const { registerUser, loginUser } = require("../controller/auth.controller");

const authRoute = express.Router();

authRoute.get("/", (req, res)=>{
    res.send("working")
})

authRoute.post("/create-user", registerUser)
authRoute.post("/login-user", loginUser)

module.exports = authRoute;