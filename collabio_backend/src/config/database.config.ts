import mongoose from "mongoose";
import { config } from "./app.config";

let connectPromise: Promise<void> | null = null;

const connectDatabase = async (): Promise<void> => {
  // 1 = connected
  if (mongoose.connection.readyState === 1) return;

  if (!connectPromise) {
    connectPromise = mongoose
      .connect(config.MONGO_URI)
      .then(() => {
        console.log("Connected to Mongo database");
      })
      .catch((error) => {
        console.log("Error connecting to Mongo database", error);
        connectPromise = null;
        throw error;
      });
  }

  await connectPromise;
};

export default connectDatabase;

