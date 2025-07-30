import mongoose from "mongoose";

export const connectDB: () => Promise<void> = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        await mongoose.connect(mongoUri, {});
        console.log("MongoDB connected");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error connecting to MongoDB:", error.message);
        } else {
            console.error("Error connecting to MongoDB: An unknown error occurred", error);
        }
        process.exit(1);
    }
}