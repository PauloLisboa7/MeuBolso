const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

const VALID_TYPES = ['income', 'expense'];

router.get('/', async (req, res) => {
  try {
    const rows = await db('transactions as t')
      .select(
        't.id',
        't.type',
        't.amount',
        't.date',
        't.description',
        'c.name as category_name',
        'c.type as category_type'
      )
      .leftJoin('categories as c', 't.category_id', 'c.id')
      .orderBy('t.date', 'desc');

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = `${year}-${String(month).padStart(2, '0')}-31`;

  try {
    const rows = await db('transactions as t')
      .select(
        't.id',
        't.type',
        't.amount',
        't.date',
        't.description',
        'c.name as category_name',
        'c.type as category_type'
      )
      .leftJoin('categories as c', 't.category_id', 'c.id')
      .whereBetween('t.date', [start, end])
      .orderBy('t.date', 'desc');

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { type, amount, categoryId, date, description } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Tipo de transação inválido.' });
  }

  if (!amount || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Valor inválido.' });
  }

  try {
    const insertQuery = db('transactions');
    const payload = {
      type,
      amount: Number(amount),
      category_id: categoryId || null,
      date,
      description
    };

    const result = db.client.config.client === 'pg'
      ? await insertQuery.returning('id').insert(payload)
      : await insertQuery.insert(payload);

    const id = Array.isArray(result) ? result[0] : result;
    res.status(201).json({ id, type, amount, categoryId, date, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, amount, categoryId, date, description } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Tipo de transação inválido.' });
  }

  try {
    const changes = await db('transactions')
      .where({ id })
      .update({
        type,
        amount: Number(amount),
        category_id: categoryId || null,
        date,
        description
      });

    res.json({ updated: changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('transactions').where({ id }).del();
    res.json({ deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
