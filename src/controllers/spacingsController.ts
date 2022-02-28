import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Spacings } from '../models/spacingsModel';

export const getSpacings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const spacings = await Spacings.findById(id);

    if (!spacings) {
      return res.status(404).json({ message: 'No spacings found' });
    }

    res.status(200).json({ data: spacings });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid spacings id syntax' });
    }
    next(error);
  }
};

export const createSpacings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { baseSize, scaleFactor } = req.body;

    const spacings = await Spacings.create({
      baseSize: baseSize,
      scaleFactor: scaleFactor,
    });

    if (!spacings) {
      return res.status(400).json({ message: 'Invalid spacings data' });
    }

    res
      .status(201)
      .json({ message: 'Spacings created successfully', data: spacings });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updateSpacings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { baseSize, scaleFactor } = req.body;

    const updatedSpacings = await Spacings.findByIdAndUpdate(
      id,
      {
        baseSize: baseSize,
        scaleFactor: scaleFactor,
      },
      { new: true }
    );

    if (!updatedSpacings) {
      return res.status(404).json({ message: 'Spacings not found' });
    }

    res.status(200).json({
      message: 'Spacings updated successfully',
      data: updatedSpacings,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      console.log(error);
      return res
        .status(400)
        .json({ message: 'Invalid spacings id or fields syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteSpacings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedSpacings = await Spacings.deleteOne({ _id: id });

    if (deletedSpacings.deletedCount < 1) {
      return res.status(404).json({ message: 'Spacings not found' });
    }

    res.status(200).json({
      message: 'Spacings deleted successfully',
      data: deletedSpacings,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid spacings id syntax or spacings not found' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
