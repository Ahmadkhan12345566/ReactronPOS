import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditCustomerForm({ customer, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Customer Name',
      required: true,
      placeholder: 'Enter customer name',
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
      name: 'city',
      label: 'City',
      placeholder: 'Enter city',
    },
    {
      name: 'country',
      label: 'Country',
      placeholder: 'Enter country',
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
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    country: customer?.country || '',
    status: customer?.status || 'Active',
    image: customer?.image || '',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Customer"
      onSubmit={(values) => api.put(`/api/customers/${customer.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
