---
title: "Roam"
track: "systems"
tier: "featured"
canonicalStage: "1-6"
orderDefault: 6
orderGameplay: 6
orderSystems: 4
statuses: ["PROTOTYPE"]
role: "Backend & Real-Time Systems Engineer"
timeline: "Oct 2026 (3-day intensive build)"
platform: "Web / Cross-Platform (.NET 10 API + React 19 + .NET MAUI)"
teamSize: "1 (Solo)"
stack: ["C#", ".NET 10", "ASP.NET Core", "SignalR", "WebRTC", "PostgreSQL", "PostGIS", "Redis", "React 19", "TypeScript", "MapLibre GL", ".NET MAUI", "xUnit", "Testcontainers", "Docker Compose"]
links:
  repo: "https://github.com/Beerkanwar/Roam"
hook: "An open-source real-time platform for volunteer-guided remote exploration — WebRTC audio/video signaling via SignalR, PostGIS geospatial proximity matching, coturn TURN credential generation, and a Testcontainers-backed integration test suite."
mission: "Design a privacy-respecting, non-commercial alternative to paid live-tour-guide apps: a volunteer streams their perspective to a remote requester via WebRTC without revealing their GPS location, backed by a modular-monolith .NET 10 API with clean layered architecture, real geospatial queries, and a trust-and-safety subsystem."
keySystems:
  - title: "4-Hub SignalR Real-Time Architecture & TURN Credential Service (TourHub, NotificationHub, ChatHub, PresenceHub)"
    detail: "Four purpose-separated SignalR hubs handle session signaling (WebRTC SDP offer/answer, ICE candidates broadcast to Groups.OthersInGroup), notifications, chat, and presence independently. TurnService generates coturn REST-API-compatible, short-lived, per-user HMAC-SHA1 credentials (unix-timestamp:userId signed with the shared TURN secret) rather than static shared passwords — the standard coturn long-term credential scheme, correctly securing the relay infrastructure."
  - title: "PostGIS Geospatial Proximity Matching & Cache-Aside Geocoding (TourRequestService + PlaceService)"
    detail: "GetNearbyRequestsAsync() uses EF Core's NetTopologySuite provider to translate Place.Location.IsWithinDistance(userLocation.Location, radiusMeters) into a native PostGIS ST_DWithin call, executing true geographic distance filtering inside PostgreSQL. PlaceService.SearchPlacesAsync() checks the local database first; only on a miss does it call the OpenStreetMap OsmGeocodingService, then persists results immediately so repeat lookups never hit the external API."
  - title: "Guarded State Machine with 14 States & Testcontainers Integration Suite (TourRequest.TransitionTo)"
    detail: "TourRequest.TransitionTo(target) encodes the full valid-transition graph (Draft → Published → Matching → Accepted → Confirmed → Active → Completed, plus Cancelled/Expired/Rejected/NoShow/SafetyTerminated off-ramps) as an explicit switch expression that throws InvalidOperationException on any disallowed transition. Tested parametrically via xUnit [Theory]/[InlineData] across five test projects, with the integration suite (Roam.IntegrationTests) provisioning a real postgis/postgis:15-3.3 Docker container per run via Testcontainers and exercising the full ASP.NET Core pipeline including authorization."
bossFight:
  title: "Real Geospatial Queries, TURN Security & Clean Layer Boundaries in a 3-Day Build"
  detail: "Three distinct challenges had to be solved correctly at once: (1) PostGIS spatial types require precise EF Core + NetTopologySuite wiring (SRID 4326 Point columns, ST_DWithin translation) or silently fall back to in-memory filtering; (2) coturn HMAC credential generation must exactly match the expected {timestamp}:{userId}/HMAC-SHA1/Base64 format or TURN auth fails silently at the client; (3) the modular-monolith layer boundary (Application references only Domain, never Infrastructure) requires DI composition to happen exclusively in the Api project without shortcuts — all three were implemented correctly and verified by the integration test suite."
