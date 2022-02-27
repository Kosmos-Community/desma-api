import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { userRoutes } from './routes/userRoutes';
import { fontsRoutes } from './routes/fontsRoutes';
import { spacingsRoutes } from './routes/spacingsRoutes';

dotenv.config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/fonts', fontsRoutes);
app.use('/api/spacings', spacingsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
