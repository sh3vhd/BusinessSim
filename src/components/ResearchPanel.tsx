import { useGame } from '../context/GameContext';
import { FlaskConical, Clock, DollarSign, CheckCircle, Play, Zap } from 'lucide-react';

export function ResearchPanel() {
  const { research, startResearch, financials } = useGame();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Исследования</h1>
        <p className="text-slate-400">Развивайте технологии для улучшения бизнеса</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {research.map((res) => {
          const canAfford = financials.cash >= res.cost;
          const canStart = !res.isCompleted && res.progress === 0;

          return (
            <div
              key={res.id}
              className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border transition-all ${
                res.isCompleted
                  ? 'border-green-700/50 bg-green-900/10'
                  : res.progress > 0
                  ? 'border-violet-700/50 bg-violet-900/10'
                  : 'border-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    res.isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : res.progress > 0
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                      : 'bg-gradient-to-br from-slate-600 to-slate-700'
                  }`}>
                    {res.isCompleted ? (
                      <CheckCircle className="w-7 h-7 text-white" />
                    ) : (
                      <FlaskConical className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{res.name}</h3>
                    <p className="text-slate-400 text-sm">{res.description}</p>
                  </div>
                </div>
                {res.isCompleted && (
                  <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm font-medium">
                    Завершено
                  </span>
                )}
              </div>

              {/* Progress */}
              {res.progress > 0 && !res.isCompleted && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Прогресс
                    </span>
                    <span className="text-white font-semibold">{res.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${res.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-slate-400 text-sm mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Преимущества
                </h4>
                <div className="flex flex-wrap gap-2">
                  {res.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-900/50 text-slate-300 rounded-lg text-sm"
                    >
                      {benefit.description}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-semibold">${res.cost.toLocaleString()}</span>
                </div>
                {canStart ? (
                  <button
                    onClick={() => startResearch(res.id)}
                    disabled={!canAfford}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Начать
                  </button>
                ) : res.progress > 0 && !res.isCompleted ? (
                  <span className="text-violet-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    В процессе
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
