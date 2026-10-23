import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Category } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wrench, ShieldCheck, Mail, Lock, User, Phone, MapPin, Briefcase } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'provider' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
  const { register } = useAuth();

  const [role, setRole] = useState<'CUSTOMER' | 'SERVICE_PROVIDER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('FixNear@123');
  const [phone, setPhone] = useState('');

  // Provider specific fields
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(15);
  const [street, setStreet] = useState('10 Main Road, Anna Nagar');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [postalCode, setPostalCode] = useState('600040');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories-reg'],
    queryFn: () => api.get('/categories'),
  });

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const payload: any = {
        name,
        email,
        password,
        phone: phone || '9840123456',
        role,
      };

      if (role === 'SERVICE_PROVIDER') {
        if (selectedCategoryIds.length === 0) {
          setError('Please select at least one primary service category');
          setIsLoading(false);
          return;
        }
        payload.businessName = businessName || `${name} Services`;
        payload.description = description || `Professional handyman and service technician with ${experienceYears} years experience.`;
        payload.experienceYears = Number(experienceYears);
        payload.serviceRadiusKm = Number(serviceRadiusKm);
        payload.street = street;
        payload.city = city;
        payload.state = state;
        payload.postalCode = postalCode;
        payload.latitude = 13.0850;
        payload.longitude = 80.2100;
        payload.categoryIds = selectedCategoryIds;
      }

      await register(payload);

      if (role === 'SERVICE_PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            FIX<span className="text-primary-600">NEAR</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs text-slate-500">
          Join thousands of homeowners and local pros on FixNear
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              👤 I am a Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('SERVICE_PROVIDER')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'SERVICE_PROVIDER'
                  ? 'bg-white shadow-xs text-primary-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔧 I am a Service Provider
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rohan Sharma"
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="9840123456"
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rohan@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password (min. 8 chars, 1 uppercase, 1 number)"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Provider Additional Fields */}
            {role === 'SERVICE_PROVIDER' && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" /> Professional Business Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business / Trade Name"
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Electrical Works"
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={experienceYears}
                      onChange={e => setExperienceYears(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Your Categories (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map(cat => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  />
                  <Input
                    label="PIN Code (6 digits)"
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Workshop / Service Area Address"
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Street and neighborhood"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
            >
              {role === 'SERVICE_PROVIDER' ? 'Complete Partner Registration' : 'Create Free Account'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
