import { MongoClient } from "mongodb";

let database;

try {
  const client = new MongoClient(
    "mongodb+srv://saad:saad2522@cluster0.9bemtsg.mongodb.net/?retryWrites=true&w=majority"
  );
  database = client.db("Vectorproduts");
  // console.log("database", database);
} catch (err) {
  // console.log("🚀 ~ file: db.ts:16 ~ err:", err);
}

export { database as db };

// "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/server.mjs\"",

// finally {
//   // Ensures that the client will close when you finish/error
//   await client.close(); }
