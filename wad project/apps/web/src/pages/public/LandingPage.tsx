import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Category, ProviderSearchResult } from '@fixnear/shared';
import { ProviderCard } from '../../components/domain/ProviderCard';
import { Button } from '../../components/ui/Button';
import {
  Search,
  MapPin,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Star,
  ArrowRight,
  Zap,
  Wrench,
  Wind,
  Tv,
  Laptop,
  Car,
  Bike,
  Hammer,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Chennai');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories'),
  });

  const { data: featuredProviders = [] } = useQuery<ProviderSearchResult[]>({
    queryKey: ['featured-providers'],
    queryFn: async () => {
      const res: any = await api.get('/search/providers', { limit: 4, verifiedOnly: true });
      return res || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/providers?query=${encodeURIComponent(query)}&city=${encodeURIComponent(location)}`);
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electrical': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'plumbing': return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'ac-cooling': return <Wind className="w-6 h-6 text-cyan-500" />;
      case 'appliance-repair': return <Tv className="w-6 h-6 text-purple-500" />;
      case 'laptop-mobile': return <Laptop className="w-6 h-6 text-indigo-500" />;
      case 'car-services': return <Car className="w-6 h-6 text-rose-500" />;
      case 'bike-services': return <Bike className="w-6 h-6 text-orange-500" />;
      case 'carpentry': return <Hammer className="w-6 h-6 text-emerald-500" />;
      default: return <Sparkles className="w-6 h-6 text-primary-500" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white pt-16 pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            FixNear Verified Network • Doorstep In 45 Minutes
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
            Reliable help, <br className="hidden sm:inline" />
            <span className="text-primary-600">right around the corner.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Find trusted local professionals for repairs, maintenance and everyday services in your neighborhood with verified rate cards and guaranteed warranty.
          </p>

          {/* Hero Search Box */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. AC repair, electrician)"
                  className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-xl"
                />
              </div>

              <div className="relative w-full sm:w-56 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-3">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-10 pr-6 py-3 text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer rounded-xl"
                >
                  <option value="Chennai">Chennai, TN</option>
                  <option value="Bengaluru">Bengaluru, KA</option>
                  <option value="Hyderabad">Hyderabad, TS</option>
                  <option value="Mumbai">Mumbai, MH</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Popular searches suggestions */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular:</span>
            {['AC foam servicing', 'Switch repair', 'Tap leak fix', 'Ceiling fan fitting', 'Laptop diagnosis'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  navigate(`/providers?query=${encodeURIComponent(tag)}&city=${encodeURIComponent(location)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Everyday Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Experienced technicians for home repairs, maintenance, and diagnostics
            </p>
          </div>
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 11).map(cat => (
            <Link
              key={cat.id}
              to={`/services/${cat.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-primary-400 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center mb-3 transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {cat.serviceCount || 3}+ options
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How FixNear Works */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">
              How FixNear Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Connecting you to verified professionals with zero hassle and upfront price transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-lg font-black text-white">
                1
              </div>
              <h3 className="text-lg font-bold">Tell us what you need</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe the issue, specify your preferred doorstep date & time, or request instant emergency repair.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-lg font-black text-white">
                2
              </div>
              <h3 className="text-lg font-bold">Find trusted professionals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare verified local pros by distance, authentic star ratings, transparent prices, and badges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-lg font-black text-white">
                3
              </div>
              <h3 className="text-lg font-bold">Book a convenient time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant schedule confirmation with live technician arrival status and direct in-app chat.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-lg font-black text-white">
                4
              </div>
              <h3 className="text-lg font-bold">Get the job done</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay safely via Razorpay UPI or card only after work completion with 30-day warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Providers */}
      {featuredProviders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Top-Rated Local Professionals
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Backed by customer reviews, identity checks, and stellar completion rates
              </p>
            </div>
            <Link
              to="/providers"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Browse all pros <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map(p => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      )}

      {/* Trust & Guarantees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-primary-900 to-indigo-900 rounded-3xl p-8 sm:p-14 text-white">
          <div className="max-w-2xl space-y-4 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Why homeowners choose FixNear
            </h2>
            <p className="text-primary-200 text-sm sm:text-base leading-relaxed">
              We eliminate the friction of finding genuine tradesmen. No hidden fees, no price gouging, and real accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2" />
              <h4 className="font-bold text-base">Verified Professionals</h4>
              <p className="text-xs text-primary-100 leading-relaxed">
                Government ID, trade credentials, and police background records verified before onboarding.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2">
              <CheckCircle className="w-8 h-8 text-primary-300 mb-2" />
              <h4 className="font-bold text-base">Transparent Pricing</h4>
              <p className="text-xs text-primary-100 leading-relaxed">
                Standard rate cards for every category. Written quotes for custom jobs before work begins.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2">
              <CreditCard className="w-8 h-8 text-cyan-300 mb-2" />
              <h4 className="font-bold text-base">Secure Razorpay Escrow</h4>
              <p className="text-xs text-primary-100 leading-relaxed">
                Pay safely via UPI or card. Funds are protected until you inspect the completed service.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 mb-2" />
              <h4 className="font-bold text-base">100% Genuine Reviews</h4>
              <p className="text-xs text-primary-100 leading-relaxed">
                Only customers with completed bookings can leave ratings, preventing fake testimonials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Service Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              For Technicians & Service Businesses
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Grow your local service business with FixNear
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Join thousands of skilled electricians, plumbers, AC engineers, and carpenters getting direct doorstep bookings with zero lead buying gimmicks and daily payouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              to="/register?role=provider"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
            >
              Become a Service Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
