import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Category, Service } from '@fixnear/shared';
import { Search, ChevronRight, Zap, Wrench, Wind, Tv, Laptop, Car, Bike, Hammer, Sparkles, Paintbrush, Bug } from 'lucide-react';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories-all'],
    queryFn: () => api.get('/categories'),
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services-all'],
    queryFn: () => api.get('/services'),
  });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electrical': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'plumbing': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'ac-cooling': return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'appliance-repair': return <Tv className="w-5 h-5 text-purple-500" />;
      case 'laptop-mobile': return <Laptop className="w-5 h-5 text-indigo-500" />;
      case 'car-services': return <Car className="w-5 h-5 text-rose-500" />;
      case 'bike-services': return <Bike className="w-5 h-5 text-orange-500" />;
      case 'carpentry': return <Hammer className="w-5 h-5 text-emerald-500" />;
      case 'painting': return <Paintbrush className="w-5 h-5 text-pink-500" />;
      case 'pest-control': return <Bug className="w-5 h-5 text-red-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary-500" />;
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          All Service Categories
        </h1>
        <p className="text-slate-600 text-sm">
          Browse our full catalog of home repairs, electrical, plumbing, vehicle maintenance, and appliance services with standard upfront prices.
        </p>

        {/* Category search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search category or service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => {
            const catServices = services.filter(s => s.categoryId === cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-primary-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                      <span className="text-xs text-slate-400 font-medium">{catServices.length} standard services</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-3">
                    {catServices.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 truncate">{s.name}</span>
                        <span className="font-semibold text-slate-900 flex-shrink-0 ml-2">₹{s.basePrice}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/services/${cat.slug}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold transition-colors"
                >
                  Explore {cat.name} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
