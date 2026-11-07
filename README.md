# Sunshine Restaurant Platform
> **"Good food. Great moments."**  
> An enterprise-grade, responsive full-stack restaurant platform featuring an artisanal Customer Experience and an Admin Restaurant Management Console.

Built for the **CodeOrbit Tech Web Development Internship** (Task: Responsive Landing Page / Restaurant Web Application).

---

## 📌 Project Overview

**Sunshine Restaurant** is a responsive restaurant web application featuring a premium customer dining experience, interactive menu and ordering flow, reservations, events, customer reviews and ratings, location integration, and a secure role-based admin portal for managing restaurant content and operations.

Instead of a basic static landing page, this application bridges two distinct, interconnected experiences sharing a unified reactive data layer (`sunshine_db`):
1. **A Customer Experience**: A dining website with a responsive landing page, interactive digital menu, real-time filters, customizable food detail modals, a slide-over cart drawer, table/room reservation with live capacity checks, automatic 5-character token generation, downloadable confirmation vouchers, token-based reservation tracking, and events booking.
2. **An Admin Restaurant Management Portal**: A SaaS management console with KPI metrics cards, interactive charts, full booking management (search, filters, status transitions, CSV export), front-desk 5-digit token verification with one-click guest check-in, manual walk-in booking entry, menu management with live availability toggling, event management, time slot capacity management, table & room pricing configuration, customer CRM directory, and business settings.

> ⚠️ **Important Demo Data Notice**: All business data, customer records, revenue figures (e.g., ₹48,650), and initial reservations are simulated **demo data** for internship evaluation and demonstration purposes.

---

## 🚀 Key Features

### 🌟 Customer Experience
- **Responsive Landing Page**:
  - Hero section with food photography, brand tagline (*"Good food. Great moments."*), and quick actions (*Explore Menu*, *Book a Table*).
  - Restaurant Story & Culinary Heritage with interactive trust metrics (15+ Years of Excellence, 4.9★ rating).
  - Dining Spaces & Venues showcase (Grand Dining Hall, VIP Family Booths, Private AC Banquet Suites, Courtyard Hall).
  - Chef's Signature Specials carousel and interactive dishes.
  - Upcoming Special Nights & Live Music Events preview.
  - Full-featured Footer with operational hours, Google Maps location mock, WhatsApp concierge, and newsletter subscription.
- **Interactive Digital Menu**:
  - Categorized browsing: *Starters*, *Main Course*, *Breads*, *Rice & Biryani*, *Desserts*, *Beverages*.
  - Multi-attribute filtering: Pure Veg, Non-Veg, Popular, Spicy, Chef's Special.
  - Live instant search with real-time matching across dish names, categories, and ingredients.
  - Real-time availability indicator (*"Currently Unavailable"* badge when toggled by Admin).
- **Food Detail & Customization Modal**:
  - High-resolution dish photography with spice level meter.
  - Artisanal ingredient tags and dietary classification.
  - Customizable add-ons with reactive price recalculation (e.g., Extra Cheese Melt, Mint Dip, Spicy Chutney).
  - Quantity selector and instant addition to the cart.
- **Functional Dining Cart**:
  - Slide-over drawer and dedicated `/cart` page.
  - Quantity controls (`+` / `-`), individual item removal, and full cart clearing.
  - Automated calculation of subtotal, restaurant GST (5%), and total in Indian Rupees (₹ INR).
  - Special kitchen instructions and dietary request input.
  - Seamless continuation to table reservation.
- **Table & Room Reservation Flow**:
  - Interactive schedule picker (date and real-time operational time slots with remaining seat counts).
  - Headcount selection (1 to 30 guests).
  - Occasion type: *Dining*, *Birthday*, *Anniversary*, *Family Gathering*, *Private Event*.
  - Space selection: *Normal Dining*, *VIP Lounge Booth*, *AC Private Room (Recommended)*, *Courtyard Hall (Budget Friendly)* with automatic price calculation.
- **Booking Confirmation & 5-Character Token**:
  - Immediate generation of unique Booking ID (e.g., `SUN-2026-00128`).
  - Generation of unique 5-character verification token (e.g., `A7K42`).
  - Printable / Downloadable official reservation voucher (`window.print()`).
  - Token copy-to-clipboard button.
- **Customer Token Status Verification**:
  - Real-time status lookup using Booking ID or 5-character token.
  - Interactive 4-step lifecycle timeline: *Created* ➔ *Confirmed* ➔ *Checked In* ➔ *Completed*.
