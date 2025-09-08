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

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const recent = url.searchParams.get("recent");

  if (recent === "true") {
  const lastPerfArray = await collection
    .find({ userId })
    .sort({ date: -1 }) // descending by string "yyyy-mm-dd" works
    .limit(1)
    .toArray();

  const lastPerf = lastPerfArray[0] || null;


  return new Response(JSON.stringify(lastPerf), { status: 200 });
}
}

export async function POST(req) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("performances");

  const newPerf = await req.json();

  if (!newPerf.userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  // Add timestamp
  newPerf.createdAt = new Date();

  const result = await collection.insertOne(newPerf);
  return new Response(JSON.stringify({ ...newPerf, id: result.insertedId }), { status: 201 });
}

export async function DELETE(req, { params }) {
  await client.connect();
  const db = client.db("playr");
  const collection = db.collection("performances");

  try {
    const { id } = params;
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
