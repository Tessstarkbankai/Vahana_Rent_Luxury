import mongoose from "mongoose";

let isConnected = false;

const connectDB = async ()=>{
    // If already connected, reuse the connection
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    try {
        mongoose.connection.on('connected', ()=> {
            console.log("Database Connected");
            isConnected = true;
        });
        
        mongoose.connection.on('disconnected', ()=> {
            console.log("Database Disconnected");
            isConnected = false;
        });

        mongoose.connection.on('error', (error) => {
            console.log("Database connection error:", error);
            isConnected = false;
        });

        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };

        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, options);
        isConnected = true;
        
    } catch (error) {
        console.log("Database connection error:", error.message);
        isConnected = false;
        throw error;
    }
}

export default connectDB;