---
order: 1
title: "Hostel Mess Management System (Offline-First)"
track: "systems"
phase: "Plan"
phaseNote: "Phase: Plan Complete → Entering Prototype (SRS, SDD, FlowDoc, and DBDD finalized; Django/DRF backend & Expo client scaffolded)"
hook: "An offline-first meal attendance and billing platform for university hostel messes — operates seamlessly without internet and synchronizes when connectivity returns."
whatItIs: "Tracks daily meal attendance, rebates, and monthly billing across hostel messes with role-based workflows for Student, Mess Manager, Hostel Clerk, and Super Admin. Mobile clients persist operations locally first with offline storage and synchronize deltas with a central Django REST Framework + PostgreSQL backend."
stack: ["Django", "Django REST Framework", "PostgreSQL", "React", "React Native", "Expo", "TypeScript", "Python"]
platforms: "Web (React Admin/Clerk Portal) & Mobile (React Native / Expo for Android & iOS)"
architectureHighlights:
  - "Spec-first engineering workflow: complete Software Requirements Specification (SRS), Software Design Document (SDD), Flow Document (FlowDoc), and Database Design Document (DBDD) authored prior to implementation."
  - "Decoupled architecture: Django REST Framework backend with PostgreSQL, paired with a React Web dashboard and React Native (Expo) cross-platform mobile client."
  - "Offline-first local storage engine designed for zero-latency mess counter check-ins during campus Wi-Fi outages with delta synchronization."
doneSoFar:
  - "Completed SRS, SDD, FlowDoc, and DBDD technical specifications."
  - "Scaffolded Django REST Framework backend schemas and React / React Native client projects."
currentFocus: "Implementing offline delta sync queue and role-based API authentication."
nextMilestone: "First vertical slice: offline meal attendance check-in on mobile syncing to the central DRF + PostgreSQL backend."
plannedFeaturesNote: "Role-based billing analytics dashboards, automated conflict resolution during background sync, and automated rebate processing."
devLog:
  - date: "2026-09"
    entry: "Scaffolded Django REST Framework backend with PostgreSQL and React Native (Expo) mobile client structure."
  - date: "2026-08"
    entry: "Finalized Database Design Document (DBDD) and offline delta synchronization state flows (FlowDoc)."
  - date: "2026-07"
    entry: "Completed SRS and SDD defining Student, Mess Manager, Hostel Clerk, and Super Admin RBAC boundaries."
---
