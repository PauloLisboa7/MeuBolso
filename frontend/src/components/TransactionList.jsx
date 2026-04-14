function TransactionList({ transactions, loading, onDelete }) {
  return (
    <div className="card">
      <h2>Transações do mês</h2>
      {loading ? (
        <p>Carregando transações...</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhuma transação encontrada para este mês.</td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.description || 'Sem descrição'}</td>
                  <td>{item.category_name || 'Sem categoria'}</td>
                  <td>
                    <span className={`status-chip status-${item.type}`}>{item.type === 'income' ? '+' : '-'}</span>
                    R$ {item.amount.toFixed(2)}
                  </td>
                  <td>
                    {onDelete ? (
                      <button className="secondary" type="button" onClick={() => onDelete(item.id)}>
                        Excluir
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
