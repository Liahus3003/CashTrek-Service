import mongoose from 'mongoose';

const MONGO_URI = `mongodb+srv://${encodeURIComponent(process.env?.MONGO_URI_USER ?? '')}:${encodeURIComponent(process.env.MONGO_URI_KEY ?? '')}@${encodeURIComponent(process.env.CLUSTER ?? '')}/cashtrek?retryWrites=true&w=majority`;
const connectOptions: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(MONGO_URI, connectOptions)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err: any) => {
  console.error('Failed to connect to MongoDB', err);
});

export default mongoose.connection;
