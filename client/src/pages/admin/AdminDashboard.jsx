import { usePlatformAnalytics } from "../../hooks/useAdminData";
import StatCard from "../../components/ui/StatCard";
import { Users, Building, FileText, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = usePlatformAnalytics();

  if (isLoading) return <div className="p-10 text-slate-500">Loading dashboard data...</div>;
  if (!stats) return <div className="p-10 text-red-500">Failed to load analytics.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500">System-wide metrics and analytics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={stats.totalUsers.toLocaleString()} icon={Users} trend="up" trendValue="12%" color="blue" />
        <StatCard title="Partner Universities" value={stats.totalUniversities} icon={Building} trend="up" trendValue="2" color="purple" />
        <StatCard title="Applications Submitted" value={stats.totalApplications.toLocaleString()} icon={FileText} trend="up" trendValue="8%" color="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">User Growth (Students vs Universities)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                <Area yAxisId="right" type="monotone" dataKey="universities" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUnis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
