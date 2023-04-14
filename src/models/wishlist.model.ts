import { Document, Schema, model } from "mongoose";

export interface IWishlist extends Document {
  name: string;
  budget: number;
  createdDate: Date;
  updatedDate: Date;
  notes: string;
  priority: boolean;
}

const WishlistSchema = new Schema(
  {
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    notes: { type: String, required: true },
    priority: { type: Boolean, required: true }
  },
  { collection: "wishlists" }
);

export default model<IWishlist>("Wishlist", WishlistSchema);
