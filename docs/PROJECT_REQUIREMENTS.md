# Project Requirements: Kids Toy E-commerce (GrowKins Toy World)

## 1. Executive Summary & Business Context

**Project Name:** GrowKins Toy World — Single-Page Kids Toy E-commerce with Dedicated Provider/Admin Panel and Bengali Gemini AI Assistant.  
**Target Market:** Bangladesh-based parents shopping for children aged 1–6 years.  
**Core Philosophy:** Ultra-simple, high-converting, friction-free ordering experience backed by Google Sheets and Google Drive for seamless data persistence without requiring complex database maintenance.

---

## 2. Market & User Behavior Analysis (Bangladesh Context)

### 2.1 Customer Behavior & Purchasing Habits
* **Mobile-First Dominated:** Over 85% of Bangladesh e-commerce traffic originates from mobile devices (Android/iOS). Navigation and forms must be single-thumb friendly with large touch targets (min 44px).
* **Frictionless Checkout (No Account Creation):** Requiring account registration or passwords causes over 60% cart abandonment in Bangladesh. Checkout must require only:
  * Customer Name (নাম)
  * Mobile Phone Number (11-digit Bangladesh phone number: `01XXXXXXXXX`)
  * Delivery Address (পূর্ণ ঠিকানা, জেলা/থানা/এরিয়া)
* **Cash on Delivery (COD) as Standard:** Customers overwhelmingly prefer Cash on Delivery (ক্যাশ অন ডেলিভারি). Transparent delivery charge display (ঢাকার ভিতরে vs ঢাকার বাইরে) upfront prevents checkout bounce.
* **Visual Trust & Demonstration:** Parents need to see how the toy works before purchasing. Video demonstrations (YouTube embeds / shorts / clips) drastically increase conversion.
* **Bangla-First Interface:** All customer-facing text, checkout labels, buttons, alerts, and AI chatbot responses must be in natural, friendly Bengali (বাংলা), while retaining recognized brand or product titles in English/Bangla.

### 2.2 Common Checkout Abandonment Triggers & Solutions
| Abandonment Trigger | GrowKins Solution |
| :--- | :--- |
| Multi-step complicated checkout | Single-page direct checkout located right below the product catalog |
| Hidden or surprising delivery fees | Live delivery fee radio toggle (ঢাকা: ৳৭০, ঢাকার বাইরে: ৳১৩০) updating the total dynamically |
| Uncertainty about product features | YouTube demonstration modal + Floating Gemini AI assistant for instant answers in Bengali |
| Slow page load on 3G/4G | Lightweight React + Tailwind bundle, optimized image delivery from Google Drive CDN |

---

## 3. Scope of the System

The system encompasses two main functional spaces and an intelligent AI layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GrowKins Ecosystem                              │
├───────────────────────────────┬────────────────────────────────────────┤
│ 1. Customer-Facing Storefront │ 2. Provider / Admin Management Portal   │
│    Route: /growkins-toy-world │    Route: /provider & /admin           │
│    - 20 Curated Toy Products  │    - Real-time Order Stream            │
│    - YouTube Video Demo Modal │    - Customer & Location Details       │
│    - Multi-Item Selection & Qty│   - Order Status Transition           │
│    - On-Page Direct COD Form  │    - Product CRUD & Price Updates      │
│    - Floating Gemini Bengali  │    - Delivery Settings Control         │
│      Chatbot (Sheets RAG)     │    - Google Sheets / Drive Sync Status │
├───────────────────────────────┴────────────────────────────────────────┤
│ 3. Data & Storage Engine: Google Sheets (Database) + Drive (Media)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Functional Requirements

### 4.1 Customer Storefront (`/growkins-toy-world`)
1. **Curated Showcase:** Display 20 high-demand educational and Montessori-style toys dynamically loaded from Google Sheets.
2. **Product Presentation:**
   * High-resolution product imagery from Google Drive CDN.
   * Product Name, Bengali tagline, Age suitability badge (e.g., "২-৫ বছর").
   * Regular price and promotional discount badge (compare-at price).
   * Key features and learning benefits list.
   * "ভিডিও দেখুন" (Watch Video) button opening a responsive YouTube modal.
3. **Multi-Product Selection & Cart Engine:**
   * Direct "অর্ডার করুন" (Select Item) button.
   * Instant quantity increment/decrement controls.
   * Live subtotal calculation in Bangladeshi Taka (৳).
   * Floating/sticky cart summary bar with quick-scroll to checkout.
4. **On-Page Direct Checkout Form:**
   * Customer Name field.
   * 11-digit mobile phone validator (`01XXXXXXXXX`).
   * District / Area / Detailed street address.
   * Delivery zone selector with dynamic charge update (ঢাকার ভিতরে: ৳৭০, ঢাকার বাইরে: ৳১৩০).
   * Clear Grand Total calculation (`Subtotal + Delivery Charge`).
   * "অর্ডার কনফার্ম করুন" (Confirm Order) single-click submission with anti-double-click guard.
5. **Instant Order Confirmation Screen:**
   * Bengali confirmation banner with celebratory animation.
   * Unique Order Tracking ID (e.g., `GK-2026-XXXX`).
   * Order item summary, delivery address snapshot, and expected delivery timeline (ঢাকার ভিতরে ১-২ দিন, ঢাকার বাইরে ২-৪ দিন).

### 4.2 Bengali Gemini AI Chatbot
1. **Floating Trigger:** Bottom-right floating badge with friendly toy mascot icon.
2. **Product Knowledge Sync (RAG):** Backend compiles active products from Google Sheets into a structured knowledge context.
3. **Strict Fact-Checked Bengali Responses:** Powered by Google Gemini API using `@google/genai`.
   * Answers questions regarding age suitability, material safety, price, and usage.
   * Strict instruction never to hallucinate or invent prices/products.
   * Automatic graceful fallback in Bengali if information is not found in the catalog.

### 4.3 Provider / Admin Portal (`/provider` & `/admin`)
1. **Simplified Provider View (`/provider`):**
   * Secure passcode / lightweight authentication.
   * Streamlined real-time order table showing:
     * Order Number & Timestamp
     * Customer Name & Click-to-Call Phone Number
     * Full Delivery Location & Zone
     * Ordered Items list, quantities, and line totals
     * Total Amount & COD indicator
     * Order status dropdown (`Pending`, `Confirmed`, `Processing`, `Delivered`, `Cancelled`)
   * Quick search by phone number or order ID.
2. **Full Admin Control (`/admin`):**
   * Manage Products (Add, Edit, Update Price, YouTube Video Link, Stock Status).
   * Manage Delivery Charges.
   * View sales analytics and Google Sheets sync health.

---

## 5. Non-Functional Requirements

* **Performance:** First Contentful Paint (FCP) < 1.2s; Time to Interactive (TTI) < 2.0s on standard 4G networks.
* **Security:**
  * Server-side price recalculation: The server retrieves canonical product prices from Google Sheets and calculates final totals; client-side price manipulation is strictly ignored.
  * API Rate Limiting on checkout and AI chat endpoints to prevent spam/abuse.
  * Google Service Account credentials stored strictly on the backend server, never exposed in frontend code.
* **Reliability:** Dual-mode service architecture (Mock fallback for local development + Google Sheets API for production persistence).
* **Cross-Browser & Device Compatibility:** Flawless rendering on mobile screens (360px–430px), tablets (768px–1024px), and desktop viewports.

