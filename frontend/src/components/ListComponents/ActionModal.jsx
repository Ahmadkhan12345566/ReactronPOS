import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const defaultTitles = {
  view: 'View Item',
  edit: 'Edit Item',
  delete: 'Delete Item',
};

const toTitleCase = (value) => {
  if (!value) return '';
  return value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === 'object') return 'Object';
  return String(value);
};

const getItemLabel = (data) => {
  if (!data || typeof data !== 'object') return 'this item';
  const candidates = [
    data.name,
    data.code,
    data.email,
    data.sku,
    data.id,
  ];
  const label = candidates.find((item) => item && String(item).trim());
  return label ? String(label) : 'this item';
};

export default function ActionModal({
  isOpen,
  onClose,
  action,
  data,
  handleDelete,
  handleEdit,
  renderers = {},
  titles = {},
}) {
  const [isWorking, setIsWorking] = useState(false);

  if (!isOpen || !action) return null;

  const title = titles[action] || defaultTitles[action] || 'Action';

  const handleDeleteConfirm = async () => {
    if (!handleDelete) return;
    try {
      setIsWorking(true);
      await handleDelete(data);
      onClose();
    } finally {
      setIsWorking(false);
    }
  };

  const handleEditConfirm = async (updatedData) => {
    if (!handleEdit) return;
    await handleEdit(updatedData);
    onClose();
  };

  const defaultRenderer = () => {
    if (action === 'view') {
      if (!data || typeof data !== 'object') {
        return <div className="text-sm text-gray-600">No details available.</div>;
      }

      const rows = Object.entries(data)
        .filter(([key]) => !['_id', '__v'].includes(key))
        .slice(0, 12);

      return (
        <div className="space-y-2 text-sm">
          {rows.map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">{toTitleCase(key)}</span>
              <span className="text-gray-900">{formatValue(value)}</span>
            </div>
          ))}
        </div>
      );
    }

    if (action === 'edit') {
      return (
        <div className="text-sm text-gray-600">
          No editor configured for this item.
        </div>
      );
    }

    if (action === 'delete') {
      const label = getItemLabel(data);
      return (
        <div>
          <p>
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">{label}</span>? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={onClose}
              disabled={isWorking}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-60"
              onClick={handleDeleteConfirm}
              disabled={isWorking}
            >
              {isWorking ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderer = renderers[action];
  const content = renderer
    ? renderer({
        data,
        onClose,
        onDelete: handleDeleteConfirm,
        onEdit: handleEditConfirm,
      })
    : defaultRenderer();

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4">
                  {content}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
