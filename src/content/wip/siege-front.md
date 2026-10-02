---
order: 2
title: "Siege Front"
track: "gameplay"
phase: "Prototype"
phaseNote: "Phase: Prototype (Milestone 2: UI/UX & Core-Loop Polish)"
hook: "Generate battle energy, deploy specialized counter-troops down a single lane, and break the enemy cave in a mobile-first 2D auto-battler."
whatItIs: "A tactical 2D single-lane tug-of-war auto-battler built in Unity. Passive battle energy regenerates over time and is spent to deploy troops that march and fight autonomously. A rock-paper-scissors armor and damage-type matrix forces players to read and counter incoming enemy waves to destroy the enemy cave and survive boss encounters."
stack: ["Unity", "C#", "ScriptableObjects", "EventBus", "New Input System", "ObjectPool<T>"]
platforms: "Mobile-first 2D (Android primary; iOS & PC planned)"
architectureHighlights:
  - "Data-driven ScriptableObject blueprints for troop definitions and base stats, paired with a runtime dynamic stat-modifier pipeline."
  - "Generic ObjectPool<T> managing high-frequency unit spawning, recycling, and projectile lifecycles without runtime GC spikes."
  - "Pure C# state machines (including 4 completed boss state machines) communicating with UI and audio through a decoupled EventBus."
doneSoFar:
  - "Completed core entity architecture refactor and dynamic stat-modifier system."
  - "Implemented and verified 4 distinct pure-C# boss state machines and lane combat detection."
currentFocus: "Scene assembly, unit prefab configuration, and battle HUD integration (regenerating energy bar, troop deployment buttons, and unit health bars)."
nextMilestone: "End-to-end playable Wave 1 loop with HUD energy spending, pooled unit deployment, and cave destruction win/loss state."
plannedFeaturesNote: "Meta-game unit unlock progression, multi-stage campaign map, and iOS build packaging are planned for Alpha."
devLog:
  - date: "2026-09"
    entry: "Entered Milestone 2: wiring battle HUD (energy regeneration bar, troop spawn buttons, and floating health bars)."
  - date: "2026-08"
    entry: "Completed pure-C# state machines for all four boss encounters and generic ObjectPool<T> integration."
  - date: "2026-07"
    entry: "Refactored core combat entities around ScriptableObject stat blueprints and dynamic stat modifiers."
---
