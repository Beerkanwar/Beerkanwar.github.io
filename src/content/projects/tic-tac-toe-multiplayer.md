---
title: "Tic-Tac-Toe Multiplayer"
track: "both"
tier: "side"
canonicalStage: "2-5"
orderDefault: 10
orderGameplay: 10
orderSystems: 6
statuses: ["PROTOTYPE"]
role: "Multiplayer / Netcode Programmer"
timeline: "2025"
platform: "Unity 2D · PC (Networked)"
teamSize: "1 (Solo)"
stack: ["Unity", "C#", "Netcode for GameObjects 2.8.1", "Multiplayer Services", "Server Authority"]
links:
  repo: "https://github.com/Beerkanwar/TicTacToe"
hook: "A real-time 2-player networked game built on Unity Netcode for GameObjects (NGO) with strict server-authoritative move validation and replicated state."
mission: "Implement a tamper-resistant client-server multiplayer architecture in Unity where clients submit unvalidated move intents via RPCs and the server acts as the single source of truth."
keySystems:
  - title: "Server-Authoritative RPC Move Validation (GameManager.cs)"
    detail: "Clients invoke [Rpc(SendTo.Server)] ClickedOnGridPositionRpc(x, y, playerType). The server independently validates turn ownership (playerType == currentPlayablePlayerType.Value) and cell vacancy before mutating authoritative board state and broadcasting [Rpc(SendTo.ClientsAndHost)] visual triggers."
  - title: "Automatic State Replication via NetworkVariable<T>"
    detail: "Tracks currentPlayablePlayerType, playerCrossScore, and playerCircleScore as NetworkVariables whose OnValueChanged callbacks drive local UI updates across connected clients without manual score-sync packets."
  - title: "Precomputed 8-Line Win Evaluator & Deterministic Session Bootstrapping"
    detail: "Builds all 8 winning Line structs (3 grid coords, center cell reference, and Horizontal/Vertical/DiagonalA/DiagonalB orientation enum) once in Awake(), and auto-starts the match on the server the instant ConnectedClientsList.Count == 2."
media:
  poster: "/media/projects/tic-tac-toe-multiplayer/poster.webp"
  gallery: []
---

## Architecture & Deep Dive

This project implements server-authoritative multiplayer using Unity's Netcode for GameObjects (NGO). Clients send move intents as RPCs, but the server independently validates turn ownership and cell vacancy before accepting any move, preventing client-side cheating.

Game state is replicated automatically via `NetworkVariable<T>`, with UI updates driven by `OnValueChanged` callbacks rather than manual synchronization packets. The win evaluator precomputes all 8 winning line configurations once at startup.
