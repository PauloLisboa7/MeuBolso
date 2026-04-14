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

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/goals', goalsRoutes);

app.get('/api/summary/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = `${year}-${String(month).padStart(2, '0')}-31`;

  try {
    const [row] = await db('transactions')
      .select(
        db.raw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income"),
        db.raw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense")
      )
      .whereBetween('date', [start, end]);

    const totalIncome = row.total_income || 0;
    const totalExpense = row.total_expense || 0;
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
  await initialize();
  app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
});
