import { useState } from "react";
import { useUserManagement, useUpdateUserStatusMutation } from "../../hooks/useAdminData";
import { Search, ShieldAlert, ShieldCheck, Lock } from "lucide-react";

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useUserManagement(roleFilter);
  const statusMutation = useUpdateUserStatusMutation();

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    if (newStatus === "banned" && !window.confirm(`Are you sure you want to ban ${user.name}?`)) return;
    
    statusMutation.mutate({ userId: user.id, status: newStatus });
  };

  const filteredUsers = users?.filter(u => {
    const nameStr = u.fullName || u.name || "";
    return nameStr.toLowerCase().includes(search.toLowerCase()) || 
           u.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500">Manage students, universities, and their access statuses.</p>
      </div>

      {/* Single Admin Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Single Admin System</p>
          <p className="text-sm text-blue-800 mt-1">User roles are fixed and cannot be changed. Contact your system administrator if you need to modify roles.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex space-x-2">
          {["all", "student", "university"].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                roleFilter === role ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {role}s
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name / Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
            ) : filteredUsers?.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
            ) : (
              filteredUsers?.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.fullName || user.name || "Unknown"}</div>
                    <div className="text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      user.role === 'university' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 
                     (typeof user.createdAt === 'string' ? new Date(user.createdAt).toLocaleDateString() : '—')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={statusMutation.isPending}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.status === 'active' 
                          ? 'text-rose-600 hover:bg-rose-50' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <><ShieldAlert className="w-4 h-4 mr-1.5" /> Ban</>
                      ) : (
                        <><ShieldCheck className="w-4 h-4 mr-1.5" /> Unban</>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