- **Special Events & Dining Nights**:
  - Featured spotlight event (e.g., Weekend Candlelight Dinner, Live Acoustic Sufi Night, Grand Family Sunday Brunch).
  - Real-time seats remaining counter and direct event reservation.

---

### 🛡️ Admin Restaurant Management Portal
- **Admin Authentication**:
  - Dedicated login screen with brand styling.
  - Pre-filled one-click demo credentials button.
  - Session persistent in browser storage.
- **Executive Dashboard**:
  - **KPI Metric Cards**: Total Bookings (128+), Today's Bookings (24), Confirmed, Pending, Cancelled, Today's Revenue (₹48,650).
  - **Interactive Visual Charts**:
    - Weekly Bookings Overview bar chart.
    - Hourly Peak Revenue trend breakdown (Lunch vs. Dinner vs. AC Banquets).
    - Booking Status doughnut distribution.
    - Popular Dishes revenue and order volume ranking.
  - **Recent Bookings Quick Actions**: One-click *Confirm*, *Check In*, *Cancel*, and *View Details*.
- **Comprehensive Bookings Management**:
  - Real-time searchable and filterable table (search by customer, phone, Booking ID, or token).
  - Multi-filtering by date, booking status, and occasion type.
  - View full customer notes and dietary requests.
  - Inline Edit Modal (change date, time, guests, room type, status).
  - Export all filtered reservations to **CSV**.
- **Token Verification & Guest Check-In**:
  - Front-desk scanner interface for 5-digit verification tokens.
  - Instant token lookup displaying customer name, booking ID, time, guests, and format.
  - One-click **"Check In Customer Now"** button that updates the reservation status to `Checked In` across the entire application.
- **Manual Booking Entry**:
  - Front-desk form for telephone, email, and walk-in reservations.
  - Inputs for Customer Name, Phone, Occasion Type, Space Format, Date, Shift Slot, Headcount, and Calculated Price.
  - Assigns an immediate verification token and adds the guest to the database.
- **Menu Management**:
  - Add new dishes, edit existing recipes, delete items.
  - **Live Availability Toggle**: Instantly disables/enables dishes on the customer menu.
- **Event Management**:
  - Create and edit promotional events with title, dates, hours, discount badges, and seat capacities.
- **Time Slot & Capacity Management**:
  - Manage restaurant operational shifts (start time, end time, max bookings, available capacity).
  - Toggling or filling a slot automatically disables it in the customer booking flow.
- **Table & Room Pricing**:
  - Dynamic pricing controls for Normal Seat Price, VIP Seat Price, AC Room Price, and Non-AC Room Price.
  - Changes immediately update quotes across customer reservations.
- **Customer CRM Directory**:
  - Guest directory tracking lifetime visits, total spend, contact information, and last visit date.
  - Customer profile modal showing their complete historical reservation record.
- **Business Settings**:
  - Restaurant Name, Tagline, Phone, WhatsApp concierge number, Address, Operating Hours, and About Text.
  - **"Reset Factory Demo Data"** button to restore initial sample state at any point during evaluation.

---

## 💻 Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | Modular component architecture, hooks, and context |
| **Vite 5** | High-performance development server and optimized production bundler |
| **Tailwind CSS 3** | Custom design system, responsive typography, and glassmorphic effects |
| **React Router DOM 6** | Declarative client-side routing with clean URLs |
| **Lucide React** | Modern, accessible iconography |
| **LocalStorage State Layer** | Cross-tab reactive persistence (`sunshine_restaurant_db_v1`) |

---

## 📂 Project Structure

