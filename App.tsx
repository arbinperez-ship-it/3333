import React, { useState, useMemo, useCallback } from 'react';
import { Part, PartCategory } from './types';
import { INITIAL_INVENTORY, CATEGORIES } from './constants';
import { PencilIcon, PlusIcon, TrashIcon, DocumentTextIcon, StorefrontIcon, Squares2X2Icon } from './components/Icons';
import Logo from './components/Logo';
import PartModal from './components/PartModal';
import SingleItemView from './components/SingleItemView';
import SummaryReport from './components/SummaryReport';
import EodReport from './components/EodReport';
import CatalogueView from './components/CatalogueView';

const Header: React.FC<{ appView: 'inventory' | 'catalogue', onToggleView: () => void }> = ({ appView, onToggleView }) => (
    <header className="bg-brand-medium/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Logo className="h-10 w-auto" />
                <h1 className="text-2xl font-bold text-white tracking-wider hidden sm:block uppercase">
                    {appView}
                </h1>
            </div>
            <button
                onClick={onToggleView}
                className="flex items-center gap-2 bg-brand-light text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition-colors shadow-md"
                aria-label={appView === 'inventory' ? 'Switch to catalogue view' : 'Switch to inventory view'}
            >
                {appView === 'inventory' ? (
                    <>
                        <StorefrontIcon className="w-5 h-5" />
                        <span className="hidden md:inline">View Catalogue</span>
                    </>
                ) : (
                    <>
                        <Squares2X2Icon className="w-5 h-5" />
                        <span className="hidden md:inline">Manage Inventory</span>
                    </>
                )}
            </button>
        </div>
    </header>
);

