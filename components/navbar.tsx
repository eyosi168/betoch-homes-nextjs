"use client";

import { useEffect } from "react"; 
import Link from "next/link";
import Image from "next/image"; 
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Session } from "@/lib/auth"; 
import { Badge } from "@/components/ui/badge"; 
import { useNotificationStore } from "@/lib/store/useNotificationStore";
import { getUnreadCount } from "@/lib/actions/chat.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Loader2, 
  LogOut, 
  User, 
  PlusCircle, 
  Bell, 
  MessageSquare,
  LayoutDashboard,
  ArrowLeft 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  // CHANGE 1: Explicitly casting 'data' to your custom Session type so '.role' is recognized
  const session = data as Session | null;
  
  const isDashboard = pathname.startsWith("/dashboard");

  // CHANGE 2: Updated to "ADMIN" (uppercase) to match your database defaultValue and logs
  const isAdmin = session?.user?.role === "ADMIN";

  const { unreadCount, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (session?.user) {
      getUnreadCount().then((count) => {
        setUnreadCount(count);
      });
    }
  }, [session, setUnreadCount]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const linkClass = (path: string, isStartsWith = false) =>
    `transition-colors hover:text-primary ${
      isStartsWith
        ? pathname.startsWith(path)
          ? "text-primary font-semibold"
          : "text-muted-foreground"
        : pathname === path
        ? "text-primary font-semibold"
        : "text-muted-foreground"
    }`;

  return (
    <nav className="sticky h-20 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 mt-2">
        
        {/* LEFT SIDE: LOGO */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative flex items-center overflow-hidden h-20 w-64">
              <Image 
                src="/logo.png" 
                alt="Betoch Homes Logo" 
                fill 
                priority 
                className="object-contain scale-150" 
              />
            </Link>
          </div>

          {/* MIDDLE NAV */}
          <div className="hidden lg:flex items-center gap-10 text-base font-medium ml-20">
            {isDashboard ? (
              <Link href="/" className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity ">
                <ArrowLeft size={18} />
                Back to Public Site
              </Link>
            ) : (
              <>
                <Link href="/" className={linkClass("/")}>Home</Link>
                <Link href="/properties" className={linkClass("/properties", true)}>Listing</Link>
                <Link href="/agents" className={linkClass("/agents")}>Agents</Link>
                <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
                
                {/* CHANGE 3: Added Admin Dashboard link directly to the main horizontal nav */}
                {isAdmin && (
                  <Link 
                    href="/dashboard" 
                    className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 ml-20"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : session ? (
            <div className="flex items-center gap-3">
              
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/chats">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Link href="/addPost">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Post Property
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={session.user.image || "/avatar.png"} alt={session.user.name} />
                      <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* CHANGE 4: Verified logic for the dropdown link */}
                  {isAdmin && (
                    <DropdownMenuItem asChild className="text-blue-600 focus:text-blue-700 font-semibold">
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/chats" className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" /> Messages
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Sign Up</Link></Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}