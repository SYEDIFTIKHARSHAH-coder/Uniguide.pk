import { useState, useEffect } from 'react';
import { Plus, FlaskConical, Search, Loader2, Trash2, Pencil, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  fetchEntryTestsForAdmin,
  createEntryTestAdmin,
  updateEntryTestAdmin,
  deleteEntryTestAdmin
} from '../../api/adminApi';

const EMPTY_FORM = {
  name: '',
  organizingBody: '',
  description: '',
  registrationLink: '',
  registrationDeadline: '',
  testDate: '',
  eligibilityCriteria: '',
};

export default function EntryTestsManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchEntryTestsForAdmin();
      setTests(data || []);
    } catch (err) {
      toast.error('Failed to load entry tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name || '',
      organizingBody: t.organizingBody || '',
      description: t.description || '',
      registrationLink: t.registrationLink || '',
      registrationDeadline: t.registrationDeadline ? t.registrationDeadline.substring(0, 10) : '',
      testDate: t.testDate ? t.testDate.substring(0, 10) : '',
      eligibilityCriteria: Array.isArray(t.eligibilityCriteria) ? t.eligibilityCriteria.join('\n') : (t.eligibilityCriteria || ''),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.organizingBody.trim() || !formData.description.trim()) {
      toast.error('Name, Organizing Body, and Description are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        organizingBody: formData.organizingBody.trim(),
        description: formData.description.trim(),
        registrationLink: formData.registrationLink.trim() || null,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        testDate: formData.testDate ? new Date(formData.testDate).toISOString() : null,
        eligibilityCriteria: formData.eligibilityCriteria.trim()
          ? formData.eligibilityCriteria.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
      };
      if (editingId) {
        await updateEntryTestAdmin(editingId, payload);
        toast.success('Entry test updated!');
      } else {
        await createEntryTestAdmin(payload);
        toast.success('Entry test added!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save entry test');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteEntryTestAdmin(id);
      toast.success('Entry test deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (t) => {
    try {
      await updateEntryTestAdmin(t.id, { isActive: !t.isActive });
      toast.success(`Entry test ${!t.isActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = tests.filter(t =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.organizingBody || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Entry Tests Management</h2>
          <p className="text-sm text-slate-500">Add, edit, and remove entry tests shown on the public Entry Tests page.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Entry Test
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search tests..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" />
          </div>
          <div className="text-sm font-medium text-slate-500">{filtered.length} / {tests.length} total</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Test Name</th>
                <th className="p-4 font-semibold">Organizing Body</th>
                <th className="p-4 font-semibold">Test Date</th>
                <th className="p-4 font-semibold">Deadline</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-medium">No entry tests found.</td></tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{t.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{t.organizingBody}</td>
                    <td className="p-4 text-slate-600">{formatDate(t.testDate)}</td>
                    <td className="p-4 text-slate-600">{formatDate(t.registrationDeadline)}</td>
                    <td className="p-4">
                      <button onClick={() => handleToggleActive(t)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${t.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id, t.name)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Entry Test' : 'Add New Entry Test'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="entrytest-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Test Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. MDCAT 2026" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Organizing Body *</label>
                    <input required type="text" value={formData.organizingBody} onChange={e => setFormData(p => ({ ...p, organizingBody: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. PMDC" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                    <textarea required rows="3" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Short description of this entry test..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Test Date</label>
                    <input type="date" value={formData.testDate} onChange={e => setFormData(p => ({ ...p, testDate: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Deadline</label>
                    <input type="date" value={formData.registrationDeadline} onChange={e => setFormData(p => ({ ...p, registrationDeadline: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Link (URL)</label>
                    <input type="url" value={formData.registrationLink} onChange={e => setFormData(p => ({ ...p, registrationLink: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="https://..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Eligibility Criteria <span className="text-slate-400 font-normal">— one criterion per line</span>
                    </label>
                    <textarea rows="3" value={formData.eligibilityCriteria} onChange={e => setFormData(p => ({ ...p, eligibilityCriteria: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="FSc Pre-Medical with 65% marks&#10;Valid CNIC required" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" form="entrytest-form" disabled={saving} className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Entry Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
