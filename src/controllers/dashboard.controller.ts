import { Request, Response } from "express";
import Expense from "../models/expense.model";
import { getMonthName } from "../utils/helper";

// Route handler for getting expense data for the last 6 months
export const getExpenseDataLast6Months = async (
  req: Request,
  res: Response
) => {
  try {
    const currentDate = new Date();
    const userId = req.headers['x-user-id'];
    let initialMonth = currentDate.getMonth() + 1;
    let initialYear = currentDate.getFullYear();
    let expenseDetails = [];
    for (let i = 0; i < 6; i++) {
      if (initialMonth < 0) {
        initialMonth = 12;
        initialYear--;
      }
      // Calculate the start and end dates of the month
      const startDate = new Date(initialYear, initialMonth - 1, 1);
      const endDate = new Date(initialYear, initialMonth, 1);

      // Query to get expense details for all days in the month
      let expenses = await Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$date" } },
            totalCredit: {
              $sum: {
                $cond: [{ $eq: ['$transactionType', 'Credit'] }, '$amount', 0]
              }
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ['$transactionType', 'Expense'] }, '$amount', 0]
              }
            }
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id.month",
            totalCredit: 1,
            totalExpense: 1
          },
        },
      ]);
      // Default to 0 for months with no expenses
      if (!expenses?.length) {
        expenses = [
          { 
            totalCredit: 0,
            totalExpense: 0,
            period: `${getMonthName(initialMonth)}, ${initialYear}`
          }
        ];
      } else {
        expenses = expenses.map(expense => {
          expense.period = `${getMonthName(initialMonth)}, ${initialYear}`;
          return expense;
        });
      }
      expenseDetails.push(expenses[0]);
      initialMonth--;
    }

    res.status(200).json({ expenseDetails });
  } catch (err: any) {
    console.error("Failed to retrieve expense data for the last 6 months", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve expense data for the last 6 months" });
  }
};

// Route handler for getting sum of expenses for last 6 months by category type
export const getExpensesSumLast6MonthsByCategoryType = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.headers['x-user-id'];

    // Calculate the date 6 months ago from today
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Query to get expenses for last 6 months by category type and calculate sum
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryType: "$_id",
          total: 1,
        },
      },
    ]);

    const overallTotal = expenses.reduce((total: number, categoryType: any) => {
      return total + categoryType.total;
    }, 0);

    res.status(200).json({ expenses, overallTotal });
  } catch (err: any) {
    res
      .status(500)
      .json({
        error:
          "Failed to retrieve expenses sum for last 6 months by category type",
      });
  }
};

// Route handler for getting transactions by type with pagination
export const getTransactionsByType = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit, transactionType } = req.query;
    const userId = req.headers['x-user-id'];
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    // Calculate skip and offset values for pagination
    const skip = (pageNumber - 1) * limitNumber;
    const offset = limitNumber;

    // Query to get upcoming expenses by transaction type sorted by date in ascending order
    const transactions = await Expense.find({
      userId,
      date: { $lte: new Date() },
      transactionType,
    }, { name: 1, amount: 1, date: 1 })
      .sort({ date: 1 })
      .skip(skip)
      .limit(offset);

    // Return the transactions
    res.status(200).json(transactions);
  } catch (err: any) {
    // Handle any errors that occurred during the database query
    console.error("Failed to retrieve upcoming expenses by category type", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve upcoming expenses by category type" });
  }
};
