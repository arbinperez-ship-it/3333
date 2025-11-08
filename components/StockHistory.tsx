import React from 'react';

interface StockHistoryProps {
  history: { date: string; quantity: number }[];
}

const StockHistory: React.FC<StockHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="mt-8 border-t border-brand-light pt-6">
        <h3 className="text-xl font-semibold text-white mb-3">Stock History</h3>
        <p className="text-gray-400">No stock history available.</p>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mt-8 border-t border-brand-light pt-6">
      <h3 className="text-xl font-semibold text-white mb-3">Stock History</h3>
      <div className="bg-brand-dark rounded-lg overflow-hidden max-h-64 overflow-y-auto">
        <table className="min-w-full divide-y divide-brand-light">
          <thead className="bg-brand-light/50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date of Change</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">New Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {sortedHistory.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(entry.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-white">
                  {entry.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockHistory;