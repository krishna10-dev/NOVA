const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    isConnected = false;

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDatabase;