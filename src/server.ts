import 'dotenv/config';
import express from 'express';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const port = 3000;
const app = express();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: 'asc',
        },
        include: {
            genres: true,
            languages: true,
        },
    });
    res.json(movies);
});

app.post('/movies', async (req, res) => {
    const { title, release_date, genre_id, language_id, oscar_count } =
        req.body;

    try {
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: 'insensitive' },
            },
        });

        if (movieWithSameTitle) {
            return res.status(409).send('Já existe um filme com esse nome');
        }

        await prisma.movie.create({
            data: {
                title,
                release_date: new Date(release_date),
                genre_id,
                language_id,
                oscar_count,
            },
        });

        res.status(201).send('Movie created');
    } catch (error) {
        return res.status(500).send('Erro ao criar filme');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
