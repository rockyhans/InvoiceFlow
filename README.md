<h1 align="center">InvoiceFlow</h1>
Implementation & Feature Documentation

| **Prepared For** | Ultrakey IT Solutions Private Limited     |
| ---------------- | ----------------------------------------- |
| **Prepared By**  | Danish Rizwan                             |
| **Role**         | Full Stack Developer (Assessment Project) |
| **Date**         | June 2026                                 |

**Project Repository**

**GitHub:**  
<https://github.com/rockyhans/InvoiceFlow>

**Live URL:**  
<https://invoice-flow-sigma-weld.vercel.app/dashboard>

**Demo Credentials**

Since the application is protected and requires authentication, use the following administrator credentials to access it:

- **Email:** <admin@gmail.com>
- **Password:** Admin@123

# 1\. Technology Stack

## 1.1 Backend

| **Technology** | **Version / Package** | **Purpose**           |
| -------------- | --------------------- | --------------------- |
| Node.js        | v18+                  | Runtime environment   |
| Express.js     | ^4.x                  | REST API framework    |
| MongoDB        | ^7.x                  | Primary database      |
| Mongoose       | ^8.x                  | ODM for MongoDB       |
| JSON Web Token | jsonwebtoken          | Admin authentication  |
| bcryptjs       | ^2.x                  | Password hashing      |
| PDFKit         | pdfkit                | PDF generation        |
| Nodemailer     | nodemailer            | Email sending (SMTP)  |
| dotenv         | dotenv                | Environment config    |
| cors           | cors                  | Cross-origin requests |
| cookie-parser  | cookie-parser         | Cookie handling       |

## 1.2 Frontend

| **Technology**   | **Package**      | **Purpose**                         |
| ---------------- | ---------------- | ----------------------------------- |
| React.js         | ^18.x            | UI framework                        |
| Vite             | vite             | Build tool & dev server             |
| React Router DOM | react-router-dom | Client-side routing                 |
| Axios            | axios            | HTTP API calls                      |
| Tailwind CSS     | tailwindcss      | Utility-first styling               |
| React Icons      | react-icons      | Icon library (FaEdit, FaTrash etc.) |

## 1.3 Database

- MongoDB Atlas
- Mongoose ODM for schema definition, validation, and queries
- One database with 5 collections: admins, clients, quotes, invoices, settings

# 2\. Features Implemented

## 2.1 Authentication

Secure admin login system protecting all routes.

- JWT-based authentication stored in Authorization header
- Passwords hashed using bcryptjs before storing in database
- Auth middleware (protect) validates token on every protected route
- req.user.\_id used throughout to scope all data to logged-in admin

| **Backend** | Node.js + Express + JWT + bcryptjs | **Frontend** | React state + Axios interceptors |
| ----------- | ---------------------------------- | ------------ | -------------------------------- |

## 2.2 Client Management

Full CRUD for managing clients. All client data is scoped to the logged-in admin.

- Create new clients with name, email, phone, address
- List all clients with search and pagination
- Edit existing client details inline via modal
- Delete clients with confirmation dialog
- Clients populate into Quote and Invoice forms as dropdown selections

| **Backend** | Express REST API + Mongoose | **Frontend** | React + Modal + DataTable component |
| ----------- | --------------------------- | ------------ | ----------------------------------- |

## 2.3 Quote Management

Complete quotation lifecycle management from draft to acceptance.

- Create quotes with multiple line items (description, qty, price, item-level tax)
- Auto-generated quote numbers (QT-00001, QT-00002...)
- Subtotal, discount, tax, and grand total calculated automatically
- Number() parsing fix applied to prevent string concatenation bugs in totals
- Status tracking: Draft → Sent → Accepted → Rejected
- Search by quote number with server-side pagination
- Edit and delete with admin-scoped security (admin filter on all queries)

| **Backend** | Express + Mongoose + Number() coercion | **Frontend** | React + QuoteForm with live total calculation |
| ----------- | -------------------------------------- | ------------ | --------------------------------------------- |

## 2.4 Invoice Management

Full invoice lifecycle with the ability to convert approved quotes into invoices.

- Create invoices manually or auto-fill from an existing quote
- Client dropdown → Quote dropdown flow (quote filtered by selected client)
- When quote selected: items, discount, tax, notes, due date all pre-filled
- Additional invoice fields: amountPaid, balanceDue (= total - amountPaid)
- Auto-generated invoice numbers
- Status tracking: Draft → Sent → Paid → Partially Paid → Overdue
- All queries admin-scoped using req.user.\_id
- Edit and delete with confirmation

| **Backend** | Express + Mongoose + Settings model | **Frontend** | React + InvoiceForm with quote pre-fill logic |
| ----------- | ----------------------------------- | ------------ | --------------------------------------------- |

## 2.5 Invoice Detail Page

Dedicated view page for each invoice with action buttons.

