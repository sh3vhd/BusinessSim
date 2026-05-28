import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Users, Zap, DollarSign, Hammer } from 'lucide-react';
import { BuildingType } from '../types';

const buildingTypes: { type: BuildingType; name: string; description: string; icon: string; baseCost: number; baseUpkeep: number }[] = [
  { type: 'office', name: 'Офис', description: 'Увеличивает вместимость сотрудников', icon: '🏢', baseCost: 50000, baseUpkeep: 500 },
  { type: 'factory', name: 'Завод', description: 'Увеличивает производство', icon: '🏭', baseCost: 100000, baseUpkeep: 1000 },
  { type: 'warehouse', name: 'Склад', description: 'Увеличивает хранение', icon: '📦', baseCost: 30000, baseUpkeep: 300 },
  { type: 'research_lab', name: 'Лаборатория', description: 'Ускоряет исследования', icon: '🔬', baseCost: 75000, baseUpkeep: 750 },
  { type: 'marketing_center', name: 'Маркетинг центр', description: 'Увеличивает спрос', icon: '📢', baseCost: 60000, baseUpkeep: 600 },
  { type: 'training_center', name: 'Учебный центр', description: 'Повышает продуктивность', icon: '🎓', baseCost: 45000, baseUpkeep: 450 },
];

export function BuildingsPanel() {
  const { buildings, buildStructure, upgradeBuilding, financials } = useGame();
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [selectedType, setSelectedType] = useState<BuildingType>('office');

  const selectedBuilding = buildingTypes.find(b => b.type === selectedType)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Здания</h1>
          <p className="text-slate-400">Стройте и улучшайте инфраструктуру</p>
        </div>
        <button
          onClick={() => setShowBuildModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Построить
        </button>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {buildings.map((building) => {
          const typeInfo = buildingTypes.find(b => b.type === building.type)!;
          const upgradeCost = Math.floor(building.cost * 0.5 * building.level);

          return (
            <div
              key={building.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl">
                    {typeInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{building.name}</h3>
                    <p className="text-slate-400 text-sm">Уровень {building.level}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-900/50 text-slate-400 rounded-full text-xs">
                  {typeInfo.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatBox icon={<Users className="w-4 h-4" />} label="Вместимость" value={building.capacity} color="text-blue-400" />
                <StatBox icon={<Zap className="w-4 h-4" />} label="Эффективность" value={`${building.efficiency}%`} color="text-yellow-400" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Содержание
                  </span>
                  <span className="text-red-400 font-semibold">${building.upkeep}/мес</span>
                </div>
              </div>

              <button
                onClick={() => upgradeBuilding(building.id)}
                disabled={financials.cash < upgradeCost}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Hammer className="w-4 h-4" />
                Улучшить (${upgradeCost.toLocaleString()})
              </button>
            </div>
          );
        })}
      </div>

      {/* Build Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Построить здание</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {buildingTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.type
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <h4 className="text-white font-semibold text-sm">{type.name}</h4>
                  <p className="text-slate-400 text-xs">${type.baseCost.toLocaleString()}</p>
                </button>
              ))}
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <h4 className="text-white font-semibold mb-3">{selectedBuilding.name}</h4>
              <p className="text-slate-400 text-sm mb-4">{selectedBuilding.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-sm">Стоимость</span>
                  <p className="text-white font-semibold">${selectedBuilding.baseCost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Содержание</span>
                  <p className="text-red-400 font-semibold">${selectedBuilding.baseUpkeep}/мес</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Доступно: </span>
                <span className="text-green-400">${financials.cash.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuildModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  buildStructure({
                    name: selectedBuilding.name,
                    type: selectedType,
                    capacity: 10,
                    cost: selectedBuilding.baseCost,
                    upkeep: selectedBuilding.baseUpkeep,
                  });
                  setShowBuildModal(false);
                }}
                disabled={financials.cash < selectedBuilding.baseCost}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all"
              >
                Построить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-3">
      <div className={`flex items-center gap-1 ${color} mb-1`}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
