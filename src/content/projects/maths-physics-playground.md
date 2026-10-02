---
title: "Maths & Physics Playground"
track: "gameplay"
tier: "side"
canonicalStage: "2-4"
orderDefault: 9
orderGameplay: 9
orderSystems: 9
statuses: ["PROTOTYPE"]
role: "Gameplay Math & Systems Programmer"
timeline: "2025"
platform: "Unity 3D · PC"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "Vector Math", "Control Theory (P-Controller)", "Object Pooling", "Gizmos"]
links:
  repo: "https://github.com/Beerkanwar/MathsAndPhysicsPlayground"
hook: "An applied linear-algebra sandbox demonstrating XZ-plane flattened FOV detection, cross-product proportional turret aiming, and self-expanding object pools."
mission: "Solve common 3D gameplay-math bugs from first principles using dot products, cross products, and subspace projection rather than black-box engine helpers."
keySystems:
  - title: "Dimension-Reduced XZ-Plane Field-of-View Detection (EnemyVision.cs)"
    detail: "Flattens both the observer's forward vector and the direction-to-target onto the XZ plane (zeroing Y before normalizing) prior to computing the dot product against cos(viewAngle / 2). Prevents elevation differences from causing false-positive or false-negative 3D cone checks, visualized live with green/red Editor Gizmos."
  - title: "Un-Normalized Cross-Product Proportional Turret Controller (TurretLogic.cs)"
    detail: "Computes the cross product of the flattened turret forward vector and flattened target direction, intentionally omitting normalization so the resulting Y component's magnitude scales proportionally with angular error. Acts as a natural P-controller that decelerates smoothly into alignment without bang-bang overshoot jitter."
  - title: "Gracefully Self-Expanding Projectile Pool (ObjectPool.cs & PooledObject.cs)"
    detail: "Pre-warms inactive projectiles at Start() and dynamically instantiates and registers additional instances on the fly if sustained fire exhausts the active pool, resetting lifetime timers in OnEnable()."
media:
  poster: "/media/projects/maths-physics-playground/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

This project solves three common 3D gameplay-math problems from first principles: field-of-view detection, smooth turret tracking, and efficient projectile management.

The FOV system flattens vectors to the XZ plane before dot-product comparison, preventing Y-axis elevation from corrupting horizontal angle checks. The turret controller uses an un-normalized cross product as a natural proportional controller — angular error directly maps to rotation speed without needing explicit PID tuning.
