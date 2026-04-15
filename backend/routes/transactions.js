const express = require('express');
const router = express.Router();
const { db, admin } = require('../db/database');

const VALID_TYPES = ['income', 'expense'];

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('transactions').orderBy('date', 'desc').get();
    const transactions = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let categoryData = null;

      if (data.categoryId) {
        const catSnap = await db.collection('categories').doc(data.categoryId).get();
        if (catSnap.exists) {
          categoryData = catSnap.data();
        }
      }

      transactions.push({
        id: doc.id,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        description: data.description,
        categoryId: data.categoryId,
        category_name: categoryData?.name || null,
        category_type: categoryData?.type || null
      });
    }

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  try {
    const snapshot = await db.collection('transactions')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'desc')
      .get();

    const transactions = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let categoryData = null;

      if (data.categoryId) {
        const catSnap = await db.collection('categories').doc(data.categoryId).get();
        if (catSnap.exists) {
          categoryData = catSnap.data();
        }
      }

      transactions.push({
        id: doc.id,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        description: data.description,
        categoryId: data.categoryId,
        category_name: categoryData?.name || null,
        category_type: categoryData?.type || null
      });
    }

    res.json(transactions);
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
    const payload = {
      type,
      amount: Number(amount),
      categoryId: categoryId || null,
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('transactions').add(payload);

    res.status(201).json({ id: docRef.id, ...payload });
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
    const payload = {
      type,
      amount: Number(amount),
      categoryId: categoryId || null,
      date,
      description,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('transactions').doc(id).update(payload);

    res.json({ id, ...payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('transactions').doc(id).delete();
    res.json({ deleted: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
