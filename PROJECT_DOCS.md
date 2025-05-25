# PharmaEase (صيدليتي) - Project Documentation

## 1. Introduction

**PharmaEase (صيدليتي)** is a modern, web-based pharmacy management system designed to streamline daily operations for pharmacists. It provides tools for inventory management, sales processing, supplier tracking, reporting, and AI-driven stock ordering suggestions. The application supports multiple languages (Arabic and English), dark mode, and currency switching (SYP/USD) to enhance user experience.

## 2. Purpose

The primary goal of PharmaEase is to offer an intuitive, efficient, and comprehensive solution for managing a pharmacy. It aims to:
- Simplify inventory tracking and reduce manual errors.
- Expedite the sales process, especially with barcode scanning.
- Provide insights through sales and stock reports.
- Assist in optimizing stock levels with AI-powered order suggestions.
- Offer a user-friendly interface adaptable to user preferences (language, theme, currency).

## 3. Technology Stack

- **Frontend:**
    - Next.js 15 (App Router)
    - React 18
    - TypeScript
    - ShadCN UI Components
    - Tailwind CSS
- **Backend (handled by Next.js Server Actions):**
    - Node.js (implicitly, as Next.js runtime)
    - Server Actions for API-less data mutations and fetching.
- **AI Integration:**
    - Genkit (with Google AI/Gemini models)
- **Data Persistence:**
    - JSON files stored locally in the `src/data/` directory (for products, sales, suppliers, customers, transactions). This is suitable for development and small-scale deployments. For production, a dedicated database is recommended.
- **Utilities & Libraries:**
    - `react-hook-form` (Form handling)
    - `zod` (Schema validation)
    - `lucide-react` (Icons)
    - `date-fns` (Date utilities)
    - `uuid` (Generating unique IDs)
    - `clsx`, `tailwind-merge` (CSS class utilities)

## 4. System Requirements

- Node.js (v18.x or later recommended)
- npm (comes with Node.js)
- A modern web browser (e.g., Chrome, Firefox, Edge, Safari)
- An external USB barcode scanner (that acts as a keyboard input device) for the Quick Invoice feature.

## 5. Project Structure

```
pharmaease/
├── .env                    # Environment variables (currently empty)
├── apphosting.yaml         # Firebase App Hosting configuration
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── install_dependencies.bat # Script to install dependencies
├── start_web_app.bat       # Script to start the web application
├── PROJECT_DOCS.md         # This documentation file
├── README.md               # Basic project README
├── src/
│   ├── ai/                 # Genkit AI integration
│   │   ├── dev.ts
│   │   ├── flows/
│   │   │   └── ai-driven-stock-ordering.ts
│   │   └── genkit.ts
│   ├── app/                # Next.js App Router
│   │   ├── (dashboard)/    # Authenticated/Dashboard routes
│   │   │   ├── inventory/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (redirects to /inventory)
│   │   │   ├── quick-invoice/
│   │   │   ├── reports/
│   │   │   ├── sales/
│   │   │   ├── smart-order/
│   │   │   └── suppliers/
│   │   ├── globals.css     # Global styles and ShadCN theme
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Root page (redirects)
│   ├── components/         # Reusable UI components
│   │   ├── inventory/
│   │   ├── page-header.tsx
│   │   ├── quick-invoice/
│   │   ├── translations-wrapper.tsx
│   │   └── ui/             # ShadCN UI pre-built components
│   ├── contexts/           # React Context providers
│   │   ├── CurrencyContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/               # JSON files for data storage
│   │   ├── customers.json
│   │   ├── products.json
│   │   ├── sales.json
│   │   ├── suppliers.json
│   │   └── transactions.json
│   ├── hooks/              # Custom React hooks
│   │   ├── useAppTranslation.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                # Utility functions and services
│   │   ├── data-service.ts # Handles reading/writing to JSON data files
│   │   └── utils.ts
│   ├── translations/       # Language translation files
│   │   ├── ar.json
│   │   └── en.json
│   └── types/              # TypeScript type definitions
│       └── index.ts
└── ... (other configuration files)
```

## 6. Setup and Running the Application

### 6.1. Using Batch Files (Windows)

1.  **Install Dependencies:**
    Double-click the `install_dependencies.bat` file. This will run `npm install` to download all necessary project packages. Wait for the process to complete.

2.  **Start the Web Application:**
    Double-click the `start_web_app.bat` file. This will:
    - Start the Next.js development server.
    - Automatically open your default web browser to `http://localhost:9002`.
    Please wait for the server to compile and start; the page will load once it's ready.
    The command prompt window running the server should remain open. To stop the server, close this window or press `Ctrl+C`.

