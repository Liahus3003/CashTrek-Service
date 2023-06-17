import { Request, Response } from "express";
import Expense from "../models/expense.model";

// Route handler for getting expense data for the last 6 months
export const getExpenseDataLast6Months = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.headers['x-user-id'];
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 6 months ago from the current date
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    // Find expenses that were created within the last 6 months
    const expenses = await Expense.find({
      userId,
      createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
    });

    res.status(200).json({ expenses });
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
    const { categoryType } = req.query; // Get category type from query parameters
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
          category: categoryType,
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

    res.status(200).json({ expenses });
  } catch (err: any) {
    res
      .status(500)
      .json({
        error:
          "Failed to retrieve expenses sum for last 6 months by category type",
      });
  }
};

// Route handler for getting upcoming transactions by category type with pagination
export const getUpcomingTransactionsByType = async (
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

    // Query to get upcoming expenses by category type sorted by date in ascending order
    const expenses = await Expense.find({
      userId,
      date: { $gte: new Date() },
      transactionType,
    })
      .sort({ date: 1 })
      .skip(skip)
      .limit(offset);

    // Get total count of upcoming expenses by category type for pagination
    const totalExpenses = await Expense.countDocuments({
      date: { $gte: new Date() },
      transactionType,
    });

    // Return the expenses and total count as JSON response
    res.status(200).json({ expenses, totalExpenses });
  } catch (err: any) {
    // Handle any errors that occurred during the database query
    console.error("Failed to retrieve upcoming expenses by category type", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve upcoming expenses by category type" });
  }
};
