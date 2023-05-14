import { Document, Schema, model } from "mongoose";

export interface IExpense extends Document {
  name: string;
  userId: string;
  amount: number;
  category: string;
  transactionType: string;
  date: Date;
  notes: string;
  site: string;
  isRebill: boolean;
  isSubscription: boolean;
  paymentMode: string;
  createdDate: Date;
  updatedDate: Date;
}

const ExpenseSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    transactionType: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    notes: { type: String, required: true },
    site: { type: String },
    isRebill: { type: Boolean, required: true },
    isSubscription: { type: Boolean, required: true },
    paymentMode: { type: String, required: true },
  },
  { collection: "expenses" }
);

export default model<IExpense>("Expense", ExpenseSchema);
