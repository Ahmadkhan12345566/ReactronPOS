// components/FormFooter.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const FormFooter = ({ 
  cancelPath, 
  submitLabel = 'Save', 
  cancelLabel = 'Cancel',
  disabled = false
}) => (
  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
    <NavLink
      to={cancelPath}
      className="px-6 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50"
    >
      {cancelLabel}
    </NavLink>
    <button 
      type="submit"
      disabled={disabled}
      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {submitLabel}
    </button>
  </div>
);

export default FormFooter;