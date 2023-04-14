import express from 'express';
import {
  getExpenseDataLast6Months,
  getExpensesSumLast6MonthsByCategoryType,
  getUpcomingTransactionsByType
} from '../controllers/dashboard.controller';

const router = express.Router();

// Get last 6 months expenses
router.get('/last-six-months-expense', getExpenseDataLast6Months);

// Get last 6 months expenses summed by Category
router.get('/last-six-months-expense-sum', getExpensesSumLast6MonthsByCategoryType);

// Get all transactions based on Transaction Type
router.get('/transactions', getUpcomingTransactionsByType);

export default router;
