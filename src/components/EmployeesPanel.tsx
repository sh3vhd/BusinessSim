import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Plus, Briefcase, Star, TrendingUp, DollarSign } from 'lucide-react';
import { PositionType, DepartmentType } from '../types';

const positions: { type: PositionType; name: string; salary: number; minExp: number }[] = [
  { type: 'intern', name: 'Стажёр', salary: 1500, minExp: 0 },
  { type: 'junior', name: 'Джуниор', salary: 3000, minExp: 1 },
  { type: 'middle', name: 'Мидл', salary: 5000, minExp: 3 },
  { type: 'senior', name: 'Сеньор', salary: 8000, minExp: 5 },
  { type: 'lead', name: 'Лид', salary: 12000, minExp: 7 },
  { type: 'manager', name: 'Менеджер', salary: 15000, minExp: 8 },
  { type: 'director', name: 'Директор', salary: 25000, minExp: 10 },
];

const departments: { type: DepartmentType; name: string; icon: string }[] = [
  { type: 'development', name: 'Разработка', icon: '💻' },
  { type: 'marketing', name: 'Маркетинг', icon: '📢' },
  { type: 'sales', name: 'Продажи', icon: '💼' },
  { type: 'hr', name: 'HR', icon: '👥' },
  { type: 'finance', name: 'Финансы', icon: '💰' },
  { type: 'operations', name: 'Операции', icon: '⚙️' },
];

export function EmployeesPanel() {
  const { employees, hireEmployee, fireEmployee, financials } = useGame();
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionType>('junior');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('development');

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgProductivity = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.productivity, 0) / employees.length 
    : 0;
  const avgSatisfaction = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.satisfaction, 0) / employees.length 
    : 0;

  const handleHire = () => {
    const position = positions.find(p => p.type === selectedPosition);
    if (!position) return;
    
    hireEmployee({
      name: `Сотрудник ${employees.length + 1}`,
      position: selectedPosition,
      salary: position.salary,
      productivity: 50 + Math.random() * 30 + (position.minExp * 3),
      satisfaction: 70 + Math.random() * 20,
      experience: position.minExp,
      department: selectedDepartment,
    });
    setShowHireModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Сотрудники</h1>
          <p className="text-slate-400">Управление командой и найм</p>
        </div>
        <button
          onClick={() => setShowHireModal(true)}
          disabled={financials.cash < (positions.find(p => p.type === selectedPosition)?.salary ?? 0)}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Нанять
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Всего сотрудников"
          value={employees.length.toString()}
          color="from-blue-500 to-cyan-600"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Фонд оплаты"
          value={`$${(totalSalary / 1000).toFixed(1)}k/мес`}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Средняя продуктивность"
          value={`${avgProductivity.toFixed(0)}%`}
          color="from-purple-500 to-violet-600"
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          title="Удовлетворённость"
          value={`${avgSatisfaction.toFixed(0)}%`}
          color="from-amber-500 to-orange-600"
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-violet-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl">
                  {departments.find(d => d.type === employee.department)?.icon || '👤'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{employee.name}</h3>
                  <p className="text-slate-400 text-sm">
                    {positions.find(p => p.type === employee.position)?.name}
                  </p>
                </div>
              </div>
              {employee.position !== 'ceo' && (
                <button
                  onClick={() => fireEmployee(employee.id)}
                  className="p-2 hover:bg-red-900/30 rounded-lg transition-colors group"
                >
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Отдел
                </span>
                <span className="text-white text-sm">{departments.find(d => d.type === employee.department)?.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Зарплата
                </span>
                <span className="text-white font-semibold">${employee.salary.toLocaleString()}/мес</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-sm">Продуктивность</span>
                  <span className="text-green-400 text-sm font-medium">{employee.productivity.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    style={{ width: `${employee.productivity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-sm">Удовлетворённость</span>
                  <span className={`text-sm font-medium ${employee.satisfaction >= 70 ? 'text-green-400' : employee.satisfaction >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {employee.satisfaction.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                    style={{ width: `${employee.satisfaction}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Опыт</span>
                <span className="text-white text-sm">{employee.experience} лет</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hire Modal */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Нанять сотрудника</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Должность</label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value as PositionType)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {positions.map((pos) => (
                    <option key={pos.type} value={pos.type}>
                      {pos.name} - ${pos.salary.toLocaleString()}/мес
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Отдел</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value as DepartmentType)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.type} value={dept.type}>
                      {dept.icon} {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Зарплата: <span className="text-white font-semibold">${positions.find(p => p.type === selectedPosition)?.salary.toLocaleString()}/мес</span>
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Доступно: <span className="text-green-400">${financials.cash.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowHireModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleHire}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all"
              >
                Нанять
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
