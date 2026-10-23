import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Clock, Zap, Award } from 'lucide-react';
import { ProviderSearchResult, formatDistance } from '@fixnear/shared';
import { RatingStars } from '../ui/RatingStars';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProviderCardProps {
  provider: ProviderSearchResult;
  onBookNow?: (providerId: string) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBookNow }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header with Avatar, Name, Verification */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0">
            <img
              src={provider.avatarUrl || `https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150`}
              alt={provider.businessName}
              className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-xs"
            />
            {provider.status === 'VERIFIED' && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm"
                title="Verified by FixNear"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/providers/${provider.id}`}
                className="text-base font-bold text-slate-900 hover:text-primary-600 transition-colors truncate"
              >
                {provider.businessName}
              </Link>
              {provider.status === 'VERIFIED' && (
                <Badge variant="success" size="sm" className="hidden sm:inline-flex">
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <RatingStars
                rating={provider.rating}
                showNumber
                reviewCount={provider.reviewCount}
                size="sm"
              />
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-0.5">
                <Award className="w-3 h-3 text-slate-400" />
                {provider.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
          {provider.description}
        </p>

        {/* Services Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.services.slice(0, 3).map(s => (
            <span
              key={s.id}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
            >
              {s.name}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>

        {/* Badges for Emergency, Availability & Distance */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            {provider.distanceKm !== undefined ? formatDistance(provider.distanceKm) : `${provider.city}`}
          </span>

          <div className="flex items-center gap-2">
            {provider.isEmergencyAvailable && (
              <span className="flex items-center gap-0.5 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                <Zap className="w-3 h-3 fill-amber-500" /> Emergency Ready
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available today
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & CTAs */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 block">Starting from</span>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            ₹{provider.startingPrice}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/providers/${provider.id}`}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/providers/${provider.id}#book`}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};
