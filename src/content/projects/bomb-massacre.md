---
title: "Bomb Massacre"
track: "gameplay"
tier: "side"
canonicalStage: "2-7"
orderDefault: 12
orderGameplay: 12
orderSystems: 11
statuses: ["JAM", "TEMPLATE-BASED", "PLAYABLE"]
role: "Programmer"
timeline: "GMTK Game Jam 2026"
platform: "WebGL (itch.io) & Windows · Unity 6"
teamSize: "2"
stack: ["Unity 6 (6000.5.4f1)", "C#", "URP", "New Input System", "Tiled (.tmx)", "Aseprite"]
links:
  itch: "https://beer-23.itch.io/bomb-massacre"
  itchEmbedUrl: "https://itch.io/embed-upload/18550070?color=333333"
  repo: "https://github.com/Beerkanwar/BombMassacre"
controlsText: "WASD / Arrow Keys: Move · Space: Jump · B: Pick Up / Throw Bomb · Esc: Pause"
hook: "A GMTK Game Jam 2D platformer where the longer you carry a bomb before throwing it, the larger its terrain-carving blast radius grows."
mission: "Build a 2D action platformer for the GMTK Game Jam around a high-risk 'cook-the-bomb' mechanic where blasts carve circular craters out of destructible tilemap geometry and eliminate enemies, extending Unity's 2D Platformer Microgame template under strict jam time constraints."
keySystems:
  - title: "Single-Button Cook-to-Throw Bomb Loop & Fixed Pool of 3 (PlayerController.cs & BombHandler.cs)"
    detail: "Pressing the Bomb action dequeues a bomb from a pre-instantiated Queue<GameObject> pool of 3, parents it to bombCarryPosition, and switches its Rigidbody2D to Kinematic. While carried, maxHoldTimer increments each frame, growing explosionRadius in discrete +1f per-second steps from 1f up to 3f over a 5-second maxHoldTime while syncing the fuse sprite frame (FloorToInt(maxHoldTimer / (maxHoldTime / spriteCount))). Holding past 5s explodes the bomb in the player's hands; pressing Bomb again unparents and launches it along Vector2(facingDirection, 0.5f).normalized."
  - title: "Circular Bounding-Grid Tilemap Crater Carving (DestroyTilesInRadius)"
    detail: "Converts the explosion's world-space center to Tilemap cell coordinates, iterates a bounding square of CeilToInt(radius) cells in each axis, converts each candidate cell back to world space, and clears only cells satisfying Vector2.Distance(center, cellWorldPos) <= radius — carving true circular craters out of a square grid alongside standalone 2-HP DestructibleBlock objects."
  - title: "Single-Scene Spawn-Point Level Flow, Checkpoints & Tiled Pipeline"
    detail: "Authors levels externally in Tiled Map Editor (Bombs.tmx, BombsLevel1.tmx, BombsLevel2.tmx, BombsLevel2f.tmx) and switches levels within a single Unity scene by updating PlatformerModel.spawnPoint and scheduling a PlayerSpawn event via the template's Simulation queue, paired with trigger-based Checkpoint.cs actors."
scopeNote:
  baseName: "Unity 2D Platformer Microgame Template"
  providedByBase:
    - "Core player horizontal movement/jump physics, patrol-path EnemyController AI, the Simulation / HeapQueue / Fuzzy discrete-event scheduling framework, KinematicObject, ParallaxLayer, and AnimationController."
  builtByMe:
    - "The complete bomb pickup/cook/throw/explode system (BombHandler & PlayerController bomb logic), circular tilemap destruction algorithm (DestroyTilesInRadius), 2-HP cracked-sprite DestructibleBlock, Checkpoint respawn integration, single-scene LevelSelectMenu, procedural fallback explosion sprite generator, and all Tiled (.tmx) level designs."
bossFight:
  title: "The Boss I Didn't Build (Scope Discipline) & Mid-Physics-Callback Safety"
  detail: "An elaborate end-of-game boss fight was part of the initial jam concept, but was deliberately cut mid-jam to prevent feature creep from compromising the core mechanic. Instead, that time went into polishing the 3-bomb pool, deferring collision explosions via an explodeNextFrame flag so tile destruction never executes mid-OnCollisionEnter2D physics callback, adding an explicit distance check so the player takes blast damage even if physics layer masks are misconfigured, and writing a procedural 64x64 Texture2D circle generator as a visual fallback."
loot:
  - "Shipped a complete, playable WebGL build to itch.io before the GMTK Game Jam deadline with full source code on GitHub."
  - "Includes defensive jam-time fallbacks: runtime procedural 64x64 circle sprite generation with coroutine fade-out when no VFX prefab is assigned, and [ContextMenu] editor test hooks on DestructibleBlock."
media:
  poster: "/media/projects/bomb-massacre/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

Bomb Massacre extends Unity's 2D Platformer Microgame template with an original bomb mechanic designed under game jam time pressure. The core loop revolves around a cook-to-throw risk/reward system backed by a fixed pool of 3 bombs.

### Bomb Mechanic

Picking up a bomb starts a hold timer that grows the explosion radius in discrete steps (1f → 2f → 3f over 5 seconds). Holding too long detonates the bomb in the player's hands. The fuse sprite animates in sync with the timer via integer frame indexing.

### Tilemap Destruction

The `DestroyTilesInRadius` algorithm converts world-space positions to tilemap cell coordinates, iterates a bounding square, and clears only cells within the circular radius — creating true circular craters in the square-grid tilemap. Explosions are deferred via an `explodeNextFrame` flag to avoid mutating tilemaps during physics callbacks.

### Scope Discipline

The planned boss fight was deliberately cut mid-jam to focus on polishing the core mechanic, defensive fallbacks (procedural explosion sprites), and level design quality.

