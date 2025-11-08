import React, { useMemo } from 'react';
import { Part } from '../types';
import { XMarkIcon } from './Icons';

interface EodReportProps {
  isOpen: boolean;
  onClose: () => void;
  parts: Part[];
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const EodReport: React.FC<EodReportProps> = ({ isOpen, onClose, parts }) => {
  const reportData = useMemo(() => {
    const today = new Date();
    const newPartsToday = parts.filter(p => isSameDay(new Date(p.dateAdded), today));
    const outOfStockParts = parts.filter(p => p.stock === 0);

    const valueOfNewStock = newPartsToday.reduce((sum, part) => sum + (part.stock * part.price), 0);

    return {
      date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      newPartsToday,
      outOfStockParts,
      newPartsCount: newPartsToday.length,
      outOfStockCount: outOfStockParts.length,
      valueOfNewStock,
    };
  }, [parts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-brand-medium rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-brand-light flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">End of Day Report</h2>
            <p className="text-sm text-gray-400">{reportData.date}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-brand-dark p-4 rounded-lg">
                    <p className="text-sm text-gray-400">New Parts Added</p>
                    <p className="text-2xl font-bold text-white">{reportData.newPartsCount}</p>
                </div>
                <div className="bg-brand-dark p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Value of New Stock</p>
                    <p className="text-2xl font-bold text-brand-orange">{reportData.valueOfNewStock.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}</p>
                </div>
                <div className="bg-brand-dark p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Items Out of Stock</p>
                    <p className="text-2xl font-bold text-yellow-400">{reportData.outOfStockCount}</p>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section>
                    <h3 className="text-lg font-semibold text-white mb-3">Newly Added Items Today</h3>
                    <div className="bg-brand-dark rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                        {reportData.newPartsToday.length > 0 ? (
                            <table className="min-w-full divide-y divide-brand-light">
                                <thead className="bg-brand-light/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Part Name</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light">
                                    {reportData.newPartsToday.map(part => (
                                        <tr key={part.id}>
                                            <td className="px-4 py-2 text-sm text-white">{part.name}</td>
                                            <td className="px-4 py-2 text-sm text-white text-right font-semibold">{part.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-8 text-gray-400">No new parts were added today.</p>
                        )}
                    </div>
                </section>
                
                <section>
                    <h3 className="text-lg font-semibold text-white mb-3">Out of Stock Items</h3>
                    <div className="bg-brand-dark rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                        {reportData.outOfStockParts.length > 0 ? (
                           <table className="min-w-full divide-y divide-brand-light">
                                <thead className="bg-brand-light/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Part Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">SKU</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light">
                                    {reportData.outOfStockParts.map(part => (
                                        <tr key={part.id}>
                                            <td className="px-4 py-2 text-sm text-yellow-400">{part.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-300">{part.sku}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-8 text-gray-400">No items are currently out of stock.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>

        <div className="p-4 border-t border-brand-light flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EodReport;