```
CodeOrbit_SunshineRestaurant/
├── public/
│   ├── favicon.svg               # Brand vector icon
│   └── images/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.jsx   # Topbar with quick actions & date
│   │   │   ├── AdminLayout.jsx   # Protected layout & responsive drawer
│   │   │   └── AdminSidebar.jsx  # Sidebar navigation
│   │   ├── common/
│   │   │   ├── DemoSwitcher.jsx  # Floating Evaluation Demo Switcher
│   │   │   ├── Footer.jsx        # Landing page footer with internship attribution
│   │   │   └── Navbar.jsx        # Glassmorphic header with cart badge
│   │   └── customer/
│   │       ├── CartDrawer.jsx    # Slide-over cart drawer with tax calculation
│   │       ├── EventCard.jsx     # Event card with discount badges
│   │       ├── FoodDetailModal.jsx # Dish details & add-ons customizer
│   │       └── MenuCard.jsx      # Food card with veg/spice/availability indicators
│   ├── context/
│   │   ├── AuthContext.jsx       # Mock admin authentication & session
│   │   ├── RestaurantContext.jsx # Central state: menu, bookings, events, slots, pricing, cart
│   │   └── ToastContext.jsx      # Non-blocking notification toasts
│   ├── data/
│   │   └── initialData.js        # Seed demo dataset with Indian cuisine items
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminBookingsPage.jsx
│   │   │   ├── AdminCustomersPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminEventsPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminManualBookingPage.jsx
│   │   │   ├── AdminMenuPage.jsx
│   │   │   ├── AdminPricingPage.jsx
│   │   │   ├── AdminSettingsPage.jsx
│   │   │   ├── AdminTimeSlotsPage.jsx
│   │   │   └── AdminTokenVerificationPage.jsx
│   │   └── customer/
│   │       ├── AboutPage.jsx
│   │       ├── BookingConfirmationPage.jsx
│   │       ├── BookingStatusPage.jsx
│   │       ├── CartPage.jsx
│   │       ├── ContactPage.jsx
│   │       ├── EventsPage.jsx
│   │       ├── HomePage.jsx
│   │       ├── MenuPage.jsx
│   │       └── ReservationPage.jsx
│   ├── styles/
│   │   └── index.css             # Tailwind directives & glass utilities
│   ├── utils/
│   │   ├── formatters.js         # INR currency, token & date utilities
│   │   └── storage.js            # Safe localStorage wrapper with custom events
│   ├── App.jsx                   # Central route configurations
│   └── main.jsx                  # React application entry point
├── test-app.js                   # Automated business logic test suite
├── index.html                    # HTML document with Google Fonts & SEO
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Custom color palette & fonts
├── vite.config.js                # Vite build configuration
└── README.md
```

---

## 🛠️ How to Install & Run

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone or Extract Repository
```bash
git clone https://github.com/NagaAswith/CodeOrbit_Sunshine-Restaurant.git
cd CodeOrbit_Sunshine-Restaurant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at:
```
http://localhost:5173/
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

## 🔒 Admin Authentication & Environment Configuration

Authentication credentials are configured through server-side environment variables. In strict adherence to security best practices for public repositories, no actual passwords, password hashes, salts, or private tokens are stored in the repository.

### Environment Configuration

To configure administrative access and server signing keys locally:
1. Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure the required server-side environment variables:

| Variable | Description |
|---|---|
| `SESSION_SECRET` | 32+ character cryptographically secure key for HMAC session signing |
| `SUPER_ADMIN_EMAIL` | Authorized email address for Super Administrator |
| `SUPER_ADMIN_PASSWORD_HASH` | PBKDF2-SHA512 hashed password (100,000 iterations) |
| `SUPER_ADMIN_SALT` | 16-byte cryptographic hex salt for Super Admin |
| `STANDARD_ADMIN_EMAIL` | Authorized email address for Standard Administrator |
| `STANDARD_ADMIN_PASSWORD_HASH` | PBKDF2-SHA512 hashed password for Standard Admin |
| `STANDARD_ADMIN_SALT` | 16-byte cryptographic hex salt for Standard Admin |

> 🔒 **Security Notice**: Never commit `.env` or any file containing actual passwords, hashes, salts, or API keys. The `.gitignore` file is configured to strictly exclude `.env` and `.env.*` files (preserving `.env.example` as a template).

---

## 🛡️ Security Notes

The platform implements multi-layered security controls:
- **Zero Secret Exposure**: Public repository contains no passwords, hashes, salts, or active tokens.
- **PBKDF2-SHA512 Password Hashing**: Passwords are authenticated using PBKDF2 with HMAC-SHA512, 100,000 iterations, and unique cryptographic salts.
- **HMAC-SHA256 Session Management**: Authenticated sessions utilize signed HttpOnly, SameSite=Lax cookies, verified server-side with constant-time equality checks (`crypto.timingSafeEqual`).
- **Brute-Force Rate Limiting**: Administrative endpoints enforce strict rate limiting (maximum 5 failed login attempts per 15-minute window per IP) to mitigate credential stuffing and dictionary attacks.
- **Role-Based Access Control (RBAC)**: Enforces clear separation of duties between Super Administrator (full CMS, settings, tariff controls) and Standard Administrator (day-to-day operations and moderation).
- **CSRF & Origin Protection**: All mutation endpoints validate request origins against trusted hosts.
- **Input Sanitization**: User inputs, reviews, and booking notes are sanitized against Cross-Site Scripting (XSS).

---

## 📸 Image Management Architecture & Storage Limitations

