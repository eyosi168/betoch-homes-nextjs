import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import AdminNavLink from "@/components/admin/AdminNavLink";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Home
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r bg-white flex flex-col z-50">
        
        {/* BRANDING */}
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Home className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">Betoch</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 leading-none">Admin Suite</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
          
          {/* Main Group */}
          {/* Inside your AdminLayout nav section */}
<div className="space-y-1">
  <AdminNavLink href="/dashboard" iconName="dashboard">Overview</AdminNavLink>
  <AdminNavLink href="/dashboard/approvals" iconName="approvals">Approvals</AdminNavLink>
  <AdminNavLink href="/dashboard/users" iconName="users">Users</AdminNavLink>
</div>

<div>
  <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Insights</p>
  <div className="space-y-1">
    <AdminNavLink href="/dashboard/reports" iconName="reports">Market Reports</AdminNavLink>
    <AdminNavLink href="/dashboard/settings" iconName="settings">Platform Settings</AdminNavLink>
  </div>
</div>
        </nav>

        {/* USER PROFILE FOOTER */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-3 p-3 bg-white border rounded-2xl shadow-sm">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image 
                src={session.user.image || "/avatar.png"} 
                alt="Admin" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">System Administrator</p>
            </div>
            <Link href="/api/auth/signout" className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}