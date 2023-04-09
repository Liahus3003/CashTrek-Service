import { Document, Schema, model } from 'mongoose';

export interface IExpense extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
}

const ExpenseSchema = new Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { collection: 'expenses' }
);

export default model<IExpense>('Expense', ExpenseSchema);
