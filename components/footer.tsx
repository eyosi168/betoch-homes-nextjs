"use client";

import Link from "next/link";
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Home className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold tracking-tight">Betoch <span className="text-blue-500">Homes</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The leading real estate marketplace in Ethiopia. We simplify the process of buying, selling, and renting properties with transparency and local expertise.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-blue-700 transition-colors"><Linkedin size={20} /></Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/properties" className="hover:text-blue-500 transition-colors">Browse Properties</Link></li>
              <li><Link href="/agents" className="hover:text-blue-500 transition-colors">Find an Agent</Link></li>
              <li><Link href="/about" className="hover:text-blue-500 transition-colors">About Our Company</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span>+251 911 22 33 44</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <span>contact@betochhomes.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get the latest property listings and market news.
            </p>
            <div className="flex flex-col gap-2">
              <Input 
                placeholder="Email address" 
                className="bg-slate-900 border-slate-800 text-white focus-visible:ring-blue-500" 
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Betoch Homes. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
          <p>Built with ❤️ by Eyosyas Solomon</p>
        </div>
      </div>
    </footer>
  );
}