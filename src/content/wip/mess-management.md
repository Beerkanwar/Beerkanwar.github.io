---
order: 1
title: "Hostel Mess Management System (Offline-First)"
track: "systems"
phase: "Plan"
phaseNote: "Phase: Plan Complete → Entering Prototype (SRS, SDD, FlowDoc, and DBDD finalized; multi-project .NET 10 solution scaffolded)"
hook: "An offline-first meal attendance and billing platform for university hostel messes — operates seamlessly without internet and synchronizes when connectivity returns."
whatItIs: "Tracks daily meal attendance, rebates, and monthly billing across hostel messes with role-based workflows for Student, Mess Manager, Hostel Clerk, and Super Admin. Every device persists operations to a local SQLite database first and synchronizes deltas with a central SQL Server backend."
stack: [".NET 10", ".NET MAUI", "ASP.NET Core", "SQLite (Local)", "SQL Server (Central)", "C#"]
platforms: "Windows & Android (Primary targets); iOS & macOS planned from the shared .NET MAUI codebase"
architectureHighlights:
  - "Spec-first engineering workflow: complete Software Requirements Specification (SRS), Software Design Document (SDD), Flow Document (FlowDoc), and Database Design Document (DBDD) authored prior to implementation."
  - "Unified multi-project .NET 10 solution separating the .NET MAUI cross-platform client, ASP.NET Core REST API, and shared domain/sync class libraries."
  - "Offline-first local SQLite storage engine designed for zero-latency mess counter check-ins during campus Wi-Fi outages."
doneSoFar:
  - "Completed SRS, SDD, FlowDoc, and DBDD technical specifications."
  - "Scaffolded the unified .NET 10 solution structure (MAUI Client + ASP.NET Core API + Shared Libraries)."
currentFocus: "Implementing local SQLite entity schemas and repository layer inside the shared client library."
nextMilestone: "First vertical slice: offline meal attendance entry on Windows & Android syncing to the central SQL Server API."
plannedFeaturesNote: "Role-based billing dashboards, automated conflict resolution during background sync, and iOS/macOS builds are currently in the planned stage."
devLog:
  - date: "2026-09"
    entry: "Scaffolded unified .NET 10 solution (MAUI client + ASP.NET Core API + shared domain libraries)."
  - date: "2026-08"
    entry: "Finalized Database Design Document (DBDD) and offline sync state flows (FlowDoc)."
  - date: "2026-07"
    entry: "Completed SRS and SDD defining Student, Mess Manager, Hostel Clerk, and Super Admin RBAC boundaries."
---
