# UniAGORA

> A trusted multi-university marketplace for students to discover, buy, sell, and communicate within their university communities.

UniAGORA is a campus-focused marketplace built around verified vendors, product discovery, direct customer-to-vendor communication, and offline transaction completion.

This README documents the **current implementation state** of the UniAGORA project, based on the latest frontend and backend repositories supplied for the project audit.

---

## Project Status

**Current stage:** Active MVP development

The backend is substantially ahead of the web client. The current frontend has completed the core customer marketplace, messaging, and vendor onboarding experience, while several vendor, engagement, notification, and administration interfaces remain to be built.

### Current milestone

| Area | Status |
|---|---|
| Frontend foundation | 🟢 Complete |
| Authentication | 🟢 Complete |
| Marketplace browsing | 🟢 Complete |
| Product detail | 🟢 Complete |
| Store detail | 🟢 Complete |
| Contact Seller | 🟢 Complete |
| Real-time chat | 🟢 Complete |
| Read receipts | 🟢 Complete |
| Vendor onboarding UI | 🟢 Complete |
| Vendor dashboard | 🔴 Not started |
| Product management UI | 🔴 Not started |
| Wishlist | 🔴 Not started |
| Reviews UI | 🔴 Not started |
| Reports UI | 🔴 Not started |
| Notifications UI | 🔴 Not started |
| Admin dashboard UI | 🔴 Not started |
| Production deployment | 🔴 Not started |

> The status above describes the **current web frontend experience**. The backend already contains many of the APIs and domain services required for the remaining features.

---

# 1. Product Vision

UniAGORA aims to provide a trusted marketplace where students can:

- Create an account
- Select their university
- Browse campus products
- Search and filter products
- View vendor stores
- Contact vendors
- Become vendors
- Create and manage listings
- Complete transactions offline
- Leave reviews after completed transactions
- Report products or vendors
- Receive platform notifications

The MVP supports a multi-university architecture and a single selected university per user at a time.

---

# 2. Repositories

### Web frontend

Repository:

`https://github.com/uniagora-team/uniagora-web`

Current working branch:

`feature/frontend-architecture`

Latest pushed frontend commit:

`d5f619f feat: add vendor onboarding flow`

### Backend

Repository:

`https://github.com/uniagora-team/uniagoraBackend`

Primary branch:

`main`

The backend was built separately and provides the API and business logic consumed by the web client.

---

# 3. Technology Stack

## Web

The current implemented web client uses:

- React 19
- TypeScript
- Vite
- Bootstrap 5
- React Router
- Axios
- ESLint

### Current web structure

