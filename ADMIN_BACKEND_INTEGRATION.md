# GrowKins Admin — Backend Integration & API Specification Guide

This guide provides full architectural documentation, data contracts, and endpoint specifications for the GrowKins administration backend.

---

## 1. Architectural Principle

The frontend has been built strictly with an isolated, layered architecture:

```
UI Components (Pages, Tables, Forms)
          ↓
Hooks / State Handlers
          ↓
Service Interfaces (IProductService, IOrderService, etc.)
          ↓
   ┌──────────────┴──────────────┐
   ▼                             ▼
Mock Implementation          Live API Implementation
(Persistent localStorage)     (Axios / Fetch ApiClient)
                                 ↓
                             Backend API
```

### Switching From Mock to Live Backend

To toggle the entire application from Local Mock DB to the live backend:

1. Create or update `.env` in the project root:
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```
2. The switcher in `src/services/index.ts` automatically instantiates `ApiProductService`, `ApiOrderService`, etc., passing real HTTP calls to the backend via `apiClient`.
3. **No UI components, forms, validation rules, or tables need to be rewritten.**

---

## 2. Authentication & Authorization

All admin endpoints require an HTTP Bearer JWT token in the `Authorization` header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### Endpoints

| Method | Endpoint | Description | Payload |
|---|---|---|---|
| `POST` | `/api/admin/auth/login` | Authenticate admin | `{ email, password }` |
| `POST` | `/api/admin/auth/logout` | Invalidate token | Empty |
| `GET` | `/api/admin/auth/me` | Current admin session | Headers only |
| `POST` | `/api/admin/auth/refresh` | Rotate access token | `{ refreshToken }` |

### Login Payload
```json
{
  "email": "admin@growkins.com",
  "password": "SecurePassword123!"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_01",
      "name": "GrowKins Ops Admin",
      "email": "admin@growkins.com",
      "role": "admin",
      "avatar": "https://..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-10-01T00:00:00.000Z"
  }
}
```

---

## 3. Standard Request / Response Contracts

### Generic Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource updated successfully"
}
```

### Paginated List Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 84,
    "totalPages": 5
  }
}
```

### Standard Error Response (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Product name is required"],
    "price": ["Price must be greater than 0"]
  }
}
```

---

## 4. Endpoints & Data Models

### 4.1 Products (`/api/admin/products`)

- `GET /api/admin/products`
  - Query params: `page`, `limit`, `search`, `category`, `status` (`draft` \| `active` \| `archived`), `stockStatus` (`in_stock` \| `low_stock` \| `out_of_stock`), `sortBy`, `sortOrder`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`

#### Product Data Model (`AdminProduct`)
```typescript
interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  sku: string;
  tag?: 'BESTSELLER' | 'NEW' | 'STAFF PICK' | 'RESTOCKED';
  price: number;              // In Bangladeshi Taka (৳ BDT)
  compareAtPrice?: number;    // Original price for showing discount strike-through
  currency: 'BDT';
  status: 'draft' | 'active' | 'archived';
  category: string;
  ageGroup: '0-12m' | '1-2y' | '3-4y' | '5-7y' | '8y+';
  ageBadge: string;           // e.g. "1-3 Years"
  interests: string[];
  benefits: string[];
  materials: string[];
  occasions: string[];
  description: string;
  storyDescription?: string;
  whatsInside: string[];
  playTips: string[];
  dimensions?: string;
  careInstructions?: string;
  safetyNotes?: string;
  inventory: {
    trackInventory: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
    sku?: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary?: boolean;
    sortOrder: number;
  }>;
  featuredImage?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

### 4.2 Categories & Collections

#### Categories (`/api/admin/categories`)
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `GET /api/admin/categories/:id`
- `PATCH /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`

```typescript
interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  productCount: number;
  status: 'active' | 'inactive';
  sortOrder: number;
}
```

#### Collections (`/api/admin/collections`)
- `GET /api/admin/collections`
- `POST /api/admin/collections`
- `GET /api/admin/collections/:id`
- `PATCH /api/admin/collections/:id`
- `DELETE /api/admin/collections/:id`

```typescript
interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  badge?: string;
  productIds: string[];
  status: 'active' | 'inactive';
  sortOrder: number;
}
```

---

### 4.3 Orders & Cash on Delivery Lifecycle (`/api/admin/orders`)

GrowKins is exclusively **Cash on Delivery (COD)** with courier delivery across Bangladesh.

- `GET /api/admin/orders`
  - Query params: `page`, `limit`, `search` (order number / customer name / phone), `status`, `paymentStatus`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status` — Updates order status & appends timeline log

#### Status Lifecycle
```
[pending] ──(Confirm Call)──► [confirmed] ──(Packing)──► [processing]
                                                              │
                                                        (Hand to Courier)
                                                              ▼
[delivered] ◄──(Rider Handover)── [out_for_delivery] ◄── [shipped]
    │
 (COD Collected)
