import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TaskModel } from '../models/task.model';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status } = req.body;
  const userId = req.user!.id;

  const task = await TaskModel.create({
    title,
    description,
    status,
    user_id: userId
  });

  res.status(201).json(task);
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  let tasks;
  if (role === 'ADMIN') {
    tasks = await TaskModel.findAll();
  } else {
    tasks = await TaskModel.findAllByUserId(userId);
  }

  res.json(tasks);
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user!.id;
  const role = req.user!.role;

  const task = await TaskModel.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (role !== 'ADMIN' && task.user_id !== userId) {
    return res.status(403).json({ message: 'Access denied to this task' });
  }

  res.json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user!.id;
  const role = req.user!.role;
  const { title, description, status } = req.body;

  const task = await TaskModel.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (role !== 'ADMIN' && task.user_id !== userId) {
    return res.status(403).json({ message: 'Access denied to update this task' });
  }

  const updatedTask = await TaskModel.update(taskId, { title, description, status });

  res.json(updatedTask);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user!.id;
  const role = req.user!.role;

  const task = await TaskModel.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (role !== 'ADMIN' && task.user_id !== userId) {
    return res.status(403).json({ message: 'Access denied to delete this task' });
  }

  await TaskModel.delete(taskId);

  res.status(204).send();
};
