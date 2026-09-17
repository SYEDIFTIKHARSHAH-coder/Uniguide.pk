import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, FileCheck, Settings,
  LogOut, Bot, FileText, Building, BookOpen, Bell, Mail, Coins, FlaskConical
} from "lucide-react";
import IftiAiWidget from "../ui/IftiAiWidget";

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/ai-admissions", label: "AI Admissions", icon: Bot, badge: "AI" },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/universities", label: "Universities", icon: Building },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/scholarships", label: "Scholarships", icon: Coins },
  { to: "/admin/entry-tests", label: "Entry Tests", icon: FlaskConical },
  { to: "/admin/articles", label: "Articles & Guides", icon: FileText },
  { to: "/admin/documents", label: "Doc Verification", icon: FileCheck },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800">
          <Link to="/" className="text-xl font-black text-white">
            Uni<span className="text-blue-400">Guide</span>
            <span className="text-slate-400 text-sm font-normal">.pk</span>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">SI</div>
            <div>
              <div className="text-xs font-bold text-white leading-none">Syed Iftikhar Shah</div>
              <div className="text-xs text-slate-400 mt-0.5">Super Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.to, link.exact);
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                  active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}>
                <link.icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 bg-blue-500 text-white rounded-md">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium">
            <Mail className="w-4 h-4" /> Contact Us
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium">
            <LogOut className="w-4 h-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800">Admin Command Center</h2>
          <div className="flex items-center gap-3">
            <a href="mailto:ifitkharbusiness100@gmail.com"
              className="text-xs text-slate-500 hover:text-blue-600 hidden sm:block">
              ifitkharbusiness100@gmail.com
            </a>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              SI
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Admin IFTI AI Access */}
      <IftiAiWidget />
    </div>
  );
}
