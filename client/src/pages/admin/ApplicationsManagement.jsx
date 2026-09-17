import { useState } from "react";
import {
  useAdminApplications, useApproveApplicationMutation,
  useRejectApplicationMutation
} from "../../hooks/useAdminData";
import { Check, X, FileText, Edit3, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const statusBadge = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function ApplicationsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: applications, isLoading } = useAdminApplications(statusFilter);
  const approveMutation = useApproveApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();

  const handleApprove = (app) => {
    if (!window.confirm(`Approve ${app.studentName}'s application to ${app.university}?`)) return;
    approveMutation.mutate({ appId: app.id });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; }
    rejectMutation.mutate({ appId: rejectTarget.id, reason: rejectReason });
    setRejectTarget(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications Management</h1>
        <p className="text-sm text-slate-500">Review, approve or reject student university applications.</p>
      </div>

      <div className="flex gap-2 bg-white p-3 rounded-xl border border-slate-200">
        {["all", "pending", "approved", "rejected"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-4 font-semibold text-slate-600">Student</th>
              <th className="px-5 py-4 font-semibold text-slate-600">University / Program</th>
              <th className="px-5 py-4 font-semibold text-slate-600">Merit %</th>
              <th className="px-5 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-5 py-4 font-semibold text-slate-600">Submitted</th>
              <th className="px-5 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="6" className="py-10 text-center text-slate-500">Loading applications...</td></tr>
            ) : applications?.length === 0 ? (
              <tr><td colSpan="6" className="py-10 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No applications found.</p>
              </td></tr>
            ) : (
              applications?.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{app.studentName}</div>
                    <div className="text-xs text-slate-400">{app.studentId}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">{app.university}</div>
                    <div className="text-xs text-slate-500">{app.program}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-bold text-base ${app.merit >= 80 ? "text-emerald-600" : app.merit >= 65 ? "text-amber-600" : "text-rose-600"}`}>
                      {app.merit}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(app.submittedAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {app.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(app)}
                          disabled={approveMutation.isPending}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors gap-1">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => setRejectTarget(app)}
                          className="inline-flex items-center px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors gap-1">
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {app.approvedBy || app.rejectionReason ? `By: ${app.approvedBy || "Admin"}` : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reject Application</h3>
            <p className="text-sm text-slate-600 mb-4">
              You are rejecting <strong>{rejectTarget.studentName}</strong>'s application to <strong>{rejectTarget.university}</strong>.
            </p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              rows={3} placeholder="Reason for rejection (required)..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-rose-500 outline-none" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1 py-2.5 bg-slate-100 rounded-lg font-semibold text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleReject} disabled={rejectMutation.isPending}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-70">
                {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
