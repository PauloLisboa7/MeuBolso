function MonthlySummary({ summary }) {
  return (
    <div className="card">
      <h2>Resumo mensal</h2>
      <div className="summary-card" style={{ marginTop: '20px' }}>
        <div className="metric-card">
          <p>Receitas</p>
          <strong>R$ {summary.totalIncome.toFixed(2)}</strong>
        </div>
        <div className="metric-card">
          <p>Despesas</p>
          <strong>R$ {summary.totalExpense.toFixed(2)}</strong>
        </div>
        <div className="metric-card">
          <p>Saldo</p>
          <strong>R$ {summary.balance.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

export default MonthlySummary;
