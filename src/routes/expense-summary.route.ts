import express from "express";
import {
  getExpenseDetailsForMonth,
  getExpenseDetailsForYear,
  getExpensesForMonthPaginated,
  getExpensesForYearByCategoryType,
  getExpensesForYearPaginated,
  getTotalExpensesByCategoryTypeForMonth,
} from "../controllers/expense-summary.controller";

const router = express.Router();

// Get all expenses in a month
router.get("/monthly-expense", getExpensesForMonthPaginated);

// Get last 6 months expenses
router.get("/expense-per-day", getExpenseDetailsForMonth);

// Get all monthly expenses based on Category Type
router.get("/grouped-monthly-expense", getTotalExpensesByCategoryTypeForMonth);

// Get all expenses in a year
router.get("/yearly-expense", getExpensesForYearPaginated);

// Get last 6 months expenses summed by Category
router.get("/expense-per-month", getExpenseDetailsForYear);

// Get all yearly expenses based on Category Type 
router.get("/grouped-yearly-expense", getExpensesForYearByCategoryType);

export default router;
