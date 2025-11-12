import { Banknote, Bitcoin, CreditCard, Landmark, PiggyBank, ReceiptText, ShoppingCart, TrendingUp } from "lucide-react";

export const accounts = [
  { id: 'acc1', name: 'Chase Checking', type: 'bank', balance: 12540.75, icon: Landmark },
  { id: 'acc2', name: 'Fidelity Investments', type: 'investment', balance: 85234.00, icon: TrendingUp },
  { id: 'acc3', name: 'Amex Gold', type: 'loan', balance: -1250.45, icon: CreditCard },
  { id: 'acc4', name: 'Coinbase', type: 'crypto', balance: 2310.60, icon: Bitcoin },
  { id: 'acc5', name: 'High-Yield Savings', type: 'bank', balance: 56000.00, icon: PiggyBank },
];

export const transactions = [
  { id: 'trx1', date: '2024-07-28', description: 'Paycheck', category: 'Income', amount: 3500.00, type: 'income', icon: Banknote },
  { id: 'trx2', date: '2024-07-27', description: 'Trader Joe\'s', category: 'Groceries', amount: -154.32, type: 'expense', icon: ShoppingCart },
  { id: 'trx3', date: '2024-07-26', description: 'Exxon Mobil', category: 'Gas', amount: -45.67, type: 'expense', icon: ShoppingCart },
  { id: 'trx4', date: '2024-07-25', description: 'Netflix Subscription', category: 'Bills', amount: -15.49, type: 'expense', icon: ReceiptText },
  { id: 'trx5', date: '2024-07-24', description: 'Apple Store', category: 'Shopping', amount: -999.00, type: 'expense', icon: ShoppingCart },
  { id: 'trx6', date: '2024-07-23', description: 'Freelance Project', category: 'Income', amount: 750.00, type: 'income', icon: Banknote },
  { id: 'trx7', date: '2024-07-22', description: 'Rent', category: 'Bills', amount: -2200.00, type: 'expense', icon: ReceiptText },
];

export const cashFlowData = [
  { month: 'Jan', income: 4000, expenses: 2400 },
  { month: 'Feb', income: 3000, expenses: 1398 },
  { month: 'Mar', income: 5000, expenses: 3800 },
  { month: 'Apr', income: 4780, expenses: 3908 },
  { month: 'May', income: 5890, expenses: 4800 },
  { month: 'Jun', income: 4390, expenses: 3800 },
  { month: 'Jul', income: 5490, expenses: 4300 },
];

export const spendingData = [
    { category: 'Groceries', amount: 540 },
    { category: 'Gas', amount: 210 },
    { category: 'Bills', amount: 2450 },
    { category: 'Shopping', amount: 1200 },
    { category: 'Dining Out', amount: 350 },
    { category: 'Health', amount: 150 },
];

export const getNetWorthData = () => {
    const assets = accounts.filter(a => a.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
    const liabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((acc, curr) => acc + curr.balance, 0));
    const netWorth = assets - liabilities;
    return { assets, liabilities, netWorth };
}

export const assetsLiabilitiesData = [
    { name: 'Assets', value: getNetWorthData().assets, fill: 'var(--color-chart-1)' },
    { name: 'Liabilities', value: getNetWorthData().liabilities, fill: 'var(--color-chart-2)' },
];

export const transactionHistoryForAI = `
July 28, 2024: +$3500.00 (Paycheck)
July 27, 2024: -$154.32 (Groceries at Trader Joe's)
July 26, 2024: -$45.67 (Gas at Exxon Mobil)
July 25, 2024: -$15.49 (Netflix Subscription)
July 24, 2024: -$999.00 (Shopping at Apple Store)
July 23, 2024: +$750.00 (Freelance Project)
July 22, 2024: -$2200.00 (Rent payment)
July 15, 2024: -$89.50 (Dinner at Italian restaurant)
July 14, 2024: +$3500.00 (Paycheck)
July 10, 2024: -$250.00 (Utilities Bill)
July 5, 2024: -$55.00 (Internet Bill)
July 1, 2024: -$120.00 (Car Insurance)
`;
