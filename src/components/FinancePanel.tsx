import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  TrendingUp,
  CreditCard,
  PiggyBank,
  Landmark,
  Plus,
  Wallet,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function FinancePanel() {
  const { financials, takeLoan, invest } = useGame();
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [investAmount, setInvestAmount] = useState(5000);
  const [investType, setInvestType] = useState('stocks');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const assetsData = [
    { name: 'Наличные', value: financials.cash },
    { name: 'Инвестиции', value: financials.investments.reduce((sum, i) => sum + i.currentValue, 0) },
    { name: 'Активы', value: financials.assets - financials.cash },
  ];

  const handleTakeLoan = () => {
    const interestRate = 5 + (loanTerm / 12) * 2;
    takeLoan(loanAmount, interestRate, loanTerm);
    setShowLoanModal(false);
  };

  const handleInvest = () => {
    if (financials.cash >= investAmount) {
      invest(investType, investAmount);
      setShowInvestModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Финансы</h1>
          <p className="text-slate-400">Управление капиталом, кредитами и инвестициями</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLoanModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Кредит
          </button>
          <button
            onClick={() => setShowInvestModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Инвестировать
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceCard
          title="Наличные"
          value={formatCurrency(financials.cash)}
          icon={<Wallet className="w-6 h-6" />}
          color="from-green-500 to-emerald-600"
        />
        <FinanceCard
          title="Активы"
          value={formatCurrency(financials.assets)}
          icon={<PiggyBank className="w-6 h-6" />}
          color="from-blue-500 to-cyan-600"
        />
        <FinanceCard
          title="Обязательства"
          value={formatCurrency(financials.liabilities)}
          icon={<CreditCard className="w-6 h-6" />}
          color="from-red-500 to-pink-600"
        />
        <FinanceCard
          title="Капитал"
          value={formatCurrency(financials.equity)}
          icon={<Landmark className="w-6 h-6" />}
          color="from-purple-500 to-violet-600"
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-violet-400" />
            Доходы и расходы
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Выручка', value: financials.revenue, fill: '#10b981' },
                { name: 'Расходы', value: financials.expenses, fill: '#ef4444' },
                { name: 'Прибыль', value: financials.profit, fill: '#8b5cf6' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Выручка</p>
              <p className="text-green-400 font-semibold">{formatCurrency(financials.revenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Расходы</p>
              <p className="text-red-400 font-semibold">{formatCurrency(financials.expenses)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Прибыль</p>
              <p className={`font-semibold ${financials.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(financials.profit)}
              </p>
            </div>
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Распределение активов
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {assetsData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-slate-400 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loans */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-red-400" />
          Кредиты
        </h3>
        {financials.loans.length === 0 ? (
          <div className="text-center py-8">
            <Landmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Нет активных кредитов</p>
            <button
              onClick={() => setShowLoanModal(true)}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all"
            >
              Взять кредит
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="text-left py-3 px-4">Сумма</th>
                  <th className="text-right py-3 px-4">Ставка</th>
                  <th className="text-right py-3 px-4">Срок</th>
                  <th className="text-right py-3 px-4">Платёж</th>
                  <th className="text-right py-3 px-4">Остаток</th>
                </tr>
              </thead>
              <tbody>
                {financials.loans.map((loan) => (
                  <tr key={loan.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{formatCurrency(loan.amount)}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{loan.interestRate}%</td>
                    <td className="py-3 px-4 text-right text-slate-300">{loan.term} мес</td>
                    <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(loan.monthlyPayment)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-red-400">{formatCurrency(loan.amount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investments */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Инвестиции
        </h3>
        {financials.investments.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Нет активных инвестиций</p>
            <button
              onClick={() => setShowInvestModal(true)}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all"
            >
              Инвестировать
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {financials.investments.map((investment) => {
              const gain = investment.currentValue - investment.amount;
              const gainPercent = (gain / investment.amount) * 100;
              return (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-semibold">{investment.type}</p>
                    <p className="text-slate-400 text-sm">Вложено: {formatCurrency(investment.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatCurrency(investment.currentValue)}</p>
                    <p className={`text-sm ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {gain >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credit Score */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Кредитный рейтинг</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#334155"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={financials.creditScore >= 700 ? '#10b981' : financials.creditScore >= 600 ? '#f59e0b' : '#ef4444'}
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(financials.creditScore / 850) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{financials.creditScore}</span>
            </div>
          </div>
          <div>
            <p className={`text-lg font-semibold ${
              financials.creditScore >= 700 ? 'text-green-400' :
              financials.creditScore >= 600 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {financials.creditScore >= 700 ? 'Отличный' :
               financials.creditScore >= 600 ? 'Хороший' :
               'Плохой'}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {financials.creditScore >= 700 ? 'Лучшие условия кредитования' :
               financials.creditScore >= 600 ? 'Стандартные условия' :
               'Высокие процентные ставки'}
            </p>
          </div>
        </div>
      </div>

      {/* Loan Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Взять кредит</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Сумма</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  min="1000"
                  step="1000"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Срок (месяцев)</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value={6}>6 месяцев</option>
                  <option value={12}>12 месяцев</option>
                  <option value={24}>24 месяца</option>
                  <option value={36}>36 месяцев</option>
                </select>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Процентная ставка: <span className="text-white">{(5 + (loanTerm / 12) * 2).toFixed(1)}%</span></p>
                <p className="text-slate-400 text-sm">Ежемесячный платёж: <span className="text-white">{formatCurrency((loanAmount * (1 + (5 + (loanTerm / 12) * 2) / 100)) / loanTerm)}</span></p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLoanModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleTakeLoan}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all"
              >
                Взять
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Инвестировать</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Тип инвестиции</label>
                <select
                  value={investType}
                  onChange={(e) => setInvestType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="stocks">Акции</option>
                  <option value="bonds">Облигации</option>
                  <option value="crypto">Криптовалюта</option>
                  <option value="real_estate">Недвижимость</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Сумма</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  min="1000"
                  step="1000"
                  max={financials.cash}
                />
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Доступно: <span className="text-green-400">{formatCurrency(financials.cash)}</span></p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleInvest}
                disabled={financials.cash < investAmount}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all"
              >
                Инвестировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FinanceCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
