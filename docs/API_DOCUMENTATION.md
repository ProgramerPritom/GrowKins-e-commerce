# API Documentation: GrowKins Backend REST API

## 1. Overview & Base Configuration

* **Base URL:** `http://localhost:5000/api/growkins` (Development) / `https://your-api.vercel.app/api/growkins` (Production)
* **Data Format:** `application/json`
* **Authentication:** HTTP Bearer Token or Session Cookie for Admin/Provider routes.
* **CORS:** Configured to accept requests from authorized frontend origins (`http://localhost:5173`, `https://growkins.vercel.app`).

---

## 2. Public Storefront Endpoints

### 2.1 Get Active Toy Products
Retrieves all published active toys for the `/growkins-toy-world` showcase. Cached in-memory for 60 seconds.

* **Method:** `GET`
* **Endpoint:** `/products`
* **Query Parameters:**
  * `category` (optional, string): Filter by category
  * `ageGroup` (optional, string): Filter by age suitability
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "toy_001",
      "name": "Wooden Montessori Shape Sorter",
      "slug": "wooden-montessori-shape-sorter",
      "subtitle": "বাচ্চাদের ব্রেন ডেভেলপমেন্ট ও কালার লার্নিং টয়",
      "price": 850,
      "compareAtPrice": 1200,
      "currency": "BDT",
      "category": "Wooden Toys",
      "ageGroup": "2-5 Years",
      "ageBadge": "২-৫ বছর",
      "benefits": [
        "হাতের ব্যালেন্স ও একাগ্রতা বাড়ায়",
        "রং ও জ্যামিতিক আকার চিনতে শেখায়"
      ],
      "materials": "Non-toxic natural wood",
      "description": "উচ্চমানের কাঠ দিয়ে তৈরি নিরাপদ শেপ সর্টার...",
      "featuredImage": "https://drive.google.com/...",
      "images": ["https://drive.google.com/..."],
      "videoUrl": "https://www.youtube.com/watch?v=EXAMPLE_ID",
      "inventory": { "quantity": 45, "trackInventory": true },
      "sortOrder": 1
    }
  ]
}
```

---

### 2.2 Get Public Delivery Settings
Retrieves configured delivery fees for dynamic calculations on the landing page.

* **Method:** `GET`
* **Endpoint:** `/settings/delivery`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "insideDhaka": 70,
    "outsideDhaka": 130,
    "freeDeliveryThreshold": 3500,
    "currency": "BDT"
  }
}
```

---

### 2.3 Submit Customer Order (Cash on Delivery)
Creates a new order in the Google Sheet. Performs strict server-side price calculation.

* **Method:** `POST`
* **Endpoint:** `/orders`
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "customer": {
    "name": "রাফি আহমেদ",
    "phone": "01712345678",
    "email": ""
  },
  "deliveryAddress": {
    "fullName": "রাফি আহমেদ",
    "phone": "01712345678",
    "streetAddress": "বাড়ি ১২, রোড ৪, ব্লক সি, বনশ্রী",
    "city": "ঢাকা",
    "zone": "inside_dhaka"
  },
  "items": [
    {
      "productId": "toy_001",
      "quantity": 2
    },
    {
      "productId": "toy_004",
      "quantity": 1
    }
  ],
  "paymentMethod": "cash_on_delivery",
  "notes": "বিকেলে ডেলিভারি দিলে ভালো হয়"
}
```

* **Server Logic:**
  1. Validates phone number format (`/^01[3-9]\d{8}$/`).
  2. Looks up `toy_001` (৳850) and `toy_004` (৳650) from `Products` worksheet.
  3. Calculates: `subtotal = (850*2) + (650*1) = 2350`.
  4. Looks up delivery charge for `inside_dhaka`: `৳70`.
  5. Computes: `total = 2350 + 70 = 2420`.
  6. Generates unique order number: `GK-2026-1048`.
  7. Appends row to `Orders` sheet atomically.

* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "GK-2026-1048",
    "customerName": "রাফি আহমেদ",
    "phone": "01712345678",
    "items": [
      {
        "productId": "toy_001",
        "name": "Wooden Montessori Shape Sorter",
        "unitPrice": 850,
        "quantity": 2,
        "lineTotal": 1700
      },
      {
        "productId": "toy_004",
        "name": "Cognitive Wooden Puzzle",
        "unitPrice": 650,
        "quantity": 1,
        "lineTotal": 650
      }
    ],
    "subtotal": 2350,
    "deliveryFee": 70,
    "total": 2420,
    "currency": "BDT",
    "paymentMethod": "cash_on_delivery",
    "deliveryAddress": "বাড়ি ১২, রোড ৪, ব্লক সি, বনশ্রী, ঢাকা",
    "estimatedDelivery": "১-২ কার্যদিবস"
  }
}
```

