import { NextResponse } from "next/server";
import {MongoClient} from 'mongodb'

// const { MongoClient } = require("mongodb");
export async function GET(request) {
    

// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:mongoatlas@cluster0.46dtgey.mongodb.net/";

const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query={ }
    const products = await inventory.find(query).toArray();

    // console.log(movie);
    return NextResponse.json({products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}


export async function POST(request) {
    

    // Replace the uri string with your connection string.
    let body=await request.json()
    const uri = "mongodb+srv://mongodb:mongoatlas@cluster0.46dtgey.mongodb.net/";
    
    const client = new MongoClient(uri);
    
      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
    
        // Query for a movie that has the title 'Back to the Future'
        const product = await inventory.insertOne(body)
    
        // console.log(product);
        return NextResponse.json({product,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }