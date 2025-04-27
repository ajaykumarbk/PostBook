import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import adminRoutes from './routes/adminRoutes';
import sequelize from './config/database';

// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '../.env'); // Adjusted to go up only one directory: from src/ to server/
console.log('Attempting to load .env file from:', envPath);

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  throw new Error(`.env file not found at ${envPath}`);
}

// Read and log the contents of the .env file for debugging
const envContents = fs.readFileSync(envPath, 'utf-8');
console.log('Raw contents of .env file:', envContents);

// Load environment variables
dotenv.config({ path: envPath });

// Log all environment variables after loading
console.log('Environment variables after loading:', process.env);

// Verify database environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not defined in .env file`);
  }
}
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error: Error) => {
  console.error('Unable to connect to the database:', error.message);
});