* **Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)"
  }
}
```

---

### 2.4 Gemini AI Bengali Product Assistant
Dynamic RAG query endpoint. Answers customer inquiries using real-time product data from Google Sheets.

* **Method:** `POST`
* **Endpoint:** `/chat`
* **Request Body:**
```json
{
  "message": "৩ বছরের বাচ্চার জন্য ব্রেন ডেভেলপমেন্টের কী খেলনা আছে?",
  "history": []
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "reply": "৩ বছর বয়সী বাচ্চাদের জন্য আমাদের 'Wooden Montessori Shape Sorter' (মূল্য: ৳৮৫০) এবং 'Cognitive Wooden Puzzle' (মূল্য: ৳৬৫০) অত্যন্ত চমৎকার। এগুলো রঙ ও বিভিন্ন আকার চিনতে সাহায্য করে এবং বাচ্চার বুদ্ধির বিকাশ ঘটায়। আপনি আমাদের পেজ থেকে সরাসরি অর্ডার করতে পারেন!"
}
```

---

## 3. Provider & Admin Management Endpoints

### 3.1 List Orders (Provider & Admin)
Retrieves order stream with search, status filtering, and pagination.

* **Method:** `GET`
* **Endpoint:** `/orders`
* **Query Parameters:**
  * `page` (number, default: 1)
  * `limit` (number, default: 50)
  * `status` (string, optional: `pending`, `confirmed`, `processing`, `delivered`, `cancelled`)
  * `search` (string, optional: customer name or phone number)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ord_1732101234567",
      "orderNumber": "GK-2026-1048",
      "createdAt": "2026-11-20T13:20:00Z",
      "customer": {
        "name": "রাফি আহমেদ",
        "phone": "01712345678"
      },
      "deliveryAddress": {
        "fullName": "রাফি আহমেদ",
        "phone": "01712345678",
        "streetAddress": "বাড়ি ১২, রোড ৪, ব্লক সি, বনশ্রী",
        "city": "ঢাকা",
        "zone": "inside_dhaka"
      },
      "items": [
        {
          "productId": "toy_001",
          "name": "Wooden Montessori Shape Sorter",
          "unitPrice": 850,
          "quantity": 2,
          "lineTotal": 1700
        }
      ],
      "subtotal": 1700,
      "deliveryFee": 70,
      "total": 1770,
      "paymentMethod": "cash_on_delivery",
      "paymentStatus": "unpaid",
      "status": "pending"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 128,
    "totalPages": 3
  }
}
```

---

### 3.2 Update Order Status (Provider & Admin)
Updates the fulfillment stage of an order.

* **Method:** `PATCH`
* **Endpoint:** `/orders/:id/status`
* **Request Body:**
```json
{
  "status": "confirmed",
  "note": "Customer confirmed over phone"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated to confirmed",
  "data": {
    "id": "ord_1732101234567",
    "status": "confirmed",
    "updatedAt": "2026-11-20T13:25:00Z"
  }
}
```

---

### 3.3 Product Management Endpoints (Admin)
* `POST /products`: Create new toy product (automatically regenerates AI product knowledge context).
* `PATCH /products/:id`: Update price, YouTube video URL, description, or stock.
* `DELETE /products/:id`: Soft-archive or remove product.

---

### 3.4 Delivery Settings Management (Admin)
* `GET /settings/delivery`: Read current delivery rates.
* `PATCH /settings/delivery`: Update rates (e.g. `{ "insideDhaka": 70, "outsideDhaka": 130 }`).

---

### 3.5 Health & Connection Status
* **Method:** `GET`
* **Endpoint:** `/health`
* **Response:**
```json
{
  "status": "ok",
  "service": "GrowKins Google Sheets & Drive API",
  "sheetsConnected": true,
  "timestamp": "2026-11-20T13:26:00Z"
}
```

