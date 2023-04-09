import express from 'express';
import {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller';

const router = express.Router();

// Create expense
router.post('/', createExpense);

// Get all expenses
router.get('/', getAllExpenses);

// Get a single expense
router.get('/:id', getExpense);

// Update an expense
router.put('/:id', updateExpense);

// Delete an expense
router.delete('/:id', deleteExpense);

export default router;