```
*Alternative terminals: `[cancelled]`, `[returned]`.*

#### COD Payment Status
- `cod_pending`: Customer has not paid yet (parcel in transit).
- `cod_collected`: Courier has collected cash from recipient upon inspection.
- `not_collected` / `refunded`: Parcel refused or returned.

#### Order Data Model (`AdminOrder`)
```typescript
interface AdminOrder {
  id: string;
  orderNumber: string;         // e.g. "LK-BD-9214"
  customer: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    isGuest?: boolean;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    deliveryZone: 'inside-dhaka' | 'outside-dhaka';
    district: string;
    thanaArea: string;
    streetAddress: string;
  };
  items: Array<{
    productId: string;
    name: string;
    sku?: string;
    image: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  currency: 'BDT';
  paymentMethod: 'Cash on Delivery';
  paymentStatus: 'cod_pending' | 'cod_collected' | 'not_collected' | 'refunded';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  notes?: string;
  gift?: {
    enabled: boolean;
    recipientName?: string;
    message?: string;
  };
  timeline: Array<{
    id: string;
    status: OrderStatus;
    title: string;
    description?: string;
    timestamp: string;
    actor: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

### 4.4 Customers (`/api/admin/customers`)

- `GET /api/admin/customers`
  - Query params: `page`, `limit`, `search` (name, phone, email)
- `GET /api/admin/customers/:id`
- Note: Guest checkouts automatically create or associate customer records by Phone Number.

---

### 4.5 Reviews Moderation (`/api/admin/reviews`)

- `GET /api/admin/reviews`
  - Query params: `page`, `limit`, `status` (`pending` \| `approved` \| `rejected`), `rating`
- `PATCH /api/admin/reviews/:id` — Update moderation status (`approved`, `rejected`)
- `DELETE /api/admin/reviews/:id`

---

### 4.6 Media Library (`/api/admin/media`)

- `GET /api/admin/media`
  - Returns array of media assets with metadata.
- `POST /api/admin/media`
  - Content-Type: `multipart/form-data`
  - Body: `file: File`
  - Returns uploaded asset URL, dimensions, and size.
- `DELETE /api/admin/media/:id`

---

### 4.7 Homepage & Navigation CMS (`/api/admin/content/*`)

- `GET /api/admin/content/homepage` / `PATCH /api/admin/content/homepage`
  - Controls announcement banner, hero slides, featured collection selection, shop by age, shop by personality, trust statements, and section visibility toggles.
- `GET /api/admin/content/navigation` / `PATCH /api/admin/content/navigation`
  - Header links and mega-menu links.
- `GET /api/admin/content/footer` / `PATCH /api/admin/content/footer`
  - Customer care links, legal links, office address, and copyright text.

---

### 4.8 Delivery & Logistics Settings (`/api/admin/settings/delivery`)

- `GET /api/admin/settings/delivery`
- `PATCH /api/admin/settings/delivery`

Default zones configured:
1. **Inside Dhaka**: Fee ৳70, 24–48 hours, free over ৳2,500.
2. **Outside Dhaka**: Fee ৳130, 2–4 days, free over ৳2,500.

---

### 4.9 Store & Checkout Settings (`/api/admin/settings/*`)

- `GET /api/admin/settings/store` / `PATCH /api/admin/settings/store`
  - Store name, hotline, email, currency symbol (`৳`), social media links.
- `GET /api/admin/settings/checkout` / `PATCH /api/admin/settings/checkout`
  - COD active flag, phone verification call notice, free delivery banner threshold.

---

## 5. Frontend Service Mapping Checklist

When connecting your real backend, verify that each API method corresponds to the interface methods defined in `src/services/interfaces/`:

| Interface | File | Api Service Implementation |
|---|---|---|
| `IProductService` | `src/services/interfaces/IProductService.ts` | `src/services/api/ApiProductService.ts` |
| `ICategoryService` | `src/services/interfaces/ICategoryService.ts` | `src/services/api/ApiCategoryService.ts` |
| `ICollectionService` | `src/services/interfaces/ICollectionService.ts` | `src/services/api/ApiCollectionService.ts` |
| `IOrderService` | `src/services/interfaces/IOrderService.ts` | `src/services/api/ApiOrderService.ts` |
| `ICustomerService` | `src/services/interfaces/ICustomerService.ts` | `src/services/api/ApiCustomerService.ts` |
| `IReviewService` | `src/services/interfaces/IReviewService.ts` | `src/services/api/ApiReviewService.ts` |
| `IMediaService` | `src/services/interfaces/IMediaService.ts` | `src/services/api/ApiMediaService.ts` |
| `IContentService` | `src/services/interfaces/IContentService.ts` | `src/services/api/ApiContentService.ts` |
| `ISettingsService` | `src/services/interfaces/ISettingsService.ts` | `src/services/api/ApiSettingsService.ts` |
| `IAuthService` | `src/services/interfaces/IAuthService.ts` | `src/services/api/ApiAuthService.ts` |

All standard HTTP methods, bearer headers, and response parsing are handled by `src/lib/api/client.ts`.
