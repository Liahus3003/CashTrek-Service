import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.route';
import expenseSummaryRoutes from './routes/expense-summary.route';
import expenseRoutes from './routes/expense.route';
import wishlistRoutes from './routes/wishlist.route';
import lookupRoutes from './routes/lookup.route';
import authRoutes from './routes/auth.route';
import dotenv from 'dotenv';
dotenv.config();

import './config/db.config';
import { authenticateUser } from './middlewares/auth-middleware';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/dashboard', authenticateUser, dashboardRoutes);
app.use('/api/expense-summary', authenticateUser, expenseSummaryRoutes);
app.use('/api/expenses', authenticateUser, expenseRoutes);
app.use('/api/wishlists', authenticateUser, wishlistRoutes);
app.use('/api/lookup', authenticateUser, lookupRoutes);
app.use('/api/auth', authenticateUser, authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
