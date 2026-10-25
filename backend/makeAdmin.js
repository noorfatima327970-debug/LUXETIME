import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error(
    'Usage: node makeAdmin.js "your-registered-email@example.com"'
  );
  process.exit(1);
}

await connectDB();

try {
  const user = await User.findOne({ email });

  if (!user) {
    console.error("User not found. Signup first.");
    process.exitCode = 1;
  } else {
    user.role = "admin";
    await user.save();

    console.log(`✅ Admin access granted to ${email}`);
    console.log("Logout and login again to refresh your session.");
  }
} catch (error) {
  console.error("Unable to grant admin access:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}