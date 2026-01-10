import React from 'react';

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return `PKR ${Number(value)}`;
};

const getPrimaryVariant = (product) => {
  const variants = product?.ProductVariants || product?.variants || [];
  return variants[0] || null;
};

const getPrimaryInventory = (variant) => {
  if (!variant) return null;
  const inventories = variant.Inventories || variant.inventories || [];
  return inventories[0] || null;
};

export default function ProductDetails({ product }) {
  if (!product) {
    return <div className="text-sm text-gray-600">No product selected.</div>;
  }

  const variant = getPrimaryVariant(product);
  const inventory = getPrimaryInventory(variant);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
            {product.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
        )}
        <div>
          <div className="text-lg font-semibold text-gray-900">{product.name || 'Untitled product'}</div>
          <div className="text-sm text-gray-500">{product.category || 'Uncategorized'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Status</span>
          <span className="text-gray-900">{product.status || 'Active'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Brand</span>
          <span className="text-gray-900">{product.brand || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Unit</span>
          <span className="text-gray-900">{product.unit || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Selling Type</span>
          <span className="text-gray-900">{product.sellingType || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">SKU</span>
          <span className="text-gray-900">{variant?.sku || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Price</span>
          <span className="text-gray-900">{formatCurrency(variant?.price)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Quantity</span>
          <span className="text-gray-900">{inventory?.qty ?? product.qty ?? '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Created By</span>
          <span className="text-gray-900">{product.createdBy || '—'}</span>
        </div>
      </div>

      {product.description ? (
        <div className="text-sm text-gray-600">
          <div className="text-xs uppercase text-gray-400 mb-1">Description</div>
          <p className="text-gray-700">{product.description}</p>
        </div>
      ) : null}
    </div>
  );
}
