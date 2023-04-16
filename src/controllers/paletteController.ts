import { Request, Response, NextFunction } from 'express';
import mongoose, { mongo } from 'mongoose';
import { Palette } from '../models/paletteModel';
import _ from 'lodash';
import {
  deleteManyColors,
  insertManyColors,
} from '../utils/colorFunctions';

export const createPalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.body;
    const individualColors = [];

    for (const type in request) {
      for (const color of request[type]) {
        individualColors.push({
          type: type,
          hexCode: color.hexCode,
        });
      }
    }

    const colorsInserted: any = await insertManyColors(individualColors);

    const paletteInsert: Record<string, any> = {};
    for (const color of colorsInserted) {
      const type = color.type;
      if (paletteInsert[type]) {
        paletteInsert[type].push(color._id);
      } else {
        paletteInsert[type] = [color._id];
      }
    }

    const paletteData = await Palette.create(paletteInsert);

    res.status(201).json(paletteData);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid fields syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getPalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: paletteId } = req.params;
    await Palette.findOne(
      { _id: paletteId },
      { createdAt: false, updatedAt: false, __v: false }
    )
      .populate([
        { path: 'primaryColor', select: '_id hexCode' },
        { path: 'secondaryColor', select: '_id hexCode' },
        { path: 'textColor', select: '_id hexCode' },
        { path: 'backgroundColors', select: '_id hexCode' },
        { path: 'extraColors', select: '_id hexCode' },
      ])
      .then((palette) => {
        res.status(200).json({ ...palette._doc });
      });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid palette id syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updatePalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: paletteId } = req.params;
    const request = req.body;

    const palette = await Palette.findOne(
      { _id: paletteId },
      { _id: false, createdAt: false, updatedAt: false, __v: false }
    );

    if (!palette)
      return res
        .status(404)
        .json({ message: `No palette with id: ${paletteId}` });

    const colors: any = Object.values(request).reduce((acc: any, val: any) => acc.concat(val), []);

    const colorOpts = colors.map((color: any) => ({
      updateOne: {
        filter: { _id: color._id || new mongoose.Types.ObjectId() },
        update: { $set: { type: color.type, hexCode: color.hexCode } },
        upsert: true,
      },
    }));

    const paletteUpdate: any = {};
    colors.forEach((color: any) => {
      const field = color.type;
      const colorId = color._id || new mongoose.Types.ObjectId();

      paletteUpdate[field] = paletteUpdate[field] || [];
      paletteUpdate[field].push(colorId);
    });

    const [updatedColors, updatedPalette] = await Promise.all([Palette.bulkWrite(colorOpts), Palette.updateOne({ _id: paletteId }, paletteUpdate)]);

    res.status(200).json({
      acknowledged: updatedPalette.acknowledged,
      modifiedCount: updatedPalette.modifiedCount,
      upsertedId: updatedPalette.upsertedId
        ? updatedPalette.upsertedId.toString()
        : null,
      upsertedCount: updatedPalette.upsertedCount,
      matchedCount: updatedPalette.matchedCount,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Invalid fields syntax" });
    } else if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const deletePalette = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: paletteId } = req.params;
    let message: string | object;

    let palette = await Palette.findOne(
      { _id: paletteId },
      {
        _id: true,
        primaryColor: true,
        secondaryColor: true,
        textColor: true,
        backgroundColors: true,
        extraColors: true,
      }
    );

    if (!palette)
      return res
        .status(404)
        .json({ message: `No palette with id: ${paletteId}` });

    const paletteData = palette._doc;
    let ids = [];

    await palette.remove();
    for (let field in paletteData) {
      if (paletteData[field].length) ids.push(paletteData[field]);
    }
    message = `Palette with id: ${paletteId} successfully removed`;
    await deleteManyColors(ids.flat());

    res.status(200).json({ message });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid fields syntax' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};