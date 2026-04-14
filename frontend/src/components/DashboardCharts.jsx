function DashboardCharts({ transactions, categories }) {
  const expenseDistribution = categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const total = transactions
        .filter((tx) => tx.category_name === category.name && tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { ...category, total };
    })
    .filter((item) => item.total > 0);

  const totalExpense = expenseDistribution.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gap: '18px' }}>
        <div>
          <h3>Distribuição de gastos</h3>
          {expenseDistribution.length === 0 ? (
            <p>Nenhum gasto registrado ainda.</p>
          ) : (
            <div className="chart-legend">
              {expenseDistribution.map((item, index) => {
                const percent = ((item.total / totalExpense) * 100).toFixed(1);
                const color = `hsl(${index * 42 % 360}, 72%, 60%)`;
                return (
                  <div key={item.id} className="legend-item">
                    <span className="legend-color" style={{ background: color }} />
                    <span>{item.name}: R$ {item.total.toFixed(2)} ({percent}%)</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <h3>Indicadores rápidos</h3>
          <div className="indicator-grid">
            <div className="indicator-card">
              <strong>Total de transações</strong>
              <p>{transactions.length}</p>
            </div>
            <div className="indicator-card">
              <strong>Total de categorias</strong>
              <p>{categories.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
