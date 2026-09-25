import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserModel } from '../models/user.model';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const user = await UserModel.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  // Only admins can access this (enforced by middleware)
  const users = await UserModel.findAll();
  res.json(users);
};
