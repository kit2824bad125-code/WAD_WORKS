# FixNear (FIXNEAR)

> **"Find trusted local service professionals near you."**

FixNear is a complete, production-grade, two-sided local services marketplace web application connecting Indian homeowners with verified, high-quality local tradesmen and technicians (electricians, plumbers, AC technicians, laptop/mobile mechanics, appliance specialists, painters, and carpenters).

FixNear includes a full-stack monorepo architecture, role-based access control, geospatial search with a 6-factor ranking score algorithm, real-time WebSocket messaging, an automated booking state machine, Razorpay payment abstraction, customer ratings & reviews, and a comprehensive admin moderation suite.

---

## 🚀 Key Highlights & Architectural Features

1. **Two-Sided Marketplace Workflows**:
   - **Customer**: Location-based discovery, interactive OpenStreetMap/Leaflet explorer, doorstep booking, quotes review, real-time chat, Razorpay checkout, and verified reviews.
   - **Service Provider**: Multi-step partner onboarding, live job acceptance/rejection, booking state machine progression (Confirmed → En Route → Arrived → In Progress → Completed), weekly working hours configuration, emergency toggle, and payout analytics.
   - **Admin**: Partner verification queue (document inspection, approval, suspension), dispute arbitration center with refund issuance, platform KPIs, and database-driven category/service management.

2. **Geospatial Search & 6-Factor Ranking Engine**:
   - **Haversine Great-Circle Distance Calculation** with privacy preservation (only approximate distance is displayed publicly, e.g. `"2.4 km away"`, never exposing private home coordinates).
   - **Multi-Factor Weighted Scoring Algorithm**:
     $$\text{Score} = (0.30 \times \text{Distance}) + (0.25 \times \text{Rating}) + (0.20 \times \text{Availability}) + (0.10 \times \text{Experience}) + (0.10 \times \text{Response Rate}) + (0.05 \times \text{Completed Jobs})$$

3. **Booking State Machine**:
   - Strict transition rules:
     `PENDING` → `ACCEPTED` → `CONFIRMED` → `EN_ROUTE` → `ARRIVED` → `IN_PROGRESS` → `COMPLETED`
   - Controlled branches for `CANCELLED` and `DISPUTED`.

4. **Payments Architecture**:
   - Server-side HMAC-SHA256 signature verification for **Razorpay** orders.
   - Zero-friction sandbox simulation for instant testing of UPI, Credit/Debit Cards, Netbanking, and Cash on Service.

5. **Real-Time Communication**:
   - Integrated **Socket.IO** server handling private notification channels (`user_{userId}`) and secured booking chat rooms (`booking_{bookingId}`).

6. **Full-Stack Resilience & Persistence**:
   - Compatible with PostgreSQL and Prisma ORM.
   - Standalone persistent seed dataset pre-loaded with **43 users, 21 providers, 11 categories, 27 services, 61 bookings, and 57 reviews** across Chennai, Bengaluru, Mumbai, Hyderabad, and Delhi NCR.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query v5, React Hook Form, Zod, Lucide Icons, Recharts, Leaflet / React-Leaflet |
| **Backend** | Node.js (v22+), Express.js, TypeScript, Socket.IO, JWT, bcryptjs, Helmet, Express Rate Limit, Swagger UI Express, Zod |
| **Database** | PostgreSQL, Prisma ORM, PostGIS / Haversine Geospatial Queries |
| **Payments** | Razorpay Payment Gateway Abstraction |
| **DevOps** | Docker Compose, Multi-stage Dockerfiles, Nginx reverse proxy |

---

## 📁 Repository Structure

