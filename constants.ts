import { Part, PartCategory } from './types';

export const CATEGORIES: PartCategory[] = [
  PartCategory.Engine,
  PartCategory.Brakes,
  PartCategory.Suspension,
  PartCategory.Exhaust,
  PartCategory.Lighting,
  PartCategory.Wheels,
  PartCategory.Accessories,
];

// Dynamically set dates to make summary report always show sample data
const today = new Date();
const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(today.getDate() - 3);
const earlierThisYear = new Date(today.getFullYear(), 1, 10); // Feb 10th of the current year
const evenEarlierThisYear = new Date(today.getFullYear(), 0, 15); // Jan 15th of the current year

export const INITIAL_INVENTORY: Part[] = [
  {
    id: '1',
    name: "Terreins 'Street Fury' Performance Pipe for NMAX",
    sku: 'TR-SC-EX-001',
    category: PartCategory.Exhaust,
    stock: 18,
    price: 2850.00,
    description: "Unleash your scooter's true potential with the Terreins Street Fury performance pipe. Engineered for the Yamaha NMAX, it delivers a throaty exhaust note, improved throttle response, and a noticeable power boost. Full stainless steel construction.",
    imageUrl: 'https://picsum.photos/seed/nmaxpipe/400/300',
    dateAdded: '2023-10-26T10:00:00Z',
    salesLog: [
      { date: today.toISOString(), quantity: 1 },
      { date: threeDaysAgo.toISOString(), quantity: 2 },
    ],
    stockHistory: [{ date: '2023-10-26T10:00:00Z', quantity: 18 }],
  },
  {
    id: '2',
    name: "Terreins 'Quick-Launch' CVT Kit",
    sku: 'TR-SC-CVT-001',
    category: PartCategory.Engine,
    stock: 25,
    price: 1500.00,
    description: "Upgrade your scooter's acceleration with the Terreins Quick-Launch CVT Kit. Includes performance flyballs and clutch springs for faster take-offs and improved mid-range pull. Perfect for city commuting.",
    imageUrl: 'https://picsum.photos/seed/cvtkit/400/300',
    dateAdded: '2023-11-05T11:30:00Z',
    salesLog: [
      { date: twoDaysAgo.toISOString(), quantity: 3 },
      { date: evenEarlierThisYear.toISOString(), quantity: 10 },
    ],
    stockHistory: [{ date: '2023-11-05T11:30:00Z', quantity: 25 }],
  },
  {
    id: '3',
    name: "Terreins CNC Adjustable Brake Levers (Pair)",
    sku: 'TR-SC-BR-005',
    category: PartCategory.Brakes,
    stock: 40,
    price: 899.00,
    description: 'Get the perfect feel and control with Terreins CNC-machined adjustable brake levers. Six levels of adjustment for a custom fit. Made from high-grade aluminum with a durable anodized finish. Universal fit for most Philippine scooter models.',
    imageUrl: 'https://picsum.photos/seed/levers/400/300',
    dateAdded: '2023-11-15T09:20:00Z',
    salesLog: [
       { date: threeDaysAgo.toISOString(), quantity: 5 },
    ],
    stockHistory: [{ date: '2023-11-15T09:20:00Z', quantity: 40 }],
  },
  {
    id: '4',
    name: "Terreins 'Night Piercer' LED Mini Driving Lights",
    sku: 'TR-AC-LGT-012',
    category: PartCategory.Lighting,
    stock: 32,
    price: 1250.00,
    description: 'Illuminate the road ahead with the ultra-bright Night Piercer LED lights. Compact, waterproof, and energy-efficient, they provide exceptional visibility for safer night rides. Comes with a complete wiring harness and switch.',
    imageUrl: 'https://picsum.photos/seed/minidriving/400/300',
    dateAdded: '2024-01-20T14:00:00Z',
    salesLog: [],
    stockHistory: [{ date: '2024-01-20T14:00:00Z', quantity: 32 }],
  },
  {
    id: '5',
    name: "Terreins 'Cargo-Max' 45L Alloy Top Box",
    sku: 'TR-AC-TB-045',
    category: PartCategory.Accessories,
    stock: 12,
    price: 4500.00,
    description: 'Secure your belongings with the rugged Terreins Cargo-Max top box. With a 45-liter capacity, this waterproof and dustproof alloy case can hold a full-face helmet and more. Features a quick-release base plate.',
    imageUrl: 'https://picsum.photos/seed/topbox/400/300',
    dateAdded: earlierThisYear.toISOString(), // Shows up in yearly report
    salesLog: [
       { date: earlierThisYear.toISOString(), quantity: 3 },
    ],
    stockHistory: [{ date: earlierThisYear.toISOString(), quantity: 12 }],
  },
  {
    id: '6',
    name: "Terreins 'Grip-Pro' Scooter Tire (110/80-14)",
    sku: 'TR-SC-WH-110',
    category: PartCategory.Wheels,
    stock: 50,
    price: 1800.00,
    description: 'Experience superior handling in wet or dry conditions with the Grip-Pro scooter tire. Its advanced tread compound offers excellent grip and longevity, making it the ideal choice for daily commuters. Size 110/80-14.',
    imageUrl: 'https://picsum.photos/seed/tire/400/300',
    dateAdded: threeDaysAgo.toISOString(), // Shows up in weekly report
    salesLog: [],
    stockHistory: [{ date: threeDaysAgo.toISOString(), quantity: 50 }],
  },
  {
    id: '7',
    name: "Terreins 'Comfort-Ride' Rear Shock (310mm)",
    sku: 'TR-SC-SP-310',
    category: PartCategory.Suspension,
    stock: 22,
    price: 2100.00,
    description: 'Smooth out rough Philippine roads with the Terreins Comfort-Ride rear shock absorber. Features adjustable preload and a gas-charged reservoir for consistent damping performance. A direct-fit upgrade for Honda Click models.',
    imageUrl: 'https://picsum.photos/seed/scootershock/400/300',
    dateAdded: today.toISOString(), // Shows up in daily report
    salesLog: [
      { date: today.toISOString(), quantity: 2 },
    ],
    stockHistory: [{ date: today.toISOString(), quantity: 22 }],
  },
];