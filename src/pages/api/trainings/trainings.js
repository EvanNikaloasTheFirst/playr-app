// src/pages/api/trainings/trainings.js
import { dbConnect } from "../lib/mongodb";
import Training from "@/models/training";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const body = req.body;

      if (!body.userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const training = new Training(body);
      await training.save();

      return res.status(201).json(training);
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
