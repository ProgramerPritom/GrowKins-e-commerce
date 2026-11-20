# User Flows: GrowKins Kids Toy E-commerce

## 1. Flow 1: Customer Storefront Journey (`/growkins-toy-world`)

This flow is designed for zero-friction ordering inspired by high-converting Bangladeshi e-commerce landing pages.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Parent / Customer
    participant Page as Landing Page (/growkins-toy-world)
    participant VideoModal as YouTube Video Modal
    participant Checkout as On-Page Checkout Section
    participant API as Express API Server
    participant Sheets as Google Sheets

    Customer->>Page: Lands on /growkins-toy-world (Mobile/Desktop)
    Page->>Page: Dynamically loads 20 active toys from Google Sheets
    Customer->>Page: Scrolls through curated toy collection
    opt Watch Demonstration
        Customer->>Page: Clicks "ভিডিও দেখুন" (Watch Video)
        Page->>VideoModal: Opens responsive YouTube embed
        Customer->>VideoModal: Watches toy features & demo, closes modal
    end
    Customer->>Page: Clicks "অর্ডার করুন" (Add to selection) on Toy 1
    Customer->>Page: Adjusts quantity (e.g. 2 pcs)
    Customer->>Page: Selects Toy 2 (1 pc)
    Page->>Page: Updates sticky bottom summary bar with live subtotal (৳)
    Customer->>Page: Clicks "অর্ডার কনফার্ম করতে এগিয়ে যান" (Scrolls to Form)
    Customer->>Checkout: Enters Name ("রাফি আহমেদ")
    Customer->>Checkout: Enters Mobile Number ("017XXXXXXXX")
    Customer->>Checkout: Enters Full Address & District
    Customer->>Checkout: Selects Delivery Area ("ঢাকার ভিতরে - ৳৭০")
    Checkout->>Checkout: Instantly updates Grand Total (Subtotal + ৳70)
    Customer->>Checkout: Clicks "অর্ডার কনফার্ম করুন" (Cash on Delivery)
    Checkout->>API: POST /api/growkins/orders
    API->>Sheets: Validates price, calculates total, saves order row
    API-->>Checkout: Order Confirmed (Order ID: GK-2026-1048)
    Checkout->>Page: Shows Animated Success Screen with Delivery Notice
```

---

## 2. Flow 2: Provider / Order Fulfillment Journey (`/provider`)

This flow gives the warehouse/provider fulfillment team an unencumbered view of pending shipments without access to sensitive store settings.

```mermaid
sequenceDiagram
    autonumber
    actor Provider as Warehouse / Delivery Agent
    participant Portal as Provider Dashboard (/provider)
    participant API as Express API Server
    participant Sheets as Google Sheets

    Provider->>Portal: Navigates to /provider
    Portal->>Portal: Prompt for Provider Passcode / Access Key
    Provider->>Portal: Enters authorized passcode
    Portal->>API: GET /api/growkins/orders?limit=50&status=pending
    API->>Sheets: Reads Orders worksheet
    API-->>Portal: Returns ordered list of pending shipments
    Portal->>Portal: Renders clean table / card list
    Provider->>Portal: Inspects Customer Phone, District & Street Address
    Provider->>Provider: Dials phone number to verify customer availability
    Provider->>Portal: Selects "Confirmed" from Status Dropdown
    Portal->>API: PATCH /api/growkins/orders/:id/status { status: "confirmed" }
    API->>Sheets: Updates Status column in Google Sheet
    API-->>Portal: Success toast notification
```

---

## 3. Flow 3: AI Chatbot Inquiry Journey (Bengali Gemini RAG)

```mermaid
sequenceDiagram
    autonumber
    actor Parent as Parent (Customer)
    participant Bot as Floating Gemini Chat Widget
    participant Server as Express Server (RAG Engine)
    participant Gemini as Google Gemini API (@google/genai)

    Parent->>Bot: Clicks floating toy mascot button
    Bot->>Bot: Opens chat window with warm Bengali greeting
    Parent->>Bot: "আমার বাচ্চার বয়স ২ বছর, ওর জন্য কোন খেলনা সবচেয়ে ভালো?"
    Bot->>Server: POST /api/growkins/chat
    Server->>Server: Compiles active toy catalog into structured knowledge markdown
    Server->>Gemini: Sends System Prompt + Toy Knowledge + User Message
    Gemini-->>Server: Bengali reply suggesting Montessori Shape Sorter with price and age benefits
    Server-->>Bot: JSON { success: true, reply: "..." }
    Bot->>Parent: Displays animated Bengali reply with "অর্ডার করতে এখানে ক্লিক করুন" CTA
```

---

## 4. Flow 4: Admin Product & Settings Journey (`/admin`)

1. **Authentication:** Admin logs in using administrative credentials.
2. **Product Management:**
   * Admin navigates to `/admin/products`.
   * Clicks "নতুন খেলনা যোগ করুন" (Add New Toy).
   * Enters Name, Bengali subtitle, Price, Original Price, Age suitability, YouTube video link, and uploads image to Google Drive.
   * Clicks Save -> Row appended to `Products` worksheet -> AI knowledge document automatically invalidated.
3. **Delivery Charges Management:**
   * Admin opens `/admin/delivery`.
   * Updates inside Dhaka fee (e.g., from ৳৬০ to ৳৭০) or outside Dhaka fee.
   * Clicks Save -> Value saved in `Settings` worksheet -> Immediate reflection on storefront.

---

## 5. Error & Edge Case User Flows

| Edge Case | User Experience & System Handling |
| :--- | :--- |
| **Invalid Phone Number** | Frontend validates against regex `^01[3-9]\d{8}$`. If invalid, highlights field in red with Bengali error: *"সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন"*. Backend re-validates and rejects with 400 if bypassed. |
| **Double-Click on Order Submit** | Submit button enters `disabled` state with animated spinner immediately upon first click. Prevents duplicate rows in Google Sheets. |
| **YouTube Video Unavailable** | If a product has no `videoUrl` or is invalid, the "ভিডিও দেখুন" button is automatically hidden, showing only the product photo gallery. |
| **Network Failure during Checkout** | Catch block displays a retry banner: *"দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"* without resetting entered customer information. |
| **Out-of-Stock Product Selected** | Backend checks `inventory.quantity`. If 0, responds with error: *"দুঃখিত, এই খেলনাটি বর্তমানে স্টকে নেই"*. |

