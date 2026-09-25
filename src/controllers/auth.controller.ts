import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'USER'
  });

  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({
    message: 'User registered successfully',
    user: userWithoutPassword
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  res.json({
    message: 'Login successful',
    token
  });
};
