import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Some user data fields are missing' });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid email or password' });
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Some user data fields are missing' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'The email is already associated with a Desma account',
    });
  }

  try {
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
