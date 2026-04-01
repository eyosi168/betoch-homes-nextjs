import { prisma } from "@/lib/prisma";
import { updateSystemSettings } from "@/lib/actions/settings.actions";
import { ShieldCheck, Power, Info } from "lucide-react";

export default async function SettingsPage() {
  // Fetch current settings
  const config = await prisma.systemConfig.findUnique({ where: { id: "system-settings" } });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Configuration</h1>
        <p className="text-slate-500 font-medium">Control global behavior for Betoch-Homes.</p>
      </div>

      <form action={async (formData) => {
        "use server";
        const autoApprove = formData.get("autoApprove") === "on";
        const maintenance = formData.get("maintenance") === "on";
        await updateSystemSettings({ autoApprove, maintenance });
      }} className="space-y-6">
        
        {/* Moderation Card */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-blue-50/30 flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={20} />
            <h3 className="font-bold">Moderation Settings</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Auto-Approve Listings</p>
                <p className="text-sm text-slate-500">New posts bypass the "Pending" queue.</p>
              </div>
              <input 
                type="checkbox" 
                name="autoApprove" 
                defaultChecked={config?.autoApprovePosts} 
                className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-rose-50/30 flex items-center gap-3 text-rose-700">
            <Power size={20} />
            <h3 className="font-bold">Danger Zone</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-rose-700">Maintenance Mode</p>
                <p className="text-sm text-slate-500">Block public access to the platform during major updates.</p>
              </div>
              <input 
                type="checkbox" 
                name="maintenance" 
                defaultChecked={config?.maintenanceMode} 
                className="w-6 h-6 rounded border-slate-300 text-rose-600 focus:ring-rose-500" 
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          Save Configuration Changes
        </button>
      </form>
    </div>
  );
}