const express = require("express");
const router = express.Router();
const { User, Contact, SpamReport } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// Helper function to authenticate users
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  // console.log("Token:", token);
  if (!token) {
    return res.status(403).send("Forbidden");
  }
  jwt.verify(token.split(" ")[1], "your_jwt_secret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register user
router.post("/register", async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Phone number already registered." });
    const user = await User.create({ name, phoneNumber, email, password });
    // Automatically create a contact for the registered user
    await Contact.create({
      name: user.name,
      phoneNumber: user.phoneNumber,
      userId: user.id, // Reference the user ID
      isSpam: false, // Set isSpam to false by default
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Search contacts
router.get("/search", authenticate, async (req, res) => {
  const { name, phoneNumber } = req.query; // Retrieve name or phoneNumber from query parameters

  try {
    // Build a dynamic 'where' condition based on the provided parameters
    const whereCondition = { userId: req.user.id }; // Start with userId filter

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` }; // Add name condition if provided
    }

    if (phoneNumber) {
      whereCondition.phoneNumber = { [Op.like]: `%${phoneNumber}%` }; // Add phoneNumber condition if provided
    }

    const contacts = await Contact.findAll({
      where: whereCondition, // Use dynamic condition
    });

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// Report spam
router.post("/report-spam", authenticate, async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    // Create a new spam report
    await SpamReport.create({
      phoneNumber,
      reportedBy: req.user.id,
    });

    // Mark the corresponding contacts as spam
    await Contact.update({ isSpam: true }, { where: { phoneNumber } });

    res.status(201).json({ message: "Spam reported successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Create Contact
router.post("/contacts", authenticate, async (req, res) => {
  console.log("User ID:", req.user.id);
  try {
    const { name, phoneNumber } = req.body;
    const userId = req.user.id;

    const newContact = await Contact.create({ name, phoneNumber, userId });
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

//Get Contacts
router.get("/contacts", authenticate, async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.user.id }, // Only fetch the authenticated user's contacts
    });

    res.json(
      contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        isSpam: contact.isSpam, // Include spam status
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

module.exports = router;
