import mongoose from "mongoose";

const DB = process.env.MONGO_LOCAL_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
    });
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