### 6.2. Manual Setup (All Platforms)

1.  **Clone the Repository (if applicable):**
    If you have the project as a set of files, skip this step. Otherwise:
    ```bash
    git clone <repository_url>
    cd pharmaease
    ```

2.  **Install Dependencies:**
    Open a terminal or command prompt in the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    Run the following command:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`. Open this URL in your web browser.

## 7. Data Persistence

PharmaEase currently uses JSON files for data storage, located in the `src/data/` directory.
- `products.json`: Stores product information.
- `sales.json`: Stores sales records.
- `suppliers.json`: Stores supplier information.
- `customers.json`: Stores customer information (currently minimal usage).
- `transactions.json`: Stores financial transactions (revenue from sales).

The `src/lib/data-service.ts` module contains functions to read from and write to these JSON files.
**Note:** For production environments, it's highly recommended to migrate to a more robust database system (e.g., PostgreSQL, MySQL, Firebase Firestore).

## 8. Key Features

- **Dashboard Layout:** A consistent layout with a sidebar for navigation.
- **Inventory Management (`/inventory`):**
    - View all products in a sortable, filterable table.
    - Add new products with details like name, barcode, price, quantity, expiry date.
    - Edit existing products.
    - Delete products.
    - Visual indicators for low stock, expired, and soon-to-expire products.
- **Quick Invoice (`/quick-invoice`):**
    - Designed for use with an external USB barcode scanner (keyboard emulation).
    - A hidden input field automatically receives focus for scanner input.
    - Manual barcode entry option.
    - Scanned products are added to an invoice list.
    - Quantity automatically increments if the same product is scanned multiple times.
    - Ability to adjust quantity or remove items from the invoice.
    - Calculates total amount.
    - "Complete Sale" button saves the sale, updates stock, and records a financial transaction.
- **Sales Management (`/sales`):**
    - Placeholder page for future detailed sales history and reporting. Currently, sales are recorded via Quick Invoice.
- **Supplier Management (`/suppliers`):**
    - Placeholder page for managing suppliers.
- **Reporting (`/reports`):**
    - Placeholder page for future financial and inventory reports.
- **Smart Order Tool (`/smart-order`):**
    - AI-driven tool using Genkit to suggest stock orders.
    - User inputs sales data, stock levels, and expiration dates (JSON format or prefill with current data).
    - AI provides a suggested order list and reasoning.
- **Multi-lingual Support:**
    - Supports Arabic (default) and English.
    - Language switcher in the header.
    - Translations managed via JSON files in `src/translations/`.
- **Dark Mode:**
    - Toggle between light and dark themes.
    - Theme switcher in the header.
- **Currency Switching:**
    - Switch display currency between SYP (default) and USD.
    - Currency switcher in the header.
    - Backend calculations and storage remain in SYP.

## 9. Server Actions

Instead of traditional API routes, PharmaEase extensively uses Next.js Server Actions for backend logic. These are functions defined with the `"use server";` directive and can be called directly from Client Components.

Key Server Actions include:
- **Inventory Actions (`src/app/(dashboard)/inventory/actions.ts`):**
    - `addProductAction`
    - `updateProductAction`
    - `deleteProductAction`
    - `getInventorySummaryAction`
- **Quick Invoice Actions (`src/app/(dashboard)/quick-invoice/actions.ts`):**
    - `getProductByBarcodeAction`
    - `createQuickSaleAction`

These actions interact with `src/lib/data-service.ts` to perform CRUD operations on the JSON data files and revalidate paths as needed.

## 10. AI Integration (Genkit)

- **Genkit Setup:** Initialized in `src/ai/genkit.ts` using the `googleAI` plugin (Gemini models).
- **Smart Order Flow (`src/ai/flows/ai-driven-stock-ordering.ts`):**
    - Defines a Genkit flow (`generateSuggestedOrderFlow`) and a prompt (`generateSuggestedOrderPrompt`).
    - Takes sales data, stock levels, and expiration dates as input.
    - Returns a suggested order (JSON) and the reasoning behind it.
    - The UI for this is in `src/app/(dashboard)/smart-order/page.tsx`.

## 11. Future Enhancements (Potential)

- Migration to a dedicated database for better scalability and performance.
- More comprehensive reporting features (e.g., profit margins, sales trends charts).
- Full implementation of Customer and Supplier management sections.
- User authentication and authorization.
- Integration with actual barcode scanning libraries for devices without external scanners (if desired).
- More sophisticated AI features (e.g., demand forecasting).
