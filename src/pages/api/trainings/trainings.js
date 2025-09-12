// src/pages/api/trainings/trainings.js
import { dbConnect } from "../lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import Training from "@/models/training";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if casing differs
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
 await client.connect();
  const db = client.db("playr");
    const collection = db.collection("trainings");
    const session = await getServerSession(req, res, authOptions);
   const userId = session.user?.email;
    if (!userId) return res.status(400).json({ error: "User email missing" });

  if (req.method === "POST") {
    try {

      const training = {
        ...req.body,
        userId,
        createdAt: new Date(), // optional but useful for sorting by date
      };
      const result = await collection.insertOne(training);
      return res.status(201).json({ ...training, _id: result.insertedId });

    } catch (err) {
            //   console.log("❌ Training POST error:", err);  // <-- log the full error÷÷
            console.log("Trainign POST Error")

      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
