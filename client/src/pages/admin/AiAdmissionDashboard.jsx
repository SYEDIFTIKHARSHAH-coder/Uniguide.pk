import { useState } from "react";
import {
  useAiDashboardStats, useAiDiscoveries, useAiActivityLog,
  useApproveAiDiscoveryMutation, useRejectAiDiscoveryMutation,
  useEditAiDiscoveryMutation, useTriggerCrawlMutation,
  useCrawlerCooldownStatus
} from "../../hooks/useAdminData";
import {
  Bot, Check, X, Edit3, ExternalLink, RefreshCw,
  AlertTriangle, CheckCircle, Clock, Activity, TrendingUp,
  BookOpen, Award, GraduationCap, FileText, ClipboardList
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Type display helpers ─────────────────────────────────────────────────────
const typeConfig = {
  admission:   { label: "Admission",   icon: GraduationCap, bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  scholarship: { label: "Scholarship", icon: Award,          bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200" },
  free_course: { label: "Free Course", icon: BookOpen,        bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  article:     { label: "Article",     icon: FileText,        bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  entry_test:  { label: "Entry Test",  icon: ClipboardList,   bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
};

const getTypeDisplay = (type) => typeConfig[type] || typeConfig.admission;

// Type-specific fields to show nicely in the detail panel
const typeFields = {
  admission:   ["universityName", "program", "deadline", "fee", "eligibility", "description", "sourceUrl"],
  scholarship: ["name", "provider", "amount", "deadline", "eligibility", "description", "sourceUrl"],
  free_course: ["name", "provider", "category", "duration", "level", "description", "sourceUrl"],
  article:     ["title", "category", "excerpt", "author", "sourceUrl"],
  entry_test:  ["name", "organizingBody", "registrationDeadline", "testDate", "eligibility", "description", "sourceUrl"],
};

// Normalize score to 0-100 range regardless of how it was stored
const normalizeScore = (score) => {
  if (!score && score !== 0) return 0;
  // If score is > 1, it's already a percentage (e.g. 86 → use as-is)
  // If score is ≤ 1, it's a decimal (e.g. 0.86 → multiply by 100)
  return score > 1 ? score : score * 100;
};

const confidenceColor = (score) => {
  const pct = normalizeScore(score);
  if (pct >= 90) return "text-emerald-600 bg-emerald-50";
  if (pct >= 75) return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
};

const statusBadge = {
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function AiAdmissionDashboard() {
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter discoveries by type (in addition to status filter)
  const filteredDiscoveries = (discoveries || []).filter(d =>
    typeFilter === "all" || d.type === typeFilter
  );

  const { data: stats } = useAiDashboardStats();
  const { data: discoveries, isLoading } = useAiDiscoveries(statusFilter);
  const { data: activityLog } = useAiActivityLog();
  const approveMutation = useApproveAiDiscoveryMutation();
  const rejectMutation = useRejectAiDiscoveryMutation();
  const editMutation = useEditAiDiscoveryMutation();
  const crawlMutation = useTriggerCrawlMutation();
  const { data: cooldownData } = useCrawlerCooldownStatus();

  const handleApprove = (disc) => {
    approveMutation.mutate({ id: disc.id, adminNote: "" });
    setSelectedDisc(null);
  };

  const handleReject = (disc) => {
    if (!rejectReason.trim() || rejectReason.length < 5) {
      toast.error("Please provide a rejection reason (min 5 chars)");
      return;
    }
    rejectMutation.mutate({ id: disc.id, reason: rejectReason });
    setRejectReason("");
    setSelectedDisc(null);
  };

  const handleSaveEdit = (disc) => {
    editMutation.mutate({ id: disc.id, data: editData });
    setEditMode(false);
    setEditData({});
  };

  const openEdit = (disc) => {
    setSelectedDisc(disc);
    setEditMode(true);
    setEditData({ ...disc.data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-600" /> IFTI AI
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Auto-discovered admissions from official Pakistani university websites. Review → Edit → Approve → Publish.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => crawlMutation.mutate()}
            disabled={crawlMutation.isPending || cooldownData?.onCooldown}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold rounded-lg transition-all ${
              cooldownData?.onCooldown 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${crawlMutation.isPending ? "animate-spin" : ""}`} />
            {crawlMutation.isPending ? "Crawling..." : 
             cooldownData?.onCooldown ? "On Cooldown" : "Trigger AI Crawl"}
          </button>
          {cooldownData?.onCooldown && (
            <span className="text-xs text-orange-600 font-medium">
              Next run in: {cooldownData.remaining}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Discovered", value: stats.totalDiscoveries, icon: Bot, color: "blue" },
            { label: "Pending Review", value: stats.pendingReview, icon: Clock, color: "amber" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "emerald" },
            { label: "Rejected", value: stats.rejected, icon: X, color: "rose" },
            { label: "Avg Confidence", value: `${normalizeScore(stats.avgConfidenceScore).toFixed(0)}%`, icon: TrendingUp, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3`}>
              <div className={`p-2 rounded-lg bg-${color}-50`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Discovery Queue */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Status Filter Row */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
            {["pending_review", "approved", "rejected", "all"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          {/* Type Filter Row */}
          <div className="px-4 py-2.5 border-b border-slate-50 flex flex-wrap items-center gap-2 bg-slate-50/50">
            <span className="text-xs font-semibold text-slate-500 mr-1">Type:</span>
            {["all", "admission", "free_course", "scholarship", "article", "entry_test"].map(t => {
              const cfg = t === "all" ? null : getTypeDisplay(t);
              const IconComp = cfg?.icon;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    typeFilter === t
                      ? (cfg ? `${cfg.bg} ${cfg.text} border ${cfg.border}` : "bg-blue-600 text-white")
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {IconComp && <IconComp className="w-3 h-3" />}
                  {t === "all" ? "All Types" : cfg?.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading AI discoveries...</div>
          ) : discoveries?.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No discoveries with this status.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDiscoveries.map(disc => {
                const tCfg = getTypeDisplay(disc.type);
                const TypeIcon = tCfg.icon;
                return (
                <div key={disc.id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedDisc?.id === disc.id ? "bg-blue-50" : ""}`}
                  onClick={() => { setSelectedDisc(disc); setEditMode(false); }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Type badge */}
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${tCfg.bg} ${tCfg.text}`}>
                          <TypeIcon className="w-3 h-3" />{tCfg.label}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm truncate">{disc.universityName || disc.name || disc.title || '(No name)'}</h3>
                        {disc.changeDetected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            <AlertTriangle className="w-3 h-3" /> Change Detected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {disc.type === "free_course" ? (disc.provider || disc.category || "") :
                         disc.type === "scholarship" ? (disc.provider || disc.amount || "") :
                         disc.type === "article" ? (disc.excerpt?.substring(0, 80) || "") :
                         (disc.data?.programs?.slice(0, 3).join(", ") || "")}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[disc.status]}`}>
                          {disc.status.replace("_", " ")}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${confidenceColor(disc.confidenceScore)}`}>
                          {normalizeScore(disc.confidenceScore).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>
                    {disc.status === "pending_review" && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(disc); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit data">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleApprove(disc); }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedDisc(disc); }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>

        {/* Detail Panel / Activity Log */}
        <div className="space-y-6">
          {/* Detail Panel */}
          {selectedDisc && !editMode && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              {/* Type-aware header */}
              {(() => {
                const detailType = getTypeDisplay(selectedDisc.type);
                const DetailIcon = detailType.icon;
                return (
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mb-2 ${detailType.bg} ${detailType.text}`}>
                        <DetailIcon className="w-3.5 h-3.5" />{detailType.label}
                      </span>
                      <h3 className="font-bold text-slate-900">
                        {selectedDisc.universityName || selectedDisc.name || selectedDisc.title}
                      </h3>
                    </div>
                    {(selectedDisc.sourceUrl || selectedDisc.officialWebsite) && (
                      <a href={selectedDisc.sourceUrl || selectedDisc.officialWebsite} target="_blank" rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs">
                        <ExternalLink className="w-4 h-4" /> Source
                      </a>
                    )}
                  </div>
                );
              })()}

              {selectedDisc.changeDetected && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                  <strong>⚠️ Change Detected:</strong> {selectedDisc.changeDetails}
                </div>
              )}

              {/* Type-specific fields display */}
              <div className="space-y-2 text-sm text-slate-600">
                {(typeFields[selectedDisc.type] || Object.keys(selectedDisc.data || selectedDisc)).map(key => {
                  const val = selectedDisc[key] ?? selectedDisc.data?.[key];
                  if (val === undefined || val === null || val === "") return null;
                  return (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-slate-700 capitalize min-w-[120px]">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="text-slate-600">
                        {key === "sourceUrl" ? (
                          <a href={val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{val}</a>
                        ) : Array.isArray(val) ? val.join(", ") : String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {selectedDisc.status === "pending_review" && (
                <div className="mt-4 space-y-2">
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Rejection reason (if rejecting)..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(selectedDisc)}
                      className="flex-1 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 text-sm flex items-center justify-center gap-1">
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleApprove(selectedDisc)}
                      className="flex-1 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 text-sm flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(selectedDisc)}
                      className="flex-1 py-2 bg-rose-50 text-rose-700 font-semibold rounded-lg hover:bg-rose-100 text-sm flex items-center justify-center gap-1">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Mode Panel */}
          {selectedDisc && editMode && (
            <div className="bg-white rounded-xl border border-blue-300 shadow-sm p-5">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Editing: {selectedDisc.universityName}
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {Object.entries(editData).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-600 capitalize mb-1">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    {Array.isArray(val) ? (
                      <textarea
                        value={val.join(", ")}
                        onChange={e => setEditData(prev => ({ 
                          ...prev, 
                          [key]: e.target.value.split(",").map(i => i.trim()).filter(Boolean) 
                        }))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                        rows="3"
                        placeholder="Comma separated values..."
                      />
                    ) : (
                      <input
                        type={typeof val === "number" ? "number" : "text"}
                        value={val || ""}
                        onChange={e => setEditData(prev => ({ 
                          ...prev, 
                          [key]: typeof val === "number" ? Number(e.target.value) : e.target.value 
                        }))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditMode(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200">
                  Cancel
                </button>
                <button onClick={() => handleSaveEdit(selectedDisc)}
                  disabled={editMutation.isPending}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">
                  {editMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-600" /> AI Activity Log
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {activityLog?.slice(0, 10).map(log => (
                <div key={log.id} className="text-xs py-2 border-b border-slate-50">
                  <div className={`font-semibold ${
                    log.type === "approved" ? "text-emerald-700" :
                    log.type === "rejected" ? "text-rose-700" :
                    log.type === "change_detected" ? "text-orange-700" : "text-blue-700"
                  }`}>{log.message}</div>
                  <div className="text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString("en-PK")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
