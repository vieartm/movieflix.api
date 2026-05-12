import 'dotenv/config';
import express from 'express';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

const port = 3000;
const app = express();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.put('/movies/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id,
            },
        });

        if (!movie) {
            return res.status(404).send({ message: 'filme não encontrado' });
        }

        const data = { ...req.body };
        data.release_date = data.release_date
            ? new Date(data.release_date)
            : undefined;

        await prisma.movie.update({
            where: {
                id,
            },
            data: data,
        });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao atualizar filme' });
    }

    res.status(200).send();
});

app.delete('/movies/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id,
            },
        });

        if (!movie) {
            return res.status(404).send({ message: 'filme não encontrado' });
        }

        await prisma.movie.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao deletar filme' });
    }

    res.status(200).send({ message: 'filme deletado com sucesso' });
});

app.get('/movies/:genreName', async (req, res) => {
    try {
        const moviesFilteredByGenre = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true,
            },
            where: {
                genres: {
                    name: {
                        equals: req.params.genreName,
                        mode: 'insensitive',
                    },
                },
            },
        });
        res.status(200).send(moviesFilteredByGenre);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar filmes por gênero' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
