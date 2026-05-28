import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  Company,
  Financials,
  Product,
  Employee,
  MarketEvent,
  Competitor,
  GameState,
  Notification,
  Achievement,
  Research,
  Building,
  StockMarket,
  Task,
  Contract,
  Settings,
  IndustryType,
  Loan,
  Investment,
} from '../types';

// Начальное состояние компании
const createInitialCompany = (name: string, industry: IndustryType): Company => ({
  id: `company_${Date.now()}`,
  name,
  industry,
  foundedAt: new Date(),
  level: 1,
  experience: 0,
  reputation: 50,
  employees: 1,
  maxEmployees: 5,
  officeLevel: 1,
  logo: `🏢`,
});

// Начальные финансы
const createInitialFinancials = (): Financials => ({
  cash: 100000,
  revenue: 0,
  expenses: 0,
  profit: 0,
  profitMargin: 0,
  assets: 100000,
  liabilities: 0,
  equity: 100000,
  creditScore: 650,
  loans: [],
  investments: [],
});

// Начальные продукты
const createInitialProducts = (industry: IndustryType): Product[] => {
  const baseProducts: Record<IndustryType, Product[]> = {
    tech: [
      { id: 'prod_1', name: 'Базовое ПО', category: 'Software', price: 99, cost: 20, demand: 100, quality: 50, sales: 0, marketingBudget: 1000 },
      { id: 'prod_2', name: 'Мобильное приложение', category: 'Mobile', price: 4.99, cost: 0.5, demand: 500, quality: 40, sales: 0, marketingBudget: 500 },
    ],
    retail: [
      { id: 'prod_1', name: 'Товар категории А', category: 'Retail', price: 29.99, cost: 12, demand: 200, quality: 60, sales: 0, marketingBudget: 800 },
      { id: 'prod_2', name: 'Товар категории Б', category: 'Retail', price: 49.99, cost: 20, demand: 150, quality: 55, sales: 0, marketingBudget: 600 },
    ],
    manufacturing: [
      { id: 'prod_1', name: 'Компонент А', category: 'Parts', price: 150, cost: 80, demand: 80, quality: 70, sales: 0, marketingBudget: 500 },
      { id: 'prod_2', name: 'Компонент Б', category: 'Parts', price: 200, cost: 100, demand: 60, quality: 65, sales: 0, marketingBudget: 400 },
    ],
    services: [
      { id: 'prod_1', name: 'Консалтинг', category: 'Consulting', price: 500, cost: 200, demand: 50, quality: 75, sales: 0, marketingBudget: 1000 },
      { id: 'prod_2', name: 'Поддержка', category: 'Support', price: 100, cost: 30, demand: 100, quality: 60, sales: 0, marketingBudget: 300 },
    ],
    finance: [
      { id: 'prod_1', name: 'Инвестиционный план', category: 'Investment', price: 1000, cost: 300, demand: 30, quality: 80, sales: 0, marketingBudget: 1500 },
      { id: 'prod_2', name: 'Страховка', category: 'Insurance', price: 200, cost: 50, demand: 80, quality: 70, sales: 0, marketingBudget: 800 },
    ],
    healthcare: [
      { id: 'prod_1', name: 'Медицинское оборудование', category: 'Equipment', price: 5000, cost: 2500, demand: 20, quality: 85, sales: 0, marketingBudget: 2000 },
      { id: 'prod_2', name: 'Расходные материалы', category: 'Supplies', price: 100, cost: 40, demand: 150, quality: 75, sales: 0, marketingBudget: 500 },
    ],
  };
  return baseProducts[industry] || baseProducts.tech;
};

// Начальные сотрудники
const createInitialEmployees = (): Employee[] => [
  { id: 'emp_1', name: 'Вы (CEO)', position: 'ceo', salary: 0, productivity: 100, satisfaction: 80, experience: 10, department: 'operations' },
];

// Начальные конкуренты
const createCompetitors = (): Competitor[] => [
  { id: 'comp_1', name: 'TechGiant Corp', industry: 'tech', marketShare: 25, revenue: 5000000, reputation: 85, aggression: 70, strategy: 'aggressive', actions: [] },
  { id: 'comp_2', name: 'InnovateX', industry: 'tech', marketShare: 18, revenue: 3500000, reputation: 78, aggression: 50, strategy: 'innovative', actions: [] },
  { id: 'comp_3', name: 'BudgetKing', industry: 'tech', marketShare: 15, revenue: 2000000, reputation: 60, aggression: 80, strategy: 'cost_leader', actions: [] },
  { id: 'comp_4', name: 'StableCo', industry: 'tech', marketShare: 12, revenue: 1800000, reputation: 72, aggression: 30, strategy: 'conservative', actions: [] },
];

