import { Request, Response } from 'express';
import { Color } from '../models/colorModel';

export const createMassiveColor = async (req: Request, res: Response) => {
  const data = req.body;
  const colors = await Color.insertMany(data)
    .catch((err) => {
        throw new Error(err)
    })
  res.status(200).json(colors)
}

export const updateColor = async (req: Request, res: Response) => {
    const { id: colorId } = req.params;
    const color = await Color.findOneAndUpdate({ _id: colorId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!color) 
        throw new Error(`No color with id : ${colorId}`);
    res.status(200).json({ color });
  };
