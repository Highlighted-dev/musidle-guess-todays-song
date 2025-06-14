/* eslint-disable @typescript-eslint/naming-convention */
// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URL || !process.env.MONGODB_URL_PROD) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const uri = IS_DEVELOPMENT ? process.env.MONGODB_URL : process.env.MONGODB_URL_PROD;
const options: MongoClientOptions = {};

let client;
let clientPromise: Promise<MongoClient>;

if (IS_DEVELOPMENT) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // eslint-disable-next-line prefer-const
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
