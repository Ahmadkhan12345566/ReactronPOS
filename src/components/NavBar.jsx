import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CubeIcon,
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'Sales', path: '/sales', icon: ChartBarIcon },
  { name: 'Purchases', path: '/purchases', icon: ShoppingBagIcon },
  { name: 'POS', path: '/pos', icon: CreditCardIcon },
];

const NavBar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">POS System</div>
        <div className="flex gap-6">
          {navLinks.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
