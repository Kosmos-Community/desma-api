import { Request, Response, NextFunction } from 'express';
import { insertManyColors, deleteManyColors } from '../utils/colorFunctions';

export const createColors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const colors = await insertManyColors(data);
    res.status(200).json(colors);
  } catch (error) {
    next(error);
  }
};

export const deleteColors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const deletedColors = await deleteManyColors(ids);
    res.status(200).json(deletedColors);
  } catch (error) {
    next(error);
  }
};
