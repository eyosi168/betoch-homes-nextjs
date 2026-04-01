"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  Settings,
  Home,
  MessageSquareText
} from "lucide-react";

// This map lives on the Client side, so it's safe!
const ICONS = {
  dashboard: LayoutDashboard,
  approvals: ClipboardCheck,
  users: Users,
  reports: BarChart3,
  settings: Settings,
  home: Home,
  chats: MessageSquareText,
};

export default function AdminNavLink({ 
  href, 
  iconName, // Change this to a string
  children 
}: { 
  href: string; 
  iconName: keyof typeof ICONS; 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = ICONS[iconName]; // Get the component from the map

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
        isActive 
          ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon size={20} className={cn(
        "transition-colors",
        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
      )} />
      {children}
    </Link>
  );
}