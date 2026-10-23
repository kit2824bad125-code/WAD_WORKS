import React, { useState } from 'react';
import { Booking } from '@fixnear/shared';
import { api } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, CheckCircle2, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_SERVICE'>('UPI');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Step 1: Create payment order with backend
      const orderData = await api.post<{ orderId: string; amount: number; keyId: string }>(
        '/payments/create',
        {
          bookingId: booking.id,
          paymentMethod: method === 'UPI' ? 'UPI' : method === 'CARD' ? 'CARD' : method === 'CASH_ON_SERVICE' ? 'CASH_ON_SERVICE' : 'NET_BANKING',
        }
      );

      // Step 2: In development sandbox, simulate Razorpay payment response
      const mockPaymentId = `pay_${Date.now()}_mock`;
      const mockSignature = `mock_sig_${Date.now()}`;

      // Step 3: Server-side signature verification
      await api.post('/payments/verify', {
        bookingId: booking.id,
        orderId: orderData.orderId,
        paymentId: mockPaymentId,
        signature: mockSignature,
      });

      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Checkout" maxWidth="md">
      {success ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
          <p className="text-xs text-slate-500">
            ₹{booking.totalPrice} paid successfully via {method}. Your booking receipt is confirmed.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Service: {booking.service?.name}</span>
              <span className="font-semibold text-slate-900">₹{booking.servicePrice}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>FixNear Platform Fee</span>
              <span className="font-semibold text-slate-900">₹{booking.platformFee}</span>
            </div>
            {booking.isEmergency && (
              <div className="flex justify-between text-xs text-amber-600 font-medium">
                <span>Emergency Booking Surcharge</span>
                <span>₹150</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-primary-600 text-base">₹{booking.totalPrice}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'UPI'
                    ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-primary-600" />
                UPI (GPay/PhonePe)
              </button>

              <button
                type="button"
                onClick={() => setMethod('CARD')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'CARD'
                    ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-primary-600" />
                Debit / Credit Card
              </button>

              <button
                type="button"
                onClick={() => setMethod('NET_BANKING')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'NET_BANKING'
                    ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-primary-600" />
                Net Banking
              </button>

              <button
                type="button"
                onClick={() => setMethod('CASH_ON_SERVICE')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  method === 'CASH_ON_SERVICE'
                    ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4 text-primary-600" />
                Cash on Service
              </button>
            </div>
          </div>

          {/* Details input preview */}
          {method === 'UPI' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Enter UPI ID / VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                placeholder="username@okaxis"
              />
            </div>
          )}

          {method === 'CARD' && (
            <div className="space-y-2">
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                placeholder="Card Number"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  defaultValue="08/28"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                  placeholder="MM/YY"
                />
                <input
                  type="password"
                  defaultValue="•••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                  placeholder="CVV"
                />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Razorpay Encrypted & Verified Server-Side</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isProcessing}
            onClick={handleProcessPayment}
          >
            Pay ₹{booking.totalPrice} Securely
          </Button>
        </div>
      )}
    </Modal>
  );
};
