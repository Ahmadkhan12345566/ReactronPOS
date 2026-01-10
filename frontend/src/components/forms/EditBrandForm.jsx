import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditBrandForm({ brand, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Brand Name',
      required: true,
      placeholder: 'Enter brand name',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: ['Active', 'Inactive'],
    },
    {
      name: 'image',
      label: 'Brand Image',
      type: 'image',
      fullWidth: true,
    },
  ];

  const initialValues = {
    name: brand?.name || '',
    status: brand?.status || 'Active',
    image: brand?.image || '',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Brand"
      onSubmit={(values) => api.put(`/api/brands/${brand.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
