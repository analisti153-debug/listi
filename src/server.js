const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Pastikan path file swagger.json kamu benar

const app = express();

// URL CDN untuk Asset Swagger UI
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";

// Setup Swagger UI dengan customCssUrl
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL })
);

module.exports = app; // Sangat penting untuk Vercel Export