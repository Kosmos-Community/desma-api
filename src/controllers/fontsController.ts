import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Fonts } from '../models/fontsModel';

export const getFonts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fonts = await Fonts.findById(id);
    if (fonts) {
      return res.status(200).json({ data: fonts });
    } else {
      return res.status(404).json({ message: 'No fonts found' });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid fonts id syntax' });
    }
  }
};

export const createFonts = async (req: Request, res: Response) => {
  const { headingFontName, parragraphFontName, baseSize, scaleFactor } =
    req.body;

  const fonts = await Fonts.create({
    headingFontName: headingFontName,
    parragraphFontName: parragraphFontName,
    baseSize: baseSize,
    scaleFactor: scaleFactor,
  });

  if (fonts) {
    return res
      .status(201)
      .json({ message: 'Fonts created successfully', data: fonts });
  } else {
    return res.status(400).json({ message: 'Invalid fonts data' });
  }
};

export const updateFonts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { headingFontName, parragraphFontName, baseSize, scaleFactor } =
      req.body;

    const updateFonts = await Fonts.findByIdAndUpdate(id, {
      headingFontName: headingFontName,
      parragraphFontName: parragraphFontName,
      baseSize: baseSize,
      scaleFactor: scaleFactor,
    });

    if (updateFonts) {
      return res
        .status(200)
        .json({ message: 'Fonts updated successfully', data: updateFonts });
    } else {
      return res.status(404).json({ message: 'Fonts not found' });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid fonts id syntax or fonts not found' });
    }
  }
};
