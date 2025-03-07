import { Request, Response } from 'express';
import { Task } from '../models/task';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: { userId: string }; 
}

export const Tasks = {
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await Task.find({ user: req.user?.userId }).sort({ createdAt: -1 });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get task list' });
    }
  },

  async createTask(req: AuthRequest, res: Response) {
    try {
      const { title, description, status: taskStatus } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Title is required'
        });
      }

      const task = await Task.create({
        title,
        description,
        user: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get create task' });
    }
  },

  async getTaskById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
      }

      const task = await Task.findOne({
        _id: id,
        user: req.user?.userId
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get task' });
    }
  },

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
      }

      const task = await Task.findOneAndDelete({
        _id: id,
        user: req.user?.userId
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }
};