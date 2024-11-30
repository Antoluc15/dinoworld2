const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para manejar JSON en solicitudes POST

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'junction.proxy.rlwy.net',
  database: process.env.DB_NAME || 'railway',
  password: process.env.DB_PASSWORD || 'DZPJJGlePMtBqPuWVwpiifqWyvvKkpuI',
  port: process.env.DB_PORT || 21824,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the PostgreSQL database.');
});

// Ruta para obtener el récord global
app.get('/api/highscore', async (req, res) => {
  try {
    const result = await pool.query('SELECT score FROM highscore ORDER BY score DESC LIMIT 1');
    const highScore = result.rows[0] ? result.rows[0].score : 0;
    res.json({ highScore });
  } catch (err) {
    console.error('Error fetching high score:', err);
    res.status(500).json({ error: 'Error fetching high score' });
  }
});

// Ruta para actualizar el récord global
app.post('/api/highscore', async (req, res) => {
  const { score } = req.body;
  console.log('Score received:', score); // Log para verificar que el puntaje ha sido recibido
  try {
    await pool.query('INSERT INTO highscore (score) VALUES ($1)', [score]);
    res.status(201).json({ message: 'High score updated' });
  } catch (err) {
    console.error('Error updating high score:', err);
    res.status(500).json({ error: 'Error updating high score' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
