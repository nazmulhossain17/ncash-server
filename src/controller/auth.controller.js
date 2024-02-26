const bcrypt = require('bcryptjs');
const prisma = require('../../prisma');
const jwt = require("jsonwebtoken");
const { jwtKey } = require('../helper');

const registerUser = async (req, res) => {
    try {
        const { name, pin, mobile, email, accountType, nid } = req.body;

        // Check if the required fields are present in req.body
        if (!name || !pin || !mobile || !email || !accountType || !nid) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ mobile }, { email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Validate pin to be exactly 5 digits
        if (!(/^\d{5}$/.test(pin))) {
            return res.status(400).json({ msg: 'PIN must be a 5-digit number' });
        }

        // Hash the pin before storing it in the database
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                pin: hashedPin,
                mobile,
                email,
                accountType,
                nid
            }
        });

        // Send response with required fields including balance
        res.status(201).json({
            msg: 'User registered successfully',
            user: {
                name: newUser.name,
                mobile: newUser.mobile,
                email: newUser.email,
                accountType: newUser.accountType,
                balance: newUser.balance
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { mobile, pin } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { mobile } });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(pin, user.pin);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }


        // Fetch the admin ID
        // const admin = await prisma.admin.findUnique({ where: { id: _id } });

        // Check if admin is null before accessing its id property
  
const token = jwt.sign({ user }, jwtKey, { expiresIn: "1h" });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); 
        // Send the user object in the response
        res.json({
            user: {
                id: user.id,
                role: 'user',
                mobile: user.mobile,
                email: user.email,
                accountType: user.accountType,
                // adminId: admin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}
// const sendMoney = async (req, res) => {
//     try {
//         const { senderId, receiverMobile, amount, pin } = req.body;

//         // Check if the required fields are present in req.body
//         if (!senderId || !receiverMobile || !amount || !pin) {
//             return res.status(400).json({ msg: 'Missing required fields' });
//         }

//         // Find the sender user
//         const sender = await prisma.user.findUnique({ where: { id: senderId } });

//         // Verify the sender's pin
//         const isPinValid = await bcrypt.compare(pin, sender.pin);
//         if (!isPinValid) {
//             return res.status(401).json({ msg: 'Invalid PIN' });
//         }

//         // Check if the sender has sufficient balance
//         if (sender.balance < amount) {
//             return res.status(400).json({ msg: 'Insufficient balance' });
//         }

//         // Calculate the send-money fee
//         let fee = 0;
//         if (amount > 100) {
//             fee = 5;
//         }

//         // Deduct the amount and fee from the sender's balance
//         const updatedSender = await prisma.user.update({
//             where: { id: senderId },
//             data: { balance: sender.balance - amount - fee }
//         });

//         // Find the receiver user
//         const receiver = await prisma.user.findUnique({ where: { mobile: receiverMobile } });

//         // If receiver doesn't exist, return error
//         if (!receiver) {
//             return res.status(404).json({ msg: 'Receiver not found' });
//         }

//         // Update the receiver's balance
//         const updatedReceiver = await prisma.user.update({
//             where: { mobile: receiverMobile },
//             data: { balance: receiver.balance + amount }
//         });

//         // Create a transaction record
//         const transaction = await prisma.transaction.create({
//             data: {
//                 senderId,
//                 receiverId: receiver.id,
//                 amount,
//                 fee
//             }
//         });

        // Update admin's balance
        // const admin = await prisma.admin.update({
        //     where: { id: 'admin_id' }, // You need to replace 'admin_id' with the actual admin id
        //     data: { balance: { increment: fee } }
        // });

        // Send response with updated balances
//         res.status(200).json({
//             msg: 'Money sent successfully',
//             sender: {
//                 id: updatedSender.id,
//                 name: updatedSender.name,
//                 balance: updatedSender.balance
//             },
//             receiver: {
//                 id: updatedReceiver.id,
//                 name: updatedReceiver.name,
//                 balance: updatedReceiver.balance
//             },
//             transaction
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };


const sendMoney = async (req, res) => {
    try {
        const { senderId, receiverMobile, amount } = req.body;

        // Check if the required fields are present in req.body
        if (!senderId || !receiverMobile || !amount) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        // Find the sender user
        const sender = await prisma.user.findUnique({ where: { id: senderId } });

        // Check if sender exists
        if (!sender) {
            return res.status(404).json({ msg: 'Sender not found' });
        }

        // Calculate the send-money fee
        let fee = 0;
        if (amount > 100) {
            fee = 5;
        }

        // Deduct the amount and fee from the sender's balance
        const updatedSender = await prisma.user.update({
            where: { id: senderId },
            data: { balance: parseInt(sender.balance - amount - fee) }
        });

        // Find the receiver user
        const receiver = await prisma.user.findUnique({ where: { mobile: receiverMobile } });

        // If receiver doesn't exist, return error
        if (!receiver) {
            return res.status(404).json({ msg: 'Receiver not found' });
        }

        // Update the receiver's balance
        const updatedReceiver = await prisma.user.update({
            where: { mobile: receiverMobile },
            data: { balance: parseInt(receiver.balance + amount) }
        });

        // Create a transaction record
        const transaction = await prisma.transaction.create({
            data: {
                senderId,
                receiverId: receiver.id,
                amount,
                fee
            }
        });

        // Send response with updated balances
        res.status(200).json({
            msg: 'Money sent successfully',
            sender: {
                id: updatedSender.id,
                name: updatedSender.name,
                balance: updatedSender.balance
            },
            receiver: {
                id: updatedReceiver.id,
                name: updatedReceiver.name,
                balance: updatedReceiver.balance
            },
            transaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

  module.exports = { registerUser,loginUser, sendMoney };