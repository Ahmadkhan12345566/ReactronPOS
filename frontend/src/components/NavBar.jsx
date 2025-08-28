import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CubeIcon,
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

// Modular dropdown component
const NavDropdown = ({ title, icon: Icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if any item is active
  const isActive = items.some(item => location.pathname.startsWith(item.path));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
          isActive ? 'bg-gray-800' : ''
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{title}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isActive ? 'bg-gray-700 text-white font-medium' : 'text-gray-300'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// User dropdown component
const UserDropdown = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700"
      >
        <UserIcon className="h-5 w-5" />
        <span>Account</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !user && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handleNavigation('/signin')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => handleNavigation('/signup')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Sign Up
            </button>
          </div>
        </div>
      )}
      {isOpen && user && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {localStorage.removeItem('user'); setUser(null); setIsOpen(false); navigate('/signin');}}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
              <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign Out 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation groups
const navGroups = {
  products: {
    title: 'Products',
    icon: CubeIcon,
    items: [
      { name: 'Products', path: '/products' },
      { name: 'Add Product', path: '/products/add' },
      { name: 'Categories', path: '/categories' },
      { name: 'Brands', path: '/brands' },
      { name: 'Units', path: '/units' },
    ],
  },
  sales: {
    title: 'Sales',
    icon: ChartBarIcon,
    items: [
      { name: 'Sales', path: '/sales' },
      { name: 'Invoices', path: '/invoices' },
      { name: 'Sales Return', path: '/sales/return' },
      { name: 'Sales Report', path: '/sales/report' },
      { name: 'Customers', path: '/customers' },
      { name: 'Billers', path: '/billers' },
    ],
  },
  purchases: {
    title: 'Purchases',
    icon: ShoppingBagIcon,
    items: [
      { name: 'Purchases', path: '/purchases' },
      { name: 'Add Purchase', path: '/purchases/add' },
      { name: 'Purchase Report', path: '/purchases/report' },
      { name: 'Suppliers', path: '/suppliers' },
    ],
  },
};

const navLinks = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  navGroups.products,
  navGroups.sales,
  navGroups.purchases,
  { name: 'POS', path: '/pos', icon: CreditCardIcon },
];

const NavBar = () => {

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">POS System</div>
        <div className="flex gap-6 items-center">
          {navLinks.map((item) => {
            if (item.path) {
              // Simple NavLink item
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
                      isActive ? 'bg-gray-800' : ''
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            } else {
              // Dropdown group
              return (
                <NavDropdown
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  items={item.items}
                />
              );
            }
          })}
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;