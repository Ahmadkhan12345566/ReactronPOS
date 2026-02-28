import React from 'react';

export default function SelectField({
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = null,
  colClass = 'md:col-span-3',
  className = '',
  required = false,
  renderOption = null, // (opt) => JSX if you want custom option markup
}) {
  // normalize options: allow array of strings or array of { value, label }
  const normalized = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`${colClass}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${className}`}
        aria-label={label || name}
        required={required}
      >
        {placeholder !== null && <option value="">{placeholder}</option>}
        {normalized.map((opt, i) => (
          <option key={i} value={opt.value}>
            {renderOption ? renderOption(opt) : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
