const express = require('express');
const router = express.Router();
const { db, admin } = require('../db/database');
const VALID_TYPES = ['income', 'expense'];

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').orderBy('name').get();
    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(categories);
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
    const payload = {
      name,
      type,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('categories').add(payload);
    res.status(201).json({ id: docRef.id, ...payload });
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
    const payload = {
      name,
      type,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('categories').doc(id).update(payload);
    res.json({ id, ...payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('categories').doc(id).delete();
    res.json({ deleted: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
