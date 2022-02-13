import jwt from 'jsonwebtoken';

export const generateToken = (id: string) => {
  const JWT_SECRET: string = process.env.JWT_SECRET!;
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
