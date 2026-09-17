import { useDashboardAnalytics } from "../../hooks/useUniversityData";
import { CustomBarChart, CustomPieChart, CustomLineChart } from "../../components/ui/Charts";
import { BookOpen, GraduationCap, Users, RefreshCw } from "lucide-react";

export default function UniversityDashboard() {
  const { data: analytics, isLoading, isError, refetch } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Failed to load analytics.</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
          Retry
        </button>
      </div>
    );
  }

  // Formatting data for Recharts based on our mock backend
  const monthlyData = analytics?.applicationsOverTime || [];
  const statusData = analytics?.statusBreakdown || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <button onClick={() => refetch()} className="p-2 text-slate-500 hover:text-blue-600 bg-white rounded-md shadow-sm border border-slate-200">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Programs</p>
            <h3 className="text-2xl font-bold text-slate-900">{analytics?.totalPrograms || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Admissions</p>
            <h3 className="text-2xl font-bold text-slate-900">{analytics?.activeAdmissions || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Applications</p>
            <h3 className="text-2xl font-bold text-slate-900">{analytics?.totalApplications || 0}</h3>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Applications Over Time</h3>
          <CustomLineChart data={monthlyData} xKey="name" lineKey="applications" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Application Status</h3>
          <CustomPieChart data={statusData} />
        </div>
      </div>
    </div>
  );
}
