import React, { useEffect, useState } from 'react';

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const normalizeOptions = (options = []) => {
  return options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }
    return option;
  });
};

export default function EntityForm({
  initialValues = {},
  fields = [],
  onSubmit,
  onCancel,
  onSuccess,
  submitLabel = 'Save',
  autoClose = true,
}) {
  const [formData, setFormData] = useState({ ...initialValues });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({ ...initialValues });
  }, [initialValues]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (name, file) => {
    if (!file) {
      handleChange(name, '');
      return;
    }
    try {
      const base64 = await toBase64(file);
      handleChange(name, base64);
    } catch (err) {
      console.error('Failed to process image:', err);
      setError('Failed to process image. Please try another file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (typeof onSuccess === 'function') {
        onSuccess(result);
      }
      if (autoClose && typeof onCancel === 'function') {
        onCancel();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const value = formData[field.name] ?? '';
          const isRequired = Boolean(field.required);
          const label = field.label || field.name;

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {isRequired && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  name={field.name}
                  rows={field.rows || 3}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={isRequired}
                />
              </div>
            );
          }

          if (field.type === 'select') {
            const options = normalizeOptions(field.options);
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {isRequired && <span className="text-red-500">*</span>}
                </label>
                <select
                  name={field.name}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={isRequired}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'image') {
            return (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-600"
                  onChange={(e) => handleFileChange(field.name, e.target.files?.[0])}
                />
                {value && (
                  <div className="mt-3 flex items-center space-x-3">
                    <img
                      src={value}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                    />
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700"
                      onClick={() => handleChange(field.name, '')}
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                name={field.name}
                type={field.type || 'text'}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={isRequired}
              />
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
