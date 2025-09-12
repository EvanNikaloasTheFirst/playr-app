import mongoose from "mongoose";

const Training = new mongoose.Schema({
  userId: { type: String, required: true },
  trai21ningDate: { type: String, required: true },
  trainingDuration: { type: String, required: true },
  trainingRating: { type: Number, min: 1, max: 10, required: true },
  trainingType: { type: String, required: true },
  trainingSummary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Training || mongoose.model("Training", Training);
