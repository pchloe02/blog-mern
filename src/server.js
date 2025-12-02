import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import articleRoutes from './routes/articles.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Blog MERN !',
        version: '1.0.0',
        status: 'Le serveur fonctionne correctement',
        endpoints: {
            articles: '/api/articles'
        }
    });
});
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);


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





