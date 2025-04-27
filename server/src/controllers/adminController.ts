import { Request as ExpressRequest, Response } from 'express';
import { User } from '../models';

interface CustomRequest extends ExpressRequest {
  user?: { userId: number; role: string };
}

export const getAllUsers = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
