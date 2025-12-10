import GlobalErrorHandler from './components/GlobalErrorHandler';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PosProvider } from './context/PosContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Sales from './pages/Sales';
import AddSales from './pages/AddSales';
import Purchases from './pages/Purchases';
import AddPurchase from './pages/AddPurchase';
import Navbar from './components/NavBar';
import POS from './pages/POS';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import Brands from './pages/Brands';
import AddBrand from './pages/AddBrand';
import Units from './pages/Units';
import AddUnit from './pages/AddUnit';
import Invoices from './pages/Invoices';
import SalesReturn from './pages/SalesReturn';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Billers from './pages/Billers';
import Suppliers from './pages/Suppliers';
import AddSupplier from './pages/AddSupplier';
import PurchaseReport from './pages/PurchaseReport';
import CustomerDueReport from './pages/CustomerDueReport';
import CustomerReport from './pages/CustomerReport';
import SalesReport from './pages/SalesReport';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
  window.electronAPI?.onBackendError((message) => {
    alert('Backend failed: ' + message);
  });
}, []);

  return (
    <PosProvider>
      <GlobalErrorHandler />
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar className="h-[5%] min-h-[3rem]" />
          <div className="flex-1 overflow-hidden">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/add-brand" element={<AddBrand />} />
            <Route path="/units" element={<Units />} />
            <Route path="/add-unit" element={<AddUnit />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/billers" element={<Billers/>} />
            <Route path="/suppliers" element={<Suppliers/>} />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route path="/sales-return" element={<SalesReturn />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/add-sale" element={<AddSales />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/add-purchase" element={<AddPurchase />} />
            <Route path="/purchase-report" element={<PurchaseReport />} />
            <Route path="/customer-due-report" element={<CustomerDueReport />} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/customer-report" element={<CustomerReport />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          </div>
        </div>
      </Router>
    </PosProvider>
  );
}

export default App;
