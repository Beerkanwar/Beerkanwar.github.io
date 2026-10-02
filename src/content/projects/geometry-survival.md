---
title: "Geometry Survival"
track: "gameplay"
tier: "side"
canonicalStage: "2-6"
orderDefault: 11
orderGameplay: 11
orderSystems: 10
statuses: ["PROTOTYPE"]
role: "Gameplay Programmer"
timeline: "2025"
platform: "Unity 3D (URP) · PC"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "URP", "MaterialPropertyBlock", "Object Pooling", "New Input System"]
links:
  repo: "https://github.com/Beerkanwar/GeometrySurvival"
hook: "A 3D top-down twin-stick survival shooter featuring ground-plane raycast aiming, dual independent object pools, and batching-safe shader dissolve effects."
mission: "Build a responsive 3D top-down shooter arena capable of handling continuous projectile fire and enemy waves without frame-time spikes or broken GPU draw-call batching."
keySystems:
  - title: "Ground-Plane Raycast Mouse Aiming Decoupled from Movement (PlayerController.cs)"
    detail: "Separates unit-clamped WASD Rigidbody velocity from cursor aiming by casting a Physics.Raycast from the camera through the mouse screen position against a dedicated groundLayer to compute exact world-space look rotation."
  - title: "Dual Independent Object Pools (ObjectPool & EnemySpawner)"
    detail: "Implements pre-warmed, self-expanding object pools twice independently — once for high-frequency player bullets and once for enemy wave spawning and recycling."
  - title: "GPU-Batching-Safe Dissolve Shader Animation (EnemyHealth.cs)"
    detail: "Animates _DissolveStrength during enemy spawn-in and death using a MaterialPropertyBlock rather than material.SetFloat, preventing per-enemy material duplication and preserving GPU draw-call batching while disabling colliders mid-dissolve to prevent double-hit bugs."
media:
  poster: "/media/projects/geometry-survival/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

Geometry Survival separates movement from aiming by raycasting against a dedicated ground plane layer, computing world-space aim direction independently of WASD velocity input.

The dissolve shader effect uses `MaterialPropertyBlock` instead of direct material property modification, preventing Unity from creating per-instance material copies that would break GPU draw-call batching. Colliders are disabled during the dissolve animation to prevent double-hit bugs.
