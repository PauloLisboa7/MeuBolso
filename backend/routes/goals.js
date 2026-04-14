const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const rows = await db('goals').select('*').orderBy('deadline', 'asc');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, targetAmount, currentAmount, deadline } = req.body;

  if (!title || !targetAmount || isNaN(Number(targetAmount))) {
    return res.status(400).json({ error: 'Título e valor alvo são obrigatórios.' });
  }

  try {
    const result = await db('goals').insert({
      title,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount) || 0,
      deadline
    });

    const id = Array.isArray(result) ? result[0] : result;
    res.status(201).json({ id, title, targetAmount, currentAmount: Number(currentAmount) || 0, deadline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, targetAmount, currentAmount, deadline } = req.body;

  try {
    const updated = await db('goals')
      .where({ id })
      .update({
        title,
        target_amount: Number(targetAmount),
        current_amount: Number(currentAmount),
        deadline
      });

    res.json({ updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('goals').where({ id }).del();
    res.json({ deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
