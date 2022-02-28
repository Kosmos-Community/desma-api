import { Request, Response } from 'express';
import { insertManyColors, deleteManyColors } from '../utils/colorFunctions';


export const createColors = async (req: Request, res: Response) => {
  const data = req.body;
  const colors = await insertManyColors(data)
    .catch((err) => {
      throw new Error(err.message)
    })
  res.status(200).json(colors)
}

export const deleteColors = async (req: Request, res: Response) => {
  const { ids } = req.body
  const deletedColors = await deleteManyColors(ids)
    .catch((err) => {
      throw new Error(err.message)
    })
  res.status(200).json(deletedColors)
}


