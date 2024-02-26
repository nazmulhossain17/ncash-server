const express = require("express");
const { registerUser, loginUser, sendMoney, registerAgent, loginAgent } = require("../controller/auth.controller");
const prisma = require("../../prisma");

const authRoute = express.Router();

authRoute.get("/", (req, res)=>{
    res.send("working")
})

authRoute.post("/create-user", registerUser)
authRoute.post("/create-agent", registerAgent)
authRoute.post("/login-agent", loginAgent)
authRoute.post("/login-user", loginUser)
authRoute.post("/send-money", sendMoney)





// const isAdminAuthenticated = (req, res, next) => {
//     // Assuming admin authentication is implemented and adminId is set in the request
//     const adminId = req.adminId;
//     if (!adminId) {
//       return res.status(401).json({ msg: 'Admin authentication failed' });
//     }
//     next();
//   };





// Get all users
// authRoute.get('/users', async (req, res) => {
//     try {
//       const users = await prisma.user.findMany();
//       res.status(200).json(users);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
  
//   // Get all agents
//   authRoute.get('/agents', async (req, res) => {
//     try {
//       const agents = await prisma.agent.findMany();
//       res.status(200).json(agents);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
  
//   // Get transactions by user or agent id
//   authRoute.get('/transactions/:id', async (req, res) => {
//     try {
//       const id = req.params.id;
//       const transactions = await prisma.transaction.findMany({
//         where: {
//           OR: [
//             { senderId: id },
//             { receiverId: id }
//           ]
//         }
//       });
//       res.status(200).json(transactions);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
  
//   // Approve agent request
//   authRoute.post('/approve-agent/:id', async (req, res) => {
//     try {
//       const agentId = req.params.id;
//       const agent = await prisma.agent.update({
//         where: { id: agentId },
//         data: { approved: true } // Assuming there's a boolean field 'approved' in Agent model
//       });
//       res.status(200).json({ msg: 'Agent approved successfully', agent });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
  
//   // Block user or agent
//   authRoute.post('/block/:type/:id', async (req, res) => {
//     try {
//       const { type, id } = req.params;
//       const model = type === 'user' ? prisma.user : prisma.agent;
//       await model.update({
//         where: { id: id },
//         data: { blocked: true } // Assuming there's a boolean field 'blocked' in User/Agent model
//       });
//       res.status(200).json({ msg: `${type} blocked successfully` });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
module.exports = authRoute;