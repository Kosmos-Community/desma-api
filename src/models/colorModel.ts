import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    type: {type: String, required: true},
    hexCode: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

export const Color = mongoose.model('Color', colorSchema);