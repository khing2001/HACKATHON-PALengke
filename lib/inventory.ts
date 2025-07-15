import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleProducts } from '../app/testRestock';

const STORAGE_KEY = 'inventory';

type StockLog = {
  type: 'restock' | 'sale';
  quantity: number;
  timestamp: string;
};

export interface Product {
  id: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  image: any;
  storeName: string;
  storeType: string;
  storeLocation: string;
  totalSold?: number;
  capital?: number;
  profit?: number;
  logs: StockLog[];
}
export const getProducts = async(): Promise<Product[]> => {
  try{
    const storedProducts = await AsyncStorage.getItem(STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts): [];
  } catch(e){
    console.error('Failed to get products');
    return [];
  }
}

export const addProduct = async (newProducts: Product) => {
    const initialQty = newProducts.stock;
    const productWithStats = {
      ...newProducts,
      capital: newProducts.cost * initialQty,
      totalSold: 0,
      profit: 0,
    };
  
  const products = await getProducts();
  const updatedProducts = [...products, productWithStats];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
};

export const sellProduct = async (id: string) => {
  const products = await getProducts();
  const updated = products.map(p =>
    p.id === id && p.stock > 0
      ? {
          ...p,
          stock: p.stock - 1,
          totalSold: (p.totalSold || 0) + 1,
          profit: (p.profit || 0) + (p.price - p.cost),
          logs: [
            ...p.logs,
            {
              type: 'sale',
              quantity: 1,
              timestamp: new Date().toISOString(),
            },
          ],
        }
      : p
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const restockProduct = async (id: string, qty: number) => {
  const products = await getProducts();
  const updated = products.map(p =>
    p.id === id
      ? {
          ...p,
          stock: p.stock + qty,
          logs: [
            ...p.logs,
            {
              type: 'restock',
              quantity: qty,
              timestamp: new Date().toISOString(),
            },
          ],
        }
      : p
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const LoadSampleProducts = async () => {
  for (const pr of sampleProducts) {
    await addProduct(pr);
  }
};

export const calculateStats = async () => {
  const products = await getProducts();
  let totalProfit = 0, totalCapital = 0, totalSold = 0;
  let profitToday = 0, profitWeekly = 0;

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  for (const p of products) {
    totalProfit += p.profit || 0;
    totalCapital += p.capital || 0;
    totalSold += p.totalSold || 0;

    for (const log of p.logs) {
      if (log.type === 'sale') {
        const saleDate = new Date(log.timestamp);
        const profitPerUnit = p.price - p.cost;

        if (log.timestamp.startsWith(today)) {
          profitToday += profitPerUnit * log.quantity;
        }

        if (saleDate >= oneWeekAgo) {
          profitWeekly += profitPerUnit * log.quantity;
        }
      }
    }
  }
  return { totalProfit, totalCapital, totalSold, profitToday, profitWeekly };
}

export const getProfitPerDay = async (): Promise<{ date: string; profit: number, label: string }[]> => {
  const products = await getProducts();
  const now = new Date();
  const days: { [date: string]: { profit: number; label: string} } = {};

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const iso = date.toISOString().split('T')[0];
    const label = `{date.getMonth() + 1}/${date.getDate()}`;
    days[iso] = {profit: 0, label};
  }

  for (const p of products) {
    const unitProfit = p.price - p.cost;
    for (const log of p.logs) {
      if (log.type === 'sale') {
        const dateKey = log.timestamp.split('T')[0];
        if (days[dateKey]) {
          days[dateKey].profit += log.quantity * unitProfit;
        }
      }
    }
  }

  return Object.entries(days).map(([_, {profit, label}]) => ({ date: label, profit, label }));
};