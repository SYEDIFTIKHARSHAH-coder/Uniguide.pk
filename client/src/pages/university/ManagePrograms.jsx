import { useState } from "react";
import { usePrograms, useAddProgram } from "../../hooks/useUniversityData";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function ManagePrograms() {
  const { data: programs, isLoading } = usePrograms();
  const addProgramMutation = useAddProgram();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", department: "", degreeLevel: "Bachelors", creditHours: 130 });

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      await addProgramMutation.mutateAsync({ ...formData, durationYears: 4, tuitionFee: 0 });
      toast.success("Program added successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add program");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Programs</h1>
          <p className="text-sm text-slate-500">Add, update, or remove academic programs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search programs..." 
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Program Name</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Level</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
              ) : programs?.map((prog) => (
                <tr key={prog.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{prog.name}</td>
                  <td className="px-6 py-4">{prog.department}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {prog.degreeLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 mr-3"><Edit className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal Stub */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Add New Program</h2>
            <form onSubmit={handleAddProgram} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Program Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" disabled={addProgramMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
