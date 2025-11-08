import React, { useState } from 'react';
import { Part } from '../types';
import { suggestReorderQuantity } from '../services/geminiService';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CubeTransparentIcon } from './Icons';
import StockHistory from './StockHistory';

interface SingleItemViewProps {
    part: Part;
    onBack: () => void;
    onEdit: (part: Part) => void;
    onDelete: (id: string) => void;
}

const SingleItemView: React.FC<SingleItemViewProps> = ({ part, onBack, onEdit, onDelete }) => {
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSuggestReorder = async () => {
        setIsSuggesting(true);
        setSuggestion(null);
        setError(null);
        const result = await suggestReorderQuantity(part.name, part.category, part.stock);
        if (result === "Error") {
            setError("Could not generate a suggestion. Please try again.");
        } else {
            setSuggestion(result);
        }
        setIsSuggesting(false);
    };

    return (
        <div className="bg-brand-medium rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-300 hover:text-brand-orange transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Inventory</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="w-full h-auto object-cover rounded-lg shadow-md aspect-square"
                    />
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <div>
                        <span className="px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-200">{part.category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{part.name}</h1>
                        <p className="text-gray-400 font-mono mt-1">SKU: {part.sku}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-brand-light py-4">
                        <InfoBlock label="Stock Quantity" value={part.stock.toString()} isLow={part.stock < 10} />
                        <InfoBlock label="Unit Price" value={part.price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} />
                        <InfoBlock label="Date Added" value={new Date(part.dateAdded).toLocaleDateString()} />
                    </div>

                    <div className="text-gray-300 leading-relaxed">
                        <h3 className="font-semibold text-white mb-1">Description</h3>
                        <p>{part.description}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button onClick={() => onEdit(part)} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg">
                            <PencilIcon className="w-5 h-5" />
                            <span>Edit</span>
                        </button>
                        <button onClick={() => onDelete(part.id)} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg">
                            <TrashIcon className="w-5 h-5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-brand-light pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Inventory Management AI</h3>
                <div className="bg-brand-dark p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-300 text-sm">Need help with reordering? Let AI suggest a quantity.</p>
                    <div className="flex items-center gap-4">
                        {suggestion && !isSuggesting && (
                           <p className="text-white">Suggested quantity: <span className="font-bold text-brand-orange text-lg">{suggestion}</span></p>
                        )}
                         {error && !isSuggesting && (
                           <p className="text-red-400 text-sm">{error}</p>
                        )}
                        <button
                            onClick={handleSuggestReorder}
                            disabled={isSuggesting}
                            className="flex items-center gap-2 bg-brand-orange text-white font-semibold px-4 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed transition-colors shadow-md w-full sm:w-auto"
                        >
                            {isSuggesting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <CubeTransparentIcon className="w-5 h-5" />
                            )}
                            <span>{isSuggesting ? 'Thinking...' : 'Suggest Reorder'}</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <StockHistory history={part.stockHistory} />
        </div>
    );
};

const InfoBlock: React.FC<{ label: string; value: string; isLow?: boolean }> = ({ label, value, isLow = false }) => (
    <div>
        <h4 className="text-sm text-gray-400">{label}</h4>
        <p className={`text-xl font-semibold ${isLow ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
    </div>
);


export default SingleItemView;