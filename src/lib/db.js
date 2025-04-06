import mongoos from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoos.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error", error);
  }
};
