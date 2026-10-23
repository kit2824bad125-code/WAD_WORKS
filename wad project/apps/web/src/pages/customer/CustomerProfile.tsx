import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Rohan Sharma');
  const [email, setEmail] = useState(user?.email || 'customer@fixnear.dev');
  const [phone, setPhone] = useState(user?.phone || '9840123456');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Profile & Settings
        </h1>
        <p className="text-xs text-slate-500">Manage your contact information and default service address</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl border border-slate-200"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <span className="text-xs text-slate-400">{user?.email}</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
            Profile details updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />

          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
