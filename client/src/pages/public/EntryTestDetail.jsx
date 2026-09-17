import { useParams, Link } from "react-router-dom";
import { useTestDetail } from "../../hooks/useEntryTestData";
import { Download, ExternalLink, Calendar, CheckCircle2, Book, FileText, ArrowLeft } from "lucide-react";

function safeDate(val) {
  if (!val) return "TBA";
  try {
    const d = new Date(val?.toDate ? val.toDate() : val);
    if (isNaN(d.getTime())) return "TBA";
    return d.toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "TBA";
  }
}

export default function EntryTestDetail() {
  const { id } = useParams();
  const { data: test, isLoading, isError } = useTestDetail(id);

  if (isLoading) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading test details...</p>
      </div>
    </div>
  );

  if (isError || !test) return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Entry Test Not Found</h2>
      <p className="text-slate-500 mb-6">This entry test may have been removed or doesn't exist.</p>
      <Link to="/entry-tests" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
        ← Back to Entry Tests
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/entry-tests" className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Entry Tests
          </Link>
          <span className="inline-block px-3 py-1 bg-blue-700 text-blue-100 rounded-full text-sm font-semibold mb-4 border border-blue-600">
            {test.organizingBody || "Organizing Body TBA"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{test.name}</h1>
          {test.description && (
            <p className="text-blue-100 max-w-3xl text-lg">{test.description}</p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {test.registrationLink ? (
              <a
                href={test.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-sm"
              >
                Official Registration <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            ) : (
              <span className="px-6 py-3 bg-blue-700 text-blue-300 font-bold rounded-lg flex items-center justify-center cursor-not-allowed">
                Registration Link TBA
              </span>
            )}
            {test.syllabusFileUrl && (
              <a
                href={test.syllabusFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center border border-blue-600"
              >
                Download Syllabus <Download className="ml-2 w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">

          {/* Eligibility */}
          {test.eligibilityCriteria?.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
                Eligibility Criteria
              </h2>
              <ul className="space-y-3">
                {test.eligibilityCriteria.map((criteria, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-slate-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Prep Materials */}
          {test.preparationMaterials?.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Book className="w-6 h-6 text-purple-500 mr-2" />
                Preparation Materials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {test.preparationMaterials.map((material, idx) => (
                  <a
                    key={idx}
                    href={material.fileUrl || material.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-50 rounded flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                      {material.externalLink
                        ? <ExternalLink className="w-5 h-5 text-purple-600" />
                        : <FileText className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{material.title}</p>
                      <p className="text-xs text-slate-500 uppercase">{material.type?.replace('_', ' ')}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* No content fallback */}
          {!test.eligibilityCriteria?.length && !test.preparationMaterials?.length && (
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-400">
              <Book className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Detailed information coming soon.</p>
              <p className="text-sm mt-1">Check the official registration link for complete details.</p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Important Dates</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Test Date</p>
                  <p className="text-sm text-slate-600">{safeDate(test.testDate)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-600">Registration Deadline</p>
                  <p className="text-sm text-slate-600">{safeDate(test.registrationDeadline)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 text-sm">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Organized by</span>
                <span className="text-blue-900 font-semibold text-right">{test.organizingBody || "TBA"}</span>
              </div>
              {test.eligibilityCriteria?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Criteria</span>
                  <span className="text-blue-900 font-semibold">{test.eligibilityCriteria.length} items</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
