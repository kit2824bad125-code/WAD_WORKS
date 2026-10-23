import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Category, Service } from '@fixnear/shared';
import { Clock, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const ServiceCategoryPage: React.FC = () => {
  const { category: slug } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ category: Category; services: Service[] }>({
    queryKey: ['category-detail', slug],
    queryFn: () => api.get(`/categories/${slug}`),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  const category = data?.category;
  const services = data?.services || [];

  if (!category) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
        <p className="text-xs text-slate-500">The service category you requested does not exist or has been retired.</p>
        <Button variant="primary" onClick={() => navigate('/services')}>Back to Services</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <Link to="/services" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Services
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="space-y-3 max-w-xl">
            <Badge variant="indigo" size="sm" className="bg-white/20 text-white border-transparent">
              Verified Category
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{category.name}</h1>
            <p className="text-sm text-primary-100 leading-relaxed">{category.description}</p>
          </div>
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate(`/providers?categoryId=${category.id}`)}
          >
            Find Nearby {category.name} Pros <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Standard Rate Card & Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                  <Badge variant="primary" size="sm">
                    {s.pricingType.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{s.estimatedDurationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    30-Day Revisit Warranty
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard Rate</span>
                  <span className="text-xl font-black text-slate-900">₹{s.basePrice}</span>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/providers?serviceId=${s.id}&categoryId=${category.id}`)}
                >
                  Find Pros
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
