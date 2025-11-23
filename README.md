# Fleet & Delivery Management System — Full Documentation

## 🌐 Overview
This project implements a complete Fleet & Delivery Management platform that includes driver management, vehicle allocation, shift scheduling, GPS tracking, and delivery workflows.

This README describes:
- System architecture
- Backend modules
- Frontend (Driver + Admin UI)
- API endpoints
- Data models
- GPS tracking logic
- Driver delivery flow
- Setup & installation steps

---

# 📦 Tech Stack
## **Backend**
- Node.js + Express.js
- MongoDB + Mongoose

## **Frontend**
- React (Vite)
- React Router
- React Query / TanStack Query
- Leaflet for maps
- TailwindCSS

---

# 🗂️ System Modules
The system contains the following major modules:

1. **Drivers**
2. **Vehicles**
3. **Vehicle Allocation**
4. **Shifts**
5. **Orders**
6. **GPS Tracking**
7. **Driver UI**
8. **Admin Console**
9. **Hubs/Terminals**

---

# 1️⃣ Drivers Module
## Purpose
Manage basic driver information.

## Driver Model
```ts
{
  name: String,
  phone: String,
  licenseNumber: String,
  isActive: Boolean
}
```

## APIs
### `GET /api/drivers`
List all drivers.

### `POST /api/drivers`
Create new driver.

### `PUT /api/drivers/:id`
Update drivers. (Not implemented on UI)

### `DELETE /api/drivers/:id`
Deletes driver. (Not implemented on UI)

### Login (mock)
Driver logs in by selecting their name — no password for demo.

---

# 2️⃣ Vehicles Module
## Purpose
Store vehicle details.

## Vehicle Model
```ts
{
  plateNumber: String,
  vehicleModel: String,
  capacityGallons: Number,
  isActive: Boolean
}
```

## APIs
### `GET /api/vehicles`
List all vehicles.

### `POST /api/vehicles`
Create a new vehicle.

### `PUT /api/vehicles/:id`
Update vehicles. (Not implemented on UI)

### `DELETE /api/vehicles/:id`
Deletes vehicles. (Not implemented on UI)

---

# 3️⃣ Vehicle Allocation Module
## Purpose
Assign a driver to a vehicle for a given period.

### Allocation Model
```ts
{
  driverId,
  vehicleId,
  date,
  orders
}
```

## Business Rules
- A driver can have only one active allocation for day.
- A vehicle can be assigned to only one active allocation for day.

## APIs
### `POST /allocations`
Create allocation.

### `GET /allocations`
List all allocations.

---

# 4️⃣ Shift Module
## Purpose
Define work shifts for drivers.

## Shift Model
```ts
{
  allocationId,
  driverId,
  vehicleId,
  date: "YYYY-MM-DD",
  active: Boolean
}
```

## Business Rules
- A driver can have only one shift per date.
- Shift must correspond to a valid allocation.

## APIs
### `POST /shifts`
Create shift (validates allocation + vehicle).

### `POST /shifts/:id/start`
Start a shift.

### `POST /shifts/:id/end`
End a shift.

### `GET /shifts/:driverId`
Fetch today's shift for driver.

### `GET /shifts`
Fetch all shifts.

---

# 5️⃣ Orders Module
## Purpose
Manage fuel/goods delivery orders.

## Order Model
```ts
{
 sourceType,
 siurceId,
 destinationType,
 destinationId
 status: "PENDING"| "IN_PROGRESS" | "COMPLETED" |"FAILED",
 assignedDriverId,
 products
}
```

## Business Logic
- When shift starts → all assigned orders move `pending → in-progress`.
- When driver marks complete → `completed`.

## APIs
### `GET /orders`
Get orders.

### `POST /orders`
Create orders

---

## Delivery status Model
```ts
{
 orderId,
 driverId,
 shiftId,
 productId
 quantity
 status: "COMPLETED" | "FAILED",
 reason
}
```

## Business Logic
- When driver reaches the desination, he can mark the order as completed.
- When driver marks complete → this updates the delivery status to completed.

## APIs
### `POST /api/delivery-status/update`
This API updates the status of delivery.

Request body:
```ts
DeliveryUpdateDTO {
  orderId: string;
  status: "COMPLETED" | "FAILED";
  reason?: string;
}
```
---

# 6️⃣ GPS Tracking Module
## Purpose
Track live vehicle position.

## GPS Model
```ts
{
  driverId,
  vehicleId,
  allocationId,
  shiftId,
  lat,
  lng,
  timestamp
}
```

### GPS Update Process
- Driver app sends coordinates every 5 seconds.
- Server stores entry in `gps_locations` collection.
- Admin dashboard fetches latest + last 20 points (history).

## APIs
### `POST /gps`
Save driver position.

### `GET /gps/fleet/active`
Return:
```json
[
  {
    "vehicleId": "...",
    "plateNumber": {...},
    "driverName": {...},
    "points": [...],
    "lastPoint": { lat, lng }
  }
]
```

---

# 7️⃣ Driver UI
Main features:
- Driver Login
- View Today's Shift
- Start Shift
- GPS auto-sync
- View Order List
- Update delivery status
- End shift

### Pages
- `/driver/login`
- `/driver/shifts`
---

# 8️⃣ Admin UI
Main features:
- Manage drivers
- Manage vehicles
- Create vehicle allocations
- Create shifts
- Assign orders
- Live map tracking: (Coming soon)

### Pages
- `/admin/live-tracking`
- `/admin/orders`
- `/admin/allocations`
- `/admin/shifts`
- `/admin/products`
- `/admin/drivers`
- `/admin/vehicles`
- `/admin/hubs`
- `/admin/terminals`

---

# 🗺️ Live Tracking Map (Leaflet)[In developement]
Displays:
- Vehicle current location
- Polyline showing historical route
- Popup showing
  - Plate number
  - Driver name
  - Coordinates

Polling interval: **3 seconds**.

---

# ⚙️ Installation & Setup
## 1. Backend Setup
```
cd fuel-panda-backend
pnpm install
pnpm run dev
```

### Environment Variables
```
MONGO_URI=
PORT=5000
```

---

## 2. Frontend Setup
```
cd fuel-backend-frontend
pnpm install
pnpm run dev
```

### Configure API Base URL
`/api/axios.ts`

---

# 🔥 Future Enhancements & Assumptions
- RBAC (Rule based access control)
- Authentication
- Real time location updates
- UI enhancements with toast and better UX.
- Bug fixes (Obviously)
---

# ✅ Conclusion
This README provides full documentation for the Fleet & Delivery Management System, describing backend modules, frontend UI, data flow, APIs, and GPS tracking mechanisms.
