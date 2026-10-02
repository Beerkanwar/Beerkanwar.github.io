---
title: "Algorithm Benchmarker"
track: "systems"
tier: "featured"
canonicalStage: "1-3"
orderDefault: 3
orderGameplay: 4
orderSystems: 3
statuses: ["PROTOTYPE"]
role: "Software / Systems Engineer"
timeline: "2025 – 2026"
platform: "Windows Desktop (.NET 8.0 / WPF)"
teamSize: "1 (Solo)"
stack: ["C# 12", ".NET 8.0", "WPF (MVVM)", "SQLite", "LiveChartsCore", "Dependency Injection"]
links:
  repo: "https://github.com/Beerkanwar/AlgorithmBenchmarker"
hook: "A .NET 8 WPF desktop profiling suite that auto-discovers 51 algorithms across 10 CS domains and empirically verifies Big-O complexity using least-squares regression."
mission: "Go beyond naive wall-clock stopwatch scripts by building a testable, extensible desktop benchmarking harness capable of adversarial worst-case generation, empirical Big-O curve fitting, JIT warmup isolation, and SQLite run persistence."
keySystems:
  - title: "Reflection Auto-Discovery of 51 Algorithms Across 10 Domains (IAlgorithm & AlgorithmRegistry)"
    detail: "Follows the Open-Closed Principle via a single contract (Name, Category, Complexity, Execute(object input)). AlgorithmRegistry scans assemblies via reflection at startup to populate the UI automatically with 51 implementations across Sorting (6), Searching (5), Graph (6), Routing (6), Dynamic Programming (5), Indexing (6), Machine Learning (6), Encryption (5), Compression (5), and Data Structures (1)."
  - title: "10 Research-Grade Profiling & Verification Services (Services/Profiling/)"
    detail: "Includes TheoreticalBoundVerificationEngine (fits R-squared least-squares regressions against candidate Big-O curves), AdversarialEngine (generates pathological worst-case inputs), ExecutionTracer ([ThreadStatic] step counters), AmdahlAnalyzer (synchronized barrier concurrency scaling), CacheLocalityAnalyzer (stride-based cache-miss math), JitWarmupProfiler, GcTopologyProfiler, EnergyEstimator, AlgorithmicPhaseTransitionDetector, and DragRaceOrchestrator."
  - title: "DI-Backed MVVM Architecture with SQLite Persistence & LiveCharts2"
    detail: "MainViewModel uses Microsoft.Extensions.DependencyInjection (10.0.2) and CommunityToolkit.Mvvm (8.4.0) to orchestrate cancellable async benchmark sweeps (CancellationTokenSource), persisting telemetry to a local SQLite database (Microsoft.Data.Sqlite 10.0.2) and rendering real-time charts via LiveChartsCore.SkiaSharpView.WPF (2.0.0)."
bossFight:
  title: "Separating True Algorithmic Complexity from .NET JIT Warmup & GC Noise"
  detail: "Raw wall-clock timings on managed runtimes are heavily distorted by first-call JIT compilation and mid-run garbage collection pauses. Building dedicated JitWarmupProfiler and GcTopologyProfiler passes alongside thread-local operation counters ([ThreadStatic] ExecutionTracer) allowed the TheoreticalBoundVerificationEngine to compute clean R-squared fits against theoretical asymptotic bounds."
loot:
  - "51 verified algorithm files across 10 domains: Sorting (Bubble, Insertion, Selection, Merge, Quick, Heap), Searching (Linear, Binary, Jump, Interpolation, Exponential), Graph (BFS, DFS, Dijkstra, Prim, Kruskal, Topological Sort), Routing (A*, Bellman-Ford, Floyd-Warshall, Distance Vector, Greedy Best-First, Dijkstra Routing), DP (0/1 Knapsack, Memoized Fibonacci, LCS, Coin Change, Matrix Chain), Indexing (BST, B-Tree, Hash Table, Linear Scan, 2x Trie), ML (K-Means, Linear/Logistic Regression, Naive Bayes, Perceptron, Matrix Mul), Encryption (AES, DES, RSA, ChaCha20, SHA-256), and Compression (Huffman, RLE, Deflate, GZip, Brotli)."
  - "Three interactive execution modes: Standard Batch Profiler, Drag Race Mode (concurrent cloned-input comparison), and Phase Transition Sweeper."
media:
  poster: "/media/projects/algorithm-benchmarker/poster.webp"
  architectureSvgId: "algorithm-benchmarker-arch"
  gallery:
    - src: "/media/projects/algorithm-benchmarker/screen-1.webp"
      alt: "Algorithm Benchmarker main interface"
      caption: "Main profiling interface"
    - src: "/media/projects/algorithm-benchmarker/screen-2.webp"
      alt: "Big-O regression chart"
      caption: "Empirical complexity verification"
---

## Architecture & Deep Dive

The benchmarker follows a strict MVVM architecture with dependency injection at its core. At startup, `AlgorithmRegistry` scans loaded assemblies for types implementing `IAlgorithm`, automatically populating the UI without requiring manual registration.

### Profiling Pipeline

Each benchmark sweep runs through multiple profiling passes: JIT warmup isolation (discarding first-run timings), GC topology profiling (forcing collections between runs), and thread-local operation counting via `[ThreadStatic]` `ExecutionTracer` fields. This multi-pass approach separates true algorithmic behavior from runtime noise.

### Complexity Verification

The `TheoreticalBoundVerificationEngine` fits measured operation counts against candidate complexity functions (O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)) using least-squares regression, reporting R² scores to empirically verify each algorithm's theoretical bound.

### Execution Modes

Three distinct modes serve different analysis goals: **Standard Batch** profiles a single algorithm across input sizes, **Drag Race** runs two algorithms on cloned inputs for direct comparison, and **Phase Transition Sweeper** detects performance inflection points across input size ranges.
