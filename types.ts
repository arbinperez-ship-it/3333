export enum PartCategory {
  Engine = 'Engine',
  Brakes = 'Brakes',
  Suspension = 'Suspension',
  Exhaust = 'Exhaust',
  Lighting = 'Lighting',
  Wheels = 'Wheels & Tires',
  Accessories = 'Accessories',
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  category: PartCategory;
  stock: number;
  price: number;
  description: string;
  imageUrl: string;
  dateAdded: string;
  salesLog: { date: string; quantity: number }[];
  stockHistory: { date: string; quantity: number }[];
}