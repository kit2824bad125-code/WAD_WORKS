import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, CheckCircle, Clock, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-950/60 border border-primary-800/50 flex items-center justify-center text-primary-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Verified Pros</h4>
              <p className="text-xs text-slate-400">Vetted identity & background</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Transparent Pricing</h4>
              <p className="text-xs text-slate-400">Standard upfront rate cards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">On-Time Arrival</h4>
              <p className="text-xs text-slate-400">Guaranteed local promptness</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">FixNear Guarantee</h4>
              <p className="text-xs text-slate-400">30-day service revisit warranty</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                FIX<span className="text-primary-500">NEAR</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Find trusted local service professionals near you. Verified electricians, plumbers, AC mechanics, carpenters, cleaners, and technicians across India.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary-400" /> +91 (800) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary-400" /> support@fixnear.dev
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary-400" /> Chennai • Bengaluru • Mumbai • Hyderabad • Delhi NCR
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services/electrical" className="hover:text-white transition-colors">Electrician</Link></li>
              <li><Link to="/services/plumbing" className="hover:text-white transition-colors">Plumber</Link></li>
              <li><Link to="/services/ac-cooling" className="hover:text-white transition-colors">AC & Cooling Service</Link></li>
              <li><Link to="/services/appliance-repair" className="hover:text-white transition-colors">Appliance Repair</Link></li>
              <li><Link to="/services/laptop-mobile" className="hover:text-white transition-colors">Laptop & Mobile Care</Link></li>
              <li><Link to="/services/cleaning" className="hover:text-white transition-colors">Home Deep Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/register?role=provider" className="text-primary-400 hover:text-primary-300 transition-colors">Join as a Partner</Link></li>
              <li><a href="/api/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms#cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/terms#safety" className="hover:text-white transition-colors">Safety Standards</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FixNear Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Razorpay Secure Payments</span>
            <span>Leaflet / OpenStreetMap Enabled</span>
            <span>Made with ❤️ for Local Tradesmen</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
