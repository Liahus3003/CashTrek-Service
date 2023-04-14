import { Document, Schema, model } from "mongoose";

export interface ILookup extends Document {
  name: string;
  type: string;
  isActive: boolean;
  description: string;
  createdDate: Date;
  updatedDate: Date;
}

const LookupSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    isActive: { type: Boolean, required: true},
    description: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
  },
  { collection: "lookup" }
);

export default model<ILookup>("Lookup", LookupSchema);
