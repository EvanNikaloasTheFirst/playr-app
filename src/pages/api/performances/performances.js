import { MongoClient } from "mongodb";
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
      const { recent, season, batchSize } = req.query; 
      let query = { userId };

      // ✅ filter by season if provided
      if (season) {
        query.season = season; // e.g. "25/26"
      }

      let cursor = collection.find(query);

      if (recent === "true") {
        cursor = cursor.sort({ _id: -1 }).limit(3);
      } else {
        cursor = cursor.sort({ date: 1 }); // default sort by match date
      }

      const performances = await cursor.toArray();

      // ✅ if batchSize is provided, group results
      if (batchSize) {
        const size = parseInt(batchSize, 10);
        if (!isNaN(size) && size > 0) {
          const batches = [];
          for (let i = 0; i < performances.length; i += size) {
            batches.push(performances.slice(i, i + size));
          }
          return res.status(200).json(batches);
        }
      }

      return res.status(200).json(performances);
    }

    // POST new performance
    if (req.method === "POST") {
      const newPerf = {
        ...req.body,
        userId,
        createdAt: new Date(),
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
