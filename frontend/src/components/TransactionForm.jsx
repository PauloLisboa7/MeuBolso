import { useState } from 'react';

function TransactionForm({ categories, onSubmit }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amount || !date) return;
    await onSubmit({ type, amount: Number(amount), categoryId: Number(categoryId) || null, date, description });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="card">
      <h2>Nova transação</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <div className="form-field">
          <label>Valor</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>

        <div className="form-field">
          <label>Categoria</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Selecione</option>
            {categories
              .filter((category) => category.type === type)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-field">
          <label>Data</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Descrição</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: almoço, salário, transporte" />
        </div>

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default TransactionForm;
