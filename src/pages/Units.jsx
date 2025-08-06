import React, { useState } from 'react';
import UnitList from '../components/UnitList';

// Dummy units data
export const dummyUnits = [
  { id: 1, name: 'Kilograms', shortName: 'kg', productCount: 25, createdOn: '24 Dec 2024', status: 'Active' },
  { id: 2, name: 'Liters', shortName: 'L', productCount: 18, createdOn: '10 Dec 2024', status: 'Active' },
  { id: 3, name: 'Dozen', shortName: 'dz', productCount: 30, createdOn: '27 Nov 2024', status: 'Active' },
  { id: 4, name: 'Pieces', shortName: 'pcs', productCount: 42, createdOn: '18 Nov 2024', status: 'Active' },
  { id: 5, name: 'Boxes', shortName: 'bx', productCount: 60, createdOn: '06 Nov 2024', status: 'Active' },
  { id: 6, name: 'Tons', shortName: 't', productCount: 10, createdOn: '25 Oct 2024', status: 'Active' },
  { id: 7, name: 'Grams', shortName: 'g', productCount: 70, createdOn: '14 Oct 2024', status: 'Active' },
  { id: 8, name: 'Meters', shortName: 'm', productCount: 80, createdOn: '03 Oct 2024', status: 'Active' },
  { id: 9, name: 'Centimeters', shortName: 'cm', productCount: 120, createdOn: '20 Sep 2024', status: 'Active' },
];

export default function Units() {
  const [units] = useState(dummyUnits);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <UnitList units={units} setShowForm={setShowForm} />
      {/* We'll add the AddUnit modal here later */}
    </div>
  );
}