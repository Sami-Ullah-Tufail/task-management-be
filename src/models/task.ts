import mongoose from 'mongoose';

interface ITask {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', taskSchema);