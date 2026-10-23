import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Clock, Zap, CheckCircle2 } from 'lucide-react';

export const ProviderAvailability: React.FC = () => {
  const { providerProfile, refreshUser } = useAuth();
  const [emergencyAvailable, setEmergencyAvailable] = useState(providerProfile?.isEmergencyAvailable ?? true);
  const [radius, setRadius] = useState(providerProfile?.serviceRadiusKm ?? 18);
  const [saved, setSaved] = useState(false);

  const [schedule, setSchedule] = useState([
    { day: 'MONDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'TUESDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'WEDNESDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'THURSDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'FRIDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'SATURDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
    { day: 'SUNDAY', isOpen: true, openTime: '09:00', closeTime: '15:00' },
  ]);

  const handleToggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].isOpen = !updated[idx].isOpen;
    setSchedule(updated);
  };

  const handleSave = async () => {
    try {
      await api.patch('/providers/working-hours', { workingHours: schedule });
      await api.patch('/providers/profile', {
        isEmergencyAvailable: emergencyAvailable,
        serviceRadiusKm: Number(radius),
      });
      refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update schedule');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Working Hours & Coverage Radius
        </h1>
        <p className="text-xs text-slate-500">Configure your daily working schedule and travel boundaries</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
          Schedule and coverage settings saved successfully!
        </div>
      )}

      {/* Emergency toggle & Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
            Emergency Service Mode
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Allow customers to book you for high-urgency jobs (burst pipes, short circuits, vehicle breakdowns) with a +₹150 priority surcharge.
          </p>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={emergencyAvailable}
              onChange={e => setEmergencyAvailable(e.target.checked)}
              className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-xs font-bold text-slate-800">
              {emergencyAvailable ? 'Emergency Mode Active' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Clock className="w-5 h-5 text-primary-600" />
            Service Travel Radius
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Maximum distance you are willing to travel from your workshop.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="range"
              min="5"
              max="50"
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-bold text-slate-900 min-w-[60px] text-right">{radius} km</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Weekly Operating Hours</h3>

        <div className="divide-y divide-slate-100">
          {schedule.map((item, idx) => (
            <div key={item.day} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={() => handleToggleDay(idx)}
                  className="w-4 h-4 rounded text-primary-600"
                />
                <span className="text-xs font-bold text-slate-800 w-28 capitalize">
                  {item.day.toLowerCase()}
                </span>
              </div>

              {item.isOpen ? (
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="time"
                    value={item.openTime}
                    onChange={e => {
                      const updated = [...schedule];
                      updated[idx].openTime = e.target.value;
                      setSchedule(updated);
                    }}
                    className="border border-slate-300 rounded px-2 py-1"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={item.closeTime}
                    onChange={e => {
                      const updated = [...schedule];
                      updated[idx].closeTime = e.target.value;
                      setSchedule(updated);
                    }}
                    className="border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Closed / Off Day</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Availability Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
