import React, { useState } from 'react';

const categories = {
  Electronics: ['Mobiles', 'Laptops', 'Accessories'],
  Clothing: ['Men', 'Women', 'Kids'],
  Grocery: ['Fruits', 'Vegetables', 'Beverages'],
};

const ProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productCode: '',
    brand: '',
    category: '',
    subCategory: '',
    productUnit: '',
    productPrice: '',
    weight: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });

      // Reset sub-category when main category changes
      if (name === 'category') {
        setFormData((prev) => ({ ...prev, subCategory: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="productName"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.productName}
            />
          </div>

          <div>
            <label className="font-medium mb-1 flex items-center justify-between">
              Product Code
              <span
                className="ml-2 text-xs text-gray-500 cursor-help"
                title="Scan or enter the product barcode here."
              >
                [?]
              </span>
            </label>
            <input
              name="productCode"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.productCode}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              name="brand"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.brand}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {formData.category && (
            <div>
              <label className="block font-medium mb-1">Sub-Category</label>
              <select
                name="subCategory"
                className="w-full border px-3 py-2 rounded"
                onChange={handleChange}
                value={formData.subCategory}
              >
                <option value="">Select Sub-Category</option>
                {categories[formData.category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">Unit</label>
            <input
              name="productUnit"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.productUnit}
              placeholder="e.g. pcs, box"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              name="productPrice"
              type="number"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.productPrice}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Weight (kg)</label>
            <input
              name="weight"
              type="number"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={formData.weight}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="mt-2 h-32"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
