import { useTestCalendar } from "../../hooks/useEntryTestData";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";

export default function TestCalendar() {
  const { data: events, isLoading } = useTestCalendar();

  if (isLoading) return <div className="h-64 flex items-center justify-center border border-slate-200 rounded-xl bg-slate-50 text-slate-500">Loading Calendar...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Upcoming Schedule</h2>
          <p className="text-sm text-slate-500">Important dates for entry tests</p>
        </div>
      </div>

      <div className="space-y-4">
        {events?.map((event) => {
          const isDeadlineClose = new Date(event.registrationDeadline) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
          
          return (
            <div key={event.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors flex items-start">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{event.name}</h4>
                <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-sm">
                  <div className="text-slate-600">
                    <span className="font-medium">Test Date:</span> {new Date(event.testDate).toLocaleDateString()}
                  </div>
                  <div className={`${isDeadlineClose ? "text-red-600 font-medium" : "text-slate-600"}`}>
                    <span className="font-medium text-slate-600">Deadline:</span> {new Date(event.registrationDeadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {isDeadlineClose && (
                <div className="ml-4 text-red-500 tooltip" title="Deadline approaching soon">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
        {events?.length === 0 && <p className="text-slate-500 text-sm">No upcoming tests scheduled.</p>}
      </div>
    </div>
  );
}
