import { useState, useEffect } from 'react';

export default function Receipt({
  isOpen,
  onClose,
  customerName,
  customerId,
  orderItems,
  subtotal,
  discount,
  tax,
  shipping = 0,
  total,
   biller = "admin"
}) {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    // invoice number
    const datePart   = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const randomPart = Math.floor(1000 + Math.random()*9000);
    setInvoiceNo(`INV-${datePart}-${randomPart}`);
    // formatted date
    setCurrentDate(new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit',
      minute: '2-digit'
    }));
  }, [isOpen]);

  const handlePrint = () => window.print();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center print:block">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black opacity-50 print:hidden"
      />

      {/* Receipt panel */}
      <div
        id="receipt-modal"
        className="
          relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden
          print:fixed print:inset-0 print:rounded-none print:shadow-none
          print:m-0 print:p-4 print:max-w-none
        "
      >
        {/* header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10 print:hidden">
          <h2 className="text-xl font-bold text-gray-800">Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        {/* content */}
        <div 
          id="receipt-content"
          className="p-4 max-h-[80vh] overflow-y-auto print:max-h-full print:overflow-visible"
        >
          {/* logo & title */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold mb-2">HerbsDepo</div>
            <div className="text-sm text-gray-600">123 Coffee Street, Beverage City</div>
            <div className="text-sm text-gray-600">Phone: +92 300 1234567</div>
          </div>

          <div className="border-t border-b border-gray-300 py-2 mb-6">
            <h3 className="text-lg font-semibold text-center">TAX INVOICE</h3>
          </div>

          {/* invoice details */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm print:text-xs">
            <div>
              <div className="text-gray-600">Customer:</div>
              <div className="font-medium">{customerName}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Biller:</div>
              <div className="font-medium">{biller}</div>
            </div>
            <div>
              <div className="text-gray-600">Customer:</div>
              <div className="font-medium">{customerName}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Invoice #:</div>
              <div className="font-medium">{invoiceNo}</div>
            </div>
            <div>
              <div className="text-gray-600">Customer ID:</div>
              <div className="font-medium">{customerId}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Date:</div>
              <div className="font-medium">{currentDate}</div>
            </div>
          </div>

          {/* items */}
          <table className="w-full mb-6 text-sm print:text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 font-semibold">Item</th>
                <th className="text-center py-2 font-semibold">Price</th>
                <th className="text-center py-2 font-semibold">Qty</th>
                <th className="text-right py-2 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item,i)=>(
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2">{i+1}. {item.name}</td>
                  <td className="py-2 text-center">PKR {parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-2 text-center">{item.qty}</td>
                  <td className="py-2 text-right">PKR {(parseFloat(item.price)*parseFloat(item.qty)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* summary */}
          <div className="border border-gray-200 rounded-lg p-3 mb-6 text-sm print:text-xs">
            {[
              ['Subtotal', subtotal],
              ['Discount', -discount],
              ['Tax (8%)', tax],
              ['Shipping', shipping]
            ].map(([label, amt]) => (
              <div key={label} className="flex justify-between py-1">
                <span>{label}:</span>
                <span className={label==='Discount'?'text-red-600':''}>
                  PKR {Math.abs(amt).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
              <span>Total:</span>
              <span>PKR {parseFloat(total).toFixed(2)}</span>
            </div>
          </div>

          {/* footer */}
          <div className="text-center py-4 border-t border-gray-200 print:border-none print:py-2">
            <p className="text-xs italic text-gray-500 mb-2">
              ** VAT against this invoice is payable through central registration
            </p>
            <p className="text-xs text-gray-500">Thank you for your business!</p>

            <button
              onClick={handlePrint}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium print:hidden"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
