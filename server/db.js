import mongoose from "mongoose";

/**
 * Establishes a single persistent connection to MongoDB.
 * The process exits if the connection fails.
 */
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
