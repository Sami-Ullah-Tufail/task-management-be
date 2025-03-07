import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';
import morgan from 'morgan';
import routes from "./routes"
import { errorHandler } from './middleware/errorHandler';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

app.get('/api/v1/ping', (req, res) => {
    res.json({ status: 200, message: 'Server is running' });
});

app.use('/api/v1', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listning on port: ${PORT}`);
});