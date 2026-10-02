---
title: "Flappy Bird"
track: "gameplay"
tier: "side"
canonicalStage: "2-3"
orderDefault: 8
orderGameplay: 8
orderSystems: 12
statuses: ["PROTOTYPE"]
role: "Gameplay Programmer"
timeline: "2025"
platform: "Unity 2D (URP) · PC"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "Rigidbody2D", "Object Pooling", "New Input System"]
links:
  repo: "https://github.com/Beerkanwar/FlappyBird"
relatedProject:
  title: "Reinforcement Learning on Flappy Bird"
  slug: "flappy-bird-rl"
  relation: "Trained with PPO in Stage 1-2"
hook: "The physics-driven base game later used as a reinforcement-learning environment, featuring zero-allocation circular pipe pooling and event-driven scoring."
mission: "Build a tight, zero-garbage-collection 2D Flappy Bird mechanics loop in Unity using Rigidbody2D physics and fixed-array obstacle recycling, serving both as a standalone arcade game and as the foundation for the ML-Agents PPO project."
keySystems:
  - title: "Zero-Allocation Circular Pipe Pool (PipesManager.cs)"
    detail: "Allocates exactly 10 pipe-pair instances once in Awake(). As pipes scroll at a constant horizontal speed (-6.0f) past -initialXPos, the manager shifts the leading pipe index (firstInLine wrapped via modulo) to the back of the line with a fresh randomized gap height — zero Instantiate() or Destroy() calls during gameplay."
  - title: "Physics-Driven Flight Controller (PlayerMovement.cs)"
    detail: "Applies vertical impulse directly via rb.linearVelocityY = jumpForce on New Input System callbacks while relying on Unity's Rigidbody2D gravity simulation for natural parabolic arcs."
  - title: "Modulo Index-Pointer Scoring & Event Decoupling"
    detail: "Tracks the next upcoming pipe via a wrapping nextScoringPipe pointer (% numberOfPipes) and fires OnScoreIncrease as it crosses X = 0, decoupling UI and audio listeners from obstacle movement."
media:
  poster: "/media/projects/flappy-bird/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

Flappy Bird implements a zero-allocation gameplay loop where all 10 pipe pairs are pre-instantiated and recycled via a circular index pointer. The pipe speed is a fixed constant (-6.0f) — there is no runtime difficulty scaling.

The scoring system uses a modulo-wrapped pointer to track which pipe is next to be scored, firing an event when the player crosses X = 0. This cleanly decouples scoring from both movement and rendering.
