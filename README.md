# Invoice Management App

A fully functional and responsive Invoice Management Application built with React and Vite. This project allows users to create, manage, and track invoices with features like filtering, status management, and a built-in light/dark mode. 

##  Features and Functionalities

### 1. Invoice Management (CRUD)
- **Create Invoices:** Open an intuitive form to fill out client details, items, and pricing.
- **Read Invoices:** View a comprehensive list of all invoices or click on a specific invoice to view its full details.
- **Update Invoices:** Edit existing invoices and persist updated values.
- **Delete Invoices:** Remove invoices with a confirmation modal to prevent accidental deletions.

### 2. Form Validations
- Strict form validation ensures data integrity before submission.
- Prevents submission if required fields are empty, email formats are invalid, or if item quantities and prices are not positive numbers.
- Displays clear error messages and visual error states for invalid fields.

### 3. Draft & Payment Flow
- **Three Statuses:** Invoices can be marked as `Draft`, `Pending`, or `Paid`.
- **Save as Draft:** Users can save an incomplete invoice as a Draft to edit later.
- **Mark as Paid:** Pending invoices can be updated to Paid once settled. (Note: Paid invoices cannot be reverted to Draft).
- Statuses are clearly reflected in both the list and detail views with distinct badge colors and styles.

### 4. Filter by Status
- Intuitive checkbox filtering allows users to view invoices by status (`All`, `Draft`, `Pending`, `Paid`).
- The filtered state updates the invoice list immediately.
- Displays a dedicated empty state illustration when no invoices match the selected filter.

### 5. Light & Dark Mode
- Global toggle between light and dark themes.
- Theme preferences are persisted in `LocalStorage`, ensuring the user's choice is remembered across sessions.
- Designed with good color contrast in both modes for optimal readability.

### 6. Fully Responsive Design
- The layout adapts seamlessly across devices:
  - **Mobile:** 320px+
  - **Tablet:** 768px+
  - **Desktop:** 1024px+
- Forms are highly usable on mobile devices with no horizontal overflow.

### 7. Interactive UI & Accessibility
- Visible hover states on all interactive elements (buttons, links, list items, status filters, form inputs).
- Built with semantic HTML and proper accessibility practices.
- Modals trap focus, close via the ESC key, and are keyboard navigable.

### 8. Data Persistence
- Invoice data and application state are persisted using `LocalStorage` (or Context API), ensuring data is not lost upon page reload.

##  Tech Stack
- **Framework:** React (Vite)
- **Styling:** CSS / Context API for Theme Management
- **State Management:** React Context API & LocalStorage

##  Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd STAGE2TASK
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

##  Architecture & Component Structure
- **App/Main:** Entry point wrapped with Theme and Invoice Context Providers.
- **Pages:** 
  - `InvoiceList`: Displays the list of invoices and handles filtering.
  - `InvoiceDetail`: Shows the full details of a single invoice.
- **Components:**
  - `InvoiceForm`: Reusable form for creating and editing invoices.
  - `Sidebar`: Navigation and theme toggle.
  - `FilterDropdown`: Component to handle status filtering.
  - `StatusBadge`: Visual indicator for invoice statuses.
  - `DeleteModal`: Confirmation dialog for deletions.
- **Contexts:**
  - `InvoiceContext`: Manages the global state of invoices and CRUD operations.
  - `ThemeContext`: Manages the light/dark mode state.

##  Accessibility Notes
- Proper semantic tags are used throughout the application.
- Form fields are associated with `<label>` tags.
- Buttons use the native `<button>` element.
- The Delete Modal supports keyboard navigation and ESC key closing.
- Colors are chosen to meet WCAG AA contrast standards in both Light and Dark modes.
