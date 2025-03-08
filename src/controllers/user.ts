import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userController = {
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwtSign(user._id.toString());

      res.json({
        user,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email is already registered' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });

      const token = jwtSign(user._id.toString());

      res.status(201).json({
        user: user,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  }
};

const jwtSign = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );
};