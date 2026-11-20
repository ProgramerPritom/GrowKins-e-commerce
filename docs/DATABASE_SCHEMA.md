# Database Schema & Data Models (Google Sheets Persistence)

## 1. Overview

In alignment with the business requirement for simplicity, transparency, and ease of access, the system utilizes **Google Sheets** as its primary persistent database engine via the official Google Sheets API v4.

* **Spreadsheet ID:** Stored in backend `.env` as `GROWKINS_GOOGLE_SHEET_ID`.
* **Media Storage:** Google Drive Folder ID stored in `GROWKINS_GOOGLE_DRIVE_FOLDER_ID`.
* **JSON Serialization:** Nested structures (such as arrays of features, image URLs, or order items) are serialized as clean JSON strings inside designated sheet cells.

---

## 2. Worksheet Schemas

### 2.1 `Products` Worksheet (Toy Catalog)
Stores all toy product information. Initially seeded with 20 toys, with full support for adding unlimited future products via the Admin panel or direct Sheets entry.

| Column Name | Type | Required | Description / Example |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Unique ID (e.g., `toy_001`, `prod_1732100000`) |
| `name` | String | Yes | Product Title (e.g., "Wooden Montessori Shape Sorter") |
| `slug` | String | Yes | URL-friendly slug (e.g., `wooden-montessori-shape-sorter`) |
| `subtitle` | String | No | Bengali tagline (e.g., "বাচ্চাদের ব্রেন ডেভেলপমেন্ট ও কালার লার্নিং টয়") |
| `sku` | String | No | SKU code (e.g., `GK-TOY-001`) |
| `price` | Number | Yes | Current Selling Price in BDT (e.g., `850`) |
| `compareAtPrice` | Number | No | Original/Cut-off Price in BDT (e.g., `1200`) |
| `currency` | String | Yes | Default: `BDT` |
| `status` | String | Yes | `active` \| `draft` \| `archived` |
| `category` | String | Yes | e.g., `Wooden Toys`, `Brain Development`, `Baby Toys` |
| `ageGroup` | String | Yes | Target age (e.g., `2-5 Years`, `1-3 Years`) |
| `ageBadge` | String | No | Short badge (e.g., `২-৫ বছর`) |
| `benefits` | JSON Array | No | Stringified array: `["হাতের ব্যালেন্স বৃদ্ধি করে", "রং ও আকৃতি চিনতে সাহায্য করে"]` |
| `materials` | String | No | e.g., `100% Non-toxic natural wood, water-based paint` |
| `description` | String | Yes | Detailed product description in Bengali |
| `videoUrl` | String | No | YouTube video / shorts URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`) |
| `featuredImage` | String | Yes | Direct image URL (Google Drive CDN or hosted asset) |
| `images` | JSON Array | No | Stringified array of additional image URLs |
| `inventory` | JSON Object | Yes | `{"quantity": 50, "trackInventory": true}` |
| `sortOrder` | Number | No | Priority ordering on landing page (e.g., `1`, `2`, `3`) |
| `createdAt` | ISO String | Yes | Creation timestamp |
| `updatedAt` | ISO String | Yes | Last modified timestamp |

---

### 2.2 `Orders` Worksheet
Stores every customer order. Each order retains an immutable snapshot of product details, prices, and customer delivery location.

| Column Name | Type | Required | Description / Example |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Unique UUID / ID (e.g., `ord_1732101234567`) |
| `orderNumber` | String | Yes | Human-friendly tracking ID (e.g., `GK-2026-1042`) |
| `customer` | JSON Object | Yes | `{"name": "Pritom Ahmed", "phone": "01711223344", "email": ""}` |
| `deliveryAddress`| JSON Object | Yes | `{"fullName": "Pritom Ahmed", "phone": "01711223344", "streetAddress": "House 12, Road 4, Sector 7, Uttara", "city": "Dhaka", "zone": "inside_dhaka"}` |
| `items` | JSON Array | Yes | Immutable product snapshot array (see below) |
| `subtotal` | Number | Yes | Sum of all line totals (e.g., `1700`) |
| `deliveryFee` | Number | Yes | Verified delivery charge (e.g., `70` or `130`) |
| `discount` | Number | No | Applied discount in BDT (Default: `0`) |
| `total` | Number | Yes | Final payable amount: `subtotal + deliveryFee - discount` |
| `currency` | String | Yes | Default: `BDT` |
| `paymentMethod` | String | Yes | `cash_on_delivery` |
| `paymentStatus` | String | Yes | `unpaid` \| `paid` \| `refunded` |
| `status` | String | Yes | `pending` \| `confirmed` \| `processing` \| `shipped` \| `delivered` \| `cancelled` |
| `notes` | String | No | Optional customer delivery instructions |
| `timeline` | JSON Array | Yes | Tracking log: `[{"status": "pending", "timestamp": "...", "note": "Order placed"}]` |
| `createdAt` | ISO String | Yes | Order placement timestamp |
| `updatedAt` | ISO String | Yes | Last status update timestamp |

#### Order `items` Array Snapshot Structure:
```json
[
  {
    "productId": "toy_001",
    "name": "Wooden Montessori Shape Sorter",
    "image": "https://drive.google.com/...",
    "unitPrice": 850,
    "quantity": 2,
    "lineTotal": 1700
  }
]
```
> [!IMPORTANT]
> **Historical Price Integrity:** The `unitPrice` and `lineTotal` inside `items` represent a frozen snapshot at purchase time. Even if an admin modifies the product price later, existing order records remain completely unaffected.

---

### 2.3 `Settings` Worksheet
Key-value configuration store for delivery fees and general settings.

| Column Name | Type | Example |
| :--- | :--- | :--- |
| `key` | String | `delivery_rates` |
| `value` | JSON String | `{"inside_dhaka": 70, "outside_dhaka": 130, "free_delivery_threshold": 3000}` |
| `updatedAt` | ISO String | `2026-11-20T13:00:00Z` |

Other standard keys:
* `store_info`: `{"storeName": "GrowKins Toy World", "phone": "01XXXXXXXXX", "currency": "BDT"}`
* `ai_settings`: `{"model": "gemini-2.5-flash", "temperature": 0.2, "system_notice": "..."}`

---

### 2.4 `Customers` Worksheet
Maintains aggregated metrics per unique customer phone number.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Phone-based ID (e.g., `cust_01711223344`) |
| `name` | String | Customer Full Name |
| `phone` | String | 11-digit mobile number |
| `totalOrders` | Number | Cumulative count of orders placed |
| `totalSpent` | Number | Total lifetime order value (BDT) |
| `lastOrderDate` | ISO String | Timestamp of most recent order |
| `status` | String | `active` \| `flagged` |

---

## 3. Security & Integrity Rules for Google Sheets

1. **Formula Injection Guard:**
   Before writing any customer-provided string (e.g., name, address, notes) to Google Sheets, prepend a single quote (`'`) or strip leading characters if the value begins with `= `, `+ `, `- `, or `@ `. This prevents Excel/Sheets macro injection.
2. **Atomic Order ID Generation:**
   Order IDs follow the format `GK-YYYY-XXXX` where `XXXX` is derived from row sequence or a cryptographically secure random 4-digit token, ensuring uniqueness even during concurrent checkouts.
3. **Data Caching & Rate Limiting:**
   * Product listings are cached in-memory on the backend for 60 seconds to avoid hitting Google Sheets API read quota (300 requests/minute).
   * Cache is invalidated immediately when an Admin creates, updates, or deletes a product.

