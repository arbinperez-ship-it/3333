import React, { useState, useMemo } from 'react';
import { Part, PartCategory } from '../types';
import { CalendarDaysIcon, CubeTransparentIcon, TagIcon } from './Icons';

type Period = 'Daily' | 'Weekly' | 'Yearly';

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isWithinLast7Days = (d: Date, today: Date) => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return today.getTime() - d.getTime() <= sevenDaysInMs && d <= today;
}

const isSameYear = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear();


const SummaryReport: React.FC<{ parts: Part[] }> = ({ parts }) => {
    const [period, setPeriod] = useState<Period>('Weekly');

    const reportData = useMemo(() => {
        const today = new Date();
        
        const salesInPeriod: { part: Part; quantity: number }[] = [];

        parts.forEach(part => {
            if (part.salesLog) {
                part.salesLog.forEach(sale => {
                    const saleDate = new Date(sale.date);
                    let isInPeriod = false;
                    switch (period) {
                        case 'Daily':
                            isInPeriod = isSameDay(saleDate, today);
                            break;
                        case 'Weekly':
                            isInPeriod = isWithinLast7Days(saleDate, today);
                            break;
                        case 'Yearly':
                            isInPeriod = isSameYear(saleDate, today);
                            break;
                    }
                    if (isInPeriod) {
                        salesInPeriod.push({ part, quantity: sale.quantity });
                    }
                });
            }
        });

        const uniqueDispatchedItems = new Set(salesInPeriod.map(s => s.part.id)).size;
        const totalUnitsSold = salesInPeriod.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalSalesValue = salesInPeriod.reduce((sum, sale) => sum + (sale.quantity * sale.part.price), 0);
        
        const categoryCounts = salesInPeriod.reduce((acc, sale) => {
            acc[sale.part.category] = (acc[sale.part.category] || 0) + sale.quantity;
            return acc;
        }, {} as Record<PartCategory, number>);

        const bestSellingCategory = Object.keys(categoryCounts).length > 0
            ? Object.entries(categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
            : 'N/A';

        return { uniqueDispatchedItems, totalUnitsSold, totalSalesValue, bestSellingCategory };
    }, [parts, period]);

    return (
        <div className="bg-brand-medium p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white mb-3 sm:mb-0">Dispatch Summary</h2>
                <div className="flex bg-brand-light p-1 rounded-md">
                    {(['Daily', 'Weekly', 'Yearly'] as Period[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                period === p ? 'bg-brand-orange text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ReportCard
                    icon={<CalendarDaysIcon className="w-6 h-6 text-brand-orange" />}
                    title="Unique Items Dispatched"
                    value={reportData.uniqueDispatchedItems.toLocaleString()}
                />
                 <ReportCard
                    icon={<CubeTransparentIcon className="w-6 h-6 text-brand-orange" />}
                    title="Total Units Sold"
                    value={reportData.totalUnitsSold.toLocaleString()}
                />
                 <ReportCard
                    icon={<span className="text-2xl font-bold text-brand-orange">₱</span>}
                    title="Total Sales Value"
                    value={reportData.totalSalesValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                />
                 <ReportCard
                    icon={<TagIcon className="w-6 h-6 text-brand-orange" />}
                    title="Best-Selling Category"
                    value={reportData.bestSellingCategory}
                    valueClassName="text-base"
                />
            </div>
        </div>
    );
};

interface ReportCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    valueClassName?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ icon, title, value, valueClassName }) => (
    <div className="bg-brand-dark p-4 rounded-lg flex items-center gap-4">
        <div className="bg-brand-light p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h4 className="text-sm text-gray-400">{title}</h4>
            <p className={`text-xl font-bold text-white ${valueClassName || ''}`}>{value}</p>
        </div>
    </div>
);


export default SummaryReport;