import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if casing differs

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    const userId = session.user?.email;
    if (!userId) return res.status(400).json({ error: "User email missing" });

    await client.connect();
    const db = client.db("playr");
    const collection = db.collection("performances");

    // GET performances
    if (req.method === "GET") {
      const { recent } = req.query; // optional ?recent=true
      let cursor = collection.find({ userId });

      if (recent === "true") {
        cursor = cursor.sort({ _id: -1 }).limit(3); // 3 most recent inserted
      }

      const performances = await cursor.toArray();
      return res.status(200).json(performances);
    }

    // POST new performance
    if (req.method === "POST") {
      const newPerf = {
        ...req.body,
        userId,
        createdAt: new Date(), // optional but useful for sorting by date
      };
      const result = await collection.insertOne(newPerf);
      return res.status(201).json({ ...newPerf, _id: result.insertedId });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("🔥 API error:", err);
    return res.status(500).json({ error: err.message });
  }
}