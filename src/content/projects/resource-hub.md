---
title: "NITJ Academic Resource & Notes Exchange (Resource Hub)"
track: "systems"
tier: "featured"
canonicalStage: "1-5"
orderDefault: 5
orderGameplay: 3
orderSystems: 1
statuses: ["PROTOTYPE"]
role: "Full-Stack & Backend Security Engineer"
timeline: "2025 – 2026"
platform: "Full-Stack Web (React 19 + Express + MongoDB + Docker)"
teamSize: "2"
stack: ["Node.js", "Express", "MongoDB", "React 19", "Docker Compose", "Jest / Supertest", "JWT & RBAC", "Tailwind CSS 4"]
links:
  repo: "https://github.com/Beerkanwar/AcademicResourceExchangeSystem"
hook: "A role-based academic content-moderation platform with magic-byte upload inspection, access-time re-verified signed downloads, file versioning, audit logs, and 6 integration test suites."
mission: "Build a production-grade campus resource exchange where student uploads pass through a teacher/admin verification workflow, file downloads are protected against stale-permission leaks and MIME spoofing, and every security contract is verified by automated tests against a real MongoDB instance."
keySystems:
  - title: "Signed, Time-Limited Downloads with Access-Time Permission Re-Verification (downloadController.js)"
    detail: "GET /api/downloads/sign/:fileId issues a short-lived signed token tied to the requesting user and optional file version. When GET /api/downloads/file?token=... is called, the server verifies token signature and expiry AND re-evaluates the user's live RBAC permissions and resource moderation status before streaming with Cache-Control: no-store."
  - title: "Magic-Byte Upload Verification, Versioning & Server-Side Document Previews"
    detail: "Inspects actual binary magic bytes via file-type (v22.0) after multer ingestion to reject spoofed file extensions/MIME headers, enforces path-traversal containment, maintains non-destructive file version arrays (/api/resources/:id/versions/:versionId/download), and extracts text previews server-side from PDFs (pdf-parse) and DOCX files (mammoth)."
  - title: "9-Model MongoDB Schema, Revocable Refresh Tokens & Bulk Moderation Queue"
    detail: "Models User, Resource, Subject, Department, Rating, Bookmark, Notification, RefreshToken (enabling server-side token revocation), and AuditLog. Teachers and admins review pending uploads via single or bulk approve/reject workflows (/admin/verification-queue) with soft-delete isolation."
bossFight:
  title: "Eliminating Stale-Permission Exploitation on Pre-Signed Download Links"
  detail: "Standard pre-signed URLs remain valid until expiry even if a resource is subsequently rejected, soft-deleted, or a user's role is revoked. Splitting signing (/sign/:fileId) from streaming (/file?token=...) and re-running permission and resource-state checks at stream time closed that vulnerability completely."
loot:
  - "6 automated Jest 30.4 + Supertest 7.2 test files executing against a real in-memory MongoDB server (mongodb-memory-server 11.2): auth.test.js, rbac.test.js, resources.test.js, downloads.test.js, bulkVerification.test.js, and previewMeta.test.js."
  - "Containerized via Docker Compose (Express API + MongoDB + nodemon live-reload) paired with a React 19.2 + React Router 7.14 + Tailwind CSS 4 Vite frontend spanning 12 student and admin views."
media:
  poster: "/media/projects/resource-hub/poster.webp"
  architectureSvgId: "resource-hub-arch"
  gallery:
    - src: "/media/projects/resource-hub/screen-1.webp"
      alt: "Resource Hub dashboard"
      caption: "Admin moderation dashboard"
    - src: "/media/projects/resource-hub/screen-2.webp"
      alt: "File upload verification"
      caption: "Upload verification workflow"
---

## Architecture & Deep Dive

The Resource Hub uses a classic three-tier architecture: a React 19 SPA frontend, an Express.js REST API, and a MongoDB database, containerized via Docker Compose.

### Security Model

The download security model splits the signing and streaming phases. When a user requests a file, the server issues a short-lived signed token. When that token is redeemed, the server re-checks the user's current RBAC permissions and the resource's moderation status before streaming. This eliminates stale-permission vulnerabilities where a pre-signed URL outlives the user's access rights.

### Upload Pipeline

Uploaded files pass through multer for multipart handling, then magic-byte inspection via the `file-type` library to reject MIME-spoofed files. Path-traversal attacks are prevented by strict filename sanitization. Files support non-destructive versioning with independent download links per version.

### Testing Strategy

Six integration test suites run against a real in-memory MongoDB instance (mongodb-memory-server), covering authentication flows, RBAC enforcement, resource CRUD, download security, bulk verification, and document preview extraction. This approach tests actual database interactions rather than mocking them.
