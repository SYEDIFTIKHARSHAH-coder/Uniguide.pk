import { useState } from "react";
import { Plus, Search, Calendar, Clock } from "lucide-react";

export default function ManageAdmissions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // MOCK DATA for admission cycles
  const cycles = [
    { id: 1, title: "Fall 2026 Admissions", status: "Active", startDate: "2026-08-01", endDate: "2026-09-30", programs: 12 },
    { id: 2, title: "Spring 2026 Admissions", status: "Closed", startDate: "2026-01-01", endDate: "2026-02-28", programs: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Admission Cycles</h1>
          <p className="text-sm text-slate-500">Open or close admissions for your programs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Open New Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cycles.map((cycle) => (
          <div key={cycle.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900">{cycle.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cycle.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                {cycle.status}
              </span>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                Starts: {cycle.startDate}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                Ends: {cycle.endDate}
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-900 mr-1">{cycle.programs}</span> Programs Included
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-slate-50 text-slate-700 rounded-md hover:bg-slate-100 border border-slate-200 transition-colors">
                Edit Dates
              </button>
              {cycle.status === "Active" && (
                <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 border border-red-100 transition-colors">
                  Close Cycle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
