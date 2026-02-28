import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongodbUri);

  logger.info(`MongoDB connected: ${mongoose.connection.name}`);
}
