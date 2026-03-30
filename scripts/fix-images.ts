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
    
    const newImageUrl = "https://randomimageurl.com/assets/images/local/20260103_0518_Bold%20Abstract%20Composition_simple_compose_01ke204yvyf6pbx3ksw2cjcgkw_compressed_q80.jpeg";
    
    // Find products with broken demo images
    const brokenProducts = await db.collection('products').find({ image: { $regex: '^/images/demo/' } }).toArray();
    console.log("Products with broken demo images:", brokenProducts.length);
    
    if (brokenProducts.length > 0) {
      console.log("Updating to new URL...");
      const result = await db.collection('products').updateMany(
        { image: { $regex: '^/images/demo/' } },
        { $set: { image: newImageUrl } }
      );
      console.log(`Updated ${result.modifiedCount} products.`);
    }
  } finally {
    await client.close();
  }
}
main().catch(console.error);
