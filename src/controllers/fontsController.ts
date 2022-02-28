import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Fonts } from '../models/fontsModel';

export const getFonts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fonts = await Fonts.findById(id);

    if (!fonts) {
      return res.status(404).json({ message: 'No fonts found' });
    }

    res.status(200).json({ data: fonts });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid fonts id syntax' });
    }
    next(error);
  }
};

export const createFonts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { headingFontName, parragraphFontName, baseSize, scaleFactor } =
      req.body;

    const fonts = await Fonts.create({
      headingFontName: headingFontName,
      parragraphFontName: parragraphFontName,
      baseSize: baseSize,
      scaleFactor: scaleFactor,
    });

    if (!fonts) {
      return res.status(400).json({ message: 'Invalid fonts data' });
    }

    res
      .status(201)
      .json({ message: 'Fonts created successfully', data: fonts });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updateFonts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { headingFontName, parragraphFontName, baseSize, scaleFactor } =
      req.body;

    const updatedFonts = await Fonts.findByIdAndUpdate(
      id,
      {
        headingFontName: headingFontName,
        parragraphFontName: parragraphFontName,
        baseSize: baseSize,
        scaleFactor: scaleFactor,
      },
      { new: true }
    );

    if (!updatedFonts) {
      return res.status(404).json({ message: 'Fonts not found' });
    }

    res
      .status(200)
      .json({ message: 'Fonts updated successfully', data: updatedFonts });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid fonts id or fields syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteFonts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedFonts = await Fonts.deleteOne({ _id: id });

    if (deletedFonts.deletedCount < 1) {
      return res.status(404).json({ message: 'Fonts not found' });
    }

    res
      .status(200)
      .json({ message: 'Fonts deleted successfully', data: deletedFonts });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid fonts id syntax or fonts not found' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
