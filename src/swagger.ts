// Objeto principal da documentação Swagger/OpenAPI
const swaggerDocument = {
    // Versão do padrão OpenAPI utilizado
    openapi: '3.0.0',

    // Informações da API
    info: {
        // Nome da API
        title: 'MovieFlix API',

        // Descrição da API
        description: 'API responsável por gerenciar os filmes do MovieFlix.',

        // Versão da API
        version: '1.0.0',
    },

    // Local onde ficarão as rotas/endpoints documentados
    paths: {
        '/movies': {
            get: {
                tags: ['Movie'],
                summary: 'Obter todos os filmes',
                responses: {
                    '200': {
                        description: 'Lista de filmes obtida com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Movie',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/movies/{id}': {
            put: {
                tags: ['Movie'],
                summary: 'Atualizar um filme',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID do filme a ser atualizado',
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/MovieInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Filme atualizado com sucesso',
                    },
                    '404': {
                        description: 'Filme não encontrado',
                    },
                    '500': {
                        description: 'Falha ao atualizar o filme',
                    },
                },
            },
            delete: {
                tags: ['Movie'],
                summary: 'Remover um filme',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID do filme a ser removido',
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Filme removido com sucesso',
                    },
                    '404': {
                        description: 'Filme não encontrado',
                    },
                    '500': {
                        description: 'Falha ao remover o filme',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Movie: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID do filme',
                    },
                    title: {
                        type: 'string',
                        description: 'Título do filme',
                    },
                    genre_id: {
                        type: 'integer',
                        description: 'Gênero do filme',
                    },
                    genres: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                description: 'ID do gênero',
                            },
                            name: {
                                type: 'string',
                                description: 'Nome do gênero',
                            },
                        },
                    },
                    language_id: {
                        type: 'integer',
                        description: 'Idioma do filme',
                    },
                    languages: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                description: 'ID do idioma',
                            },
                            name: {
                                type: 'string',
                                description: 'Nome do idioma',
                            },
                        },
                    },
                    oscar_count: {
                        type: 'integer',
                        description: 'Número de Oscars ganhos pelo filme',
                    },
                    release_date: {
                        type: 'string',
                        format: 'date',
                        description: 'Data de lançamento do filme',
                    },
                },
            },
            MovieInput: {
                type: 'object',
                required: [
                    'title',
                    'genre_id',
                    'language_id',
                    'oscar_count',
                    'release_date',
                ],
                properties: {
                    title: {
                        type: 'string',
                        description: 'Título do filme',
                    },
                    genre_id: {
                        type: 'integer',
                        description: 'ID do gênero',
                    },
                    language_id: {
                        type: 'integer',
                        description: 'ID do idioma',
                    },
                    oscar_count: {
                        type: 'integer',
                        description: 'Número de Oscars ganhos pelo filme',
                    },
                    release_date: {
                        type: 'string',
                        format: 'date',
                        description: 'Data de lançamento do filme',
                    },
                },
            },
        },
    },
};

// Exporta o objeto para ser usado no server.ts
export default swaggerDocument;
