import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wrench, Lock, Mail, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { login, switchDemoAccount } = useAuth();

  const [email, setEmail] = useState('customer@fixnear.dev');
  const [password, setPassword] = useState('FixNear@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);

      if (redirect) {
        navigate(redirect);
      } else if (email.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (email.includes('provider')) {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN') => {
    try {
      setIsLoading(true);
      setError(null);
      await switchDemoAccount(role);
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'SERVICE_PROVIDER') navigate('/provider/dashboard');
      else navigate('/customer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            FIX<span className="text-primary-600">NEAR</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to manage your appointments, jobs, or marketplace settings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* 1-Click Demo Accounts Bar */}
        <div className="bg-primary-50/80 border border-primary-200/80 rounded-2xl p-4 mb-6 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800">
            <Sparkles className="w-4 h-4 text-primary-600" />
            1-Click Demo Test Accounts:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('CUSTOMER')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-primary-200 text-xs font-bold text-slate-800 shadow-2xs hover:border-primary-400 transition-all text-center"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('SERVICE_PROVIDER')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-primary-200 text-xs font-bold text-slate-800 shadow-2xs hover:border-primary-400 transition-all text-center"
            >
              🔧 Provider
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-primary-200 text-xs font-bold text-slate-800 shadow-2xs hover:border-primary-400 transition-all text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                <span>Remember me</span>
              </label>
              <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In to FixNear
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
