"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deletePost, toggleSavePost } from "@/lib/actions/post.actions";
import { updateProfile } from "@/lib/actions/user.actions";
import { authClient } from "@/lib/auth-client";
import { CldUploadWidget } from "next-cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, MapPin, Trash2, Edit, UserCircle } from "lucide-react";

export default function ProfileClient({ user, posts, savedPosts, unreadCount, isOwner }: any) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.image || "/noavatar.png");

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-2xl border mb-8">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border shrink-0">
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.bio || "No bio provided."}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-center px-4 border-r">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Listings</p>
          </div>
          {!isOwner && (
            <Link href={`/chat/${user.id}`}>
              <Button className="gap-2"><MessageCircle size={18}/> Message</Button>
            </Link>
          )}
          {isOwner && (
             <div className="relative px-4 flex flex-col items-center justify-center text-blue-600">
               <MessageCircle className="h-6 w-6" />
               {unreadCount > 0 && <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
               <span className="text-[10px] uppercase font-bold">Inbox</span>
             </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-8">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          {isOwner && <TabsTrigger value="saved">Saved</TabsTrigger>}
          {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="listings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <div key={post.id} className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition">
                <div className="relative h-40"><Image src={post.images[0]} alt="img" fill className="object-cover"/></div>
                <div className="p-4">
                  <h4 className="font-bold truncate">{post.title}</h4>
                  <p className="text-blue-600 font-bold">{post.price} ETB</p>
                  {isOwner && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1"><Edit size={14} className="mr-1"/> Edit</Button>
                      <Button variant="destructive" size="sm" className="flex-1" onClick={() => confirm("Delete?") && deletePost(post.id)}><Trash2 size={14} className="mr-1"/> Delete</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {isOwner && (
          <TabsContent value="settings">
             <form onSubmit={(e) => { e.preventDefault(); updateProfile({name, bio, image: avatar})}} className="max-w-xl space-y-4 bg-white p-6 rounded-xl border">
                <div className="space-y-2">
                  <Label>Photo</Label>
                  <CldUploadWidget uploadPreset="betoch" onSuccess={(res: any) => setAvatar(res.info.secure_url)}>
                    {({ open }) => <Button type="button" variant="outline" onClick={() => open()}>Upload New</Button>}
                  </CldUploadWidget>
                </div>
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Bio</Label><textarea className="w-full border rounded-md p-2 h-24" value={bio} onChange={e => setBio(e.target.value)} /></div>
                <Button type="submit">Update Profile</Button>
             </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}