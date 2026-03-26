"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Have questions about a property or need help with your account? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border">
        
        {/* LEFT SIDE: Contact Info */}
        <div className="bg-slate-900 text-white p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <p className="text-slate-400 mb-10 leading-relaxed">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-semibold">+251 911 234 567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-semibold">support@betoch.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Office</p>
                  <p className="font-semibold">Bole Road, Addis Ababa<br/>Ethiopia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-3">
             <Clock className="text-blue-400 h-5 w-5" />
             <p className="text-sm text-slate-400">Working Hours: Mon - Fri, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* RIGHT SIDE: Contact Form */}
        <div className="p-10 lg:p-12">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-slate-500">Thank you for reaching out. We will get back to you shortly.</p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6 rounded-xl">
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                  <Input id="firstName" required className="rounded-xl h-12 bg-slate-50 border-slate-200" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                  <Input id="lastName" required className="rounded-xl h-12 bg-slate-50 border-slate-200" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input id="email" type="email" required className="rounded-xl h-12 bg-slate-50 border-slate-200" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700">Subject</Label>
                <Input id="subject" required className="rounded-xl h-12 bg-slate-50 border-slate-200" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700">Message</Label>
                <textarea 
                  id="message" 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-4 min-h-[150px] bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y" 
                  placeholder="Tell us what you need..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium shadow-md transition-all"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}