import React from 'react';
import { Part } from '../types';

interface ProductCardProps {
    part: Part;
}

const ProductCard: React.FC<ProductCardProps> = ({ part }) => {
    const stockStatus = part.stock > 0;

    return (
        <div className="bg-brand-medium rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 group">
            <div className="relative">
                <img src={part.imageUrl} alt={part.name} className="w-full h-48 object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full ${stockStatus ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stockStatus ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-400 uppercase">{part.category}</p>
                <h3 className="text-md font-semibold text-white mt-1 truncate group-hover:text-brand-orange transition-colors">{part.name}</h3>
                <p className="text-lg font-bold text-brand-orange mt-2">{part.price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}</p>
            </div>
        </div>
    );
};

export default ProductCard;
