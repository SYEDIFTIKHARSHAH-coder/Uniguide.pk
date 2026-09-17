import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, GraduationCap, Users, BookOpen, Settings, Bell, LogOut, Search } from "lucide-react";

export default function UniversityLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/university/dashboard", icon: LayoutDashboard },
    { name: "Manage Profile", path: "/university/profile", icon: Users },
    { name: "Programs", path: "/university/programs", icon: BookOpen },
    { name: "Admissions", path: "/university/admissions", icon: GraduationCap },
    { name: "Scholarships", path: "/university/scholarships", icon: GraduationCap },
    { name: "Review Applications", path: "/university/applications", icon: Users },
    { name: "Settings", path: "/university/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-600">UniGuide.pk</span>
          <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">UNI</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.includes(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md w-64">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Search applications..." className="bg-transparent border-none text-sm outline-none w-full" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              NU
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
