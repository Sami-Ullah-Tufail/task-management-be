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

      if (!title) return res.status(400).json({ message: 'Title is required' });

      const task = await Task.create({
        title,
        description,
        user: req.user?.userId,
      });

      res.status(201).json({ task });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get create task' });
    }
  },

  async getTaskById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }

      const task = await Task.findOne({
        _id: id,
        user: req.user?.userId
      });

      if (!task) return res.status(404).json({ message: 'Task not found' });

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get task' });
    }
  },

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid task ID' });

      const task = await Task.findOne({
        _id: id,
        user: req.user?.userId
      });

      if (!task)
        return res.status(404).json({ message: 'Task not found' });

      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, user: req.user?.userId },
        { title, description, status },
        { new: true }
      );

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update task' });
    }
  },

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid task ID' });

      const task = await Task.findOneAndDelete({
        _id: id,
        user: req.user?.userId
      });

      if (!task) 
        return res.status(404).json({ message: 'Task not found' });

      res.status(200).json({
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  },

  async searchTasks(req: AuthRequest, res: Response) {
    try {
      const { title, status } = req.query;
      
      const query: any = {
        user: req.user?.userId
      };

      if (title && String(title).trim()) {
        const searchRegex = new RegExp(String(title), 'i');
        query.title = searchRegex;
      }

      if (status && String(status).trim() && ['pending', 'completed'].includes(String(status)))
        query.status = String(status);

      const tasks = await Task.find(query);

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search tasks' });
    }
  }
};