import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number;
}

const connection: ConnectionObj = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return
    }
    
    try {
        const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}`)
        if (connectionDB) {
            return;
        }
    } catch (error) {
        console.error((error as Error)?.message || "Failed to connect to database!");
        process.exit(1)
    }
}

export default dbConnect;