---
title: "Minesweeper"
track: "gameplay"
tier: "side"
canonicalStage: "2-2"
orderDefault: 7
orderGameplay: 7
orderSystems: 7
statuses: ["PROTOTYPE"]
role: "Gameplay & UI Programmer"
timeline: "2025"
platform: "Unity 2D (URP) · PC"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "Algorithms (BFS)", "Unity UI", "MVC Pattern", "TextMeshPro"]
links:
  repo: "https://github.com/Beerkanwar/Minesweeper"
hook: "From-scratch Minesweeper supporting boards up to 24x30 (180 mines) with strict Model-View separation, iterative BFS flood-fill, and runtime canvas auto-scaling."
mission: "Build a clean, from-scratch Minesweeper implementation in Unity that scales from 9x9 Easy grids to 24x30 Expert grids on any screen resolution without per-level layout hardcoding or recursive stack-overflow risk."
keySystems:
  - title: "Strict Model/View Split (Cell.cs vs. Tile.cs)"
    detail: "Cell is a pure C# class (not a MonoBehaviour) holding Row, Column, IsMine, AdjacentMines, IsFlagged, and IsRevealed, exposing an Action OnStateChanged event. The Unity Tile view component subscribes in Initialize() and updates visuals strictly on state-change events without frame polling."
  - title: "Iterative BFS Flood-Fill & O(1) HashSet Mine Placement (TileManager.cs)"
    detail: "Generates unique mine indices using a HashSet<int> for O(1) duplicate avoidance, and reveals connected zero-adjacency regions via an iterative Breadth-First Search (Queue<Tuple<int,int>> + explicit visited matrix) rather than recursion."
  - title: "Live Canvas Resolution Grid Auto-Scaler"
    detail: "Computes optimal square tile dimensions at runtime from actual canvas pixel width/height minus fixed padding (10px/side), border (8px/side), and inter-tile spacing (5px) across all 4 tiers: Easy (9x9, 10 mines), Medium (16x16, 40 mines), Hard (16x30, 99 mines), and Expert (24x30, 180 mines)."
media:
  poster: "/media/projects/minesweeper/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

Minesweeper uses a strict MVC separation where `Cell` (model) is a pure C# class and `Tile` (view) is a Unity MonoBehaviour that subscribes to state change events. This eliminates frame-polling and keeps game logic testable independently of Unity.

The flood-fill algorithm uses an iterative BFS with an explicit queue and visited matrix, avoiding recursive stack overflow on large boards. Mine placement uses a HashSet for O(1) duplicate detection.
