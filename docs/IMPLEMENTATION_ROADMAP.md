# Implementation Roadmap & Phase-by-Phase Plan

## 1. Overview & Strategy

This roadmap outlines the complete execution lifecycle for GrowKins Toy World. In strict compliance with Prompt 0 and the user's instructions:
* **No Unnecessary Abstractions:** Maintain the simple, working Google Sheets & Drive backend architecture.
* **Bangla-First & Mobile-First:** Every customer touchpoint is optimized for mobile purchasing in Bangladesh.
* **Strict Phase Gates:** Each phase has a clear Definition of Done (DoD) that must be verified before proceeding to the next.

---

## 2. Phase-by-Phase Breakdown

```
Phase 1: Architecture & Requirements (Current Phase - Completed)
   │
   ▼
Phase 2: Project Foundation & Routing Setup
   │
   ▼
Phase 3: Backend & Google Sheets Service Preparation
   │
   ▼
Phase 4: Provider Order Panel UI (/provider)
   │
   ▼
Phase 5: High-Converting Landing Page (/growkins-toy-world)
   │
   ▼
Phase 6: End-to-End Checkout, Order Placement & COD Verification
   │
   ▼
Phase 7: Bengali Gemini AI Chatbot with Sheets-Backed RAG
   │
   ▼
Phase 8: System Integration, Cross-Device Testing & Production Verification
```

---

### Phase 1: Requirements Analysis & System Architecture
* **Status:** Complete
* **Deliverables:**
  * `docs/PROJECT_REQUIREMENTS.md`
  * `docs/SYSTEM_ARCHITECTURE.md`
  * `docs/DATABASE_SCHEMA.md`
  * `docs/API_DOCUMENTATION.md`
  * `docs/USER_FLOWS.md`
  * `docs/IMPLEMENTATION_ROADMAP.md`
* **Definition of Done:** Full architecture documented, approved, and aligned with Google Sheets backend and business goals.

---

### Phase 2: Project Foundation & Routing Setup
* **Objective:** Establish the sub-application routing within `App.tsx` and verify the foundation builds cleanly without breaking existing routes (`/`, `/clothing`, `/admin`).
* **Tasks:**
  1. Add routing branches in `App.tsx`:
     * Route `/growkins-toy-world` -> `<GrowKinsToyWorldApp />`
     * Route `/provider` -> `<ProviderApp />`
  2. Create placeholder modular directory structures:
     * `src/components/toy-world/`
     * `src/components/provider/`
  3. Verify Vite development server and build scripts pass without TypeScript/oxlint errors.
* **Definition of Done:** Visiting `/growkins-toy-world` and `/provider` renders their respective foundational component shells; existing storefront and `/admin` remain 100% operational.

---

### Phase 3: Backend & Google Sheets Service Preparation
* **Objective:** Ensure Google Sheets & Drive services in `utills-server` support all required fields (YouTube video URL, age badges, simplified order intake) and verify mock service parity.
* **Tasks:**
  1. Verify Google Sheets connection in `utills-server` (`Products`, `Orders`, `Settings` worksheets).
  2. Ensure `Products` worksheet columns support `videoUrl` (YouTube embed/watch link) and `ageBadge`.
  3. Prepare order validation in `orderController.js` for Bangladesh phone numbers and delivery zones (`inside_dhaka` / `outside_dhaka`).
  4. Ensure `MockProductService` and `MockOrderService` in `src/services/mock/` contain 20 initial toy items for flawless offline testing.
* **Definition of Done:** Backend health check returns 200; mock and live service contracts match `IProductService` and `IOrderService`.

---

### Phase 4: Provider Order Panel UI (`/provider`)
* **Objective:** Build the focused order fulfillment dashboard for warehouse/delivery managers.
* **Tasks:**
  1. Build lightweight provider header with quick stats (Total Orders, Pending, Delivered).
  2. Build Orders Table / Mobile Card View showing:
     * Order Number & Timestamp.
     * Customer Name & Click-to-Call Phone (`tel:...`).
     * Full Delivery Location & Delivery Zone tag.
     * Ordered Items list with quantities and unit prices.
     * Grand Total & Cash on Delivery (COD) badge.
  3. Add interactive status dropdown (`Pending` -> `Confirmed` -> `Shipped` -> `Delivered`).
  4. Implement live search by phone number or order number.
  5. Add lightweight passcode guard for access security.
