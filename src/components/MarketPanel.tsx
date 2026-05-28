import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TrendingUp, TrendingDown, Activity, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function MarketPanel() {
  const { stockMarket, buyStock, financials, competitors } = useGame();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState(1000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleBuy = (symbol: string) => {
    buyStock(symbol, Math.floor(tradeAmount / (stockMarket.find(s => s.symbol === symbol)?.price || 1)));
    setSelectedStock(null);
  };

  const marketOverview = {
    totalVolume: stockMarket.reduce((sum, s) => sum + s.volume, 0),
    gainers: stockMarket.filter(s => s.change > 0).length,
    losers: stockMarket.filter(s => s.change < 0).length,
    avgChange: stockMarket.reduce((sum, s) => sum + s.changePercent, 0) / stockMarket.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Рынок</h1>
        <p className="text-slate-400">Фондовый рынок и торговля акциями</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MarketStat title="Объём торгов" value={`${(marketOverview.totalVolume / 1000000).toFixed(1)}M`} icon={<BarChart3 className="w-5 h-5" />} color="text-blue-400" />
        <MarketStat title="Растущие" value={marketOverview.gainers.toString()} icon={<TrendingUp className="w-5 h-5" />} color="text-green-400" />
        <MarketStat title="Падающие" value={marketOverview.losers.toString()} icon={<TrendingDown className="w-5 h-5" />} color="text-red-400" />
        <MarketStat title="Среднее изменение" value={`${marketOverview.avgChange >= 0 ? '+' : ''}${marketOverview.avgChange.toFixed(2)}%`} icon={<Activity className="w-5 h-5" />} color={marketOverview.avgChange >= 0 ? 'text-green-400' : 'text-red-400'} />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Акции</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-700">
                <th className="text-left py-4 px-6">Символ</th>
                <th className="text-right py-4 px-6">Цена</th>
                <th className="text-right py-4 px-6">Изменение</th>
                <th className="text-right py-4 px-6">Объём</th>
                <th className="text-right py-4 px-6">Капитализация</th>
                <th className="text-center py-4 px-6">Действие</th>
              </tr>
            </thead>
            <tbody>
              {stockMarket.map((stock) => (
                <tr key={stock.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => setSelectedStock(stock.symbol)}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${stock.change >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-pink-600'}`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{stock.symbol}</p>
                        <p className="text-slate-400 text-sm">
                          {stock.symbol === 'TECH' ? 'Технологии' : stock.symbol === 'FIN' ? 'Финансы' : stock.symbol === 'HLTH' ? 'Здравоохранение' : stock.symbol === 'ENRG' ? 'Энергетика' : 'Потребительские'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right"><span className="text-white font-semibold">{formatCurrency(stock.price)}</span></td>
                  <td className="py-4 px-6 text-right">
                    <div className={`flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span className="font-medium">{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right"><span className="text-slate-300">{(stock.volume / 1000).toFixed(0)}K</span></td>
                  <td className="py-4 px-6 text-right"><span className="text-slate-300">${(stock.marketCap / 1000000000).toFixed(1)}B</span></td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedStock(stock.symbol); }} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-all">Торговать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Доля рынка конкурентов</h3>
        <div className="space-y-4">
          {competitors.map((comp, index) => (
            <div key={comp.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{comp.name}</span>
                <span className="text-slate-400">{comp.marketShare}%</span>
              </div>
              <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${comp.marketShare}%`, backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4] }} />
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Выручка: {formatCurrency(comp.revenue)}</span>
                <span>Репутация: {comp.reputation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStock && (
        <TradeModal stock={stockMarket.find(s => s.symbol === selectedStock)!} amount={tradeAmount} setAmount={setTradeAmount} cash={financials.cash} onBuy={() => handleBuy(selectedStock)} onClose={() => setSelectedStock(null)} formatCurrency={formatCurrency} />
      )}
    </div>
  );
}

function MarketStat({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
      <div className={`${color} mb-3`}>{icon}</div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function TradeModal({ stock, amount, setAmount, cash, onBuy, onClose, formatCurrency }: { stock: any; amount: number; setAmount: (v: number) => void; cash: number; onBuy: () => void; onClose: () => void; formatCurrency: (v: number) => string }) {
  const shares = Math.floor(amount / stock.price);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl ${stock.change >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-pink-600'}`}>
            {stock.symbol[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
            <p className="text-slate-400">{formatCurrency(stock.price)}/акция</p>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex justify-between mb-2"><span className="text-slate-400">Изменение</span><span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Объём</span><span className="text-white">{(stock.volume / 1000).toFixed(0)}K</span></div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Сумма инвестиции ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" min="100" step="100" max={cash} />
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex justify-between"><span className="text-slate-400">Акции</span><span className="text-white font-semibold">{shares} шт</span></div>
            <div className="flex justify-between mt-1"><span className="text-slate-400">Доступно</span><span className="text-green-400">${cash.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all">Отмена</button>
          <button onClick={onBuy} disabled={cash < amount} className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all">Купить</button>
        </div>
      </div>
    </div>
  );
}
