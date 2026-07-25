import mongoose from "mongoose";

let gridFsBucket;

/**
 * Connects to MongoDB and initializes a GridFS bucket
 * (named "uploads") used to store image/video binary data.
 */
export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: "uploads",
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

/**
 * Returns the initialized GridFS bucket. Call connectDB() first.
 */
export const getBucket = () => {
  if (!gridFsBucket) {
    throw new Error("GridFS bucket not initialized — call connectDB() first");
  }
  return gridFsBucket;
};
