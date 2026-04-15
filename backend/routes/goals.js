const express = require('express');
const router = express.Router();
const { db, admin } = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('goals').orderBy('deadline', 'asc').get();
    const goals = [];

    snapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(goals);
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
    const payload = {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('goals').add(payload);
    res.status(201).json({ id: docRef.id, ...payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, targetAmount, currentAmount, deadline } = req.body;

  try {
    const payload = {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline: deadline || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('goals').doc(id).update(payload);
    res.json({ id, ...payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('goals').doc(id).delete();
    res.json({ deleted: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
