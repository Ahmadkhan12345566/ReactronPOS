import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

const buildSelectOptions = (items = [], labelKey = 'name') => {
  return [
    { label: 'Select', value: '' },
    ...items.map((item) => ({
      label: item[labelKey],
      value: item.id || item._id,
    })),
  ];
};

const getProductVariants = (product) => {
  return product?.ProductVariants || product?.variants || [];
};

const getInventories = (variant) => {
  const raw = variant?.Inventories || variant?.inventories || [];
  return raw.map((inventory) => ({
    storeId: inventory.storeId || inventory.store || inventory.store_id || '',
    qty: inventory.qty ?? 0,
    quantityAlert: inventory.quantityAlert ?? inventory.quantity_alert ?? 0,
  }));
};

const buildVariantsPayload = (product, values) => {
  const variants = getProductVariants(product).map((variant) => ({
    _id: variant._id || variant.id,
    sku: variant.sku || '',
    itemBarcode: variant.itemBarcode || '',
    price: Number(variant.price || 0),
    cost: Number(variant.cost || 0),
    weight: Number(variant.weight || 0),
    attributes: variant.attributes || {},
    inventories: getInventories(variant),
  }));

  if (product?.productType === 'single' && variants[0]) {
    const storeId = values.storeId || variants[0].inventories?.[0]?.storeId || '';
    const updatedInventory = storeId
      ? {
          storeId,
          qty: values.quantity === '' ? variants[0].inventories?.[0]?.qty || 0 : Number(values.quantity),
          quantityAlert:
            values.quantityAlert === ''
              ? variants[0].inventories?.[0]?.quantityAlert || 0
              : Number(values.quantityAlert),
        }
      : null;

    variants[0] = {
      ...variants[0],
      sku: values.sku || variants[0].sku,
      itemBarcode: values.itemBarcode || variants[0].itemBarcode,
      price: values.price === '' ? variants[0].price : Number(values.price),
    };

    if (updatedInventory) {
      const existingInventories = Array.isArray(variants[0].inventories)
        ? [...variants[0].inventories]
        : [];
      const index = existingInventories.findIndex(inv => inv.storeId === updatedInventory.storeId);
      if (index >= 0) {
        existingInventories[index] = { ...existingInventories[index], ...updatedInventory };
      } else {
        existingInventories.push(updatedInventory);
      }
      variants[0].inventories = existingInventories;
    }
  }

  return variants;
};