- **Image URL Support**: Admins can paste any valid image URL (`http://` or `https://` from CDN, Unsplash, etc.) with real-time URL validation and image loading status indicators.
- **Local Device Upload**: Admins can directly upload images from PC, laptop, or mobile (`JPG`, `PNG`, `WEBP`) using the standard file picker.
- **Client-Side Optimization**: Uploaded images are read via `FileReader` and dynamically resized using HTML5 Canvas to a maximum dimension of 800px at high visual fidelity. This ensures fast rendering and fits comfortably within browser `localStorage` quotas without requiring external third-party cloud services like AWS S3 or Cloudinary for local demonstration.
- **Production Recommendation**: For a multi-tenant or heavy-production environment, uploaded files should be streamed directly to an object storage bucket (e.g., Amazon S3, Google Cloud Storage, or Cloudinary).

---

## ⭐ Customer Feedback & Review Moderation System

- **Customer Feedback & Reviews (`/reviews`)**:
  - Customers can submit 1–5 star reviews across categories (*Food*, *Service*, *Ambience*, *Overall Experience*, *Staff*, *Booking Experience*).
  - Client-side validation ensures valid input, character length constraints, and email validation.
  - Dynamically calculates the live average star rating and verified review count.
- **Admin Review Moderation (`/admin/reviews`)**:
  - All new customer submissions enter a `Pending` state for moderation.
  - Admins can search, filter by status, category, and rating.
  - Actions include **Publish** (approves review for public display), **Hide**, and **Delete**.

---

## 🗺️ Google Maps Location Feature

- **Configurable Location**: The restaurant's physical address and official Google Maps URL are configurable by the Admin in **Business Settings (`/admin/settings`)**.
- **Customer Navigation**: Clicking the interactive map card or the *"View Location on Google Maps"* button in the Contact page and Footer triggers `window.open(url, '_blank', 'noopener,noreferrer')` to launch Google Maps with turn-by-turn navigation.

---

## 📱 Responsive Form Factors Tested

The application layout is fully responsive across all standard breakpoints:
- **1440px / 1280px (Desktop)**: Full grid layouts, sticky navigation, visible sidebar.
- **1024px (Laptops & Tablets Landscape)**: Adapted column ratios and flexible modals.
- **768px (Tablets Portrait)**: Stacked cards, responsive drawer menus, scrollable tabs.
- **430px / 390px / 360px (Mobile)**:
  - Collapsible mobile navigation drawer.
  - Single-column food cards.
  - Touch-optimized quantity steppers and add-to-cart buttons.
  - Device file upload supported via native mobile image picker.

---

## 🔄 Recommended Evaluation Demo Flow

1. **Explore Customer Landing Page (`/`)**:
   - Check the Hero section, Restaurant Story, Dining Spaces, Chef's Specials, and live calculated rating in the trust bar.
2. **Order from the Menu (`/menu`)**:
   - Filter by *Main Course*, view dietary badges (*Veg* / *Non-Veg*), and search for dishes.
   - Click on *Paneer Tikka*, click **[ + Add to Order ]** to open customization with add-ons and adjust quantities, and add to cart.
   - Observe how items marked *Out of Stock* remain visible with clear badges and disabled purchase buttons.
3. **Reserve a Table (`/reservation`)**:
   - Choose a date and shift time slot.
   - Select party size and space (*VIP Table* or *AC Room*).
   - Submit the booking and observe the **Booking Confirmation** with your auto-generated **5-character token** (e.g., `A7K42`).
4. **Submit Feedback (`/reviews`)**:
   - Submit a 5-star review for your dining experience. Notice the confirmation message and that it enters moderation.
5. **Admin Portal Login (`/admin/login`)**:
   - Click the **ShieldCheck** icon in the header.
   - Enter your configured administrative credentials (configured in `.env`) and sign in.
6. **Moderate Reviews (`/admin/reviews`)**:
   - Find your newly submitted feedback in the *Pending* tab and click **Publish**.
   - Switch to the customer `/reviews` page to see it live with recalculated ratings!
7. **Menu & Stock Management (`/admin/menu`)**:
   - Edit an item: upload a photo from your device, change spice level (🌶🌶🌶 Hot), or toggle availability (*Out of Stock*).
   - Verify changes reflect immediately across the customer menu.

---

## 🎓 Internship Project Details

- **Program**: CodeOrbit Tech Web Development Internship
- **Project**: Sunshine Restaurant Platform (`CodeOrbit_SunshineRestaurant`)
- **Developer**: Antigravity Full-Stack AI Engineer
- **Repository**: [`CodeOrbit_Sunshine-Restaurant`](https://github.com/NagaAswith/CodeOrbit_Sunshine-Restaurant)
- **Status**: Production Ready & Fully Verified
