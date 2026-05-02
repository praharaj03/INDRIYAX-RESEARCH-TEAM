// TODO (Backend Dev): Implement MongoDB connection singleton
//
// npm install mongoose
// Add MONGODB_URI to .env.local
//
// import mongoose from "mongoose";
// const MONGODB_URI = process.env.MONGODB_URI!;
// const cached = (global as any).mongoose ?? { conn: null, promise: null };
// export async function connectDB() {
//   if (cached.conn) return cached.conn;
//   cached.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false });
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

export {};
