import mongoose from 'mongoose';

// Define the shape of the cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a global variable not attached to global object
const cached: CachedConnection = { conn: null, promise: null };

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Validate MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function connectDB() {
  // If we have a connection already, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Create a connection promise that resolves with mongoose
    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then(() => mongoose);
  }

  try {
    // Await the connection
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise on error
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 