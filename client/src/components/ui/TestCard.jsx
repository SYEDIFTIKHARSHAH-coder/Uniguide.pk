import { Link } from "react-router-dom";
import { Calendar, Clock, FileText } from "lucide-react";

function safeDate(val) {
  if (!val) return "TBA";
  try {
    const d = new Date(val?.toDate ? val.toDate() : val);
    if (isNaN(d.getTime())) return "TBA";
    return d.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "TBA";
  }
}

export default function TestCard({ test }) {
  const deadline = test.registrationDeadline;
  const isApproaching = deadline
    ? new Date(deadline?.toDate ? deadline.toDate() : deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {test.name}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{test.organizingBody}</p>
          </div>
          {test.isActive === false && (
            <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-600 rounded-full">Inactive</span>
          )}
        </div>

        <p className="text-sm text-slate-600 mb-6 line-clamp-2">{test.description}</p>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center text-slate-700">
            <Calendar className="w-4 h-4 mr-3 text-slate-400" />
            <span className="font-medium mr-2">Test Date:</span>
            {safeDate(test.testDate)}
          </div>
          <div className={`flex items-center ${isApproaching ? "text-red-600" : "text-slate-700"}`}>
            <Clock className={`w-4 h-4 mr-3 ${isApproaching ? "text-red-500" : "text-slate-400"}`} />
            <span className="font-medium mr-2">Register By:</span>
            {safeDate(test.registrationDeadline)}
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-slate-100">
          <Link
            to={`/entry-tests/${test.id}`}
            className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            View Details
          </Link>
          {test.registrationLink ? (
            <a
              href={test.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Register Now
            </a>
          ) : (
            <span className="flex-1 text-center px-4 py-2 bg-slate-100 text-slate-400 rounded-md text-sm">
              Link TBA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