const DashboardMetrics: React.FC<{ parts: Part[] }> = ({ parts }) => {
    const totalItems = parts.length;
    const totalStockValue = useMemo(() => 
        parts.reduce((sum, part) => sum + (part.stock * part.price), 0), 
        [parts]
    );
    const lowStockItems = useMemo(() => 
        parts.filter(part => part.stock < 10).length, 
        [parts]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Total Unique Parts" value={totalItems.toString()} />
            <MetricCard title="Total Stock Value" value={totalStockValue.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} />
            <MetricCard title="Low Stock Items" value={lowStockItems.toString()} highlight={lowStockItems > 0} />
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; highlight?: boolean }> = ({ title, value, highlight = false }) => (
    <div className="bg-brand-medium p-6 rounded-lg shadow-md">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
    </div>
);


const App: React.FC = () => {
    const [inventory, setInventory] = useState<Part[]>(INITIAL_INVENTORY);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<Part | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<PartCategory | 'All'>('All');
    const [view, setView] = useState<'list' | 'single'>('list');
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [isEodModalOpen, setIsEodModalOpen] = useState(false);
    const [appView, setAppView] = useState<'inventory' | 'catalogue'>('inventory');


    const handleOpenModal = (part?: Part) => {
        setEditingPart(part || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPart(null);
    };

    const handleViewPart = (part: Part) => {
        setSelectedPart(part);
        setView('single');
    };

    const handleBackToList = () => {
        setSelectedPart(null);
        setView('list');
    };

    const handleSavePart = (part: Part) => {
        const sortedInventory = (inv: Part[]) => inv.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        setInventory(prev => {
            const existingPart = prev.find(p => p.id === part.id);
            
            if (existingPart) {
                // Update
                const updatedPart = { ...part };
                
                if (existingPart.stock !== updatedPart.stock) {
                    updatedPart.stockHistory = [
                        ...(existingPart.stockHistory || []),
                        { date: new Date().toISOString(), quantity: updatedPart.stock }
                    ];
                } else {
                    updatedPart.stockHistory = existingPart.stockHistory || [];
                }

                updatedPart.salesLog = existingPart.salesLog;
                
                const updatedInventory = prev.map(p => p.id === part.id ? updatedPart : p);
                
                if (selectedPart?.id === part.id) {
                    setSelectedPart(updatedPart);
                }
                return sortedInventory(updatedInventory);
            } else {
                // New part
                const newPart = {
                    ...part,
                    salesLog: [],
                    stockHistory: [{
                        date: part.dateAdded,
                        quantity: part.stock
                    }]
                };
                return sortedInventory([newPart, ...prev]);
            }
        });
        handleCloseModal();
    };

    const handleDeletePart = useCallback((partId: string) => {
        if (window.confirm("Are you sure you want to delete this part? This action cannot be undone.")) {
            setInventory(prev => prev.filter(p => p.id !== partId));
            if (view === 'single') {
                handleBackToList();
            }
        }
    }, [view]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(part => {
            const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  part.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || part.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [inventory, searchTerm, categoryFilter]);
    
    return (
        <div className="min-h-screen bg-brand-dark text-gray-200 font-sans">
            <Header appView={appView} onToggleView={() => setAppView(prev => prev === 'inventory' ? 'catalogue' : 'inventory')} />
            <main className="container mx-auto p-4 md:p-8">

                {view === 'list' ? (
                    <>
                        {appView === 'inventory' && (
                             <>
                                <DashboardMetrics parts={inventory} />
                                <SummaryReport parts={inventory} />
                             </>
                        )}
                        <div className="bg-brand-medium p-4 rounded-lg shadow-md mb-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="w-full md:w-auto flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search by name or SKU..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-brand-light border-brand-light rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange"
                                    />
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value as PartCategory | 'All')}
                                        className="w-full md:w-auto bg-brand-light border-brand-light rounded-md shadow-sm text-white focus:ring-brand-orange focus:border-brand-orange"
                                >
                                        <option value="All">All Categories</option>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {appView === 'inventory' && (
                                    <>
                                        <button onClick={() => setIsEodModalOpen(true)} className="flex items-center justify-center gap-2 w-full md:w-auto bg-brand-light text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition-colors shadow-md">
                                            <DocumentTextIcon className="w-5 h-5" />
                                            <span>EOD Report</span>
                                        </button>
                                        <button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2 w-full md:w-auto bg-brand-orange text-white font-semibold px-4 py-2 rounded-md hover:bg-orange-600 transition-colors shadow-lg">
                                            <PlusIcon className="w-5 h-5" />
                                            <span>Add Part</span>
                                        </button>
                                    </>
                                )}
                                </div>
                            </div>
                        </div>
                        {appView === 'inventory' ? (
                            <InventoryTable parts={filteredInventory} onView={handleViewPart} onEdit={handleOpenModal} onDelete={handleDeletePart} />
                        ) : (
                            <CatalogueView parts={filteredInventory} />
                        )}
                    </>
                ) : (
                    selectedPart && <SingleItemView part={selectedPart} onBack={handleBackToList} onEdit={handleOpenModal} onDelete={handleDeletePart} />
                )}
            </main>

            <PartModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePart}
                partToEdit={editingPart}
            />
            <EodReport
                isOpen={isEodModalOpen}
                onClose={() => setIsEodModalOpen(false)}
                parts={inventory}
            />
        </div>
    );
};

const InventoryTable: React.FC<{ parts: Part[], onEdit: (part: Part) => void, onDelete: (id: string) => void, onView: (part: Part) => void }> = ({ parts, onEdit, onDelete, onView }) => {
    return (
        <div className="overflow-x-auto bg-brand-medium rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-brand-light">
                <thead className="bg-brand-light/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Part</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Added</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-brand-medium divide-y divide-brand-light">
                    {parts.length > 0 ? parts.map(part => (
                        <tr key={part.id} className="hover:bg-brand-light/40 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <img className="h-12 w-12 rounded-md object-cover" src={part.imageUrl} alt={part.name} />
                                    </div>
                                    <div className="ml-4">
                                        <button onClick={() => onView(part)} className="text-sm font-medium text-white hover:text-brand-orange transition-colors text-left">
                                            {part.name}
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{part.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-200">{part.category}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(part.dateAdded).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex items-center justify-end gap-2">
                                    <span className={`font-semibold ${part.stock < 10 ? 'text-yellow-400' : 'text-white'}`}>
                                        {part.stock}
                                    </span>
                                    {part.stock < 10 && (
                                        <span className="relative flex h-2 w-2" title="Low Stock">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">{part.price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end items-center gap-3">
                                    <button onClick={() => onEdit(part)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit Part">
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => onDelete(part.id)} className="text-red-500 hover:text-red-400 transition-colors" title="Delete Part">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7} className="text-center py-10 text-gray-400">
                                No parts found. Try adjusting your search or filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


export default App;