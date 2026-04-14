import { useEffect, useMemo, useState } from 'react';
import {
  fetchCategories,
  fetchGoals,
  fetchMonthlySummary,
  fetchTransactions,
  postTransaction,
  deleteTransaction,
  deleteCategory,
  postCategory,
  postGoal,
  updateGoal,
  deleteGoal
} from './services/api';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import GoalTracker from './components/GoalTracker';
import MonthlySummary from './components/MonthlySummary';
import DashboardCharts from './components/DashboardCharts';

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [selectedMonth, setSelectedMonth] = useState(`${year}-${month}`);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const fetchData = async () => {
    setLoading(true);
    const [transactionsData, categoriesData, goalsData, summaryData] = await Promise.all([
      fetchTransactions(selectedMonth),
      fetchCategories(),
      fetchGoals(),
      fetchMonthlySummary(selectedMonth)
    ]);

    setTransactions(transactionsData);
    setCategories(categoriesData);
    setGoals(goalsData);
    setSummary(summaryData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const handleAddTransaction = async (transaction) => {
    await postTransaction(transaction);
    fetchData();
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    fetchData();
  };

  const handleAddCategory = async (category) => {
    await postCategory(category);
    fetchData();
  };

  const handleAddGoal = async (goal) => {
    await postGoal(goal);
    fetchData();
  };

  const handleUpdateGoal = async (id, goal) => {
    await updateGoal(id, goal);
    fetchData();
  };

  const handleDeleteGoal = async (id) => {
    await deleteGoal(id);
    fetchData();
  };

  const expenseTransactions = useMemo(
    () => transactions.filter((item) => item.type === 'expense'),
    [transactions]
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">MeuBolso</p>
          <h1>Controle financeiro pessoal</h1>
        </div>
        <div className="topbar-meta">
          <span>Visão mensal</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />
          <button className="secondary theme-toggle" type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </div>
      </header>

      <main>
        <section className="summary-grid">
          <MonthlySummary summary={summary} />
          <DashboardCharts transactions={transactions} categories={categories} />
        </section>

        <section className="layout-two-columns">
          <div>
            <TransactionForm categories={categories} onSubmit={handleAddTransaction} />
            <CategoryManager categories={categories} onCreate={handleAddCategory} onDelete={handleDeleteCategory} refresh={fetchData} />
          </div>
          <div>
            <TransactionList transactions={transactions} loading={loading} onDelete={handleDeleteTransaction} />
            <GoalTracker goals={goals} onCreate={handleAddGoal} onUpdate={handleUpdateGoal} onDelete={handleDeleteGoal} refresh={fetchData} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
