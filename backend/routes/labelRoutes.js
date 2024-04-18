const express = require("express");
const router = express.Router();
const Label = require("../models/labelModel");
const User = require("../models/userModel");
let buttonIsClicked = false;

// Trigger route for CPEE
router.post("/test1", async (req, res) => {
  try {
    // Set the buttonIsClicked variable to true
    buttonIsClicked = true;
    // Send a response indicating successful recording of button click
    res.status(200).send("User clicked label save");
  } catch (error) {
    console.error("Error recording label save:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Trigger route for CPEE
router.post("/triggerTest1", async (req, res) => {
  // Variable to store the button toggle status
  let buttonClickToggle;

  // Check if the  button is clicked
  if (buttonIsClicked) {
    // If clicked, set toggle to true
    buttonClickToggle = true;
    try {
      res.status(200).send(buttonClickToggle);
    } catch (error) {
      console.error("Error saving label:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If not clicked, set toggle to false
    buttonClickToggle = false;
    res.status(200).send(buttonClickToggle);
  }
});

// Save a new label
router.post("/save", async (req, res) => {
  try {
    // Extract label details from request body
    let {
      userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    } = req.body;

    // Check if userId is undefined
    if (userId === undefined) {
      // Assign default values for each attribute
      userId = "65ad315059baf730b299befe"; // Assign a default value for userId
      name = "default labek"; // Assign a default value for name
      // Assign default values for other attributes
      text = "";
      fontStyle = "Arial";
      fontSize = 30;
      isBold = false;
      isItalic = false;
      isUnderline = false;
      textAlignment = "center";
      verticalAlignment = "middle";
      isQRCodeUsed = false;
      url = "";
      shortenedUrl = "";
      createdAt = Date.now();
    }
    // Create a new label instance
    const label = new Label({
      user: userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    });

    // Save the label
    await label.save();

    // Add the label to the user's labels array
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { labels: label._id } });
    }
    //    res.status(201).json({ message: "Label saved successfully" });
    let isSaved = true;
    res.status(200).send(isSaved);
  } catch (error) {
    console.error("Error saving label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve labels for a specific user
router.get("/allLabelsOfUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user and populate the 'labels' field to get the full label documents
    const user = await User.findById(userId).populate("labels");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
      // If user not found, return 404 error
    }

    // Filter labels to get only the ones associated with the user

    const userLabels = user.labels.filter(
      (label) => label.user.toString() === userId
    );

    res.status(200).json(user.labels);
  } catch (error) {
    console.error("Error retrieving labels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a label
router.delete("/:labelId", async (req, res) => {
  try {
    const labelId = req.params.labelId;
    if (labelId === undefined) {
      res.status(200).json({ message: "No label to delete" });
    } else {
      // Remove the label from the user's labels array
      await User.findOneAndUpdate(
        { labels: labelId },
        { $pull: { labels: labelId } }
      );

      // Remove the label from the labels collection
      await Label.findByIdAndDelete(labelId);

      res.status(200).json({ message: "Label deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/save-query", async (req, res) => {
  try {
    // Extract label details from query parameters
    let {
      userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    } = req.query;

    // Check if userId is undefined
    if (!userId) {
      // Assign default values for each attribute
      userId = "65ad315059baf730b299befe"; // Assign a default value for userId
      name = "default label"; // Assign a default value for name
      // Assign default values for other attributes
      text = "";
      fontStyle = "Arial";
      fontSize = 30;
      isBold = false;
      isItalic = false;
      isUnderline = false;
      textAlignment = "center";
      verticalAlignment = "middle";
      isQRCodeUsed = false;
      url = "";
      shortenedUrl = "";
      createdAt = Date.now();
    }

    // Create a new label instance
    const label = new Label({
      user: userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    });

    // Save the label
    await label.save();

    // Add the label to the user's labels array
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { labels: label._id } });
    }

    res.status(200).json({ message: "Label saved successfully" });
  } catch (error) {
    console.error("Error saving label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteLabel/:labelId", async (req, res) => {
  try {
    const labelId = req.params.labelId;

    if (!labelId) {
      return res.status(400).json({ error: "No labelId provided" });
    }

    // Remove the label from the user's labels array
    await User.updateMany({}, { $pull: { labels: labelId } });

    // Remove the label from the labels collection
    await Label.findByIdAndDelete(labelId);

    res.status(200).json({ message: "Label deleted successfully" });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getInfoOfLabel/:labelId", async (req, res) => {
  try {
    const labelId = req.params.labelId;

    // Find the label by its ID
    const label = await Label.findById(labelId);

    if (!label) {
      return res.status(404).json({ error: "Label not found" });
      // If label not found, return 404 error
    }

    // Return the label details
    res.status(200).json(label);
  } catch (error) {
    console.error("Error retrieving label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/labelWithUrl/:url", async (req, res) => {
  try {
    const url = req.params.url;

    // Find labels with the specified URL
    const labels = await Label.find({ url });

    if (!labels || labels.length === 0) {
      return res
        .status(404)
        .json({ error: "No labels found with the specified URL" });
    }

    // Extract the required information for each label
    const labelsInfo = labels.map((label) => ({
      id: label._id,
      userId: label.user,
      createdAt: label.createdAt,
    }));

    // Return the labels information
    res.status(200).json(labelsInfo);
  } catch (error) {
    console.error("Error retrieving labels by URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/allLabelsWithUrl", async (req, res) => {
  try {
    // Find all labels
    const labels = await Label.find();

    if (!labels || labels.length === 0) {
      return res.status(404).json({ error: "No labels found" });
    }

    // Extract the required information for each label
    const labelsInfo = labels.map((label) => ({
      id: label._id,
      userId: label.user,
      createdAt: label.createdAt,
    }));

    // Return the labels information
    res.status(200).json(labelsInfo);
  } catch (error) {
    console.error("Error retrieving all labels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateUserOfLabel/:labelId/:newUserId", async (req, res) => {
  try {
    const labelId = req.params.labelId;
    const newUserId = req.params.newUserId;

    // Check if labelId and newUserId are provided
    if (!labelId || !newUserId) {
      return res
        .status(400)
        .json({ error: "LabelId or newUserId not provided" });
    }

    // Find the label by ID
    const label = await Label.findById(labelId);

    // Check if label exists
    if (!label) {
      return res.status(404).json({ error: "Label not found" });
    }

    // Find the user by ID
    const user = await User.findById(newUserId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user of the label
    label.user = newUserId;
    await label.save();

    res
      .status(200)
      .json({ message: "Label user updated successfully", newUserId });
  } catch (error) {
    console.error("Error updating label user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
