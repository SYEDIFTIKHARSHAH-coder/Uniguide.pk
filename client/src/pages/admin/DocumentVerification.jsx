import { useState } from "react";
import { usePendingDocuments, useVerifyDocumentMutation } from "../../hooks/useAdminData";
import { Check, X, Eye, FileText, AlertCircle } from "lucide-react";

export default function DocumentVerification() {
  const { data: documents, isLoading } = usePendingDocuments();
  const verifyMutation = useVerifyDocumentMutation();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleVerify = (id) => {
    verifyMutation.mutate({ documentId: id, status: "verified" });
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const handleReject = (id) => {
    if (!rejectReason.trim() || rejectReason.length < 5) {
      alert("Please provide a rejection reason (min 5 chars).");
      return;
    }
    verifyMutation.mutate({ documentId: id, status: "rejected", reason: rejectReason });
    setRejectReason("");
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  if (isLoading) return <div className="p-10 text-slate-500">Loading pending documents...</div>;

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Verification</h1>
        <p className="text-sm text-slate-500">Review and verify student uploaded documents (CNIC, Transcripts).</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Document Type</th>
                <th className="px-6 py-4">Uploaded At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    No pending documents to review.
                  </td>
                </tr>
              ) : (
                documents?.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{doc.studentName}</div>
                      <div className="text-xs text-slate-500">ID: {doc.studentId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(doc.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 mr-2 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review {selectedDoc.type}</h3>
                <p className="text-sm text-slate-500">Student: {selectedDoc.studentName}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-auto bg-slate-100 flex justify-center items-center">
              {/* In a real app, this would be an img or iframe depending on doc type */}
              <div className="bg-white p-2 shadow-sm rounded-lg border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" 
                  alt="Document Preview" 
                  className="max-w-full max-h-[50vh] object-contain rounded"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                <div className="flex-1 w-full relative">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (if rejecting)..."
                    className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {rejectReason && rejectReason.length < 5 && (
                    <p className="absolute -top-5 left-0 text-xs text-rose-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" /> Min 5 chars required
                    </p>
                  )}
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleReject(selectedDoc.id)}
                    disabled={verifyMutation.isPending}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4 mr-1.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedDoc.id)}
                    disabled={verifyMutation.isPending}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
