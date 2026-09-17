import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsMutation } from "../../hooks/useAdminData";
import { Save, Settings2, AlertTriangle, MessageSquare } from "lucide-react";

export default function SystemSettings() {
  const { data: currentSettings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsMutation();
  
  const [settings, setSettings] = useState({
    platformFeePercentage: 0,
    globalAnnouncement: "",
    maintenanceMode: false,
  });

  useEffect(() => {
    if (currentSettings) setSettings(currentSettings);
  }, [currentSettings]);

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  if (isLoading) return <div className="p-10 text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-sm text-slate-500">Configure global platform variables and behaviors.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Platform Fee */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4">
              <Settings2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">Platform Fee Percentage (%)</h3>
              <p className="text-sm text-slate-500 mb-4">
                The percentage UniGuide takes from paid courses or premium university services.
              </p>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.platformFeePercentage}
                onChange={(e) => setSettings({ ...settings, platformFeePercentage: Number(e.target.value) })}
                className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Global Announcement */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mr-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">Global Announcement</h3>
              <p className="text-sm text-slate-500 mb-4">
                A banner message displayed at the top of the screen for all logged-in users.
              </p>
              <textarea
                value={settings.globalAnnouncement}
                onChange={(e) => setSettings({ ...settings, globalAnnouncement: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Scheduled maintenance on Sunday..."
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="p-6">
          <div className="flex items-start">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg mr-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">Maintenance Mode</h3>
              <p className="text-sm text-slate-500 mb-4">
                If enabled, non-admin users will be blocked from accessing the platform.
              </p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                <span className="ml-3 text-sm font-medium text-slate-700">
                  {settings.maintenanceMode ? "Enabled (Platform is Offline)" : "Disabled (Platform is Online)"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>

      </div>
    </div>
  );
}