// Начальные рыночные события
const createInitialEvents = (): MarketEvent[] => [];

// Начальные исследования
const createInitialResearch = (): Research[] => [
  { id: 'res_1', name: 'Улучшение качества', description: '+10 к качеству продуктов', cost: 5000, duration: 7, progress: 0, isCompleted: false, benefits: [{ type: 'quality', value: 10, description: '+10 качества' }] },
  { id: 'res_2', name: 'Эффективность производства', description: '-15% себестоимости', cost: 8000, duration: 10, progress: 0, isCompleted: false, benefits: [{ type: 'cost_reduction', value: 15, description: '-15% затрат' }] },
  { id: 'res_3', name: 'Маркетинговая стратегия', description: '+20% к спросу', cost: 6000, duration: 5, progress: 0, isCompleted: false, benefits: [{ type: 'demand', value: 20, description: '+20% спроса' }] },
  { id: 'res_4', name: 'Автоматизация', description: '+25% продуктивности', cost: 15000, duration: 14, progress: 0, isCompleted: false, benefits: [{ type: 'productivity', value: 25, description: '+25% продуктивности' }] },
  { id: 'res_5', name: 'ИИ аналитика', description: 'Улучшение прогнозов', cost: 25000, duration: 21, progress: 0, isCompleted: false, benefits: [{ type: 'prediction', value: 30, description: '+30% точности прогнозов' }] },
];

// Начальные здания
const createInitialBuildings = (): Building[] => [
  { id: 'build_1', name: 'Офис', type: 'office', level: 1, capacity: 5, efficiency: 100, cost: 50000, upkeep: 500 },
];

// Начальный фондовый рынок
const createStockMarket = (): StockMarket[] => [
  { symbol: 'TECH', price: 150, change: 0, changePercent: 0, volume: 1000000, marketCap: 5000000000, history: [150] },
  { symbol: 'FIN', price: 85, change: 0, changePercent: 0, volume: 500000, marketCap: 2000000000, history: [85] },
  { symbol: 'HLTH', price: 220, change: 0, changePercent: 0, volume: 300000, marketCap: 8000000000, history: [220] },
  { symbol: 'ENRG', price: 95, change: 0, changePercent: 0, volume: 800000, marketCap: 3500000000, history: [95] },
  { symbol: 'CONS', price: 180, change: 0, changePercent: 0, volume: 400000, marketCap: 4500000000, history: [180] },
];

// Начальные достижения
const createAchievements = (): Achievement[] => [
  { id: 'ach_1', title: 'Первый шаг', description: 'Создайте свою компанию', icon: '🏆', unlocked: true, unlockedAt: new Date(), progress: 1, target: 1 },
  { id: 'ach_2', title: 'Первая прибыль', description: 'Заработайте первые $10,000', icon: '💰', unlocked: false, progress: 0, target: 10000 },
  { id: 'ach_3', title: 'Работодатель', description: 'Наймите 10 сотрудников', icon: '👥', unlocked: false, progress: 1, target: 10 },
  { id: 'ach_4', title: 'Миллионер', description: 'Достигните $1,000,000 наличными', icon: '💎', unlocked: false, progress: 0, target: 1000000 },
  { id: 'ach_5', title: 'Лидер рынка', description: 'Захватите 20% рынка', icon: '👑', unlocked: false, progress: 0, target: 20 },
  { id: 'ach_6', title: 'Инноватор', description: 'Завершите 5 исследований', icon: '🔬', unlocked: false, progress: 0, target: 5 },
  { id: 'ach_7', title: 'Империя', description: 'Постройте 10 зданий', icon: '🏙️', unlocked: false, progress: 1, target: 10 },
  { id: 'ach_8', title: 'Легенда', description: 'Достигните репутации 100', icon: '⭐', unlocked: false, progress: 50, target: 100 },
];

// Начальные настройки
const createSettings = (): Settings => ({
  soundEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  autoSave: true,
  theme: 'light',
  language: 'ru',
});

