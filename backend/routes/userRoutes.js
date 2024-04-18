const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Variable to store if user is logged in
let isLoggedIn = false;

// Route to get all users
router.get("/getUsers", async (req, res) => {
  try {
    // Retrieve all users from the database
    const result = await User.find({});
    // Send the users as a JSON response
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    // Extract user details from request body
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If email is already registered, send an error response
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Trigger route for CPEE
router.post("/test1", async (req, res) => {
  try {
    // Set the buttonIsClicked variable to true
    isLoggedIn = true;
    // Send a response indicating successful recording of button click
    res.status(200).send("User logged in");
  } catch (error) {
    console.error("Error recording user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Trigger route for CPEE
router.post("/triggerTest1", async (req, res) => {
  // Variable to store the button toggle status
  let loggedInToggle;

  // Check if the  button is clicked
  if (isLoggedIn) {
    // If clicked, set toggle to true
    loggedInToggle = true;
    try {
      res.status(200).send(loggedInToggle);
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If not clicked, set toggle to false
    loggedInToggle = false;
    res.status(200).send(loggedInToggle);
  }
});

// Route to authenticate a user
router.post("/login", async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, send a success response
        res.status(200).json({ message: "Login successful", user });
      } else {
        // Passwords do not match, send an error response
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      // If user does not exist, send an error response
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register-query", async (req, res) => {
  try {
    // Extract user details from query parameters
    const { name, email, password } = req.query;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If email is already registered, send an error response
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/login-query", async (req, res) => {
  try {
    // Extract email and password from query parameters
    const { email, password } = req.query;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, send a success response
        res.status(200).json({ message: "Login successful", user });
      } else {
        // Passwords do not match, send an error response
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      // If user does not exist, send an error response
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getInfoOfUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user information
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getInfoOfAllUsers", async (req, res) => {
  try {
    // Find all users
    const users = await User.find();

    // Return all users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllUserEmails", async (req, res) => {
  try {
    // Find all users
    const users = await User.find();

    // Extract emails from users
    const emails = users.map((user) => user.email);

    // Return all emails
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error retrieving emails:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    // Remove the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
