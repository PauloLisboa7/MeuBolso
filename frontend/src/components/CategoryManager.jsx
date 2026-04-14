import { useState } from 'react';

function CategoryManager({ categories, onCreate, onDelete, refresh }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  const addCategory = async (event) => {
    event.preventDefault();
    if (!name) return;

    await onCreate({ name, type });
    setName('');
  };

  const removeCategory = async (id) => {
    await onDelete(id);
    refresh();
  };

  return (
    <div className="card">
      <h2>Categorias</h2>

      <form onSubmit={addCategory} className="form-field">
        <label>Nova categoria</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Saúde" />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
        <button type="submit">Criar categoria</button>
      </form>

      <ul className="chart-legend">
        {categories.map((category) => (
          <li key={category.id} className="legend-item">
            <span className="legend-color" style={{ background: category.type === 'expense' ? '#f87171' : '#34d399' }} />
            <span>{category.name} ({category.type === 'expense' ? 'Despesa' : 'Receita'})</span>
            <button className="secondary" type="button" onClick={() => removeCategory(category.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;
