import { Request, Response, NextFunction } from 'express';
import mongoose, { mongo } from 'mongoose';
import { Palette } from '../models/paletteModel';
import _ from 'lodash';
import {
  deleteManyColors,
  insertManyColors,
  bulkUpdateColors,
} from '../utils/colorFunctions';

export const createPalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.body;
    const individualColors = [];

    // prepare data for insert colors in color collection
    for (let field in request) {
      for (let color in request[field]) {
        individualColors.push({
          type: field,
          hexCode: request[field][color].hexCode,
        });
      }
    }

    const colorsInserted = await insertManyColors(individualColors); // insert at Color collection

    const paletteInsert: Record<string, any> = {}; // create ids array per field
    let type: string = '';
    for (let color in colorsInserted) {
      type = colorsInserted[color].type;
      paletteInsert[type]
        ? paletteInsert[type].push(colorsInserted[color]._id)
        : (paletteInsert[type] = [colorsInserted[color]._id]);
    }

    const paletteData = await Palette.create(paletteInsert); // insert at Color collection

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
      return res.status(400).json({ message: 'Invalid fields syntax' });
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
    const colorOpts = [];
    const paletteUpdate: Record<string, any> = {};
    let colorId: string | object;

    delete request._id;
    const palette = await Palette.findOne(
      { _id: paletteId },
      { _id: false, createdAt: false, updatedAt: false, __v: false }
    );

    if (!palette)
      return res
        .status(404)
        .json({ message: `No palette with id : ${paletteId}` });

    // Prepare data to insert colors
    for (let field in request) {
      for (let color in request[field]) {
        // Data to update color
        colorId = request[field][color]._id || new mongoose.Types.ObjectId();
        colorOpts.push({
          updateOne: {
            filter: { _id: colorId },
            update: {
              $set: {
                type: field,
                hexCode: request[field][color].hexCode,
              },
            },
            upsert: true,
          },
        });
        colorOpts.push({
          updateOne: {
            filter: { _id: paletteId },
            update: {
              $pullAll: {},
            },
          },
        });
        // Data to update palette
        paletteUpdate[field]
          ? paletteUpdate[field].push(colorId)
          : (paletteUpdate[field] = [colorId]);
      }
    }

    Object.keys(palette._doc).map((field) => {
      !paletteUpdate[field] && (paletteUpdate[field] = []);
      palette._doc[field] = palette._doc[field].map((color: any) =>
        color.toString()
      );
    });

    await bulkUpdateColors(colorOpts); // Update and upsert colors

    const updatedPalette = await Palette.updateOne(
      { _id: paletteId },
      paletteUpdate
    ); // Update palette

    res.status(200).json(updatedPalette);
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

export const deletePalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: paletteId } = req.params;
    const request = req.body;
    let response: string | object;

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
        .json({ message: `No palette with id : ${paletteId}` });

    const paletteData = palette._doc;
    const ids = [];

    // delete complete palette
    await palette.remove();

    for (let field in paletteData) ids.push(...paletteData[field]);
    response = `Palette with id : ${paletteId} successfully removed`;
    await deleteManyColors(ids); // delete of color

    res.status(200).json({ msg: response });
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

function missing(array1: any[], array2: any[]) {
  const copy = array1.slice();
  return array2.some((element) => {
    const index = copy.indexOf(element);
    if (index >= 0) copy.splice(index, 1);
    return index < 0;
  });
}
