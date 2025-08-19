# React POS System Template

[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![daisyUI](https://img.shields.io/badge/daisyUI-5.0-FF7B00)](https://daisyui.com/)

Modern Point of Sale system template for retail management featuring sales, inventory, and customer management.

![POS Dashboard Preview](https://raw.githubusercontent.com/Ahmadkhan12345566/posb/main/frontend/public/screenshot.png)

## Features

- **POS & Checkout**
  - Fast product selection, quantity adjustments, customer lookup, and receipt printing.
  - Built-in payment flow and responsive product grid.

- **Inventory**
  - Add/edit products, categories/brands/units, stock tracking with alerts, and barcode/SKU support.

- **Sales & Purchases**
  - Track sales, manage purchases and suppliers, and handle invoices.

- **Reports & Exports**
  - Sales/purchase/customer reports with PDF/Excel export.

- **Multi-user & Roles**
  - User accounts, roles and basic permissions.

- **Utilities**
  - Image uploads, product variants, and bulk actions.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ahmadkhan12345566/posb.git
cd react-pos-template
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Technology Stack

### Frontend
- **React 19.1** - Core framework
- **Tailwind CSS 4.1** - Styling and layout
- **daisyUI 5.0** - UI component library
- **React Router 7.7** - Navigation and routing

### Utilities
- **Heroicons** - Icon library
- **Headless UI** - Accessible components
- **React Table** - Data table management
- **jsPDF + SheetJS** - PDF/Excel export

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── forms/            # Form components
│   ├── lists/            # Data listing components
│   └── ListComponents/   # Listing components
├── context/              # Context providers
├── pages/                # Application pages
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── POS.jsx
│   ├── Sales.jsx
│   └── Purchases.jsx
├── assets/               # Static assets
├── App.jsx               # Main application
└── main.jsx              # Entry point
```

## Key Components

1. **POS Interface (`POS.jsx`)** — live order/cart management, customer selection, payment, and receipts.  
2. **Product Management (`Products.jsx`, `AddProduct.jsx`)** — product CRUD, images, SKUs/barcodes, and stock controls.  
3. **Data Tables (`ProductList.jsx`)** — searchable, sortable tables with pagination, bulk actions, and exports.  
4. **Form System (`ProductForm.jsx`)** — dynamic accordion forms and validation-ready layout.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
```
