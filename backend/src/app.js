const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/todos', todoRoutes);

module.exports = app;