// Состояние игры
interface GameContextType {
  company: Company;
  financials: Financials;
  products: Product[];
  employees: Employee[];
  competitors: Competitor[];
  marketEvents: MarketEvent[];
  gameState: GameState;
  notifications: Notification[];
  achievements: Achievement[];
  research: Research[];
  buildings: Building[];
  stockMarket: StockMarket[];
  tasks: Task[];
  contracts: Contract[];
  settings: Settings;
  selectedIndustry: IndustryType | null;
  companyName: string;
  gameStarted: boolean;
  
  // Actions
  startGame: (name: string, industry: IndustryType) => void;
  tick: () => void;
  setGameSpeed: (speed: GameState['speed']) => void;
  togglePause: () => void;
  addNotification: (type: Notification['type'], title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  hireEmployee: (employee: Omit<Employee, 'id'>) => void;
  fireEmployee: (id: string) => void;
  createProduct: (product: Omit<Product, 'id' | 'sales'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  takeLoan: (amount: number, interestRate: number, term: number) => void;
  repayLoan: (id: string, amount: number) => void;
  invest: (type: string, amount: number) => void;
  sellInvestment: (id: string) => void;
  startResearch: (id: string) => void;
  buildStructure: (building: Omit<Building, 'id' | 'level' | 'efficiency'>) => void;
  upgradeBuilding: (id: string) => void;
  buyStock: (symbol: string, amount: number) => void;
  sellStock: (symbol: string, amount: number) => void;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  acceptContract: (contract: Contract) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Reducer actions
type GameAction =
  | { type: 'START_GAME'; payload: { name: string; industry: IndustryType } }
  | { type: 'TICK' }
  | { type: 'SET_SPEED'; payload: GameState['speed'] }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_COMPANY'; payload: Partial<Company> }
  | { type: 'UPDATE_FINANCIALS'; payload: Partial<Financials> }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'REMOVE_EMPLOYEE'; payload: string }
  | { type: 'UPDATE_EMPLOYEE'; payload: { id: string; updates: Partial<Employee> } }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: { id: string; updates: Partial<Loan> } }
  | { type: 'REMOVE_LOAN'; payload: string }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'REMOVE_INVESTMENT'; payload: string }
  | { type: 'UPDATE_INVESTMENT'; payload: { id: string; updates: Partial<Investment> } }
  | { type: 'ADD_EVENT'; payload: MarketEvent }
  | { type: 'REMOVE_EVENT'; payload: string }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<MarketEvent> } }
  | { type: 'UPDATE_COMPETITOR'; payload: { id: string; updates: Partial<Competitor> } }
  | { type: 'ADD_COMPETITOR_ACTION'; payload: { competitorId: string; action: Competitor['actions'][0] } }
  | { type: 'UPDATE_RESEARCH'; payload: { id: string; updates: Partial<Research> } }
  | { type: 'ADD_BUILDING'; payload: Building }
  | { type: 'UPGRADE_BUILDING'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { symbol: string; updates: Partial<StockMarket> } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'ADD_CONTRACT'; payload: Contract }
  | { type: 'UPDATE_CONTRACT'; payload: { id: string; updates: Partial<Contract> } }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { id: string; updates: Partial<Achievement> } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };

interface GameStateType {
  company: Company;
  financials: Financials;
  products: Product[];
  employees: Employee[];
  competitors: Competitor[];
  marketEvents: MarketEvent[];
  gameState: GameState;
  notifications: Notification[];
  achievements: Achievement[];
  research: Research[];
  buildings: Building[];
  stockMarket: StockMarket[];
  tasks: Task[];
  contracts: Contract[];
  settings: Settings;
  selectedIndustry: IndustryType | null;
  companyName: string;
  gameStarted: boolean;
}

const initialState: GameStateType = {
  company: createInitialCompany('', 'tech'),
  financials: createInitialFinancials(),
  products: [],
  employees: [],
  competitors: [],
  marketEvents: [],
  gameState: {
    day: 1,
    week: 1,
    month: 1,
    year: 1,
    speed: 'pause',
    isPaused: true,
  },
  notifications: [],
  achievements: [],
  research: [],
  buildings: [],
  stockMarket: [],
  tasks: [],
  contracts: [],
  settings: createSettings(),
  selectedIndustry: null,
  companyName: '',
  gameStarted: false,
};

