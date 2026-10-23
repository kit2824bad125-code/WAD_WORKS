import React from 'react';
import { ShieldCheck, Award, Heart, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">About FixNear</h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Reimagining local services in India through trust, transparent pricing, and verified local expertise.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
        <p>
          FixNear was born out of a simple, everyday frustration: finding reliable, honest service professionals for home repairs is stressful. Unverified handymen, unpredictable pricing, delayed arrivals, and zero warranty are unfortunately standard.
        </p>
        <p>
          We set out to fix this by building a dedicated two-sided marketplace where local tradesmen (electricians, plumbers, AC technicians, appliance mechanics, and carpenters) are vetted, verified, and rewarded for delivering top-tier service.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-primary-600" />
            <h3 className="font-bold text-slate-900">Vetted Backgrounds</h3>
            <p className="text-xs text-slate-500">Government identity verification and trade license reviews before approval.</p>
          </div>
          <div className="space-y-2">
            <Award className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Standard Rate Cards</h3>
            <p className="text-xs text-slate-500">No surprise charges. Pre-agreed prices and written estimates on all jobs.</p>
          </div>
          <div className="space-y-2">
            <Heart className="w-8 h-8 text-rose-500" />
            <h3 className="font-bold text-slate-900">30-Day Guarantee</h3>
            <p className="text-xs text-slate-500">Free revisits on repairs if any problem recurs within 30 calendar days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">How FixNear Works</h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Four simple steps to getting any repair or maintenance completed with peace of mind.
        </p>
      </div>

      <div className="space-y-6">
        {[
          { step: '01', title: 'Find or Describe Your Requirement', text: 'Search by service (e.g. AC servicing, fan repair) or let our categories guide you. Enter your location to discover nearby verified technicians within a 15km radius.' },
          { step: '02', title: 'Compare Professionals Transparently', text: 'View ratings, customer reviews, verified badges, completed jobs, and transparent rate cards. Filter by emergency availability if you need prompt help.' },
          { step: '03', title: 'Book & Track Live', text: 'Pick a convenient appointment slot. The professional confirms your booking, and you can track their travel status (En Route, Arrived) with real-time in-app messaging.' },
          { step: '04', title: 'Inspect & Pay Securely', text: 'Once the work is thoroughly completed to your satisfaction, pay securely via Razorpay (UPI, GPay, Cards) or Cash on Service. Review your technician to help your neighbors.' },
        ].map(item => (
          <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-5 shadow-xs">
            <span className="text-2xl font-black text-primary-600 bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
              {item.step}
            </span>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-slate-900">Contact FixNear Support</h1>
        <p className="text-sm text-slate-600">Our customer happiness team is available 7 days a week, 8:00 AM to 10:00 PM.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-5 h-5 text-primary-600" />
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Toll-Free Support</span>
              <span className="text-sm font-bold text-slate-800">+91 (800) 123-4567</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Mail className="w-5 h-5 text-primary-600" />
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Email Assistance</span>
              <span className="text-sm font-bold text-slate-800">support@fixnear.dev</span>
            </div>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); alert('Thank you! Your message has been received.'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
            <input type="text" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none" defaultValue="Rohan Sharma" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input type="email" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none" defaultValue="customer@fixnear.dev" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Question</label>
            <textarea rows={4} required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none" placeholder="How can we assist you?" />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Submit Support Inquiry
          </Button>
        </form>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-slate-700 leading-relaxed text-sm">
      <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
      <p className="text-xs text-slate-400">Last revised: March 2026</p>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900">1. Platform Services</h2>
        <p>FixNear is a technology platform connecting consumers with independent third-party service providers. FixNear facilitates booking, payment escrow, and dispute moderation.</p>
        <h2 className="text-base font-bold text-slate-900">2. Verification & Safety</h2>
        <p>While FixNear performs identity and credential checks on service providers, users should always exercise standard personal precautions when admitting service personnel into residential spaces.</p>
        <h2 className="text-base font-bold text-slate-900">3. Cancellation & Refunds</h2>
        <p>Customers may cancel bookings free of penalty up to 2 hours before the scheduled appointment. For emergency bookings where a technician is already EN_ROUTE, a nominal dispatch fee may apply.</p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-slate-700 leading-relaxed text-sm">
      <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last revised: March 2026</p>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>We collect personal information necessary to deliver marketplace services, including name, email address, phone number, and service address.</p>
        <h2 className="text-base font-bold text-slate-900">2. Privacy-Preserving Geolocation</h2>
        <p>FixNear never exposes exact private residential coordinates or exact house numbers to the public search index. We only display approximate distances (e.g. "2.4 km away") and city neighborhoods.</p>
        <h2 className="text-base font-bold text-slate-900">3. Payment Security</h2>
        <p>All online transactions are processed through Razorpay's PCI-DSS compliant infrastructure. FixNear never stores payment card numbers or banking passwords.</p>
      </div>
    </div>
  );
};
