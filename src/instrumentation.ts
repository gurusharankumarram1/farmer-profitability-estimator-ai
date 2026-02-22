export async function register() {
  // We only run this in the Node.js runtime, as Mongoose does not work on edge.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("./config/db.config");
    const { autoSeedDatabase } = await import("./utils/seed");
    try {
      await connectDB();
      // Ensure collections and data exist
      await autoSeedDatabase();
    } catch (error) {
      console.error("Startup DB Connection/Seeding Error:", error);
    }
  }
}
