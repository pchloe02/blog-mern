import mongoose from "mongoose";

export const connectDB = async () => { 
    try {
        const options = {}

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error, cannot connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error(`Error, cannot disconnect from MongoDB: ${error.message}`);
    }
};

mongoose.connection.on('error', (err) => {
    console.error('Error MongoDB:', err);
})

mongoose.connection.on('disconnected', () => {
    console.log('Warning : MongoDB disconnected')
})

// Ctrl + C 

process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});