* **Definition of Done:** Provider can open `/provider`, view list of orders with customer contact and location details, search by phone, and update order fulfillment status.

---

### Phase 5: High-Converting Landing Page (`/growkins-toy-world`)
* **Objective:** Build the single landing page inspired by the reference site (`babieshavenbd.com/boxingbuddy`) featuring 20 curated toys.
* **Tasks:**
  1. **Branded Hero Section:** Catchy Bengali headline, trust badges (Non-toxic wood, 100% safe, fast delivery), and "অর্ডার করতে নিচে যান" CTA.
  2. **20 Toy Products Showcase:**
     * Responsive 1-col (mobile) / 3-col (desktop) grid.
     * Product image preview with zoom/hover.
     * Age suitability badge (e.g., `২-৫ বছর`).
     * Bengali subtitle & key benefits bullets.
     * Price & Cut-off discount badge (৳).
     * "ভিডিও দেখুন" (Watch Video) button opening responsive YouTube modal.
     * "অর্ডার করুন" (Select Item) with live quantity stepper (+ / -).
  3. **YouTube Video Modal:** Responsive 16:9 iframe embed supporting YouTube watch/shorts links with auto-close and backdrop blur.
  4. **Why Choose Us Section:** Safety certificates, safe materials, and cash on delivery guarantee.
  5. **Sticky Bottom Order Bar:** Shows selected items count, live subtotal (৳), and "অর্ডার সম্পন্ন করুন" button scrolling directly to checkout.
* **Definition of Done:** Storefront loads 20 products dynamically, displays images and YouTube video modals, and allows multi-product selection with responsive mobile view.

---

### Phase 6: Checkout, Order Placement & COD Verification
* **Objective:** Connect the on-page checkout form to the backend/Sheets order creation API.
* **Tasks:**
  1. Build the single-page checkout form:
     * Full Name field.
     * Mobile Number field with strict Bangladesh validation (`01XXXXXXXXX`).
     * Detailed Address field (House, Road, Area, District).
     * Delivery Zone selector (ঢাকার ভিতরে ৳৭০ / ঢাকার বাইরে ৳১৩০).
     * Optional delivery note.
  2. Real-time Order Summary table displaying selected items, unit prices, line totals, delivery fee, and grand total.
  3. Prevent double-submission with loading state on "অর্ডার কনফার্ম করুন".
  4. Connect `POST /api/growkins/orders` API and local mock fallback.
  5. Build celebratory Order Confirmation Modal with Order ID and estimated delivery timeline.
  6. Immediate reflection in `/provider` order queue.
* **Definition of Done:** Customer can select toys, fill the form, click submit, and receive an instant order number. The order appears in Google Sheets and `/provider` with exact customer address and correct total.

---

### Phase 7: Bengali Gemini AI Chatbot with Sheets-Backed RAG
* **Objective:** Implement the floating Gemini AI assistant using `@google/genai` powered by real-time product data.
* **Tasks:**
  1. Install `@google/genai` on the backend server.
  2. Create dynamic in-memory Product Knowledge generator that reads active toys from Google Sheets into markdown format.
  3. Implement `POST /api/growkins/chat` controller with strict Bengali system prompt:
     * Zero hallucination policy.
     * Facts restricted strictly to active toys in the catalog.
     * Polite, natural Bengali tone.
  4. Build floating React chatbot widget:
     * Mascot toggle button at bottom-right.
     * Animated chat window with warm Bengali greeting.
     * Typing indicators and error fallbacks.
* **Definition of Done:** Customer asks questions about toy age recommendations, prices, or materials in Bengali, and receives accurate, polite answers based exclusively on the current catalog.

---

### Phase 8: System Integration, QA & Production Readiness
* **Objective:** Comprehensive testing across mobile, tablet, and desktop viewports, security audit, and deployment readiness.
* **Tasks:**
  1. Test all 10 user scenarios (single item, multi-item, invalid phone, inside/outside Dhaka, price tampering attempt).
  2. Mobile responsiveness verification on 360px, 390px, 768px, and 1280px viewports.
  3. Production build verification (`npm run build`).
  4. Final deployment documentation for Vercel/Node.js host with Google Sheets service account.
* **Definition of Done:** Zero console or lint errors; production build succeeds; all customer and admin journeys pass end-to-end testing.

