import React, { useState, useEffect, useCallback } from 'react';
import { Part, PartCategory } from '../types';
import { CATEGORIES } from '../constants';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, XMarkIcon, UploadIcon, PlusIcon, MinusIcon } from './Icons';

interface PartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (part: Part) => void;
  partToEdit?: Part | null;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x300/374151/7f8ea3?text=No+Image';

const PartModal: React.FC<PartModalProps> = ({ isOpen, onClose, onSave, partToEdit }) => {
  const initialPartState: Omit<Part, 'id'> = {
    name: '',
    sku: '',
    category: PartCategory.Engine,
    stock: 0,
    price: 0,
    description: '',
    imageUrl: PLACEHOLDER_IMAGE,
    dateAdded: new Date().toISOString(),
    salesLog: [],
    stockHistory: [],
  };

  const [part, setPart] = useState<Omit<Part, 'id'>>(initialPartState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdjustInput, setShowAdjustInput] = useState<'add' | 'remove' | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (partToEdit) {
        setPart({ ...partToEdit, imageUrl: partToEdit.imageUrl || PLACEHOLDER_IMAGE });
      } else {
        setPart(initialPartState);
      }
      setShowAdjustInput(null);
      setAdjustAmount('');
    }
  }, [partToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPart(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPart(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!part.name || !part.category) {
        alert("Please enter a Part Name and select a Category first.");
        return;
    }
    setIsGenerating(true);
    const desc = await generateDescription(part.name, part.category);
    setPart(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  }, [part.name, part.category]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...part,
      id: partToEdit?.id || new Date().toISOString(),
      dateAdded: partToEdit?.dateAdded || new Date().toISOString(),
    });
  };

  const handleApplyAdjustment = () => {
    const amount = parseInt(adjustAmount, 10);
    if (!adjustAmount || isNaN(amount) || amount <= 0) {
        return;
    }

    setPart(prev => {
        const currentStock = prev.stock;
        let newStock;
        if (showAdjustInput === 'add') {
            newStock = currentStock + amount;
        } else {
            newStock = Math.max(0, currentStock - amount);
        }
        return { ...prev, stock: newStock };
    });
    
    setShowAdjustInput(null);
    setAdjustAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-brand-medium rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-brand-light flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{partToEdit ? 'Edit Part' : 'Add New Part'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Part Name</label>
              <input type="text" name="name" id="name" value={part.name} onChange={handleChange} required className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange" />
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
              <input type="text" name="sku" id="sku" value={part.sku} onChange={handleChange} required className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select name="category" id="category" value={part.category} onChange={handleChange} required className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity</label>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="text" 
                  id="stock" 
                  value={part.stock} 
                  readOnly 
                  className="w-full bg-brand-dark border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange tabular-nums" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAdjustInput(showAdjustInput === 'add' ? null : 'add');
                    setAdjustAmount('');
                  }}
                  title="Add Stock"
                  className={`p-2 rounded-md transition-colors ${showAdjustInput === 'add' ? 'bg-green-600 text-white' : 'bg-brand-light hover:bg-gray-600 text-gray-300'}`}
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAdjustInput(showAdjustInput === 'remove' ? null : 'remove');
                    setAdjustAmount('');
                  }}
                  title="Remove Stock"
                  className={`p-2 rounded-md transition-colors ${showAdjustInput === 'remove' ? 'bg-red-600 text-white' : 'bg-brand-light hover:bg-gray-600 text-gray-300'}`}
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
              </div>
              {showAdjustInput && (
                <div className="mt-3 bg-brand-dark/50 p-3 rounded-md">
                  <label className="text-sm font-medium text-gray-300">
                    Amount to {showAdjustInput === 'add' ? 'Add' : 'Remove'}:
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      min="1"
                      placeholder="e.g., 5"
                      className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyAdjustment} 
                      className="px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
               <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price</label>
               <input type="number" name="price" id="price" value={part.price} onChange={handleChange} required min="0" step="0.01" className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Part Image</label>
            <div className="flex items-center gap-5">
                <img src={part.imageUrl} alt="Part preview" className="w-28 h-28 rounded-lg object-cover bg-brand-light flex-shrink-0" />
                <div className="flex-grow">
                    <input
                        type="file"
                        id="imageUpload"
                        name="imageUpload"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="imageUpload"
                        className="cursor-pointer bg-brand-light hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm inline-flex items-center gap-2"
                    >
                        <UploadIcon className="w-5 h-5" />
                        <span>Change Image</span>
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Upload a new image to replace the current one.</p>
                </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <div className="relative">
              <textarea name="description" id="description" value={part.description} onChange={handleChange} required rows={4} className="w-full bg-brand-light border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange pr-32"></textarea>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="absolute top-2 right-2 flex items-center gap-1.5 bg-brand-orange/20 text-brand-orange px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SparklesIcon className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Generating...' : 'Generate AI'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-light">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-brand-light text-white rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">Save Part</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartModal;