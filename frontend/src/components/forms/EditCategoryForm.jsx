import React from 'react';
import { api } from '../../services/api';
import EntityForm from './EntityForm';

export default function EditCategoryForm({ category, onSaved, onCancel }) {
  const fields = [
    {
      name: 'name',
      label: 'Category Name',
      required: true,
      placeholder: 'Enter category name',
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
      label: 'Category Image',
      type: 'image',
      fullWidth: true,
    },
  ];

  const initialValues = {
    name: category?.name || '',
    status: category?.status || 'Active',
    image: category?.image || '',
  };

  return (
    <EntityForm
      initialValues={initialValues}
      fields={fields}
      submitLabel="Save Category"
      onSubmit={(values) => api.put(`/api/categories/${category.id}`, values)}
      onSuccess={onSaved}
      onCancel={onCancel}
    />
  );
}
