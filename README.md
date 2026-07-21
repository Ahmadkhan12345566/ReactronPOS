# React POS System Template

Modern Point of Sale system template for retail management featuring sales, inventory, and customer management, fully containerized and orchestrated with Docker Compose.

## Features

* **POS & Checkout**
* Fast product selection, quantity adjustments, customer lookup, and receipt printing.
* Built-in payment flow and responsive product grid.


* **Inventory**
* Add/edit products, categories/brands/units, stock tracking with alerts, and barcode/SKU support.


* **Sales & Purchases**
* Track sales, manage purchases and suppliers, and handle invoices.


* **Reports & Exports**
* Sales/purchase/customer reports with PDF/Excel export.


* **Multi-user & Roles**
* User accounts, roles and basic permissions.


* **Utilities**
* Image uploads, product variants, and bulk actions.



---

## 🐳 Docker Architecture & Deployment

This project is fully containerized and orchestrated using **Docker Compose**, featuring a robust 3-tier microservice architecture:

* **Database Layer**: Official `mysql:8.0` container featuring automated health checks (`mysqladmin ping`) and a named volume (`mysql_data`) ensuring persistent storage across container lifecycles.
* **Backend Layer**: Node.js/Express API container configured with dynamic service discovery (`DB_HOST=db`) to securely link with the MySQL instance.
* **Frontend Layer**: React/Vite client container communicating seamlessly with the backend service.

### Quick Start with Docker Compose (Recommended)

To run this entire stack instantly using pre-built images from Docker Hub without manually setting up local Node environments or databases:

1. **Clone the repository:**

```bash
git clone https://github.com/Ahmadkhan12345566/posb.git
cd posb

```

2. **Configure environment variables:**
Create a `.env` file in the root directory (you can reference `.env.example`):

```env
DB_PASSWORD=rootpassword
JWT_SECRET=your_super_secret_jwt_key_here

```

3. **Spin up the entire stack:**

```bash
docker compose up

```

4. **Access the application:**

* **Frontend Client:** `http://localhost:5173`
* **Backend API:** `http://localhost:3000`

---

## Local Development Installation (Alternative)

If you prefer running the components directly on your host machine without Docker:

1. Clone the repository:

```bash
git clone https://github.com/Ahmadkhan12345566/posb.git
cd posb

```

2. Install backend and frontend dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install

```

3. Start development servers:

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

```

4. Build for production:

```bash
cd frontend && npm run build

```

## Technology Stack

### Frontend & Backend

* **React 19.1** - Core UI framework
* **Node.js & Express** - Backend server API
* **MySQL 8.0** - Relational database layer
* **Tailwind CSS 4.1** - Styling and layout
* **daisyUI 5.0** - UI component library
* **React Router 7.7** - Navigation and routing

### Utilities

* **Heroicons** - Icon library
* **Headless UI** - Accessible components
* **React Table** - Data table management
* **jsPDF + SheetJS** - PDF/Excel export

## Project Structure

```
posb/
├── backend/            # Node.js Express server
│   ├── src/            # Controllers, models, and routes
│   └── uploads/        # Asset storage directory
├── frontend/           # React Vite client application
│   ├── src/            
│   │   ├── components/ # Reusable UI components
│   │   │   ├── forms/  # Form components
│   │   │   └── lists/  # Data listing components
│   │   ├── context/    # Context providers
│   │   ├── pages/      # Application pages (Dashboard, POS, Products, etc.)
│   │   └── assets/     # Static assets
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
└── docker-compose.yml  # Multi-container orchestration config

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

MIT License - see [LICENSE](https://www.google.com/search?q=LICENSE) for details.