import { useApplications } from "../../hooks/useUniversityData";
import { Eye, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewApplications() {
  const { data: applications, isLoading } = useApplications();

  const handleUpdateStatus = (appId, status) => {
    // In reality, this would trigger a useMutation hook
    toast.success(`Application marked as ${status}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Accepted</span>;
      case "rejected":
        return <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Review Applications</h1>
        <p className="text-sm text-slate-500">Evaluate and update statuses for student applications.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex space-x-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by student name..." 
                className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center px-3 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Applicant Name</th>
                <th className="px-6 py-3 font-medium">Program Applied</th>
                <th className="px-6 py-3 font-medium">Submission Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-8">Loading applications...</td></tr>
              ) : applications?.map((app) => (
                <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                        {app.studentName.charAt(0)}
                      </div>
                      {app.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-4">{app.program}</td>
                  <td className="px-6 py-4">{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 mr-3 tooltip" title="View Full Profile">
                      <Eye className="w-4 h-4" />
                    </button>
                    {app.status === "pending" && (
                      <>
                        <button onClick={() => handleUpdateStatus(app.id, 'accepted')} className="text-slate-400 hover:text-emerald-600 mr-3" title="Accept">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="text-slate-400 hover:text-red-600" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
