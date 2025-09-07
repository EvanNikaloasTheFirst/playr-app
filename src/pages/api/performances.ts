import { MongoClient, ObjectId } from "mongodb";

let client;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(process.env.MONGODB_URI);
  client = global._mongoClient;
} else {
  client = global._mongoClient;
}

export async function GET(req) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("performances");

  // Get userId from request headers or query
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId"); // pass userId from frontend

  const performances = await collection.find({ userId }).toArray();
  return new Response(JSON.stringify(performances), { status: 200 });
}

export async function POST(req) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("performances");

  const newPerf = await req.json();

  // Ensure the performance has a userId
  if (!newPerf.userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

  const result = await collection.insertOne(newPerf);
  return new Response(JSON.stringify({ ...newPerf, id: result.insertedId }), { status: 201 });
}

export async function DELETE(req, { params }) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("performances");

  try {
    const { id } = params; // now id exists
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Performance not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete performance" }), { status: 500 });
  }
}
