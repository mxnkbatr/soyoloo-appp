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
    const preorders = products.filter(p => p.stockStatus === 'pre-order');
    console.log("Pre-order products:", preorders.length);
    preorders.forEach(p => console.log(p.name, p.image));
    
    const special = products.filter(p => p.sections?.includes('Онцгой'));
    console.log("Special products:", special.length);
    special.forEach(p => console.log(p.name, p.image));

    // Actually, let's just update the products where image includes "placehold.co" and is a special order
    const urlToUse = "https://randomimageurl.com/assets/images/local/20260103_0518_Bold%20Abstract%20Composition_simple_compose_01ke204yvyf6pbx3ksw2cjcgkw_compressed_q80.jpeg";

    if (preorders.length > 0) {
      console.log("Updating pre-orders with new image...");
      await db.collection('products').updateMany(
        { stockStatus: 'pre-order' },
        { $set: { image: urlToUse } }
      );
      console.log("Pre-orders updated.");
    }
  } finally {
    await client.close();
  }
}
main().catch(console.error);
