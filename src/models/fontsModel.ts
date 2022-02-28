import mongoose from 'mongoose';

const fontsSchema = new mongoose.Schema(
  {
    headingFontName: { type: String, required: true },
    parragraphFontName: { type: String, required: true },
    baseSize: { type: Number, required: true },
    scaleFactor: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Fonts = mongoose.model('Fonts', fontsSchema);
