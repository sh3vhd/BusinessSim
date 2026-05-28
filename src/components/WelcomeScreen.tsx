import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { IndustryType } from '../types';
import { Building2, ShoppingCart, Factory, Briefcase, TrendingUp, Heart, ChevronRight, Sparkles } from 'lucide-react';

const industries: { type: IndustryType; name: string; description: string; icon: React.ReactNode; color: string }[] = [
  { type: 'tech', name: 'Технологии', description: 'Разработка ПО и цифровых продуктов', icon: <Building2 className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
  { type: 'retail', name: 'Ритейл', description: 'Торговля и продажа товаров', icon: <ShoppingCart className="w-8 h-8" />, color: 'from-green-500 to-emerald-500' },
  { type: 'manufacturing', name: 'Производство', description: 'Изготовление продукции', icon: <Factory className="w-8 h-8" />, color: 'from-orange-500 to-amber-500' },
  { type: 'services', name: 'Услуги', description: 'Консалтинг и сервисы', icon: <Briefcase className="w-8 h-8" />, color: 'from-purple-500 to-violet-500' },
  { type: 'finance', name: 'Финансы', description: 'Инвестиции и страхование', icon: <TrendingUp className="w-8 h-8" />, color: 'from-red-500 to-pink-500' },
  { type: 'healthcare', name: 'Здравоохранение', description: 'Медицинские услуги', icon: <Heart className="w-8 h-8" />, color: 'from-teal-500 to-green-500' },
];

export function WelcomeScreen() {
  const { startGame } = useGame();
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [step, setStep] = useState(1);

  const handleStart = () => {
    if (companyName.trim() && selectedIndustry) {
      startGame(companyName.trim(), selectedIndustry);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/30 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Бизнес Симулятор
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Создайте свою империю, управляйте финансами, конкурируйте с другими и станьте магнатом!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded transition-all ${step > s ? 'bg-violet-500' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Назовите свою компанию</h2>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Например: TechCorp, MegaRetail, InnovateX..."
                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                maxLength={30}
                autoFocus
              />
              <button
                onClick={() => setStep(2)}
                disabled={!companyName.trim()}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Продолжить
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Выберите отрасль</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {industries.map((ind) => (
                  <button
                    key={ind.type}
                    onClick={() => setSelectedIndustry(ind.type)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                      selectedIndustry === ind.type
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                      {ind.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{ind.name}</h3>
                    <p className="text-slate-400 text-sm">{ind.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedIndustry}
                  className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  Продолжить
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Готовы начать?</h2>
              <div className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-700">
                  <span className="text-slate-400">Название компании</span>
                  <span className="text-white font-semibold">{companyName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-700">
                  <span className="text-slate-400">Отрасль</span>
                  <span className="text-white font-semibold">
                    {industries.find(i => i.type === selectedIndustry)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-400">Стартовый капитал</span>
                  <span className="text-green-400 font-semibold">$100,000</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all"
                >
                  Назад
                </button>
                <button
                  onClick={handleStart}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Начать игру
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '💼', title: 'Управление', desc: 'Полный контроль над компанией' },
            { icon: '📊', title: 'Финансы', desc: 'Инвестиции и кредиты' },
            { icon: '🏆', title: 'Конкуренция', desc: 'Борьба за рынок' },
            { icon: '⚡', title: 'События', desc: 'Экономические события' },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800/30 rounded-2xl p-4 text-center border border-slate-700/50">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="text-white font-semibold text-sm">{f.title}</h3>
              <p className="text-slate-400 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
