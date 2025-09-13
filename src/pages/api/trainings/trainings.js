import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if needed

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("trainings");

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.email;
  if (!userId) return res.status(400).json({ error: "User email missing" });

  try {
    if (req.method === "POST") {
      const training = {
        ...req.body,
        userId,
        createdAt: new Date(),
      };
      const result = await collection.insertOne(training);
      return res.status(201).json({ ...training, _id: result.insertedId });

    } else if (req.method === "GET") {
      const { season } = req.query;

      // Find trainings for this user, optionally filter by season
      const query = { userId };
      if (season) query.season = season;

      const trainings = await collection
        .find(query)
        .sort({ trainingDate: -1 }) // newest first
        .toArray();

      return res.status(200).json(trainings);

    } else if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing training ID" });

      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        userId,
      });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Training not found or not authorized to delete" });
      }

      return res.status(200).json({ success: true });
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error("Training API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
