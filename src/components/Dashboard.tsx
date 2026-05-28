import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Overview } from './Overview';
import { FinancePanel } from './FinancePanel';
import { ProductsPanel } from './ProductsPanel';
import { EmployeesPanel } from './EmployeesPanel';
import { MarketPanel } from './MarketPanel';
import { ResearchPanel } from './ResearchPanel';
import { BuildingsPanel } from './BuildingsPanel';
import { NotificationsPanel } from './NotificationsPanel';
import { SettingsPanel } from './SettingsPanel';
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  FlaskConical,
  Building2,
  Bell,
  Settings,
  Play,
  Pause,
  FastForward,
  Rewind,
  Menu,
} from 'lucide-react';
import { GameState } from '../types';

type TabType = 'overview' | 'finance' | 'products' | 'employees' | 'market' | 'research' | 'buildings' | 'notifications' | 'settings';

export function Dashboard() {
  const { gameState, togglePause, setGameSpeed } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Обзор', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'finance', label: 'Финансы', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'products', label: 'Продукты', icon: <Package className="w-5 h-5" /> },
    { id: 'employees', label: 'Сотрудники', icon: <Users className="w-5 h-5" /> },
    { id: 'market', label: 'Рынок', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'research', label: 'Исследования', icon: <FlaskConical className="w-5 h-5" /> },
    { id: 'buildings', label: 'Здания', icon: <Building2 className="w-5 h-5" /> },
    { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Настройки', icon: <Settings className="w-5 h-5" /> },
  ];

  const speedOptions: { value: GameState['speed']; label: string; icon: React.ReactNode }[] = [
    { value: 'pause', label: 'Пауза', icon: <Pause className="w-4 h-4" /> },
    { value: 'normal', label: '1x', icon: <Play className="w-4 h-4" /> },
    { value: 'fast', label: '2x', icon: <FastForward className="w-4 h-4" /> },
    { value: 'ultra', label: '5x', icon: <Rewind className="w-4 h-4 rotate-180" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'finance': return <FinancePanel />;
      case 'products': return <ProductsPanel />;
      case 'employees': return <EmployeesPanel />;
      case 'market': return <MarketPanel />;
      case 'research': return <ResearchPanel />;
      case 'buildings': return <BuildingsPanel />;
      case 'notifications': return <NotificationsPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-semibold">Бизнес Симулятор</h1>
                <p className="text-slate-400 text-xs">Управляйте своей империей</p>
              </div>
            </div>
          </div>

          {/* Game Time & Speed */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2">
              <span className="text-slate-400 text-sm">День</span>
              <span className="text-white font-mono font-semibold">
                {gameState.day}.{gameState.month}.{gameState.year}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
              {speedOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGameSpeed(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    gameState.speed === opt.value
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {opt.icon}
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={togglePause}
              className={`p-2 rounded-xl transition-all ${
                gameState.isPaused
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {gameState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 z-40 transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-800/50 rounded-xl p-4 space-y-3">
          <QuickStat label="Касса" value="$0" />
          <QuickStat label="Сотрудники" value="0" />
          <QuickStat label="Репутация" value="0" />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