- Navigated to via eye icon on the Invoices list page
- Displays all invoice fields: client info, dates, items table, totals breakdown
- Status badge with colour coding (green=Paid, red=Overdue, yellow=others)
- Download PDF button - generates and downloads branded PDF
- Send to Client button - emails invoice PDF to client's email address

| **Backend** | GET /api/invoices/:id | **Frontend** | InvoiceDetail.jsx + react-router useParams |
| ----------- | --------------------- | ------------ | ------------------------------------------ |

## 2.6 PDF Generation

Server-side branded PDF generation matching Ultrakey's invoice template.

- Built using PDFKit - pure Node.js, no browser required
- PDF includes: Ultrakey header bar, From/To address blocks, items table, totals, footer
- Business details (name, address, GST, email, phone) pulled from Settings
- Tax label and percentage pulled from Tax Settings
- Terms & Conditions from Invoice Settings printed at bottom
- Refactored into two export modes:
  - generateInvoicePdfStream(invoice, settings, res) - streams to HTTP response for download
  - generateInvoicePdfBuffer(invoice, settings) - returns Buffer for email attachment
- Both modes share one buildInvoicePdf() core function - no code duplication

| **Backend** | PDFKit + generateInvoicePdf.js utility | **Frontend** | Blob URL + anchor click for download trigger |
| ----------- | -------------------------------------- | ------------ | -------------------------------------------- |

## 2.7 Email - Send Invoice to Client

One-click email delivery of invoice with PDF attached directly from the detail page.

- Nodemailer configured with Gmail SMTP via App Password
- Email HTML template includes: business branding, invoice summary table, total due
- PDF auto-generated as Buffer and attached to email
- Client email address pulled from populated client document
- Success message shown on frontend after send
- Error handling if client has no email or SMTP fails

| **Backend** | Nodemailer + sendEmail.js utility | **Frontend** | sendInvoice() API call + success state |
| ----------- | --------------------------------- | ------------ | -------------------------------------- |

## 2.8 Settings Module

Centralised configuration for the application. This was partially implemented - the UI and data persistence work correctly, but the settings are not yet fully wired into all parts of the app (e.g. PDF prefix auto-numbering from settings).

**Note on Settings Implementation**

**The settings part was partially implemented, but I tried to complete it.**

**What was implemented:**

- Business Tab - name, address, email, phone, website, GST number, logo URL
- Tax Tab - tax name (e.g. GST), tax percentage (18%), inclusive/exclusive toggle
- Invoice Tab - prefix, next number, due days, terms & conditions text
- Quote Tab - prefix, next number, valid days, terms & conditions text

**How it works:**

- One Settings document per admin stored in MongoDB (upsert on save)
- GET /api/settings - fetches or auto-creates default settings for the admin
- PUT /api/settings - updates only the tab being saved (\$set with spread)
- Frontend has 4 tabs, each saves independently with its own Save button
- Business settings are consumed by PDF generation (name, address, GST, phone, email)
- Tax settings are consumed by PDF (tax label and percentage in totals section)
- Invoice terms are printed at the bottom of the generated PDF

**What is not yet wired in:**

- Invoice/Quote prefix from settings not yet used in auto-number generation (currently hardcoded QT- and INV-)
- Logo upload - currently accepts URL only, not file upload
- Payment settings tab not implemented (Razorpay, bank details)
- Email settings tab not implemented (template customisation)

| **Backend** | Express + Mongoose Settings model (upsert) | **Frontend** | Tabbed Settings.jsx with per-tab save |
| ----------- | ------------------------------------------ | ------------ | ------------------------------------- |

## 2.9 Dashboard

Overview statistics for the admin on login.

- Total Clients count
- Total Quotes count
- Total Invoices count
- Total Revenue - sum of invoice totals
- All data loaded in parallel using Promise.all for performance

| **Backend** | Reuses existing GET /api/\* endpoints | **Frontend** | Dashboard.jsx + Promise.all |
| ----------- | ------------------------------------- | ------------ | --------------------------- |

# 3\. API Routes Reference

| **Feature**                 | **Status** | **Tech Used**                 |
| --------------------------- | ---------- | ----------------------------- |
| POST /api/auth/login        | Auth       | Admin login, returns JWT      |
| POST /api/auth/register     | Auth       | Admin registration            |
| GET /api/clients            | Clients    | List with pagination & search |
| POST /api/clients           | Clients    | Create new client             |
| PUT /api/clients/:id        | Clients    | Update client                 |
| DELETE /api/clients/:id     | Clients    | Delete client                 |
| GET /api/quotes             | Quotes     | List with pagination & search |
| POST /api/quotes            | Quotes     | Create quote                  |
| GET /api/quotes/:id         | Quotes     | Get single quote              |
| PUT /api/quotes/:id         | Quotes     | Update quote                  |
| DELETE /api/quotes/:id      | Quotes     | Delete quote                  |
| GET /api/invoices           | Invoices   | List all invoices             |
| POST /api/invoices/create   | Invoices   | Create invoice                |
| GET /api/invoices/:id       | Invoices   | Get single invoice            |
| PUT /api/invoices/:id       | Invoices   | Update invoice                |
| DELETE /api/invoices/:id    | Invoices   | Delete invoice                |
| GET /api/invoices/:id/pdf   | Invoices   | Download PDF                  |
| POST /api/invoices/:id/send | Invoices   | Email PDF to client           |
| GET /api/settings           | Settings   | Get admin settings            |
| PUT /api/settings           | Settings   | Update settings (upsert)      |