function gameReducer(state: GameStateType, action: GameAction): GameStateType {
  switch (action.type) {
    case 'START_GAME': {
      const company = createInitialCompany(action.payload.name, action.payload.industry);
      return {
        ...state,
        company,
        financials: createInitialFinancials(),
        products: createInitialProducts(action.payload.industry),
        employees: createInitialEmployees(),
        competitors: createCompetitors(),
        marketEvents: createInitialEvents(),
        gameState: { ...initialState.gameState, speed: 'pause', isPaused: true },
        notifications: [{
          id: `notif_${Date.now()}`,
          type: 'info',
          title: 'Добро пожаловать!',
          message: `Вы основали компанию "${action.payload.name}" в отрасли ${action.payload.industry}. Удачи!`,
          createdAt: new Date(),
          isRead: false,
        }],
        achievements: createAchievements(),
        research: createInitialResearch(),
        buildings: createInitialBuildings(),
        stockMarket: createStockMarket(),
        tasks: [],
        contracts: [],
        settings: createSettings(),
        selectedIndustry: action.payload.industry,
        companyName: action.payload.name,
        gameStarted: true,
      };
    }

    case 'TICK': {
      // Обновление времени
      let { day, week, month, year } = state.gameState;
      day += 1;
      
      if (day > 7) {
        day = 1;
        week += 1;
      }
      if (week > 4) {
        week = 1;
        month += 1;
      }
      if (month > 12) {
        month = 1;
        year += 1;
      }

      // Расчет доходов и расходов
      let dailyRevenue = 0;
      let dailyExpenses = 0;

      // Доходы от продуктов
      state.products.forEach(product => {
        const sales = Math.floor((product.demand * product.quality / 100) * (1 + product.marketingBudget / 5000));
        dailyRevenue += sales * product.price;
        dailyExpenses += sales * product.cost;
      });

      // Зарплаты сотрудников
      state.employees.forEach(emp => {
        dailyExpenses += emp.salary / 30;
      });

      // Содержание зданий
      state.buildings.forEach(building => {
        dailyExpenses += building.upkeep / 30;
      });

      // Платежи по кредитам
      state.financials.loans.forEach(loan => {
        dailyExpenses += loan.monthlyPayment / 30;
      });

      const profit = dailyRevenue - dailyExpenses;

      // Обновление финансовых показателей
      const newCash = state.financials.cash + profit;
      const newRevenue = state.financials.revenue + dailyRevenue;
      const newExpenses = state.financials.expenses + dailyExpenses;
      const newProfit = state.financials.profit + profit;
      const profitMargin = newRevenue > 0 ? (newProfit / newRevenue) * 100 : 0;

      // Обновление опыта и уровня компании
      const expGain = Math.floor(dailyRevenue / 100);
      const newExperience = state.company.experience + expGain;
      const newLevel = Math.floor(newExperience / 1000) + 1;

      // Обновление репутации
      const reputationChange = profit > 0 ? 0.1 : -0.05;
      const newReputation = Math.min(100, Math.max(0, state.company.reputation + reputationChange));

      // Обновление акций на рынке
      const updatedStocks = state.stockMarket.map(stock => {
        const changePercent = (Math.random() - 0.5) * 10;
        const newPrice = Math.max(1, stock.price * (1 + changePercent / 100));
        const change = newPrice - stock.price;
        return {
          ...stock,
          price: newPrice,
          change,
          changePercent: (change / stock.price) * 100,
          volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
          history: [...stock.history.slice(-29), newPrice],
        };
      });

      // Обновление инвестиций
      const updatedInvestments = state.financials.investments.map(inv => {
        const changePercent = (Math.random() - 0.45) * 5;
        return {
          ...inv,
          currentValue: inv.currentValue * (1 + changePercent / 100),
        };
      });

      // Обновление прогресса исследований
      const updatedResearch = state.research.map(res => {
        if (!res.isCompleted && res.progress < 100) {
          return {
            ...res,
            progress: Math.min(100, res.progress + (100 / res.duration)),
            isCompleted: res.progress + (100 / res.duration) >= 100,
          };
        }
        return res;
      });

      // Проверка достижений
      const updatedAchievements = state.achievements.map(ach => {
        let newProgress = ach.progress;
        let unlocked = ach.unlocked;

        if (ach.id === 'ach_2' && newCash >= 10000) newProgress = 10000;
        if (ach.id === 'ach_3' && state.employees.length >= 10) newProgress = state.employees.length;
        if (ach.id === 'ach_4' && newCash >= 1000000) newProgress = 1000000;
        if (ach.id === 'ach_6' && state.research.filter(r => r.isCompleted).length >= 5) newProgress = state.research.filter(r => r.isCompleted).length;
        if (ach.id === 'ach_7' && state.buildings.length >= 10) newProgress = state.buildings.length;
        if (ach.id === 'ach_8' && newReputation >= 100) newProgress = 100;

        if (newProgress >= ach.target && !unlocked) {
          unlocked = true;
        }

        return { ...ach, progress: newProgress, unlocked, unlockedAt: unlocked && !ach.unlockedAt ? new Date() : ach.unlockedAt };
      });

      return {
        ...state,
        gameState: { ...state.gameState, day, week, month, year },
        financials: {
          ...state.financials,
          cash: newCash,
          revenue: newRevenue,
          expenses: newExpenses,
          profit: newProfit,
          profitMargin,
          assets: newCash + updatedInvestments.reduce((sum, inv) => sum + inv.currentValue, 0),
          investments: updatedInvestments,
        },
        company: {
          ...state.company,
          experience: newExperience,
          level: newLevel,
          reputation: newReputation,
        },
        stockMarket: updatedStocks,
        research: updatedResearch,
        achievements: updatedAchievements,
      };
    }

    case 'SET_SPEED':
      return {
        ...state,
        gameState: { ...state.gameState, speed: action.payload, isPaused: action.payload === 'pause' },
      };

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        gameState: { ...state.gameState, isPaused: !state.gameState.isPaused, speed: !state.gameState.isPaused ? 'pause' : 'normal' },
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };

    case 'UPDATE_COMPANY':
      return { ...state, company: { ...state.company, ...action.payload } };

    case 'UPDATE_FINANCIALS':
      return { ...state, financials: { ...state.financials, ...action.payload } };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };

    case 'REMOVE_EMPLOYEE':
      return { ...state, employees: state.employees.filter(e => e.id !== action.payload) };

    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload.updates } : e
        ),
      };

    case 'ADD_LOAN':
      return {
        ...state,
        financials: {
          ...state.financials,
          cash: state.financials.cash + action.payload.amount,
          liabilities: state.financials.liabilities + action.payload.amount,
          loans: [...state.financials.loans, action.payload],
        },
      };

    case 'UPDATE_LOAN':
      return {
        ...state,
        financials: {
          ...state.financials,
          loans: state.financials.loans.map(l =>
            l.id === action.payload.id ? { ...l, ...action.payload.updates } : l
          ),
        },
      };

    case 'REMOVE_LOAN':
      const loan = state.financials.loans.find(l => l.id === action.payload);
      return {
        ...state,
        financials: {
          ...state.financials,
          liabilities: state.financials.liabilities - (loan?.amount || 0),
          loans: state.financials.loans.filter(l => l.id !== action.payload),
        },
      };

    case 'ADD_INVESTMENT':
      return {
        ...state,
        financials: {
          ...state.financials,
          cash: state.financials.cash - action.payload.amount,
          investments: [...state.financials.investments, action.payload],
        },
      };

    case 'REMOVE_INVESTMENT':
      const investment = state.financials.investments.find(i => i.id === action.payload);
      return {
        ...state,
        financials: {
          ...state.financials,
          cash: state.financials.cash + (investment?.currentValue || 0),
          investments: state.financials.investments.filter(i => i.id !== action.payload),
        },
      };

    case 'ADD_EVENT':
      return { ...state, marketEvents: [...state.marketEvents, action.payload] };

    case 'REMOVE_EVENT':
      return { ...state, marketEvents: state.marketEvents.filter(e => e.id !== action.payload) };

    case 'UPDATE_EVENT':
      return {
        ...state,
        marketEvents: state.marketEvents.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload.updates } : e
        ),
      };

    case 'UPDATE_COMPETITOR':
      return {
        ...state,
        competitors: state.competitors.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'ADD_COMPETITOR_ACTION':
      return {
        ...state,
        competitors: state.competitors.map(c =>
          c.id === action.payload.competitorId
            ? { ...c, actions: [...c.actions, action.payload.action] }
            : c
        ),
      };

    case 'UPDATE_RESEARCH':
      return {
        ...state,
        research: state.research.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
      };

    case 'ADD_BUILDING':
      return {
        ...state,
        buildings: [...state.buildings, action.payload],
        financials: {
          ...state.financials,
          cash: state.financials.cash - action.payload.cost,
          assets: state.financials.assets + action.payload.cost,
        },
      };

    case 'UPGRADE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map(b =>
          b.id === action.payload
            ? { ...b, level: b.level + 1, capacity: Math.floor(b.capacity * 1.5), efficiency: b.efficiency + 20 }
            : b
        ),
      };

    case 'UPDATE_STOCK':
      return {
        ...state,
        stockMarket: state.stockMarket.map(s =>
          s.symbol === action.payload.symbol ? { ...s, ...action.payload.updates } : s
        ),
      };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'ADD_CONTRACT':
      return { ...state, contracts: [...state.contracts, action.payload] };

    case 'UPDATE_CONTRACT':
      return {
        ...state,
        contracts: state.contracts.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Игровой цикл
  useEffect(() => {
    if (!state.gameState.isPaused) {
      const tickRate = {
        pause: 0,
        normal: 1000,
        fast: 500,
        ultra: 200,
      }[state.gameState.speed];

      if (tickRate > 0) {
        const interval = setInterval(() => {
          dispatch({ type: 'TICK' });
        }, tickRate);

        return () => clearInterval(interval);
      }
    }
  }, [state.gameState.isPaused, state.gameState.speed]);

  // Случайные события
  useEffect(() => {
    if (!state.gameStarted || state.gameState.isPaused) return;

    const eventInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% шанс каждый тик
        const events: Omit<MarketEvent, 'id' | 'startedAt' | 'endsAt' | 'isActive'>[] = [
          { title: 'Экономический бум', description: 'Спрос на все продукты вырос на 20%', type: 'economic_boom', impact: 20, duration: 7 },
          { title: 'Рецессия', description: 'Спрос упал на 15%', type: 'recession', impact: -15, duration: 10 },
          { title: 'Технологический прорыв', description: 'Эффективность производства +25%', type: 'tech_breakthrough', impact: 25, duration: 14 },
          { title: 'Изменение налогов', description: 'Налоги увеличились на 5%', type: 'tax_change', impact: -5, duration: 30 },
          { title: 'Конкурент атакует', description: 'Крупный конкурент снизил цены', type: 'competitor_action', impact: -10, duration: 5 },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const event: MarketEvent = {
          ...randomEvent,
          id: `event_${Date.now()}`,
          startedAt: new Date(),
          endsAt: new Date(Date.now() + randomEvent.duration * 24 * 60 * 60 * 1000),
          isActive: true,
        };

        dispatch({ type: 'ADD_EVENT', payload: event });
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: `notif_${Date.now()}`,
            type: randomEvent.impact > 0 ? 'success' : 'warning',
            title: randomEvent.title,
            message: randomEvent.description,
            createdAt: new Date(),
            isRead: false,
          },
        });
      }
    }, 5000);

    return () => clearInterval(eventInterval);
  }, [state.gameStarted, state.gameState.isPaused]);

  // Действия конкурентов
  useEffect(() => {
    if (!state.gameStarted || state.gameState.isPaused) return;

    const competitorInterval = setInterval(() => {
      state.competitors.forEach(competitor => {
        if (Math.random() * 100 < competitor.aggression / 2) {
          const actions: Competitor['actions'][0][] = [
            { id: `act_${Date.now()}`, type: 'price_cut', description: `${competitor.name} снизил цены на 10%`, impact: -5, executedAt: new Date() },
            { id: `act_${Date.now()}`, type: 'marketing_campaign', description: `${competitor.name} запустил рекламную кампанию`, impact: -3, executedAt: new Date() },
            { id: `act_${Date.now()}`, type: 'product_launch', description: `${competitor.name} выпустил новый продукт`, impact: -8, executedAt: new Date() },
          ];

          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          dispatch({ type: 'ADD_COMPETITOR_ACTION', payload: { competitorId: competitor.id, action: randomAction } });
        }
      });
    }, 10000);

    return () => clearInterval(competitorInterval);
  }, [state.gameStarted, state.gameState.isPaused, state.competitors]);

  const startGame = useCallback((name: string, industry: IndustryType) => {
    dispatch({ type: 'START_GAME', payload: { name, industry } });
  }, []);

  const tick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  const setGameSpeed = useCallback((speed: GameState['speed']) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notif_${Date.now()}`,
        type,
        title,
        message,
        createdAt: new Date(),
        isRead: false,
      },
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const hireEmployee = useCallback((employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}`,
    };
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
  }, []);

  const fireEmployee = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EMPLOYEE', payload: id });
  }, []);

  const createProduct = useCallback((product: Omit<Product, 'id' | 'sales'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      sales: 0,
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } });
  }, []);

  const takeLoan = useCallback((amount: number, interestRate: number, term: number) => {
    const monthlyPayment = (amount * (1 + interestRate / 100)) / term;
    const loan: Loan = {
      id: `loan_${Date.now()}`,
      amount,
      interestRate,
      term,
      remainingPayments: term,
      monthlyPayment,
    };
    dispatch({ type: 'ADD_LOAN', payload: loan });
  }, []);

  const repayLoan = useCallback((id: string, amount: number) => {
    const loan = state.financials.loans.find(l => l.id === id);
    if (loan) {
      const newAmount = Math.max(0, loan.amount - amount);
      dispatch({ type: 'UPDATE_LOAN', payload: { id, updates: { amount: newAmount, remainingPayments: loan.remainingPayments - 1 } } });
      dispatch({ type: 'UPDATE_FINANCIALS', payload: { cash: state.financials.cash - amount, liabilities: state.financials.liabilities - amount } });
    }
  }, [state.financials.loans, state.financials.cash, state.financials.liabilities]);

  const invest = useCallback((type: string, amount: number) => {
    const investment: Investment = {
      id: `inv_${Date.now()}`,
      type,
      amount,
      currentValue: amount,
      returnRate: 0,
      purchasedAt: new Date(),
    };
    dispatch({ type: 'ADD_INVESTMENT', payload: investment });
  }, []);

  const sellInvestment = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_INVESTMENT', payload: id });
  }, []);

  const startResearch = useCallback((id: string) => {
    const research = state.research.find(r => r.id === id);
    if (research && state.financials.cash >= research.cost) {
      dispatch({ type: 'UPDATE_FINANCIALS', payload: { cash: state.financials.cash - research.cost } });
      dispatch({ type: 'UPDATE_RESEARCH', payload: { id, updates: { progress: 1 } } });
    }
  }, [state.research, state.financials.cash]);

  const buildStructure = useCallback((building: Omit<Building, 'id' | 'level' | 'efficiency'>) => {
    const newBuilding: Building = {
      ...building,
      id: `build_${Date.now()}`,
      level: 1,
      efficiency: 100,
    };
    dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
  }, []);

  const upgradeBuilding = useCallback((id: string) => {
    dispatch({ type: 'UPGRADE_BUILDING', payload: id });
  }, []);

  const buyStock = useCallback((symbol: string, amount: number) => {
    const stock = state.stockMarket.find(s => s.symbol === symbol);
    if (stock && state.financials.cash >= stock.price * amount) {
      dispatch({ type: 'UPDATE_FINANCIALS', payload: { cash: state.financials.cash - stock.price * amount } });
      invest(symbol, stock.price * amount);
    }
  }, [state.stockMarket, state.financials.cash, invest]);

  const sellStock = useCallback((symbol: string, amount: number) => {
    const investment = state.financials.investments.find(i => i.type === symbol);
    if (investment) {
      const sellValue = (investment.currentValue / investment.amount) * amount;
      dispatch({ type: 'UPDATE_FINANCIALS', payload: { cash: state.financials.cash + sellValue } });
      sellInvestment(investment.id);
    }
  }, [state.financials.investments, state.financials.cash, sellInvestment]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'pending',
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates: { status } } });
  }, []);

  const acceptContract = useCallback((contract: Contract) => {
    dispatch({ type: 'ADD_CONTRACT', payload: contract });
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const value: GameContextType = {
    ...state,
    startGame,
    tick,
    setGameSpeed,
    togglePause,
    addNotification,
    markNotificationRead,
    hireEmployee,
    fireEmployee,
    createProduct,
    updateProduct,
    takeLoan,
    repayLoan,
    invest,
    sellInvestment,
    startResearch,
    buildStructure,
    upgradeBuilding,
    buyStock,
    sellStock,
    addTask,
    updateTaskStatus,
    acceptContract,
    updateSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
