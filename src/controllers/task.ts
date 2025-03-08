import { Request, Response } from 'express';
import { Task } from '../models/task';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: { userId: string }; 
}

export const Tasks = {
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;
      const search = req.query.search as string;

      const query: any = { user: req.user?.userId };
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ];
      }

      const [tasks, totalDocs] = await Promise.all([
        Task.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Task.countDocuments(query)
      ]);

      res.status(200).json({
        tasks,
        totalDocs,
        page,
        limit
      });
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

  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      const totalTasks = await Task.countDocuments({ user: userId });
      const pendingTasks = await Task.countDocuments({ 
        user: userId,
        status: 'pending'
      });
      const completedTasks = await Task.countDocuments({
        user: userId, 
        status: 'complete'
      });

      res.status(200).json({
        total: totalTasks,
        pending: pendingTasks,
        completed: completedTasks
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  }
};