---
title: "Kitchen Chaos"
track: "gameplay"
tier: "side"
canonicalStage: "2-1"
orderDefault: 6
orderGameplay: 6
orderSystems: 8
statuses: ["TUTORIAL-BASED", "PROTOTYPE"]
role: "Gameplay Programmer"
timeline: "2024 – 2025"
platform: "Unity 3D (URP) · PC"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "URP", "ScriptableObjects", "New Input System", "Cinemachine"]
links:
  repo: "https://github.com/Beerkanwar/KitchenChaos"
hook: "Overcooked-style 3D cooking simulation — built on a CodeMonkey tutorial base, structured around polymorphic station contracts, ScriptableObject recipes, and static-event lifecycle safety."
mission: "Implement a fast-paced 3D cooking loop in Unity where players chop, fry, plate, and deliver multi-ingredient recipes under a 100-second round timer, using decoupled C# event architectures and data-driven ScriptableObject assets."
keySystems:
  - title: "Polymorphic Counter Hierarchy (BaseCounter + 7 Station Subclasses)"
    detail: "Defines virtual Interact(Player) and InteractAlternate(Player) contracts overridden independently by ClearCounter, CuttingCounter, StoveCounter (running its own 4-state Idle -> Frying -> Fried -> Burned machine), ContainerCounter, PlatesCounter, TrashCounter, and DeliveryCounter — eliminating centralized type-switch dispatchers."
  - title: "ScriptableObject Data Pipeline & Decoupled Event Bus"
    detail: "Authors all ingredients and state transitions as Unity assets (KitchenObjectSO, RecipeSO, CuttingRecipeSO, FryingRecipeSO, BurningRecipeSO). UI and audio subscribe to instance and static C# events, paired with a dedicated ResetStaticDataManager that explicitly clears static event delegates on scene reload to prevent memory leaks."
  - title: "CapsuleCast Axis-Sliding Movement & JSON-Persisted Input Rebinding"
    detail: "Player.HandleMovement() uses Physics.CapsuleCast and decomposes blocked diagonal movement into single-axis (X or Z) wall-sliding. GameInput wraps Unity's New Input System with runtime keyboard and gamepad rebinding persisted to PlayerPrefs as JSON."
scopeNote:
  baseName: "CodeMonkey Unity Tutorial Series"
  providedByBase:
    - "Core visual assets, kitchen prefabs, and foundational tutorial gameplay loop structure."
  builtByMe:
    - "Full C# implementation of the 8-class polymorphic BaseCounter hierarchy, independent StoveCounter 4-state machine, ResetStaticDataManager scene-reload memory-leak fix, CapsuleCast single-axis wall-sliding math, and JSON-serialized Keyboard + Gamepad runtime input rebinding."
media:
  poster: "/media/projects/kitchen-chaos/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

Kitchen Chaos implements a cooking simulation where every station type inherits from `BaseCounter` and overrides interaction contracts independently. The `StoveCounter` runs its own 4-state machine (Idle → Frying → Fried → Burned) with timer-based transitions.

All ingredient definitions and recipes are authored as ScriptableObject assets, making the game fully data-driven. The `ResetStaticDataManager` ensures static C# event delegates are properly cleared on scene reload to prevent memory leaks — a common pitfall in Unity projects using static events.
