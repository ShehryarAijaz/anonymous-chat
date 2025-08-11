import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number;
}

const connection: ConnectionObj = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database")
        return
    }
    
    try {
        const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}`)
        if (connectionDB) {
            console.log(`Successfully connected to database! ${connection.isConnected = connectionDB.connections[0].readyState}`)
            return;
        }
    } catch (error: any) {
        console.error(error.message || "Failed to connect to database!")
        process.exit(1)
    }
}

export default dbConnect;