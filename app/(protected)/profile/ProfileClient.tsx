"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { deletePost, togglePostStatus } from "@/lib/actions/post.actions"; 
import { updateProfile } from "@/lib/actions/user.actions";
import { CldUploadWidget } from "next-cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PropertyCard from "@/components/property/PropertyCard";
import { 
  MessageCircle, 
  Trash2, 
  Edit, 
  PlusCircle, 
  Settings,
  Heart,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Ban
} from "lucide-react";

export default function ProfileClient({ user, posts, savedPosts, unreadCount, isOwner }: any) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.image || "/avatar.png");
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (postId: string, currentStatus: string) => {
    startTransition(async () => {
      await togglePostStatus(postId, currentStatus);
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      {/* --- HEADER SECTION (Unchanged) --- */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-2xl border shadow-sm mb-8">
        <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-slate-50 shrink-0 shadow-inner">
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-500 mt-2 max-w-md leading-relaxed">
            {user.bio || "This user hasn't added a bio yet."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isOwner && (
            <Link href="/addPost">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md transition-transform hover:scale-105">
                <PlusCircle size={18} />
                Post Property
              </Button>
            </Link>
          )}

          <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-xl border">
            <div className="text-center px-4 border-r border-slate-200">
              <p className="text-2xl font-bold text-slate-900">{posts?.length || 0}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Listings</p>
            </div>
            
            {!isOwner ? (
              <Link href={`/chat/${user.id}`}>
                <Button variant="outline" className="gap-2">
                  <MessageCircle size={18}/> Message
                </Button>
              </Link>
            ) : (
              <Link href="/chats" className="relative px-4 flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 transition-colors">
                <MessageCircle className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                    {unreadCount}
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold mt-1">Inbox</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="mb-8 bg-slate-100/50 p-1">
          <TabsTrigger value="listings" className="px-8">Listings</TabsTrigger>
          {isOwner && <TabsTrigger value="saved" className="px-8">Saved</TabsTrigger>}
          {isOwner && <TabsTrigger value="settings" className="px-8">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="listings" className="space-y-6 outline-none">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 border-2 border-dashed rounded-3xl text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <PlusCircle className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">No properties yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Ready to sell or rent? Post your first listing now.</p>
              {isOwner && (
                <Link href="/addPost" className="mt-6">
                  <Button size="lg" className="rounded-full px-8 shadow-lg">Start Listing</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <div key={post.id} className="relative group flex flex-col h-full border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* --- CHANGE 1: MODERATION STATUS BADGE (Top Right) --- */}
                  <div className={`absolute top-3 right-3 z-20 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1 backdrop-blur-md ${
                    post.moderationStatus === "APPROVED" ? "bg-emerald-500/90 text-white" :
                    post.moderationStatus === "REJECTED" ? "bg-rose-600/90 text-white" :
                    "bg-amber-500/90 text-white"
                  }`}>
                    {post.moderationStatus === "PENDING" && <Clock size={10} className="animate-pulse" />}
                    {post.moderationStatus === "APPROVED" && <CheckCircle size={10} />}
                    {post.moderationStatus === "REJECTED" && <Ban size={10} />}
                    {post.moderationStatus}
                  </div>

                  {/* --- CHANGE 2: AVAILABILITY BADGE (Top Left) --- */}
                  <div className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 ${
                    post.status === "available" 
                      ? "bg-slate-900/80 text-white backdrop-blur-sm" 
                      : "bg-slate-400/80 text-white backdrop-blur-sm"
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full bg-white ${post.status === "available" ? "animate-pulse" : ""}`} />
                    {post.status}
                  </div>

                  <PropertyCard item={post} />
                  
                  {isOwner && (
                    <div className="flex flex-col gap-2 p-4 bg-white border-t mt-auto">
                      
                      {/* --- CHANGE 3: DISABLE TOGGLE IF NOT APPROVED --- */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isPending || post.moderationStatus !== "APPROVED"}
                        onClick={() => handleToggleStatus(post.id, post.status)}
                        className={`w-full rounded-lg font-semibold transition-all ${
                          post.moderationStatus !== "APPROVED" 
                            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed" 
                            : post.status === "available" 
                              ? "border-amber-200 hover:bg-amber-50 text-amber-700" 
                              : "border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {post.moderationStatus !== "APPROVED" ? (
                          "Pending Review"
                        ) : isPending ? (
                          <Loader2 size={14} className="animate-spin mr-2" />
                        ) : post.status === "available" ? (
                          <><XCircle size={14} className="mr-2" /> Mark as Occupied</>
                        ) : (
                          <><CheckCircle size={14} className="mr-2" /> Mark as Available</>
                        )}
                      </Button>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                          <Edit size={14} className="mr-2"/> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1 rounded-lg"
                          onClick={() => confirm("Delete this listing forever?") && deletePost(post.id)}
                        >
                          <Trash2 size={14} className="mr-2"/> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isOwner && (
                <Link href="/addPost" className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[400px]">
                  <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <PlusCircle className="text-slate-400 group-hover:text-blue-600" size={24} />
                  </div>
                  <span className="text-slate-500 font-semibold mt-4 group-hover:text-blue-600">Add Another Listing</span>
                </Link>
              )}
            </div>
          )}
        </TabsContent>

        {/* --- SAVED & SETTINGS TABS (Unchanged) --- */}
        {isOwner && (
          <TabsContent value="saved" className="outline-none">
            {savedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 border-2 border-dashed rounded-3xl text-center">
                <Heart className="h-10 w-10 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900">No saved properties</h3>
                <p className="text-slate-500 mt-2 max-w-sm">Tap the heart on any property to save it for later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPosts?.filter((p: any) => p !== null).map((saved: any) => (
                  <PropertyCard 
                    key={saved.id} 
                    item={saved}
                    isSavedInitial={true} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {isOwner && (
          <TabsContent value="settings">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <form 
                onSubmit={(e) => { e.preventDefault(); updateProfile({name, bio, image: avatar})}} 
                className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm"
               >
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Settings size={20} /> Profile Settings
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold">Profile Photo</Label>
                    <div className="flex items-center gap-6">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-slate-100">
                        <Image src={avatar} alt="preview" fill className="object-cover"/>
                      </div>
                      <CldUploadWidget uploadPreset="betoch" onSuccess={(res: any) => setAvatar(res.info.secure_url)}>
                        {({ open }) => (
                          <Button type="button" variant="outline" onClick={() => open()} className="rounded-full">
                            Change Avatar
                          </Button>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Display Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Personal Bio</Label>
                    <textarea 
                      className="w-full border rounded-xl p-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                      placeholder="Tell people about your properties..."
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black">
                    Save Changes
                  </Button>
               </form>
             </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}