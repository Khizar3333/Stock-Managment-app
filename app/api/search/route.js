import { NextResponse } from "next/server";
import {MongoClient} from 'mongodb'

// const { MongoClient } = require("mongodb");
export async function GET(request) {
    const query=request.nextUrl.searchParams.get("query")

// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:mongoatlas@cluster0.46dtgey.mongodb.net/";

const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    
    const products= await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } },
            //   { quantity: { $regex: query, $options: "i" } },
            //   { price: { $regex: query, $options: "i" } }
             ]
          }
        }
      ]).toArray()


    return NextResponse.json({products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}