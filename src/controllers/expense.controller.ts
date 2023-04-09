import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/expense.model';

// Create expense
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, category, date }: IExpense = req.body;

    const expense = new Expense({ description, amount, category, date });
    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses
export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single expense
export const getExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an expense
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an expense
export const deleteExpense = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.findByIdAndDelete(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
