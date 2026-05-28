import { useGame } from '../context/GameContext';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trophy } from 'lucide-react';

export function NotificationsPanel() {
  const { notifications, markNotificationRead } = useGame();

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-900/20 border-blue-700/50';
      case 'success': return 'bg-green-900/20 border-green-700/50';
      case 'warning': return 'bg-amber-900/20 border-amber-700/50';
      case 'error': return 'bg-red-900/20 border-red-700/50';
      case 'achievement': return 'bg-purple-900/20 border-purple-700/50';
      default: return 'bg-slate-900/20 border-slate-700/50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Уведомления
          </h1>
          <p className="text-slate-400">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все прочитано'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all text-sm"
          >
            Прочитать все
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Нет уведомлений</h3>
          <p className="text-slate-400">Уведомления появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markNotificationRead(notification.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                notification.isRead
                  ? 'bg-slate-800/30 border-slate-700/50 opacity-70'
                  : `bg-slate-800/50 ${getBgColor(notification.type)}`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-violet-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{notification.message}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    {new Date(notification.createdAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
