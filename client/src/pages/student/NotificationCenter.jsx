import { useState } from "react";
import { useNotifications, useMarkReadMutation } from "../../hooks/useNotificationData";
import { Link } from "react-router-dom";
import { Bell, ExternalLink, CheckCheck, Filter } from "lucide-react";

const TYPE_ICONS = {
  admission: "🎓",
  scholarship: "💰",
  deadline: "⏰",
  application_status: "📋",
  system: "⚙️",
};

const TYPE_LABELS = {
  admission: "Admission",
  scholarship: "Scholarship",
  deadline: "Deadline",
  application_status: "Application",
  system: "System",
};

const FILTERS = ["all", "admission", "scholarship", "deadline", "application_status", "system"];

export default function NotificationCenter() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkReadMutation();

  const filtered = activeFilter === "all"
    ? notifications
    : notifications?.filter(n => n.type === activeFilter);

  const handleMarkAllRead = () => {
    const unreadIds = notifications?.filter(n => !n.isRead).map(n => n.id) || [];
    if (unreadIds.length > 0) markRead.mutate(unreadIds);
  };

  const handleMarkOneRead = (id) => {
    markRead.mutate([id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Bell className="w-7 h-7 mr-3 text-blue-600" />
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with admissions, scholarships, and deadlines.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center"
        >
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeFilter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? "All" : TYPE_LABELS[f] || f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : filtered?.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-sm border p-5 flex items-start transition-colors ${
                !notif.isRead ? "border-blue-200 bg-blue-50/30" : "border-slate-200"
              }`}
            >
              <span className="text-2xl mr-4 mt-0.5">{TYPE_ICONS[notif.type] || "📢"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className={`font-bold ${!notif.isRead ? "text-slate-900" : "text-slate-700"}`}>
                    {notif.title}
                  </h3>
                  <span className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                    notif.priority === "high" ? "bg-red-50 text-red-700" :
                    notif.priority === "medium" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {notif.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-3">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkOneRead(notif.id)}
                        className="text-xs text-blue-600 font-medium hover:text-blue-800"
                      >
                        Mark read
                      </button>
                    )}
                    {notif.link && (
                      <Link to={notif.link} className="text-xs text-blue-600 font-medium flex items-center hover:text-blue-800">
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No notifications</h3>
          <p className="text-slate-500">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
