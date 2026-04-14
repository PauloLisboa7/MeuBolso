const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Erro na requisição');
  }
  return response.json();
}

export function fetchTransactions(month) {
  if (!month) return apiFetch('/transactions');
  const [year, m] = month.split('-');
  return apiFetch(`/transactions/monthly/${year}/${m}`);
}

export function fetchCategories() {
  return apiFetch('/categories');
}

export function postCategory(category) {
  return apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(category)
  });
}

export function deleteCategory(id) {
  return apiFetch(`/categories/${id}`, { method: 'DELETE' });
}

export function fetchGoals() {
  return apiFetch('/goals');
}

export function postGoal(goal) {
  return apiFetch('/goals', {
    method: 'POST',
    body: JSON.stringify(goal)
  });
}

export function updateGoal(id, goal) {
  return apiFetch(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(goal)
  });
}

export function deleteGoal(id) {
  return apiFetch(`/goals/${id}`, { method: 'DELETE' });
}

export function fetchMonthlySummary(month) {
  if (!month) return Promise.resolve({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [year, m] = month.split('-');
  return apiFetch(`/summary/${year}/${m}`);
}

export function postTransaction(transaction) {
  return apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
}

export function deleteTransaction(id) {
  return apiFetch(`/transactions/${id}`, { method: 'DELETE' });
}
