import React from 'react';
import { useGame } from '../context/GameContext';
import { Settings, Volume2, VolumeX, Bell, BellOff, Save, Moon, Sun, Monitor, Globe, Trash2, LogOut } from 'lucide-react';

export function SettingsPanel() {
  const { settings, updateSettings, achievements } = useGame();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Настройки
        </h1>
        <p className="text-slate-400">Настройте игру под себя</p>
      </div>

      {/* Sound Settings */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          Звук
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            icon={settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            title="Звуковые эффекты"
            description="Включить звуки интерфейса"
            enabled={settings.soundEnabled}
            onToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          />
          <ToggleSetting
            icon={settings.musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            title="Фоновая музыка"
            description="Включить фоновую музыку"
            enabled={settings.musicEnabled}
            onToggle={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          {settings.notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          Уведомления
        </h3>
        <ToggleSetting
          icon={settings.notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          title="Уведомления"
          description="Показывать уведомления о событиях"
          enabled={settings.notificationsEnabled}
          onToggle={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
        />
      </div>

      {/* Game Settings */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Игра
        </h3>
        <ToggleSetting
          icon={<Save className="w-5 h-5" />}
          title="Автосохранение"
          description="Автоматически сохранять прогресс"
          enabled={settings.autoSave}
          onToggle={() => updateSettings({ autoSave: !settings.autoSave })}
        />
      </div>

      {/* Theme */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Тема
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ThemeOption
            icon={<Sun className="w-5 h-5" />}
            label="Светлая"
            active={settings.theme === 'light'}
            onClick={() => updateSettings({ theme: 'light' })}
          />
          <ThemeOption
            icon={<Moon className="w-5 h-5" />}
            label="Тёмная"
            active={settings.theme === 'dark'}
            onClick={() => updateSettings({ theme: 'dark' })}
          />
          <ThemeOption
            icon={<Monitor className="w-5 h-5" />}
            label="Системная"
            active={settings.theme === 'auto'}
            onClick={() => updateSettings({ theme: 'auto' })}
          />
        </div>
      </div>

      {/* Language */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Язык
        </h3>
        <select
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value })}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Achievements Progress */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Прогресс достижений</h3>
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div key={ach.id} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                ach.unlocked ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-slate-700'
              }`}>
                {ach.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {ach.title}
                  </span>
                  <span className="text-slate-400 text-xs">{ach.progress}/{ach.target}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ach.unlocked ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-red-700/50">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Опасная зона
        </h3>
        <div className="space-y-3">
          <button className="w-full py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/50 rounded-xl transition-all flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Сбросить прогресс
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ icon, title, description, enabled, onToggle }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-all ${
          enabled ? 'bg-violet-600' : 'bg-slate-600'
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

function ThemeOption({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
        active
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
      }`}
    >
      <div className={active ? 'text-violet-400' : 'text-slate-400'}>{icon}</div>
      <span className={`text-sm ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
    </button>
  );
}
