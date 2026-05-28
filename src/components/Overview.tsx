import React from 'react';
import { useGame } from '../context/GameContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Star,
  Award,
  Building2,
  Package,
  Activity,
  Zap,
  Target,
  Briefcase,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Overview() {
  const { company, financials, employees, products, competitors, marketEvents, achievements, gameState } = useGame();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: 'Наличные',
      value: formatCurrency(financials.cash),
      change: financials.profit >= 0 ? '+ profitable' : '- losing',
      trend: financials.profit >= 0 ? 'up' : 'down',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Выручка',
      value: formatCurrency(financials.revenue),
      change: 'всего',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Прибыль',
      value: formatCurrency(financials.profit),
      change: `${financials.profitMargin.toFixed(1)}% маржа`,
      trend: financials.profit >= 0 ? 'up' : 'down',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Репутация',
      value: `${company.reputation.toFixed(1)}/100`,
      change: company.level > 1 ? `Уровень ${company.level}` : 'Новичок',
      trend: 'up',
      icon: <Star className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const chartData = financials.cash > 0 ? [
    { name: 'День 1', value: financials.cash * 0.7 },
    { name: 'День 2', value: financials.cash * 0.75 },
    { name: 'День 3', value: financials.cash * 0.8 },
    { name: 'День 4', value: financials.cash * 0.85 },
    { name: 'День 5', value: financials.cash * 0.9 },
    { name: 'День 6', value: financials.cash * 0.95 },
    { name: 'День 7', value: financials.cash },
  ] : [];

  const marketShareData = [
    { name: 'Вы', value: Math.max(1, 100 - competitors.reduce((sum, c) => sum + c.marketShare, 0)), color: '#8b5cf6' },
    ...competitors.slice(0, 4).map((c, i) => ({
      name: c.name,
      value: c.marketShare,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i],
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{company.name}</h1>
          <p className="text-slate-400">
            День {gameState.day} • Неделя {gameState.week} • {company.industry === 'tech' ? 'Технологии' : company.industry === 'retail' ? 'Ритейл' : company.industry === 'manufacturing' ? 'Производство' : company.industry === 'services' ? 'Услуги' : company.industry === 'finance' ? 'Финансы' : 'Здравоохранение'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 rounded-xl px-4 py-2">
            <span className="text-slate-400 text-sm">Опыт</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                  style={{ width: `${(company.experience % 1000) / 10}%` }}
                />
              </div>
              <span className="text-white font-semibold">{company.experience} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            Динамика капитала
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Капитал']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Share */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Доля рынка
          </h3>
          <div className="space-y-3">
            {marketShareData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-medium">{item.value.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          icon={<Users className="w-5 h-5" />}
          title="Сотрудники"
          value={`${employees.length} / ∞`}
          color="text-green-400"
        />
        <InfoCard
          icon={<Package className="w-5 h-5" />}
          title="Продукты"
          value={products.length.toString()}
          color="text-blue-400"
        />
        <InfoCard
          icon={<Building2 className="w-5 h-5" />}
          title="Здания"
          value="1"
          color="text-amber-400"
        />
        <InfoCard
          icon={<Award className="w-5 h-5" />}
          title="Достижения"
          value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`}
          color="text-purple-400"
        />
      </div>

      {/* Active Events */}
      {marketEvents.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Активные события
          </h3>
          <div className="space-y-3">
            {marketEvents.filter(e => e.isActive).map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border ${
                  event.impact > 0
                    ? 'bg-green-900/20 border-green-700/50'
                    : 'bg-red-900/20 border-red-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{event.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{event.description}</p>
                  </div>
                  <span className={`text-sm font-medium ${event.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {event.impact > 0 ? '+' : ''}{event.impact}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-red-400" />
          Конкуренты
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-700">
                <th className="text-left py-3 px-4">Компания</th>
                <th className="text-right py-3 px-4">Доля</th>
                <th className="text-right py-3 px-4">Выручка</th>
                <th className="text-right py-3 px-4">Репутация</th>
                <th className="text-center py-3 px-4">Стратегия</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((comp) => (
                <tr key={comp.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{comp.name}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{comp.marketShare}%</td>
                  <td className="py-3 px-4 text-right text-slate-300">${(comp.revenue / 1000000).toFixed(1)}M</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-lg text-sm ${
                      comp.reputation >= 80 ? 'bg-green-900/50 text-green-400' :
                      comp.reputation >= 60 ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {comp.reputation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-slate-400 text-sm capitalize">
                      {comp.strategy === 'aggressive' ? 'Агрессивная' :
                       comp.strategy === 'conservative' ? 'Консервативная' :
                       comp.strategy === 'innovative' ? 'Инновационная' : 'Лидер затрат'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-slate-400 text-sm">{title}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
