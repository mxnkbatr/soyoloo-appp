import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

const url = process.env.MONGODB_URI as string;
const dbName = process.env.MONGO_DB || 'Buddha';

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const products = await db.collection('products').find({}).toArray();
    console.log("Total products:", products.length);
    products.forEach(p => console.log(p.name, p.stockStatus, p.sections, p.image));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
