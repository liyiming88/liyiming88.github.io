export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadlineYear: number;
  category: 'Retirement' | 'Education' | 'Purchase' | 'Emergency';
}

export interface UserProfile {
  name: string;
  age: number;
  retirementAge: number;
  annualIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
}

export interface ChartDataPoint {
  year: number;
  age: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  target: number;
}

export interface AIAdvice {
  summary: string;
  steps: string[];
}