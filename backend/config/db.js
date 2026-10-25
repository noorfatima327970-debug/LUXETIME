import mongoose from "mongoose";
import dns from "node:dns";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing.");
    }

    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log(
          `✅ MongoDB Connected: ${mongooseInstance.connection.host}`
        );

        return mongooseInstance.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;