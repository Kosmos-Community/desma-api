import mongoose from 'mongoose';
const referrenceValidator = require('mongoose-referrence-validator');

const designSystemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    paletteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Palette',
      required: true,
    },
    fontsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fonts',
      required: true,
    },
    spacingsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spacings',
      required: true,
    },
    isPublic: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

designSystemSchema.plugin(referrenceValidator);

export const DesignSystem = mongoose.model('DesignSystem', designSystemSchema);
