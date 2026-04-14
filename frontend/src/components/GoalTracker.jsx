import { useState } from 'react';

function GoalTracker({ goals, onCreate, onUpdate, onDelete, refresh }) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [inputAmounts, setInputAmounts] = useState({});

  const addGoal = async (event) => {
    event.preventDefault();
    if (!title || !targetAmount) return;

    await onCreate({ title, targetAmount: Number(targetAmount), deadline, currentAmount: 0 });
    setTitle('');
    setTargetAmount('');
    setDeadline('');
  };

  const updateCurrentAmount = async (goal) => {
    const value = Number(inputAmounts[goal.id]);
    if (Number.isNaN(value)) return;

    await onUpdate(goal.id, {
      title: goal.title,
      targetAmount: goal.target_amount,
      currentAmount: value,
      deadline: goal.deadline
    });
    setInputAmounts((prev) => ({ ...prev, [goal.id]: '' }));
    refresh();
  };

  const handleInputChange = (goalId, value) => {
    setInputAmounts((prev) => ({ ...prev, [goalId]: value }));
  };

  return (
    <div className="card">
      <h2>Metas financeiras</h2>
      <form onSubmit={addGoal} className="form-field">
        <label>Título da meta</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Viagem" />

        <label>Valor alvo</label>
        <input type="number" min="0" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="R$ 0.00" />

        <label>Prazo</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <button type="submit">Criar meta</button>
      </form>

      {goals.length === 0 ? (
        <p>Nenhuma meta cadastrada ainda.</p>
      ) : (
        goals.map((goal) => {
          const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          return (
            <div key={goal.id} style={{ marginBottom: '18px' }}>
              <strong>{goal.title}</strong>
              <div className="progress-bar" style={{ marginTop: '10px' }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ margin: '8px 0 0' }}>
                R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)} ({progress.toFixed(0)}%)
              </p>
              <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={inputAmounts[goal.id] || ''}
                  onChange={(e) => handleInputChange(goal.id, e.target.value)}
                  placeholder="Atualizar valor atual"
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="secondary" type="button" onClick={() => updateCurrentAmount(goal)}>
                    Atualizar progresso
                  </button>
                  <button className="secondary" type="button" onClick={() => onDelete(goal.id)}>
                    Excluir meta
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GoalTracker;
