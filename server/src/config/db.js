import mongoose from "mongoose";

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error(
      "Missing MONGO_URI. Create server/.env based on server/.env.example."
    );
  }

  // Beginner-friendly logging
  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB connection error:", err)
  );
  mongoose.connection.on("disconnected", () =>
    console.log("MongoDB disconnected")
  );

  // TODO: add production-grade options (pool sizing, retries, structured logs)
  await mongoose.connect(mongoUri);
}

