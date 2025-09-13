import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if needed

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("profiles");

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.email;
  if (!userId) return res.status(401).json({ error: "Not authorized" });

  try {
    if (req.method === "GET") {
      const profile = await collection.findOne({ userId });
      return res.status(200).json(profile || {});
    }

    if (req.method === "POST") {
      const { bio, goals } = req.body;
      const result = await collection.updateOne(
        { userId },
        { $set: { bio, goals, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ bio, goals });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("Profile API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
