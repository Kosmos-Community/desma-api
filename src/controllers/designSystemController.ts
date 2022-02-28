import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { DesignSystem } from '../models/designSystemModel';

export const getUserDesignSystems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.params;
    const designSystems = await DesignSystem.find({ userId: userId });

    if (designSystems.length < 1) {
      return res.status(200).json({ message: 'No design systems found' });
    }

    res.status(200).json({ data: designSystems });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid fonts id syntax' });
    }
    next(error);
  }
};

export const getDesignSystems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const designSystems = await DesignSystem.find(
      { isPublic: true },
      {
        _id: true,
        name: true,
        paletteId: true,
        fontsId: true,
        spacingsId: true,
      }
    );

    if (designSystems.length < 1) {
      return res.status(200).json({ message: 'No design systems found' });
    }

    res.status(200).json({ data: designSystems });
  } catch (error) {
    next(error);
  }
};

export const getDesignSystemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const designSystem = await DesignSystem.findById(id);
    if (!designSystem) {
      return res.status(404).json({ message: 'No design system found' });
    }
    res.status(200).json({ data: designSystem });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid design system id syntax' });
    }
    next(error);
  }
};

export const createDesignSystem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, name, paletteId, fontsId, spacingsId, isPublic } = req.body;

    const designSystem = await DesignSystem.create({
      userId: userId,
      name: name,
      paletteId: paletteId,
      fontsId: fontsId,
      spacingsId: spacingsId,
      isPublic: isPublic,
    });

    if (!designSystem) {
      return res.status(400).json({ message: 'Invalid design system data' });
    }
    res.status(201).json({
      message: 'Design system created successfully',
      data: designSystem,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updateDesignSystem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, isPublic } = req.body;

    const updatedDesignSystem = await DesignSystem.findByIdAndUpdate(
      id,
      {
        name: name,
        isPublic: isPublic,
      },
      { new: true }
    );
    if (!updatedDesignSystem) {
      return res.status(200).json({ message: 'Design system not found' });
    }
    res.status(200).json({
      message: 'Design system updated successfully',
      data: updatedDesignSystem,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: 'Invalid design system id or fields syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteDesignSystem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedDesignSystem = await DesignSystem.deleteOne({ _id: id });
    if (deletedDesignSystem.deletedCount < 1) {
      return res.status(200).json({ message: 'Design system not found' });
    }
    res.status(200).json({
      message: 'Design system deleted successfully',
      data: deletedDesignSystem,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: 'Invalid design system id syntax or fonts not found',
      });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
