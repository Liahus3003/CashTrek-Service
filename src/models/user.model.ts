import mongoose, { Document, Schema } from 'mongoose';

// Define User interface for type checking
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdDate: Date;
  updatedDate: Date;
  lastLogin: Date;
}

// Define User schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Export User model
export default mongoose.model<IUser>('User', userSchema);
