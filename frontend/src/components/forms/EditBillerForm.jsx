import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditBillerForm({ biller, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Biller Name',
      required: true,
      placeholder: 'Enter biller name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: ['admin', 'biller'],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: ['Active', 'Inactive'],
    },
  ];

  const initialValues = {
    name: biller?.name || '',
    email: biller?.email || '',
    role: biller?.role || 'biller',
    status: biller?.status || 'Active',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Biller"
      onSubmit={(values) => api.put(`/api/billers/${biller.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