export default function EditProductForm({ product, onSaved, onCancel }) {
  const [options, setOptions] = useState({
    categories: [],
    brands: [],
    units: [],
    stores: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isActive = true;
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [categories, brands, units, stores] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/brands'),
          api.get('/api/units'),
          api.get('/api/stores'),
        ]);
        if (!isActive) return;
        setOptions({
          categories,
          brands,
          units,
          stores,
        });
      } catch (error) {
        if (!isActive) return;
        setLoadError('Unable to load product options. Please try again.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchOptions();
    return () => {
      isActive = false;
    };
  }, []);

  const variants = getProductVariants(product);
  const primaryVariant = variants[0] || {};
  const inventories = getInventories(primaryVariant);
  const primaryInventory = inventories[0] || {};
  const isSingle = product?.productType === 'single';

  const initialValues = useMemo(
    () => ({
      name: product?.name || '',
      description: product?.description || '',
      status: product?.status || 'Active',
      categoryId: product?.categoryId || '',
      brandId: product?.brandId || '',
      unitId: product?.unitId || '',
      sellingType: product?.sellingType || '',
      slug: product?.slug || '',
      taxType: product?.taxType || '',
      tax: product?.tax ?? '',
      discountType: product?.discountType || '',
      discountValue: product?.discountValue ?? '',
      barcodeSymbology: product?.barcodeSymbology || '',
      image: product?.image || '',
      sku: primaryVariant?.sku || '',
      itemBarcode: primaryVariant?.itemBarcode || '',
      price: primaryVariant?.price ?? '',
      quantity: primaryInventory?.qty ?? '',
      quantityAlert: primaryInventory?.quantityAlert ?? '',
      storeId: primaryInventory?.storeId || '',
    }),
    [product, primaryVariant, primaryInventory]
  );

  const fields = useMemo(() => {
    const baseFields = [
      {
        name: 'name',
        label: 'Product Name',
        required: true,
        placeholder: 'Enter product name',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: ['Active', 'Inactive'],
      },
      {
        name: 'categoryId',
        label: 'Category',
        type: 'select',
        required: true,
        options: buildSelectOptions(options.categories),
      },
      {
        name: 'brandId',
        label: 'Brand',
        type: 'select',
        required: true,
        options: buildSelectOptions(options.brands),
      },
      {
        name: 'unitId',
        label: 'Unit',
        type: 'select',
        required: true,
        options: buildSelectOptions(options.units),
      },
      {
        name: 'sellingType',
        label: 'Selling Type',
        type: 'select',
        options: ['Online', 'POS'],
      },
      {
        name: 'slug',
        label: 'Slug',
        placeholder: 'Enter slug',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        fullWidth: true,
      },
      {
        name: 'taxType',
        label: 'Tax Type',
        type: 'select',
        options: ['Exclusive', 'Inclusive'],
      },
      {
        name: 'tax',
        label: 'Tax',
        type: 'number',
      },
      {
        name: 'discountType',
        label: 'Discount Type',
        type: 'select',
        options: ['Percentage', 'Fixed'],
      },
      {
        name: 'discountValue',
        label: 'Discount Value',
        type: 'number',
      },
      {
        name: 'barcodeSymbology',
        label: 'Barcode Symbology',
        type: 'select',
        options: ['Code 128', 'Code 39', 'UPC-A'],
      },
      {
        name: 'image',
        label: 'Product Image',
        type: 'image',
        fullWidth: true,
      },
    ];

    if (!isSingle) {
      return baseFields;
    }

    return [
      ...baseFields,
      {
        name: 'sku',
        label: 'SKU',
        placeholder: 'Enter SKU',
      },
      {
        name: 'itemBarcode',
        label: 'Item Barcode',
        placeholder: 'Enter barcode',
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
      },
      {
        name: 'storeId',
        label: 'Store',
        type: 'select',
        required: true,
        options: buildSelectOptions(options.stores),
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
      },
      {
        name: 'quantityAlert',
        label: 'Quantity Alert',
        type: 'number',
      },
    ];
  }, [options, isSingle]);

  const handleSubmit = (values) => {
    if (!product?.id) {
      return Promise.reject(new Error('Product record is missing an id.'));
    }

    const payload = {
      name: values.name.trim(),
      description: values.description || '',
      status: values.status || product.status || 'Active',
      categoryId: values.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      brandId: values.brandId || null,
      unitId: values.unitId || null,
      productType: product.productType,
      taxType: values.taxType || null,
      tax: values.tax === '' ? null : Number(values.tax),
      discountType: values.discountType || null,
      discountValue: values.discountValue === '' ? null : Number(values.discountValue),
      warranties: product.warranties || null,
      barcodeSymbology: values.barcodeSymbology || product.barcodeSymbology || null,
      sellingType: values.sellingType || null,
      image: values.image || null,
      supplierId: product.supplierId || null,
      slug: values.slug || null,
      variants: buildVariantsPayload(product, values),
    };

    return api.put(`/api/products/${product.id}`, payload);
  };

  if (!product) {
    return <div className="text-sm text-gray-600">No product selected.</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-gray-600">Loading product options...</div>;
  }

  if (loadError) {
    return <div className="text-sm text-red-600">{loadError}</div>;
  }

  return (
    <div className="space-y-4">
      {!isSingle && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          This product uses multiple variants. Only core product details can be edited here.
        </div>
      )}
      <EntityForm
        initialValues={initialValues}
        fields={fields}
        submitLabel="Save Product"
        onSubmit={handleSubmit}
        onSuccess={onSaved}
        onCancel={onCancel}
      />
    </div>
  );
}
