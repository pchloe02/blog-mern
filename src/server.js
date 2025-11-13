import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {res.json({
    message: 'Welcome to the API', 
    status: 'success', 
    version: '1.0.0'});
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('URL: http://localhost:' + PORT);
        console.log(`ENV: ${process.env.NODE_ENV || 'developement'}`);

    });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
} 

startServer()





