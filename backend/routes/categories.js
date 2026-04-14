const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const VALID_TYPES = ['income', 'expense'];

router.get('/', async (req, res) => {
  try {
    const rows = await db('categories').select('*').orderBy('name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Tipo de categoria inválido.' });
  }

  try {
    const result = await db('categories').insert({ name, type });
    const id = Array.isArray(result) ? result[0] : result;
    res.status(201).json({ id, name, type });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Tipo de categoria inválido.' });
  }

  try {
    const updated = await db('categories').where({ id }).update({ name, type });
    res.json({ updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('categories').where({ id }).del();
    res.json({ deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
