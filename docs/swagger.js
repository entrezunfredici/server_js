const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Library API',
        version: '1.0.0',
        description: "Documentation de l'API pour la gestion des livres et de l'authentification.",
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: [path.join(__dirname, '..', 'api', '**', '*.js')],
};

module.exports = swaggerJSDoc(options);
