import { NextResponse } from "next/server";
import {MongoClient} from 'mongodb'

export async function POST(request) {
    

    // Replace the uri string with your connection string.
    let {action,slug,initialquantity}=await request.json()
    const uri = "mongodb+srv://mongodb:mongoatlas@cluster0.46dtgey.mongodb.net/";
    
    const client = new MongoClient(uri);
    
    try {
        const database = client.db("stock");
        const inventory = database.collection("inventory");
        // create a filter for a movie to update
        const filter = { slug: slug };
        let newquantity=action=="plus"?(parseInt(initialquantity+1)): (parseInt(initialquantity-1))
        const updateDoc = {
          $set: {
            quantity: newquantity
          },
        };
        const result = await inventory.updateOne(filter, updateDoc,{});
        
        return NextResponse.json({message:`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})

      } finally {
        await client.close();
      }
    }