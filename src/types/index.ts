// Основные типы для симулятора бизнеса

export interface Company {
  id: string;
  name: string;
  industry: IndustryType;
  foundedAt: Date;
  level: number;
  experience: number;
  reputation: number;
  employees: number;
  maxEmployees: number;
  officeLevel: number;
  logo: string;
}

export type IndustryType = 'tech' | 'retail' | 'manufacturing' | 'services' | 'finance' | 'healthcare';

export interface Financials {
  cash: number;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  assets: number;
  liabilities: number;
  equity: number;
  creditScore: number;
  loans: Loan[];
  investments: Investment[];
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  term: number;
  remainingPayments: number;
  monthlyPayment: number;
}

export interface Investment {
  id: string;
  type: string;
  amount: number;
  currentValue: number;
  returnRate: number;
  purchasedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  demand: number;
  quality: number;
  sales: number;
  marketingBudget: number;
}

export interface Employee {
  id: string;
  name: string;
  position: PositionType;
  salary: number;
  productivity: number;
  satisfaction: number;
  experience: number;
  department: DepartmentType;
}

export type PositionType = 'intern' | 'junior' | 'middle' | 'senior' | 'lead' | 'manager' | 'director' | 'ceo';
export type DepartmentType = 'development' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations';

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  impact: number;
  duration: number;
  startedAt: Date;
  endsAt: Date;
  isActive: boolean;
}

export type EventType = 'economic_boom' | 'recession' | 'market_crash' | 'tech_breakthrough' | 'regulatory_change' | 'competitor_action' | 'natural_disaster' | 'pandemic' | 'tax_change' | 'interest_rate_change';

export interface Competitor {
  id: string;
  name: string;
  industry: IndustryType;
  marketShare: number;
  revenue: number;
  reputation: number;
  aggression: number;
  strategy: CompetitorStrategy;
  actions: CompetitorAction[];
}

export type CompetitorStrategy = 'aggressive' | 'conservative' | 'innovative' | 'cost_leader';

export interface CompetitorAction {
  id: string;
  type: ActionImpactType;
  description: string;
  impact: number;
  targetCompanyId?: string;
  executedAt: Date;
}

export type ActionImpactType = 'price_cut' | 'marketing_campaign' | 'product_launch' | 'acquisition' | 'partnership' | 'lawsuit' | 'poaching';

export interface GameState {
  day: number;
  week: number;
  month: number;
  year: number;
  speed: GameSpeed;
  isPaused: boolean;
}

export type GameSpeed = 'pause' | 'normal' | 'fast' | 'ultra';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

export interface Research {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  progress: number;
  isCompleted: boolean;
  benefits: ResearchBenefit[];
}

export interface ResearchBenefit {
  type: string;
  value: number;
  description: string;
}

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  level: number;
  capacity: number;
  efficiency: number;
  cost: number;
  upkeep: number;
}

export type BuildingType = 'office' | 'factory' | 'warehouse' | 'research_lab' | 'marketing_center' | 'training_center';

export interface StockMarket {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  history: number[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityType;
  status: TaskStatus;
  dueDate: Date;
  assignedTo?: string;
  reward?: number;
}

export type PriorityType = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Contract {
  id: string;
  client: string;
  value: number;
  duration: number;
  progress: number;
  deadline: Date;
  status: ContractStatus;
  requirements: string[];
}

export type ContractStatus = 'negotiating' | 'active' | 'completed' | 'failed' | 'expired';

export interface LeaderboardEntry {
  rank: number;
  companyId: string;
  companyName: string;
  player: string;
  netWorth: number;
  revenue: number;
  marketShare: number;
  reputation: number;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  theme: ThemeType;
  language: string;
}

export type ThemeType = 'light' | 'dark' | 'auto';

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  step: number;
  totalSteps: number;
  isCompleted: boolean;
}
