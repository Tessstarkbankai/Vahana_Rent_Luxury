import mongoose from "mongoose";

// Global variable to cache the connection
global.mongoose = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
    if (global.mongoose.conn) {
        console.log("Using existing database connection");
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            // Additional serverless optimizations
            maxIdleTimeMS: 30000,
            waitQueueTimeoutMS: 5000,
        };

        console.log("Creating new database connection...");
        global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, options).then((mongoose) => {
            console.log("Database Connected");
            return mongoose;
        });
    }

    try {
        global.mongoose.conn = await global.mongoose.promise;
        return global.mongoose.conn;
    } catch (error) {
        global.mongoose.promise = null;
        console.error("Database connection error:", error);
        throw error;
    }
};

export default connectDB;