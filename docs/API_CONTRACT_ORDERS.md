# API-ready structure / MVP backend contract - Orders API

This document specifies the backend contract for the Orders API in the BOROZ platform. Since persistent database storage is not integrated yet, this layer defines the endpoints, data contracts, and client integration fallbacks to transition easily to a real backend in future phases.

---

## Base Path
All endpoints are relative to:
```
/api/orders
```

---

## 1. Get Orders
Retrieves the default list of orders (currently serving mock/demo orders).

* **Method:** `GET`
* **URL:** `/api/orders`
* **Headers:** None required
* **Response Status:** `200 OK`
* **Response Body Type:** `Order[]`

### Example Response:
```json
[
  {
    "id": "ORD-101",
    "storeName": "متجر رداء",
    "managerName": "عبدالرحمن صالح",
    "phone": "+966501234567",
    "email": "contact@reda.sa",
    "sallaUrl": "https://salla.sa/reda",
    "serviceKey": "marketing",
    "serviceLabel": "التسويق الرقمي وإعلانات المشاهير",
    "status": "قيد التنفيذ",
    "priority": "مهم",
    "date": "24 مايو 2026",
    "price": "4,500 ر.س",
    "description": "حملة تسويقية متكاملة لإطلاق خط الأزياء الصيفي الجديد مع إعلانات سناب شات وإنستغرام.",
    "notes": "التركيز على الفئة العمرية 18-30 سنة."
  },
  {
    "id": "ORD-102",
    "storeName": "سلة الحلا",
    "managerName": "سارة عبدالله",
    "phone": "+966555666777",
    "email": "info@sweetbasket.com",
    "sallaUrl": "https://salla.sa/sweetbasket",
    "serviceKey": "seo",
    "serviceLabel": "تحسين محركات البحث SEO",
    "status": "جديد",
    "priority": "عادي",
    "date": "28 مايو 2026",
    "price": "2,200 ر.س",
    "description": "تهيئة صفحات المتجر والمنتجات لمحركات البحث واستهداف الكلمات الدلالية الخاصة بالحلويات.",
    "notes": ""
  }
]
```

---

## 2. Create Order
Validates and parses a new order submission. Generates a timestamp-based Order ID and returns the newly structured object.

* **Method:** `POST`
* **URL:** `/api/orders`
* **Headers:** 
  * `Content-Type: application/json`
* **Request Body Type:** `OrderInput`

### Request Payload Fields:
| Field | Type | Required | Description / Rules |
| :--- | :--- | :---: | :--- |
| `storeName` | `string` | **Yes** | Name of the online store. Cannot be empty. |
| `managerName` | `string` | **Yes** | Full name of the manager/person in charge. Cannot be empty. |
| `phone` | `string` | **Yes** | Phone number. Must be a valid format. |
| `email` | `string` | No | Email address. |
| `sallaUrl` | `string` | No | Store URL link. |
| `serviceType` | `string` | **Yes** | Key representing the service type (e.g., `marketing`, `seo`, `dev`, etc.). |
| `budget` | `string` | No | Estimated budget. |
| `priority` | `string` | No | Priority of the order: `'عادي'` \| `'مهم'` \| `'عاجل'`. Defaults to `'عادي'`. |
| `description` | `string` | **Yes** | Details and requirements of the service request. Cannot be empty. |
| `notes` | `string` | No | Optional additional notes. |

### Example Valid Request Body:
```json
{
  "storeName": "متجر الأناقة",
  "managerName": "خالد محمد",
  "phone": "0512345678",
  "email": "khaled@anaga.com",
  "sallaUrl": "https://salla.sa/anaga",
  "serviceType": "marketing",
  "budget": "5000",
  "priority": "مهم",
  "description": "نحتاج حملة إعلانية ممولة على تيك توك وسناب شات لزيادة المبيعات.",
  "notes": "نفضل البدء فوراً."
}
```

### Responses:

#### A. Success (Order Created)
* **Status:** `201 Created`
* **Response Body Type:** `Order`

##### Example Response:
```json
{
  "id": "ORD-1717714800",
  "storeName": "متجر الأناقة",
  "managerName": "خالد محمد",
  "phone": "0512345678",
  "email": "khaled@anaga.com",
  "sallaUrl": "https://salla.sa/anaga",
  "serviceKey": "marketing",
  "serviceLabel": "التسويق الرقمي وإعلانات المشاهير",
  "status": "جديد",
  "priority": "مهم",
  "date": "اليوم",
  "price": "5,000 ر.س",
  "description": "نحتاج حملة إعلانية ممولة على تيك توك وسناب شات لزيادة المبيعات.",
  "notes": "نفضل البدء فوراً."
}
```

#### B. Validation Error (Missing Required Fields)
* **Status:** `400 Bad Request`
* **Response Body Type:** Error payload specifying the missing fields.

##### Example Response:
```json
{
  "error": "Missing required fields",
  "fields": [
    "storeName",
    "description"
  ],
  "message": "الحقول التالية مطلوبة: storeName, description"
}
```

#### C. Invalid Payload Error (Malformed JSON)
* **Status:** `400 Bad Request`

##### Example Response:
```json
{
  "error": "Invalid Request Body",
  "message": "حدث خطأ في قراءة بيانات الطلب المرسل"
}
```

---

## 3. Client Fallback Strategy
To guarantee complete user experience uptime during server transitions or offline testing, the client application follows a layered approach:
1. **API First:** The forms (`/request` and `/dashboard/orders/new`) first send requests to `POST /api/orders`.
2. **Duplicate Local Copy:** Upon success, a copy of the returned `Order` is stored in the browser's `localStorage` under the key `boroz_custom_orders`. This guarantees that custom orders appear in the dashboard lists during the prototyping phase.
3. **Local Storage Fallback:** If the network request fails (e.g. serverless route issues or network disconnect), the client generates a unique `id` and stores the order in `localStorage` directly, preventing database outages from breaking the prototype UI.
4. **Deduplication:** When rendering the dashboard list (`/dashboard/orders`), the app fetches the default API orders, merges them with `localStorage` orders, and filters out duplicate records by `id` (displaying local custom orders at the top of the list).
