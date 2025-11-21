import { useState, useEffect } from 'react';

export default function PayForm({ isOpen, onClose, total, onPaySubmit }) {
  const [formData, setFormData] = useState({
    receivedAmount: '',
    payingAmount: total.toFixed(2),
    change: '0.00',
    paymentType: 'cash',
    paymentReceiver: '',
    paymentNote: '',
    saleNote: '',
    staffNote: '',
    quickCash: '10',
  });
  
  const [showQuickCash, setShowQuickCash] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;
    
    setFormData(prev => ({
      ...prev,
      payingAmount: total.toFixed(2),
      change: '0.00',
      receivedAmount: '',
    }));
  }, [isOpen, total]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      // start with the updated field
      const next = { ...prev, [name]: value };

      // if they just changed the receivedAmount, recalc change
      if (name === 'receivedAmount') {
        const received = parseFloat(value) || 0;
        const paying  = parseFloat(prev.payingAmount) || 0;
        const rawDiff = received - paying;
        next.change     = (rawDiff > 0 ? rawDiff : 0).toFixed(2);
      }

      return next;
    });
  };

  const handlePaymentTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({ ...prev, paymentType: type }));
    
    setShowQuickCash(type === 'cash');
    setShowPoints(type === 'points');
    
    if (type !== 'cash') {
      setFormData(prev => ({ ...prev, change: '0.00' }));
    }
  };
  
  const handleQuickCashSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      quickCash: amount,
      receivedAmount: amount,
      change: (parseFloat(amount) - parseFloat(prev.payingAmount)).toFixed(2)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onPaySubmit({
      ...formData,
      method: formData.paymentType,
      amountTendered: parseFloat(formData.receivedAmount) || 0,
      total: total.toFixed(2),
    });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10">
          <h2 className="text-xl font-bold text-gray-800">Finalize Sale</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 max-h-[85vh] overflow-y-auto">
          {/* Payment Summary - Highlighted Section */}
          <div className="bg-gray-100 rounded-xl p-4 mb-4 border border-gray-300">
            <div className="grid grid-cols-3 gap-3">
              {/* Received */}
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Received
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    PKR
                  </span>
                  <input
                    type="number"
                    name="receivedAmount"
                    value={formData.receivedAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-base font-medium focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    min="0"
                    step="0.01"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Paying */}
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Paying
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    PKR
                  </span>
                  <input
                    type="text"
                    value={formData.payingAmount}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-base font-medium bg-white"
                    readOnly
                  />
                </div>
              </div>

              {/* Change */}
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Change
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    PKR
                  </span>
                  <input
                    type="text"
                    value={formData.change}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-base font-medium bg-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handlePaymentTypeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
            >
              <option value="credit">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="deposit">Deposit</option>
              <option value="points">Points</option>
            </select>
          </div>

          {/* Quick Cash - Highlighted Section */}
          {showQuickCash && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Cash
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 50, 100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickCashSelect(String(amount))}
                    className={`py-2 rounded-lg transition-all ${
                      formData.quickCash === String(amount)
                        ? 'bg-black text-white border border-black'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    PKR {amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Note
              </label>
              <textarea
                name="paymentNote"
                value={formData.paymentNote}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                rows="2"
                placeholder="Add payment note"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Note
              </label>
              <textarea
                name="saleNote"
                value={formData.saleNote}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                rows="2"
                placeholder="Add sale note"
              ></textarea>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}