```
fixnear/
├── apps/
│   ├── web/                     # React 18 + Vite + Tailwind frontend application
│   │   ├── src/
│   │   │   ├── components/      # UI, Map, Layout & Domain cards
│   │   │   ├── context/         # Auth, Socket.IO, and Notification contexts
│   │   │   ├── pages/           # Public, Auth, Customer, Provider, Admin pages
│   │   │   ├── services/        # API client with token refresh
│   │   │   └── App.tsx          # Full application routes
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── api/                     # Node.js + Express + TypeScript API server
│       ├── src/
│       │   ├── controllers/     # Route controllers for all domains
│       │   ├── services/        # Business logic, search algorithm, booking state machine
│       │   ├── middleware/      # Auth, RBAC, Zod validation, error handling, audit logging
│       │   ├── sockets/         # Socket.IO WebSocket handler
│       │   ├── config/          # Environment, Prisma DB, Swagger
│       │   └── app.ts & server.ts
│       └── Dockerfile
├── packages/
│   ├── shared/                  # Shared domain types, Zod schemas, constants, algorithms
│   └── config/                  # Shared base tsconfig
├── prisma/
│   ├── schema.prisma            # Full PostgreSQL schema with 22 models & relations
│   └── seed.ts                  # Prisma PostgreSQL database seeder
├── docker-compose.yml           # Multi-container orchestration (Postgres + API + Web)
├── .env.example
├── package.json                 # Monorepo workspaces configuration
└── README.md
```

---

## 🔑 Demo Test Accounts

The platform includes pre-configured demo credentials. You can also use the **1-Click Quick Test Switcher** bar at the top of the navbar to switch personas instantly:

| Role | Email | Password | Persona Details |
|---|---|---|---|
| **Customer** | `customer@fixnear.dev` | `FixNear@123` | Rohan Sharma, Anna Nagar, Chennai |
| **Service Provider** | `provider@fixnear.dev` | `FixNear@123` | Arun Kumar (Arun Electricals & Cooling, 11 yrs exp, 4.9 ★) |
| **Administrator** | `admin@fixnear.dev` | `FixNear@123` | FixNear Super Admin |

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js 20+ (Node.js 22 LTS recommended)
- npm 10+

### 1. Installation
```bash
# Clone or navigate to the project directory
git clone <repo-url>
cd "wad project"

# Install all monorepo dependencies
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Run the Full Stack Development Server
```bash
npm run dev
```
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **Interactive Swagger Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing & Verification

Run all test suites across the monorepo:
```bash
# Run unit tests on shared algorithms, distance formula, and state transitions
npm run test --workspace=@fixnear/shared

# Run integration tests on backend auth, search, booking state rules, and reviews
npm run test --workspace=@fixnear/api

# Test production compilation across all packages
npm run build
```

---

## 🐳 Docker Deployment

To launch the complete isolated production environment with PostgreSQL, backend, and frontend:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- PostgreSQL 16: `localhost:5432`

---

## 📑 REST API Documentation

The FixNear REST API is fully versioned under `/api/v1` and documented via OpenAPI / Swagger at `/api/docs`:

- **Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh`
- **Search**: `GET /search/providers` (geolocation, radius, multi-factor scoring)
- **Categories**: `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
- **Services**: `GET /services`, `POST /services`, `PATCH /services/:id`, `DELETE /services/:id`
- **Providers**: `GET /providers/:id`, `PATCH /providers/profile`, `PATCH /providers/availability/toggle`, `GET /providers/earnings`
- **Bookings**: `POST /bookings`, `GET /bookings`, `GET /bookings/:id`, `PATCH /bookings/:id/status`, `POST /bookings/:id/quote`
- **Payments**: `POST /payments/create`, `POST /payments/verify`, `GET /payments/:id`
- **Reviews**: `POST /reviews/:bookingId`, `GET /reviews/provider/:providerId`
- **Messages**: `GET /messages/conversations`, `GET /messages/conversations/:id/messages`, `POST /messages/conversations/:id/messages`
- **Notifications**: `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`
- **Disputes**: `POST /disputes`, `GET /disputes`, `PATCH /disputes/:id/resolve`
- **Admin**: `GET /admin/dashboard`, `GET /admin/providers`, `PATCH /admin/providers/:id/verify`, `GET /admin/users`, `PATCH /admin/users/:id/suspend`

---

## 🔒 Security Architecture
- Passwords hashed using bcrypt with salt factor 10.
- Strict JWT authentication with access token expiry and refresh token rotation.
- Role-based access control (RBAC) enforced on every private route.
- Server-side validation with Zod schemas for all request bodies and queries.
- Geospatial privacy protection: customer and technician coordinates are never exposed publicly.
- Razorpay payment signature verification executed server-side via HMAC-SHA256 before mark-as-paid.
- Reviews restricted exclusively to verified completed bookings, preventing self-reviews or fraudulent testimonials.
- Security headers via Helmet, CORS domain control, and rate-limiting to prevent DDoS/abuse.

---

## 📄 License
FixNear is distributed under the MIT License.
