import mongoose from 'mongoose';

const spacingsSchema = new mongoose.Schema(
  {
    baseSize: { type: Number, required: true },
    scaleFactor: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Spacings = mongoose.model('Spacings', spacingsSchema);
