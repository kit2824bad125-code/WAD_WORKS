import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  Search,
  Bell,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoAccount } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (role: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN') => {
    await switchDemoAccount(role);
    setDemoSwitcherOpen(false);
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'SERVICE_PROVIDER') navigate('/provider/dashboard');
    else navigate('/customer/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Demo Bar for Testing Ease */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>FixNear Live Environment — Two-Sided Marketplace Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Quick Test Switcher:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDemoSwitch('CUSTOMER')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'CUSTOMER' ? 'bg-primary-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleDemoSwitch('SERVICE_PROVIDER')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'SERVICE_PROVIDER' ? 'bg-primary-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Provider
            </button>
            <button
              onClick={() => handleDemoSwitch('ADMIN')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                FIX<span className="text-primary-600">NEAR</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Trusted Local Pros
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link
              to="/services"
              className={`hover:text-primary-600 transition-colors ${
                location.pathname.startsWith('/services') ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              Services
            </Link>
            <Link
              to="/providers"
              className={`hover:text-primary-600 transition-colors ${
                location.pathname.startsWith('/providers') ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              Find Professionals
            </Link>
            <Link
              to="/how-it-works"
              className={`hover:text-primary-600 transition-colors ${
                location.pathname === '/how-it-works' ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              How It Works
            </Link>
            {(!isAuthenticated || user?.role === 'CUSTOMER') && (
              <Link
                to="/register?role=provider"
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Become a Provider
              </Link>
            )}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Role shortcut button */}
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'SERVICE_PROVIDER' && (
                  <Link
                    to="/provider/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    Provider Dashboard
                  </Link>
                )}

                {/* Notifications */}
                <Link
                  to={user?.role === 'SERVICE_PROVIDER' ? '/provider/notifications' : '/customer/notifications'}
                  className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Messages */}
                <Link
                  to={user?.role === 'SERVICE_PROVIDER' ? '/provider/messages' : '/customer/messages'}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 focus:outline-none transition-colors"
                  >
                    <img
                      src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <Badge size="sm" variant={user?.role === 'ADMIN' ? 'indigo' : user?.role === 'SERVICE_PROVIDER' ? 'success' : 'primary'} className="mt-1">
                          {user?.role.replace('_', ' ')}
                        </Badge>
                      </div>

                      {user?.role === 'CUSTOMER' && (
                        <>
                          <Link to="/customer/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Dashboard
                          </Link>
                          <Link to="/customer/bookings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            My Bookings
                          </Link>
                          <Link to="/customer/favorites" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Saved Providers
                          </Link>
                        </>
                      )}

                      {user?.role === 'SERVICE_PROVIDER' && (
                        <>
                          <Link to="/provider/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Dashboard
                          </Link>
                          <Link to="/provider/requests" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Incoming Requests
                          </Link>
                          <Link to="/provider/bookings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Active Bookings
                          </Link>
                          <Link to="/provider/earnings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Earnings & Payouts
                          </Link>
                        </>
                      )}

                      {user?.role === 'ADMIN' && (
                        <>
                          <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Admin Overview
                          </Link>
                          <Link to="/admin/providers" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Provider Verification
                          </Link>
                          <Link to="/admin/disputes" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Disputes Center
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 hover:text-primary-600"
          >
            All Services
          </Link>
          <Link
            to="/providers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 hover:text-primary-600"
          >
            Find Professionals
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 hover:text-primary-600"
          >
            How FixNear Works
          </Link>
          <Link
            to="/register?role=provider"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-primary-600"
          >
            Become a Service Provider
          </Link>
        </div>
      )}
    </header>
  );
};