```text
src/
├── assets/
├── components/
│   └── marketplace/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
└── utils/

The original PRD lists Next.js for the web client. The current implementation uses React + Vite + TypeScript. This README intentionally documents the stack that actually exists in the repository.

Backend

The current backend uses:

Python
Django 5.2
Django REST Framework
PostgreSQL
SimpleJWT
Django Channels
Redis
Cloudinary
DRF Spectacular / OpenAPI
django-filter
Pillow
Daphne

The backend is organized into domain applications.

4. Backend Architecture
apps/
├── admin_dashboard/
├── authentication/
├── categories/
├── chat/
├── common/
├── core/
├── notifications/
├── products/
├── reports/
├── reviews/
├── stores/
├── universities/
├── users/
└── vendors/

The backend follows an API-first architecture.

The main API prefix is:

/api/v1/

The API uses a consistent response envelope.

Success
{
  "success": true,
  "message": "",
  "data": {}
}
Failure
{
  "success": false,
  "message": "",
  "errors": {}
}

Business rules belong to the backend. The frontend should consume the API rather than duplicate business logic.

5. Current Frontend Routes

Public routes:

/
 /login
 /register
 /password-reset
 /reset-password

Protected routes:

/dashboard
/products/:slug
/stores/:slug
/chat
/chat/:id
/vendor/apply

The /chat route is the conversations inbox and /chat/:id is the individual conversation.

The /vendor/apply route provides the vendor onboarding/application experience.

6. Implemented Features
Authentication

Implemented:

Registration
Login
Logout
Forgot password
Password reset
JWT token storage
Token refresh handling
Protected routes
Public routes
Current-user loading
Active university API integration

Email verification and social sign-in are intentionally not part of the current MVP.

Marketplace

Implemented:

University selection
Category browsing
Product browsing
Product cards
Product grid
Product detail pages
Store detail pages
Keyword search
Category filtering
Condition filtering
Minimum price
Maximum price
Newest ordering
Lowest-price ordering
Highest-price ordering
Loading states
Empty states
Error states

The backend product API supports the corresponding search and filtering functionality.

Messaging

The core messaging milestone is complete.

Implemented:

Contact Seller
Conversation creation
Conversations inbox
Conversation detail
REST message history
Real-time WebSocket messaging
Buyer-to-vendor communication
Message persistence
WebSocket reconnect
Unread conversation counts
Read state
WhatsApp-style sent/read indicators
Live read-receipt updates
Loading states
Empty states
Error states
Completed conversation state
Chat architecture

REST is used for:

Create conversation
List conversations
Retrieve conversation
Load message history
Send fallback message
Mark conversation as read
Complete conversation

WebSocket is used for real-time message delivery:

ws/chat/<conversation_id>/?token=<access_token>

The backend uses Django Channels with Redis as the channel layer.

Development WebSocket server

For local WebSocket testing, use Daphne/ASGI rather than Django's normal development WSGI server:

daphne -b 127.0.0.1 -p 8000 config.asgi:application
Vendor Onboarding

The vendor onboarding milestone is now complete on the web frontend.

Implemented:

Become a Vendor navigation
Vendor application route
Student vendor application
Business vendor application
University selection
Vendor type selection
Student matric number
Student department
Student level
Student verification document upload
Business name
Business address
Optional business logo upload
Phone number
Store name
Backend validation error handling
Multipart form submission
Successful application handling
Vendor state refresh after application
Automatic redirect to the dashboard after successful application
Vendor-aware navigation

The frontend submits vendor applications through the backend vendor API and uses the active university UUID required by the backend.

For the current MVP implementation, successful vendor applications are automatically approved by the backend.

Vendor onboarding is complete, but the full vendor experience is not yet complete. Vendor dashboard, product management, inventory, image management, and listing lifecycle interfaces remain to be built.

7. Backend Capabilities Already Available

The backend currently contains domain applications and API routes for features that are not yet fully exposed through the web frontend.

Vendors

Includes:

Vendor profile
Vendor application/profile retrieval
Vendor verification states
Vendor suspension/reinstatement support
Public vendor information
Stores

Includes:

Store retrieval
Store management infrastructure
Vendor/store relationship
Products

Includes:

Product listing
Product retrieval
Product management infrastructure
Product image upload
Product image deletion
Primary image management
Product lifecycle services
Inventory services
Search/filter services
Reviews

Includes:

Review creation
Review retrieval
Review editing
Store review listing
Conversation-based review eligibility
Reports

Includes:

Report product
Report vendor
View own reports
Admin report management
Under-review
Resolve
Reject
Notifications

Includes:

Notification listing
Unread count
Mark notification read
Mark all read
Device token registration
Device token deactivation
Admin

Includes:

Dashboard summary
User management
User activation/deactivation
Vendor management
Vendor suspension/reinstatement
Product moderation
Category management
Report management
8. Remaining Frontend Roadmap
Phase 1 — Foundation
 Frontend architecture
 Authentication
 Protected/public routing
 API service layer
 Marketplace foundation
Phase 2 — Marketplace Customer Experience
 Product browsing
 Search
 Filters
 Product details
 Store details
 Contact Seller
 Conversations
 Real-time chat
 Read receipts
Phase 3 — Vendor Experience
 Become a Vendor
 Vendor application
 Vendor dashboard
 Store management
 Create product listing
 Edit product listing
 Delete product listing
 Mark product as sold
 Inventory management
 Product image management
 Listing status
 Expired listing handling
 Listing renewal
 Vendor enquiries/reviews view
Phase 4 — Marketplace Engagement
 Wishlist
 Save product
 Remove saved product
 Store reviews
 Write review
 Edit review
 Report product
 Report vendor
 My reports
Phase 5 — Notifications
 Notification center
 Notification unread badge
 Mark notification read
 Mark all notifications read
 Device-token integration
 Push notification UX
Phase 6 — Admin Dashboard
 Admin dashboard
 Marketplace analytics
 User management
 Vendor management
 Vendor moderation
 Product moderation
 Category management
 Report management
 Admin navigation and protected access
Phase 7 — Account & UX Polish
 Complete profile/account UI
 University switching UX
 Responsive refinement
 Global loading states
 Global error states
 Accessibility review
 UX consistency review
Phase 8 — Production
 Production frontend environment
 Production backend environment
 PostgreSQL production configuration
 Redis production configuration
 Cloudinary production configuration
 Production WebSocket configuration
 CORS/security configuration
 Frontend deployment
 Backend deployment
 Domain configuration
 Final QA
 Release preparation
9. Features Intentionally Not Implemented Yet

The following are either future releases, optional MVP items, or outside the current scope.

Future authentication
Email verification
Google Sign-In
Apple Sign-In
Optional chat feature
Image attachments in chat
Post-MVP features
Food ordering
Rider management
Live delivery tracking
Wallet
Escrow payments
Service marketplace
Hostel listings
Event tickets
Coupons
AI recommendations
Multi-campus logistics
10. Important Current Gaps

These should not be mistaken for backend absence.

The backend already provides substantial infrastructure for:

Vendors
Products
Reviews
Reports
Notifications
Admin

The primary remaining work is exposing those capabilities through the frontend and completing the corresponding user flows.

Wishlist

A wishlist feature is required by the PRD, but there is currently no dedicated wishlist backend application in the supplied backend architecture.

Therefore wishlist implementation should be treated as a feature requiring backend/API verification before frontend work begins.

11. Local Development
Frontend

From the frontend repository:

npm install

Create/update .env:

VITE_API_BASE_URL=http://localhost:8000/api/v1

Start the development server:

npm run dev

Run lint:

npm run lint

Run production build:

npm run build

Preview production build:

npm run preview
Backend

Create and activate a virtual environment:

python -m venv .venv

Linux/macOS:

source .venv/bin/activate

Windows:

.venv\Scripts\Activate.ps1

Install development dependencies:

pip install -r requirements/dev.txt

Apply migrations:

python manage.py migrate

For normal HTTP development:

python manage.py runserver

For full HTTP + WebSocket local testing:

daphne -b 127.0.0.1 -p 8000 config.asgi:application
12. Required Backend Services

The backend development environment requires:

PostgreSQL

Used as the primary database.

Redis

Used by Django Channels for real-time communication.

Check Redis locally:

redis-cli ping

Expected:

PONG
Cloudinary

Used for backend-managed media uploads, including vendor verification documents and vendor/business media.

Cloudinary credentials must be configured through backend environment variables.

Redis Python compatibility

The current backend pins:

channels-redis==4.3.0
redis>=4.6,<6

The Redis client is intentionally constrained below version 6 because the current Channels/Redis combination encountered an idle WebSocket timeout with newer redis-py versions during local integration testing.

13. API Documentation

The backend exposes OpenAPI documentation through:

/api/schema/
/api/docs/
/api/redoc/

Swagger UI:

http://localhost:8000/api/docs/

ReDoc:

http://localhost:8000/api/redoc/
14. Git Workflow

The project uses GitHub for version control.

Frontend

Current development branch:

feature/frontend-architecture

The frontend should be verified locally before pushing changes.

Typical workflow:

git status
git add .
git commit -m "feat: description"
git push origin feature/frontend-architecture
Backend

Primary branch:

main

Backend changes should be coordinated with the team because the backend is shared by the web and future mobile clients.

15. Development Principles
Inspect the existing implementation before changing it.
Follow the PRD and established architecture.
Do not duplicate backend business rules in the frontend.
Keep API integration inside service modules.
Use typed models/interfaces for API data.
Keep authentication centralized.
Test frontend/backend integration incrementally.
Test real-time features with the actual ASGI/WebSocket stack.
Avoid unnecessary backend changes when an existing API already supports the feature.
Complete and verify one milestone before expanding scope.
16. Current Milestone Summary
Completed
Frontend Foundation
        ↓
Authentication
        ↓
Marketplace Browsing
        ↓
Product & Store Details
        ↓
Contact Seller
        ↓
Conversations Inbox
        ↓
Real-Time Chat
        ↓
Read Receipts
        ↓
Vendor Onboarding
Next major milestone
Vendor Dashboard
        ↓
Store Management
        ↓
Product Management
        ↓
Inventory & Images
        ↓
Listing Lifecycle

After that:

Wishlist / Reviews / Reports
        ↓
Notifications
        ↓
Admin Dashboard
        ↓
Final UX + Production
17. Source Documents

The backend repository currently contains the project's primary documentation:

docs/
├── UniAGORA Backend responsibility (1).md
├── UniAGORA Product Requirements Document (PRD).txt
├── UniAGORA_Backend_Architecture_FINAL.md
└── UniAGORA_Database_Design_Specification_v1.0.md

These documents should be treated as the primary reference when making architectural or product-scope decisions.

18. License

License information has not yet been finalized.

UniAGORA

Build the trusted campus marketplace.
