import React, { useState, useRef, useEffect } from 'react';
import { usePos } from '../hooks/usePos'; 
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
  DocumentChartBarIcon,
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
  const isActive = items.some(item => item.path && location.pathname.startsWith(item.path));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
          isActive ? 'bg-gray-800' : ''
        }`}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span>{title}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={() => { item.onClick(); setIsOpen(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.name}
                </button>
              ) : (
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
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NavBar = () => {
  const { currentUser, logout } = usePos();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navGroups = {
    products: {
      title: 'Products',
      icon: CubeIcon,
      items: [
        { name: 'Products List', path: '/products' },
        { name: 'Add Product', path: '/add-product' },
        { name: 'Categories', path: '/categories' },
        { name: 'Add Category', path: '/add-category' },
        { name: 'Brands', path: '/brands' },
        { name: 'Add Brand', path: '/add-brand' },
        { name: 'Units', path: '/units' },
        { name: 'Add Unit', path: '/add-unit' },
      ],
    },
    sales: {
      title: 'Sales',
      icon: ChartBarIcon,
      items: [
        { name: 'Sales List', path: '/sales' },
        { name: 'Add Sale', path: '/add-sale' },
        { name: 'Invoices', path: '/invoices' },
        { name: 'Sales Return', path: '/sales-return' },
        { name: 'Customers', path: '/customers' },
        { name: 'Add Customer', path: '/add-customer' },
      ],
    },
    purchases: {
      title: 'Purchases',
      icon: ShoppingBagIcon,
      items: [
        { name: 'Purchases List', path: '/purchases' },
        { name: 'Add Purchase', path: '/add-purchase' },
        { name: 'Suppliers', path: '/suppliers' },
        { name: 'Add Supplier', path: '/add-supplier' },
      ],
    },
    reports: {
        title: 'Reports',
        icon: DocumentChartBarIcon,
        items: [
            { name: 'Sales Report', path: '/sales-report' },
            { name: 'Purchase Report', path: '/purchase-report' },
            { name: 'Customer Report', path: '/customer-report' },
            { name: 'Customer Due Report', path: '/customer-due-report' },
        ],
    },
    account: {
      title: 'Account',
      icon: UserIcon,
      items: currentUser
        ? [
            ...(currentUser.role === 'admin' ? [{ name: 'Billers', path: '/billers' }] : []),
            { name: 'Sign Out', onClick: handleLogout, icon: ArrowLeftOnRectangleIcon },
          ]
        : [
            { name: 'Sign In', path: '/signin', icon: ArrowRightOnRectangleIcon },
            { name: 'Sign Up', path: '/signup', icon: UserPlusIcon },
          ],
    },
  };

  

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    navGroups.products,
    navGroups.sales,
    navGroups.purchases,
    navGroups.reports,
    { name: 'POS', path: '/pos', icon: CreditCardIcon },
    navGroups.account,
  ];
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">ReactronPOS</div>
        <div className="flex gap-6 items-center">
          {navLinks.map((item) =>
            item.items ? (
              <NavDropdown key={item.title} title={item.title} icon={item.icon} items={item.items} />
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-800' : ''
                  }`
                }
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
