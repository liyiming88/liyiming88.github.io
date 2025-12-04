import { FinancialGoal, UserProfile } from './types';

// Fidelity-like Green Palette
export const THEME_COLOR = '#12805c'; 
export const THEME_COLOR_HOVER = '#0e6045';
export const THEME_COLOR_LIGHT = '#e3f3ed';

export const INITIAL_USER: UserProfile = {
  name: "Alex King",
  age: 35,
  retirementAge: 65,
  annualIncome: 120000,
  currentSavings: 150000,
  monthlyContribution: 2000,
  riskTolerance: 'Moderate',
};

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    targetAmount: 2500000,
    currentAmount: 150000,
    deadlineYear: 2055,
    category: 'Retirement'
  },
  {
    id: '2',
    name: 'Kids College',
    targetAmount: 100000,
    currentAmount: 25000,
    deadlineYear: 2035,
    category: 'Education'
  },
  {
    id: '3',
    name: 'Vacation Home',
    targetAmount: 500000,
    currentAmount: 10000,
    deadlineYear: 2040,
    category: 'Purchase'
  }
];

export const MOCK_MARKET_NEWS = [
  { title: "Tech Sector Rallies Amid AI Boom", impact: "Positive", date: "2h ago" },
  { title: "Inflation Data Expected Tomorrow", impact: "Neutral", date: "5h ago" },
  { title: "Bond Yields Stabilize", impact: "Positive", date: "1d ago" },
];