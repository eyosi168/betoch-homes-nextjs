import { redirect } from "next/navigation";
import Link from "next/link";
import {headers} from "next/headers"
// Import your auth session getter from Better Auth
import { auth} from "@/lib/auth"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session || session.user.role!== "ADMIN") {
        redirect("/");
      }
    

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">Betoch Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
            Overview
          </Link>
          <Link href="/dashboard/approvals" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            Pending Approvals
          </Link>
          <Link href="/dashboard/users" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            User Management
          </Link>
          <Link href="/dashboard/reports" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            Reports
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}