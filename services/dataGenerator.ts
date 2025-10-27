import { Transaction, UserProfile } from '../types';

const users: UserProfile[] = [
  { id: 'user_1', name: 'Alice', homeCountry: 'USA', typicalSpending: { min: 10, max: 200 } },
  { id: 'user_2', name: 'Bob', homeCountry: 'Canada', typicalSpending: { min: 20, max: 350 } },
  { id: 'user_3', name: 'Charlie', homeCountry: 'UK', typicalSpending: { min: 5, max: 150 } },
  { id: 'user_4', name: 'Diana', homeCountry: 'Germany', typicalSpending: { min: 50, max: 500 } },
];

const merchants = [
  'TechCorp Electronics', 'Global Coffee Chain', 'Speedy Online Mart', 'The Book Nook', 'Gourmet Burger Bar',
  'Fashion Forward', 'Digital Stream Co.', 'City Transit System', 'Home Improvement Warehouse', 'Fine Dining Italian'
];

const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'Nigeria'];

let transactionCounter = 0;

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateFraudulentTransaction = (user: UserProfile): Transaction => {
  const fraudType = Math.random();
  transactionCounter++;

  // High amount fraud
  if (fraudType < 0.5) {
    return {
      transactionId: `txn_${Date.now()}_${transactionCounter}`,
      timestamp: new Date().toISOString(),
      amount: parseFloat((user.typicalSpending.max * 5 + Math.random() * 1000).toFixed(2)),
      currency: 'USD',
      merchant: getRandomElement(merchants),
      country: user.homeCountry,
      user,
    };
  }

  // Foreign country fraud
  return {
    transactionId: `txn_${Date.now()}_${transactionCounter}`,
    timestamp: new Date().toISOString(),
    amount: parseFloat((user.typicalSpending.min + Math.random() * (user.typicalSpending.max - user.typicalSpending.min)).toFixed(2)),
    currency: 'USD',
    merchant: getRandomElement(merchants),
    country: getRandomElement(countries.filter(c => c !== user.homeCountry)),
    user,
  };
};

const generateNormalTransaction = (user: UserProfile): Transaction => {
  transactionCounter++;
  return {
    transactionId: `txn_${Date.now()}_${transactionCounter}`,
    timestamp: new Date().toISOString(),
    amount: parseFloat((user.typicalSpending.min + Math.random() * (user.typicalSpending.max - user.typicalSpending.min)).toFixed(2)),
    currency: 'USD',
    merchant: getRandomElement(merchants),
    country: user.homeCountry,
    user,
  };
};

export const generateTransaction = (): Transaction => {
  const user = getRandomElement(users);
  const isFraudulent = Math.random() < 0.2; // 20% chance of a fraudulent transaction
  return isFraudulent ? generateFraudulentTransaction(user) : generateNormalTransaction(user);
};