# 4\. Future Enhancements

## 4.1 AWS S3 - Logo & File Upload

**Implementation Plan**

Replace the current logo URL text field in Business Settings with a real file upload. Files would be stored in an AWS S3 bucket and the public URL saved in the Settings document.

- Install: npm install @aws-sdk/client-s3 multer multer-s3
- Create S3 bucket with public read access for logo images
- Add multer-s3 middleware to handle multipart/form-data uploads
- PUT /api/settings/logo - accepts file, uploads to S3, saves URL to settings.business.logo
- Frontend: replace text input with &lt;input type='file'&gt; and preview the uploaded logo
- PDF generation reads settings.business.logo URL and embeds image using PDFKit's doc.image()

## 4.2 Dynamic Invoice/Quote Numbering from Settings

- Read prefix and nextNumber from Settings before creating invoice/quote
- Format: prefix + nextNumber.toString().padStart(4, '0') → e.g. AKEYI-0128
- Increment nextNumber in Settings after each creation using findOneAndUpdate
- This replaces the current hardcoded QT- and INV- prefixes

## 4.3 Quote to Invoice - Status Auto-Update

- When a quote is converted to an invoice, automatically set quote status to Accepted
- Prevents the same quote from being converted twice
- Add a Converted badge on the Quotes list page

## 4.4 Payment Settings & Razorpay Integration

- Add Payment tab to Settings: currency symbol, Razorpay link, bank details, GPay/PhonePe number
- Print payment methods on the generated PDF invoice
- Optional: integrate Razorpay API for online payment tracking

## 4.5 Email Template Customisation

- Add Email tab to Settings: customise subject line, body, footer for invoice and quote emails
- Use template variables: {client_name}, {invoice_number}, {total}, {due_date}
- Replace/interpolate variables at send time in the email controller

## 4.6 Quote PDF Generation

- Extend the PDF utility to support Quote documents (not just Invoices)
- Add Download PDF and Send to Client buttons on a Quote Detail page
- Reuse the same buildPdf() core with a quote-specific layout

## 4.7 Overdue Invoice Auto-Detection

- Scheduled job (node-cron) runs daily to find invoices past due date with status !== Paid
- Automatically updates status to Overdue
- Optionally sends a payment reminder email to the client

## 4.8 Role-Based Access (RBAC)

- Currently single admin role - add Staff role with read-only access
- Manager role can create/edit but not delete
- Implement using role field on Admin model + role middleware check

## 4.9 Export to CSV

- Add Export CSV button on Invoices and Quotes list pages
- Backend generates CSV using fast-csv or papaparse
- Columns: number, client, date, total, status

## 4.10 Multi-Currency Support

- Add currency field to Settings (INR, USD, EUR, GBP)
- Store currency symbol in Settings and apply throughout UI and PDF
- Optional: integrate exchange rate API for real-time conversion

# 6\. Project Folder Structure

## 6.1 Backend
```

server/

├── controllers/

│ ├── authController.js

│ ├── clientController.js

│ ├── quoteController.js

│ ├── invoiceController.js

│ └── settingsController.js

├── models/

│ ├── Admin.js

│ ├── Client.js

│ ├── Quote.js

│ ├── Invoice.js

│ └── Settings.js

├── routes/

│ ├── authRoutes.js

│ ├── clientRoutes.js

│ ├── quoteRoutes.js

│ ├── invoiceRoutes.js

│ └── settingsRoutes.js

├── middleware/

│ ├── authMiddleware.js

│ ├── errorMiddleware.js

│ └── notFound.js

├── utils/

│ ├── generateInvoicePdf.js

│ ├── generateInvoiceNumber.js

│ └── sendEmail.js

├── app.js

└── server.js
```


## 6.2 Frontend
```
client/src/

├── api/

│ ├── axios.js

│ ├── clientApi.js

│ ├── quoteApi.js

│ ├── invoiceApi.js

│ └── settingsApi.js

├── pages/

│ ├── Dashboard.jsx

│ ├── clients/Clients.jsx

│ ├── quotes/

│ │ ├── Quotes.jsx

│ │ └── QuoteForm.jsx

│ ├── invoices/

│ │ ├── Invoices.jsx

│ │ ├── InvoiceForm.jsx

│ │ └── InvoiceDetail.jsx

│ └── settings/Settings.jsx

├── components/

│ ├── common/ (Card, Button)

│ ├── forms/ (FormInput)

│ ├── modal/ (Modal, ConfirmModal)

│ └── table/ (DataTable, TablePagination)

└── layouts/DashboardLayout.jsx
```
