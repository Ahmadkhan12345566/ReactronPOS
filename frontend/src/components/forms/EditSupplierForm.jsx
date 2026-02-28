import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditSupplierForm({ supplier, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Supplier Name',
      required: true,
      placeholder: 'Enter supplier name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: 'Enter phone number',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      rows: 3,
      fullWidth: true,
      placeholder: 'Enter address',
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
      label: 'Profile Image',
      type: 'image',
      fullWidth: true,
    },
  ];

  const initialValues = {
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    status: supplier?.status || 'Active',
    image: supplier?.image || '',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Supplier"
      onSubmit={(values) => api.put(`/api/suppliers/${supplier.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
