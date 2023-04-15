import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/expense.model';

// Create expense
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { name, amount, category, date, notes, site, isRebill, isSubscription, paymentMode, transactionType }: IExpense = req.body;

    const expense = new Expense({  name, amount, category, date, notes, site, isRebill, isSubscription, paymentMode,
      transactionType, createdDate: new Date() });
    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses
export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err: any) {
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
    res.status(200).json(expense);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update an expense
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const data = {...req.body, updatedDate: new Date()};
    const expense = await Expense.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  }
  catch (err: any) {
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
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
};
