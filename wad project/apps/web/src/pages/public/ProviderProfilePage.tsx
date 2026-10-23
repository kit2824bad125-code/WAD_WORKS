import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProviderProfile, Service, Review, WorkingDayHour } from '@fixnear/shared';
import { RatingStars } from '../../components/ui/RatingStars';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  Zap,
  MessageSquare,
  Star,
  Check,
  AlertCircle,
  Phone,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [street, setStreet] = useState('Flat 204, Lotus Apartments, Anna Nagar');
  const [city, setCity] = useState('Chennai');
  const [postalCode, setPostalCode] = useState('600040');
  const [contactPhone, setContactPhone] = useState(user?.phone || '9840123456');
  const [problemDescription, setProblemDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{
    address?: { city: string; state: string; approximateArea?: string };
    distanceString?: string;
    services: { id: string; customPrice: number; pricingType: string; service: Service }[];
    reviews: Review[];
    workingHours: WorkingDayHour[];
  } & ProviderProfile>({
    queryKey: ['provider-profile', id],
    queryFn: () => api.get(`/providers/${id}`),
  });

  const provider = data;

  const handleStartBooking = (serviceId?: string) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (serviceId) setSelectedServiceId(serviceId);
    else if (provider?.services && provider.services.length > 0) {
      setSelectedServiceId(provider.services[0].service.id);
    }
    setBookingModalOpen(true);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setBookingError('Please select a service');
      return;
    }
    if (!problemDescription || problemDescription.length < 10) {
      setBookingError('Please describe your requirement in at least 10 characters');
      return;
    }

    try {
      setIsSubmittingBooking(true);
      setBookingError(null);

      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

      const booking: any = await api.post('/bookings', {
        providerId: id,
        serviceId: selectedServiceId,
        scheduledAt,
        street,
        city: city || provider?.address?.city || 'Chennai',
        state: provider?.address?.state || 'Tamil Nadu',
        postalCode,
        latitude: 13.0850,
        longitude: 80.2100,
        contactPhone,
        problemDescription,
        isEmergency,
      });

      setBookingModalOpen(false);
      navigate(`/customer/bookings/${booking.id}`);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to submit booking request');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/favorites/${id}`);
      alert('Saved to your favorites!');
    } catch (e: any) {
      alert(e.message || 'Unable to update favorites');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSkeleton type="profile" count={1} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Professional Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/providers')}>Back to Search</Button>
      </div>
    );
  }

  const selectedService = provider.services.find(s => s.service.id === selectedServiceId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <img
              src={provider.user?.avatarUrl || `https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=250`}
              alt={provider.businessName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {provider.businessName}
                </h1>
                {provider.status === 'VERIFIED' && (
                  <Badge variant="success" size="md">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified by FixNear
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-slate-600">
                <RatingStars
                  rating={provider.rating}
                  showNumber
                  reviewCount={provider.reviewCount}
                  size="md"
                />
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  {provider.address?.approximateArea || provider.address?.city}
                  {provider.distanceString ? ` (${provider.distanceString})` : ''}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Award className="w-4 h-4 text-slate-400" />
                  {provider.experienceYears}+ years in business
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleToggleFavorite}
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-rose-600 transition-colors"
              title="Save to Favorites"
            >
              <Heart className="w-5 h-5" />
            </button>

            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto px-8"
              onClick={() => handleStartBooking()}
            >
              Book Service Now
            </Button>
          </div>
        </div>

        {/* Quick Trust Score Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Completed Jobs</span>
            <span className="text-lg font-bold text-slate-900">{provider.completedJobsCount} bookings</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Response Rate</span>
            <span className="text-lg font-bold text-emerald-600">{provider.responseRatePercent}% prompt</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Service Radius</span>
            <span className="text-lg font-bold text-slate-900">{provider.serviceRadiusKm} km coverage</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Emergency Status</span>
            <span className={`text-lg font-bold ${provider.isEmergencyAvailable ? 'text-amber-600' : 'text-slate-400'}`}>
              {provider.isEmergencyAvailable ? '⚡ Active (24/7)' : 'Scheduled Only'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: About & Services Offered */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About this Professional</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {provider.description}
            </p>
          </div>

          {/* Rate Card / Services */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Services & Rate Card</h2>
              <span className="text-xs text-slate-400">All prices include service warranty</span>
            </div>

            <div className="divide-y divide-slate-100">
              {provider.services.map(item => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <h3 className="text-sm font-bold text-slate-900">{item.service.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.service.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>⏱️ ~{item.service.estimatedDurationMinutes} mins</span>
                      <span>•</span>
                      <span className="capitalize">{item.pricingType.replace('_', ' ').toLowerCase()}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-slate-900 block mb-1.5">
                      ₹{item.customPrice}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartBooking(item.service.id)}
                    >
                      Book This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Customer Reviews & Ratings</h2>
                <p className="text-xs text-slate-500">From verified homeowners with completed bookings</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-black text-slate-900">{provider.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({provider.reviewCount})</span>
              </div>
            </div>

            {provider.reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews yet for this professional.</p>
            ) : (
              <div className="space-y-4">
                {provider.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                          {rev.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{rev.customerName || 'Homeowner'}</span>
                          <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Working Hours & Booking Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Working hours card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              Standard Working Hours
            </h3>

            <div className="space-y-2 text-xs">
              {provider.workingHours.map(wh => (
                <div key={wh.day} className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="font-medium text-slate-600 capitalize">{wh.day.toLowerCase()}</span>
                  <span className={wh.isOpen ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
                    {wh.isOpen ? `${wh.openTime} - ${wh.closeTime}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guaranteed trust box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              FixNear Booking Protection
            </h3>
            <ul className="text-xs text-emerald-800 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Pay after job completion via Razorpay</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>30-Day warranty on all repairs</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Verified ID & background vetted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Modal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} title="Book Service Appointment" maxWidth="lg">
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Selected Service
            </label>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {provider.services.map(s => (
                <option key={s.service.id} value={s.service.id}>
                  {s.service.name} — ₹{s.customPrice}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Doorstep Address</label>
            <input
              type="text"
              value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder="Flat / Building, Street, Area"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none mb-2"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                required
              />
              <input
                type="text"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="6-digit PIN code"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Description</label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="Describe what needs repair or servicing in detail..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          {provider.isEmergencyAvailable && (
            <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={e => setIsEmergency(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div className="text-xs text-amber-900">
                <span className="font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-500" /> Request Emergency Urgent Arrival (+₹150 surcharge)
                </span>
                <span className="text-[11px] text-amber-700">Technician will be dispatched immediately within 30-45 minutes.</span>
              </div>
            </label>
          )}

          {bookingError && (
            <p className="text-xs text-rose-600 font-medium">{bookingError}</p>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block">Total Estimated</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{(selectedService?.customPrice || 299) + 49 + (isEmergency ? 150 : 0)}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmittingBooking}
            >
              Confirm Booking Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
