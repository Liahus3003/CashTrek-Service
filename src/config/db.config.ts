import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? ''; // Replace with your MongoDB connection string
const connectOptions: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

mongoose.connect(MONGO_URI, connectOptions)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

export default mongoose.connection;
