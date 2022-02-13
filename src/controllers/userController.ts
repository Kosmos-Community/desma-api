import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
    throw new Error('Invalid email or password');
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(400).json({ message: 'Invalid user data' });

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    throw new Error('User already exists');
  }

  const user = await User.create({ email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
    throw new Error('Invalid user data');
  }
};
