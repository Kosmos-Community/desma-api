import mongoose from 'mongoose';


const paletteSchema = new mongoose.Schema(
  {
    primaryColor: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Color' 
    }],
    secondaryColor: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Color' 
    }],
    textColor: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Color' 
    }],
    backgroundColors: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Color' 
    }],
    extraColors: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Color' 
    }],
  },
  {
    timestamps: true
  }
);

export const Palette = mongoose.model('Palette', paletteSchema);