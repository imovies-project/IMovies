import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\n⚠️ [DB WARNING] MONGODB_URI is not defined in environment variables.');
    console.warn('👉 Please set MONGODB_URI in server/.env or export it in your environment.');
    console.warn('👉 Example: mongodb+srv://<user>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('👉 Check your network connection, IP whitelist (0.0.0.0/0 on Atlas), and database credentials.');
    return false;
  }
};
