// src/pages/api/db-test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../api/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Run a ping to check connection
    await db.command({ ping: 1 });

    res.status(200).json({ message: "MongoDB connected successfully 🚀" });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    res.status(500).json({ message: "Failed to connect to MongoDB" });
  }
}
