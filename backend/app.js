require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, initialize } = require('./db/database');

const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');
const goalsRoutes = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean)
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/goals', goalsRoutes);

app.get('/api/summary/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  try {
    const incomeSnapshot = await db.collection('transactions')
      .where('type', '==', 'income')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    const expenseSnapshot = await db.collection('transactions')
      .where('type', '==', 'expense')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    let totalIncome = 0;
    let totalExpense = 0;

    incomeSnapshot.forEach((doc) => {
      totalIncome += Number(doc.data().amount || 0);
    });

    expenseSnapshot.forEach((doc) => {
      totalExpense += Number(doc.data().amount || 0);
    });

    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const startServer = async () => {
  try {
    await initialize();
    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
};

startServer();
