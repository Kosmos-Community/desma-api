import { NextFunction, request, Request, Response } from "express";
import mongoose from "mongoose";
import { Palette } from "../models/paletteModel";
import {
  deleteManyColors,
  insertManyColors,
  bulkUpdateColors,
} from "../utils/colorFunctions";

export const createPalette = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.body;
    const individualColors = [];

    for (let field in request) {
      // prepare data for insert colors in color collection
      for (let color in request[field]) {
        individualColors.push({
          type: field,
          hexCode: request[field][color],
        });
      }
    }

    const colorsInserted = await insertManyColors(individualColors); // insert at Color collection

    const paletteInsert: Record<string, any> = {}; // create ids array per field
    let type: string = "";
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
      return res.status(400).json({ message: "Invalid fields syntax" });
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
  const { id: paletteId } = req.params;

  await Palette.findOne(
    { _id: paletteId },
    { createdAt: false, updatedAt: false, __v: false }
  )
    .populate([
      { path: "primaryColor", select: "_id hexCode" },
      { path: "secondaryColor", select: "_id hexCode" },
      { path: "textColor", select: "_id hexCode" },
      { path: "backgroundColors", select: "_id hexCode" },
      { path: "extraColors", select: "_id hexCode" },
    ])
    .then((palette) => {
      res.status(200).json({ ...palette._doc });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: "Invalid fields syntax" });
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    });
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

    for (let field in request) {
      // Prepare data to insert colors
      for (let color in request[field]) {
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
        paletteUpdate[field]
          ? paletteUpdate[field].push(colorId)
          : (paletteUpdate[field] = [colorId]);
      }
    }

    await bulkUpdateColors(colorOpts); // Update and upsert colors

    const palette = await Palette.updateOne({ _id: paletteId }, paletteUpdate); // Update palette

    res.status(200).json(palette);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid fields syntax" });
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

    if (Object.keys(request).length != 0) {
      // delete color from array
      let index: number;

      delete paletteData._id;
      ids.push(
        ...request.colors_ids.map(
          (id: string) => new mongoose.Types.ObjectId(id)
        )
      );

      for (let field in paletteData) {
        ids.forEach((id: any) => {
          if (paletteData[field].includes(id)) {
            index = paletteData[field].indexOf(id);
            paletteData[field].splice(index, 1); // remove id or ids color from palette array
          }
        });
      }

      const updatedPalette = await Palette.updateOne(
        // update of palette array
        { _id: paletteId },
        { $set: palette },
        { new: true, runValidators: true }
      );

      response = updatedPalette;
    } else {
      // delete complete palette
      await palette.remove();

      for (let field in paletteData) ids.push(...paletteData[field]);

      response = `Palette with id : ${paletteId} successfully removed`;
    }

    await deleteManyColors(ids); // delete of color

    res.status(200).json({ msg: response });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid fields syntax" });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
