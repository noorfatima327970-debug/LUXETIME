import app from "../app.js";
import connectDB from "../config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("Serverless API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to the database.",
    });
  }
}