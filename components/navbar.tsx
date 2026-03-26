"use client";

import { useEffect } from "react"; 
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Home, 
  LogOut, 
  User, 
  PlusCircle, 
  Bell, 
  MessageSquare 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  // Connect to the Zustand store
  const { unreadCount, setUnreadCount } = useNotificationStore();

  // Fetch initial unread count when the user logs in
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

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT SIDE: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              Betoch <span className="text-primary">Homes</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-sm font-medium ml-40">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/about" className="transition-colors hover:text-primary">Listing</Link>
            <Link href="/agents" className="transition-colors hover:text-primary">Agents</Link>
            <Link href="/contact" className="transition-colors hover:text-primary">Contact</Link>
          </div>
        </div>

        {/* RIGHT SIDE: Auth & Notifications */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : session ? (
            <div className="flex items-center gap-3">
              
              {/* NOTIFICATION BELL */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/chats">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                    >
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
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}