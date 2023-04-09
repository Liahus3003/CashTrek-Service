import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expenseRoutes from './routes/expense.route';
import authRoutes from './routes/auth.route';
import dotenv from 'dotenv';

import './config/db.config';
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/expenses', expenseRoutes); // Expense routes
app.use('/api/auth', authRoutes); // Auth routes

// Start the server
const PORT = 3000; // Replace with your desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
