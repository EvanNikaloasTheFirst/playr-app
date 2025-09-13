

import { ObjectId } from "mongodb";

// ✅ Reusable helper for getting the collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db("playr");
  return db.collection("performances");
}

export async function GET(req) {
  try {
    const collection = await getCollection();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const recent = url.searchParams.get("recent");

    if (recent === "true") {
      const lastPerf = await collection
        .find({ userId })
        .sort({ date: -1 })
        .limit(1)
        .toArray();

      return new Response(JSON.stringify(lastPerf[0] || null), { status: 200 });
    }

    const performances = await collection.find({ userId }).toArray();
    return new Response(JSON.stringify(performances), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const collection = await getCollection();
    const newPerf = await req.json();

    if (!newPerf.userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400 }
      );
    }

    newPerf.createdAt = new Date();
    const result = await collection.insertOne(newPerf);

    return new Response(
      JSON.stringify({ ...newPerf, id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const collection = await getCollection();
    const { id } = params;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Performance not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Delete error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to delete performance" }),
      { status: 500 }
    );
  }
}
