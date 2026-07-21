import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditUnitForm({ unit, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Unit Name',
      required: true,
      placeholder: 'Enter unit name',
    },
    {
      name: 'short_name',
      label: 'Short Name',
      required: true,
      placeholder: 'Enter short name',
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
    name: unit?.name || '',
    short_name: unit?.short_name || '',
    status: unit?.status || 'Active',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Unit"
      onSubmit={(values) => api.put(`/api/units/${unit.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
