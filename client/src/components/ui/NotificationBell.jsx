import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUnreadCount, useNotifications, useMarkReadMutation } from "../../hooks/useNotificationData";
import { Bell, X, ExternalLink } from "lucide-react";

const TYPE_ICONS = {
  admission: "🎓",
  scholarship: "💰",
  deadline: "⏰",
  application_status: "📋",
  system: "⚙️",
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: unreadCount } = useUnreadCount();
  const { data: notifications } = useNotifications();
  const markRead = useMarkReadMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    const unreadIds = notifications?.filter(n => !n.isRead).map(n => n.id) || [];
    if (unreadIds.length > 0) markRead.mutate(unreadIds);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {notifications?.length > 0 ? notifications.slice(0, 8).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-slate-50 transition-colors ${!notif.isRead ? "bg-blue-50/50" : ""}`}
              >
                <div className="flex items-start">
                  <span className="text-xl mr-3 mt-0.5">{TYPE_ICONS[notif.type] || "📢"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${!notif.isRead ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                      {notif.link && (
                        <Link to={notif.link} className="text-xs text-blue-600 font-medium flex items-center hover:text-blue-800" onClick={() => setIsOpen(false)}>
                          View <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notif.isRead && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-2 mt-1.5 flex-shrink-0"></span>}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 text-sm">No notifications yet.</div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center">
            <Link to="/student/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-800" onClick={() => setIsOpen(false)}>
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
