'use client';

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid lg:grid-cols-[400px_1fr] gap-0 rounded-3xl overflow-hidden border border-border-subtle bg-surface-2 shadow-2xl"
      >
        <div className="p-8 md:p-12 bg-surface-3 lg:bg-transparent flex flex-col gap-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              <span className="text-primary">Get</span> In Touch
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full mt-2" />
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Our Location</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  J305, sohna road ,<br />
                  gurgaon,haryana, 122103
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Phone Number</h4>
                <p className="text-muted-foreground text-sm">+91 9140934524</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Email Address</h4>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p>Partnerships@gmail.com</p>
                  <p>support@tribexesports.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground px-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full bg-surface-3 border border-border-subtle rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground px-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-surface-3 border border-border-subtle rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-surface-3 border border-border-subtle rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground px-1">
                  Phone Number
                </label>
                <div className="flex gap-0 overflow-hidden rounded-xl border border-border-subtle">
                  <span className="bg-surface-3/50 px-4 flex items-center text-muted-foreground border-r border-border-subtle">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9140934524"
                    className="w-full bg-surface-3 px-4 py-3 outline-none focus:bg-surface-3/80 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground px-1">
                Your Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="w-full bg-surface-3 border border-border-subtle rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all group active:scale-95 shadow-lg shadow-primary/20"
            >
              Send Message
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