loot:
  - "Clean/onion architecture: Roam.Domain → Roam.Contracts → Roam.Application (interfaces only) → Roam.Infrastructure (EF Core, Redis, SignalR, coturn, OSM geocoding) → Roam.Api (minimal-API endpoint groups, SignalR hubs, DI root). ProjectReference analysis confirms zero circular or backward dependencies."
  - "Payments module uses full DDD encapsulation: private setters, validating constructors, private parameterless EF Core constructor, and explicit state-transition methods (MarkCompleted()/MarkFailed())."
  - "Functioning React 19 WebRTC client (LiveSession.tsx, 277 lines) constructs RTCPeerConnection, calls getUserMedia({ video: true, audio: true }), and exchanges SDP offers via the SignalR signaling layer — end-to-end video pipeline verified on the web client."
  - "Trust & Safety module: weighted reliability-event ledger (AppendReliabilityEventAsync with explicit per-event weight), user blocking/unblocking, and auditable moderation-action trail via ModerationAuditLog."
scopeNote:
  baseName: "New Project (no template base)"
  providedByBase: []
  builtByMe:
    - "Entire .NET 10 modular-monolith backend (Domain, Contracts, Application, Infrastructure, Api projects)"
    - "All 6 bounded-context domain modules (Users, Places, TourRequests, TourSessions, Chat, Trust & Safety, Payments)"
    - "Four SignalR hubs (TourHub, NotificationHub, ChatHub, PresenceHub)"
    - "coturn-compatible TURN credential service (HMAC-SHA1 generation)"
    - "PostGIS + NetTopologySuite geospatial proximity matching"
    - "Cache-aside OSM geocoding with automatic persistence"
    - "TourRequest state machine (14 states, guarded transitions)"
    - "Testcontainers-backed integration test suite (real postgis Docker container)"
    - "React 19 / MapLibre web client including working WebRTC LiveSession component"
    - ".NET MAUI cross-platform native client (scaffolded)"
media:
  poster: "/media/projects/roam/poster.webp"
  architectureSvgId: "roam-arch"
  gallery:
    - src: "/media/projects/roam/screen-1.webp"
      alt: "Roam volunteer matching map"
      caption: "PostGIS geospatial volunteer matching"
    - src: "/media/projects/roam/screen-2.webp"
      alt: "Roam live session WebRTC"
      caption: "Live WebRTC session view"
---

## Architecture & Deep Dive

Roam is structured as a modular monolith with strict one-way dependency flow: **Domain → Contracts → Application → Infrastructure → Api**. The Application layer holds only service interfaces; all concrete implementations (EF Core, Redis, SignalR, coturn, OSM geocoding) live in Infrastructure, keeping domain logic free of infrastructure dependencies.

### Real-Time Signaling

Four purpose-separated SignalR hubs handle distinct concerns: `TourHub` manages WebRTC signaling (SDP offer/answer, ICE candidate relay scoped to session groups), `NotificationHub` handles push alerts, `ChatHub` handles in-session messaging, and `PresenceHub` tracks online state. Using `Groups.AddToGroupAsync` ensures signaling messages only reach participants of a specific tour session.

### WebRTC Infrastructure

`TurnService` implements the standard coturn long-term REST credential mechanism: a username of `{unix-timestamp-24h-from-now}:{userId}` HMAC-SHA1-signed with the shared TURN secret and Base64-encoded. Credentials are short-lived and user-scoped — no static shared password in client code.

### Geospatial Matching

`TourRequestService.GetNearbyRequestsAsync()` queries `Place.Location.IsWithinDistance(userLocation.Location, radiusMeters)`, which EF Core's NetTopologySuite provider translates into a `ST_DWithin` call executed entirely in PostgreSQL — true geodetic distance, not bounding-box approximation.

### Domain State Machine

`TourRequest.TransitionTo(TourRequestStatus target)` is a guarded switch expression encoding all valid transitions across 14 states. Any disallowed transition throws `InvalidOperationException`, preventing invalid state corruption from any caller. The state machine is fully covered by `TourRequestStateMachineTests` using `[Theory]` + `[InlineData]`.

### Testing Strategy

Five test projects cover the full stack: `Roam.Domain.Tests` (pure state-machine logic), `Roam.Application.Tests`, `Roam.Infrastructure.Tests`, `Roam.Api.Tests` (including `AuthorizationTests.cs`), and `Roam.IntegrationTests` — which provisions a real `postgis/postgis:15-3.3` container via Testcontainers and exercises HTTP requests against the full ASP.NET Core pipeline via `IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime`.
