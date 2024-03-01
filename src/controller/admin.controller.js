const prisma = require("../../prisma");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");    
const { jwtKey } = require("../helper");

const createAdmin = async (req, res) => {
    const { name, mobile, email, pin, nid } = req.body;
    try {
        if (!name || !pin || !mobile || !email || !nid) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }
        if (!(/^\d{5}$/.test(pin))) {
            return res.status(400).json({ msg: 'PIN must be a 5-digit number' });
        }

        // Hash the pin before storing it in the database
        const hashedPin = await bcrypt.hash(pin, 10);
      const newAdmin = await prisma.admin.create({
        data: {
          name,
          mobile,
          email,
          isAdmin: true,
          pin: hashedPin,
          nid
        }
      });
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
};


const loginAdmin = async (req, res) => {
    const { mobile, pin } = req.body;
    try {
        const user = await prisma.admin.findUnique({ where: { mobile } });

        if (!user) {
            return res.status(404).json({ msg: 'Admin not found' });
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
                mobile: user.mobile,
                email: user.email,
                // adminId: admin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {createAdmin, loginAdmin}