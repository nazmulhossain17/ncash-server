// const isAdminAuthenticated = (req, res, next) => {
//         // Assuming admin authentication is implemented and adminId is set in the request
//         const adminId = req.adminId;
//         if (!adminId) {
//           return res.status(401).json({ msg: 'Admin authentication failed' });
//         }
//         next();
//       };

const prisma = require("../../prisma");
const bcrypt = require("bcryptjs")
    

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

module.exports = {createAdmin}