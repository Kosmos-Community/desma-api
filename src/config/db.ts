const mongoose = require('mongoose');

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI!,
      {
        useCreateIndex: true,
        newUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log(`MongoDB Connected to: ${process.env.MONGO_URI!}`);
      }
    );
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
