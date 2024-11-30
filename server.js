const express = require('express');
const path = require('path');
const { Pool } = require('pg');  // Importamos Pool de pg para manejar la conexión a PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'junction.proxy.rlwy.net',
  database: process.env.DB_NAME ||  'railway',
  password: process.env.DB_PASSWORD || 'DZPJJGlePMtBqPuWVwpiifqWyvvKkpuI',
  port: process.env.DB_PORT || '21824';  // El puerto predeterminado de PostgreSQL
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the PostgreSQL database.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
