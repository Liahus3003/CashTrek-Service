import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.route';
import expenseRoutes from './routes/expense.route';
import wishlistRoutes from './routes/wishlist.route';
import lookupRoutes from './routes/lookup.route';
import authRoutes from './routes/auth.route';
import dotenv from 'dotenv';

import './config/db.config';
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/lookup', lookupRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
