import React from 'react';
import { Part } from '../types';
import ProductCard from './ProductCard';

interface CatalogueViewProps {
    parts: Part[];
}

const CatalogueView: React.FC<CatalogueViewProps> = ({ parts }) => {
    return (
        <div className="animate-fade-in">
             {parts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {parts.map(part => (
                        <ProductCard key={part.id} part={part} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400 bg-brand-medium rounded-lg">
                    No products found. Try adjusting your search or filters.
                </div>
            )}
        </div>
    );
};

export default CatalogueView;
