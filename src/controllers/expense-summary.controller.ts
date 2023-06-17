import { Request, Response } from "express";
import Expense from "../models/expense.model";
import { getMonthName } from "../utils/helper";

// Route handler for getting expenses for a particular month with pagination
export const getExpensesForMonthPaginated = async (
  req: Request,
  res: Response
) => {
  try {
    const { month, year, page, limit } = req.query as {
      month: string;
      year: string;
      page: string;
      limit: string;
    };

    // Calculate the start and end dates of the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    const userId = req.headers['x-user-id'];
    // Query to get expenses for the particular month with pagination
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: "desc" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Get total count of upcoming expenses by category type for pagination
    const totalExpenses = await Expense.countDocuments({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({ expenses, totalExpenses });
  } catch (err: any) {
    console.error("Failed to retrieve expenses for the particular month", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve expenses for the particular month" });
  }
};

// Route handler for getting expense details for all days in a month with default value of 0 if no expense in a day
export const getExpenseDetailsForMonth = async (
  req: Request,
  res: Response
) => {
  try {
    const { month, year } = req.query as {
      month: string;
      year: string;
    };
    const userId = req.headers['x-user-id'];
    let initialMonth = parseInt(month);
    let initialYear = parseInt(year);
    let expenseDetails = [];
    while (initialMonth >= +month - 1) {
      if (initialMonth < 0) {
        initialMonth = 12;
        initialYear--;
      }
      // Calculate the start and end dates of the month
      const startDate = new Date(initialYear, initialMonth - 1, 1);
      const endDate = new Date(initialYear, initialMonth, 1);

      // Query to get expense details for all days in the month
      const expenses = await Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$date" },
              month: { $month: "$date" },
              year: { $year: "$date" },
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            day: "$_id.day",
            total: 1,
          },
        },
        {
          $sort: { day: 1 },
        },
      ]);
      // Default to 0 for months with no expenses
      const monthlyInfo = Array.from({ length: new Date(initialYear, initialMonth - 1, 0).getDate() }, (_, i) => {
        const day = i + 1;
        const expense = expenses.find((expense) => expense.day === day);
        return { day, total: expense ? expense.total : 0 };
      });
      expenseDetails.push({ [`${getMonthName(initialMonth)}, ${initialYear}`]: monthlyInfo });
      initialMonth--;
    }

    res.status(200).json({ expenseDetails });
  } catch (err: any) {
    console.error(
      "Failed to retrieve expense details for all days in the month",
      err
    );
    res
      .status(500)
      .json({ error: "Failed to retrieve expense details for all days" });
  }
};

// Route handler for getting total expenses in a month summed based on category type
export const getTotalExpensesByCategoryTypeForMonth = async (
  req: Request,
  res: Response
) => {
  try {
    const { month, year } = req.query as { month: string; year: string }; // Type casting query parameters to expected data types
    const userId = req.headers['x-user-id'];
    
    // Calculate the start and end dates of the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Query to get total expenses in the month summed based on category type
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
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
    console.error(
      "Failed to retrieve total expenses by category type for the month",
      err
    );
    res.status(500).json({
      error: "Failed to retrieve total expenses by category type for the month",
    });
  }
};

// Route handler for getting expenses for a particular year and paginated
export const getExpensesForYearPaginated = async (
  req: Request,
  res: Response
) => {
  try {
    const { year } = req.query as { year: string }; // Type casting query parameter to expected data type
    const page = parseInt(req.query.page as string) || 1; // Get the page number from query parameter, default to 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // Get the limit per page from query parameter, default to 10 if not provided
    const userId = req.headers['x-user-id'];

    // Calculate the start and end dates of the year
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    // Query to get expenses for the specified year, paginated
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .skip((page - 1) * limit)
      .limit(limit);
    // Get total count of upcoming expenses by category type for pagination
    const totalExpenses = await Expense.countDocuments({
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({ expenses, totalExpenses });
  } catch (err: any) {
    console.error("Failed to retrieve expenses for the year", err);
    res.status(500).json({ error: "Failed to retrieve expenses for the year" });
  }
};

// Route handler for getting expense details for all months in a year and defaulted to 0 if no expense in a month
export const getExpenseDetailsForYear = async (req: Request, res: Response) => {
  try {
    const { year } = req.query as { year: string }; // Type casting query parameter to expected data type
    const userId = req.headers['x-user-id'];

    let initialYear = parseInt(year);
    let expenseDetails = [];
    while (initialYear >= +year - 1) {
      // Calculate the start and end dates of the year
      const startDate = new Date(initialYear, 0, 1);
      const endDate = new Date(initialYear, 11, 31);

      // Query to get expense details for all months in the year
      const expenses = await Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$date" } },
            total: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            total: 1,
          },
        },
      ]);

      // Default to 0 for months with no expenses
      const monthlyInfo = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const expense = expenses.find((expense) => expense.month === month);
        return { month, total: expense ? expense.total : 0 };
      });
      expenseDetails.push({ [initialYear.toString()]: monthlyInfo });
      initialYear--;
    }

    res.status(200).json({ expenseDetails });
  } catch (err: any) {
    console.error("Failed to retrieve expenses for the year");
  }
};

// Route handler for getting all expenses in a year by summing based on categoryType
export const getExpensesForYearByCategoryType = async (
  req: Request,
  res: Response
) => {
  try {
    const { year } = req.query as { year: string }; // Type casting query parameter to expected data type
    const userId = req.headers['x-user-id'];

    // Calculate the start and end dates of the year
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    // Query to get expenses for the specified year, grouped by categoryType and summed
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
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
    console.error(
      "Failed to retrieve expenses by categoryType for the year",
      err
    );
    res.status(500).json({
      error: "Failed to retrieve expenses by categoryType for the year",
    });
  }
};
