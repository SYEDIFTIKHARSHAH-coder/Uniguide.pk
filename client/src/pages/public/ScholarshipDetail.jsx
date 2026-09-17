import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Coins, Calendar, ArrowLeft, ExternalLink, CheckCircle2,
  FileText, Award, Users, Clock, BookOpen
} from "lucide-react";

function safeDate(val) {
  if (!val) return null;
  try {
    const d = new Date(val?.toDate ? val.toDate() : val);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return null;
  }
}

const typeColors = {
  merit: "bg-blue-100 text-blue-700 border-blue-200",
  need: "bg-green-100 text-green-700 border-green-200",
  "need-based": "bg-green-100 text-green-700 border-green-200",
  government: "bg-purple-100 text-purple-700 border-purple-200",
  international: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/scholarships/${id}`)
      .then(r => setScholarship(r.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading scholarship details...</p>
      </div>
    </div>
  );

  if (error || !scholarship) return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Scholarship Not Found</h2>
      <p className="text-slate-500 mb-6">This scholarship may have been removed or doesn't exist.</p>
      <Link to="/scholarship-calculator" className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
        ← Back to Scholarships
      </Link>
    </div>
  );

  const deadline = safeDate(scholarship.deadline);
  const typeColor = typeColors[scholarship.type?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

  const infoItems = [
    scholarship.amount && { icon: Award, label: "Award Amount", value: scholarship.amount, color: "text-emerald-600" },
    scholarship.provider && { icon: BookOpen, label: "Provided By", value: scholarship.provider },
    scholarship.minMarks != null && { icon: Users, label: "Minimum Marks", value: `${scholarship.minMarks}%` },
    scholarship.incomeLimit != null && { icon: Users, label: "Income Limit", value: `PKR ${Number(scholarship.incomeLimit).toLocaleString()} / month` },
    deadline && { icon: Clock, label: "Application Deadline", value: deadline, color: "text-rose-600" },
  ].filter(Boolean);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/scholarship-calculator"
            className="inline-flex items-center gap-1.5 text-amber-100 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scholarships
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {scholarship.type && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize border bg-white/20 text-white border-white/30`}>
                {scholarship.type.replace(/-/g, " ")}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{scholarship.name}</h1>
          {scholarship.provider && (
            <p className="text-amber-100 text-lg font-medium">{scholarship.provider}</p>
          )}
          {scholarship.description && (
            <p className="text-amber-100 mt-3 max-w-3xl">{scholarship.description}</p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {scholarship.applyLink ? (
              <a
                href={scholarship.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 shadow"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="px-6 py-3 bg-white/20 text-white/60 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                Application Link Not Available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">

          {/* Eligibility Criteria */}
          {scholarship.eligibility && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
                Eligibility Criteria
              </h2>
              <p className="text-slate-700 leading-relaxed">{scholarship.eligibility}</p>
            </section>
          )}

          {/* Required Documents */}
          {scholarship.requiredDocuments?.length > 0 && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-blue-500 mr-2" />
                Required Documents
              </h2>
              <ul className="space-y-2">
                {scholarship.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0" />
                    <span className="text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Fallback */}
          {!scholarship.eligibility && !scholarship.requiredDocuments?.length && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400">
              <Coins className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Full details coming soon.</p>
              <p className="text-sm mt-1">Visit the provider's official website for complete information.</p>
              {scholarship.applyLink && (
                <a href={scholarship.applyLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-amber-600 hover:underline font-medium text-sm">
                  Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-5 uppercase tracking-wider text-xs">Scholarship Details</h3>
            <div className="space-y-4">
              {infoItems.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${color || "text-slate-900"}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {scholarship.applyLink && (
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
              <p className="text-sm font-medium text-amber-800 mb-3">Ready to apply?</p>
              <a
                href={scholarship.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Go to Application <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
