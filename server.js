const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Listar todas as tarefas
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  db.run(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, description, completed: 0 });
    }
  );
});

// Atualizar tarefa (marcar concluída)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: true });
    }
  );
});

// Deletar tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
