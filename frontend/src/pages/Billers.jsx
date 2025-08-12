import React, { useState } from 'react';
import BillerList from '../components/BillerList';

export const dummyBillers = [
  {
    id: 1,
    code: 'BL001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carl.evans@example.com',
    phone: '+1234567890',
    company: 'Apple',
    status: 'Active'
  },
  {
    id: 2,
    code: 'BL002',
    name: 'Alice Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    email: 'alice.johnson@example.com',
    phone: '+1234567891',
    company: 'Beats',
    status: 'Active'
  },
  {
    id: 3,
    code: 'BL003',
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    email: 'michael.brown@example.com',
    phone: '+1234567892',
    company: 'Lenovo',
    status: 'Active'
  },
  {
    id: 4,
    code: 'BL004',
    name: 'Sophie Laurent',
    avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
    email: 'sophie.laurent@example.com',
    phone: '+1234567893',
    company: 'Nike',
    status: 'Active'
  },
  {
    id: 5,
    code: 'BL005',
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    email: 'david.kim@example.com',
    phone: '+1234567894',
    company: 'Amazon',
    status: 'Inactive'
  },
  {
    id: 6,
    code: 'BL006',
    name: 'Julia Rossi',
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    email: 'julia.rossi@example.com',
    phone: '+1234567895',
    company: 'Dior',
    status: 'Active'
  },
  {
    id: 7,
    code: 'BL007',
    name: 'Carlos Mendes',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    email: 'carlos.mendes@example.com',
    phone: '+1234567896',
    company: 'Woodmart',
    status: 'Active'
  },
  {
    id: 8,
    code: 'BL008',
    name: 'Fatima Zahir',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    email: 'fatima.zahir@example.com',
    phone: '+1234567897',
    company: 'Lava',
    status: 'Active'
  },
  {
    id: 9,
    code: 'BL009',
    name: 'Hans Müller',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    email: 'hans.mueller@example.com',
    phone: '+1234567898',
    company: 'Nilkamal',
    status: 'Active'
  },
  {
    id: 10,
    code: 'BL010',
    name: 'Emma Svensson',
    avatar: 'https://randomuser.me/api/portraits/women/82.jpg',
    email: 'emma.svensson@example.com',
    phone: '+1234567899',
    company: 'The North Face',
    status: 'Active'
  }
];


export default function Billers() {
  const [Billers] = useState(dummyBillers);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <BillerList Billers={Billers} setShowForm={setShowForm} />
    </div>
  );
}