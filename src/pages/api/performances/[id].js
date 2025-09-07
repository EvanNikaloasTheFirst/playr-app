import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      console.error("❌ No active session");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = session.user?.email;
    if (!userId) {
      console.error("❌ Session found but no email:", session);
      return res.status(400).json({ error: "User email missing" });
    }

    console.log("✅ Authenticated request from:", userId);

    await client.connect();
    const db = client.db("playr");
    const collection = db.collection("performances");

    if (req.method === "GET") {
      console.log("📥 Fetching performances for:", userId);
      const performances = await collection.find({ userId }).toArray();
      console.log("📤 Found performances:", performances.length);
      return res.status(200).json(performances);
    }

    if (req.method === "POST") {
      const newPerf = { ...req.body, userId };
      console.log("➕ Inserting new performance:", newPerf);
      const result = await collection.insertOne(newPerf);
      return res.status(201).json({ ...newPerf, id: result.insertedId });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      console.log("🗑️ Deleting performance:", id);
      await collection.deleteOne({ _id: new ObjectId(id), userId });
      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("🔥 API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
