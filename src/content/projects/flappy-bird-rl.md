---
title: "Reinforcement Learning on Flappy Bird"
track: "both"
tier: "featured"
canonicalStage: "1-2"
orderDefault: 2
orderGameplay: 2
orderSystems: 4
statuses: ["PROTOTYPE"]
role: "ML / Gameplay Engineer"
timeline: "2025"
platform: "Unity + Python (ML-Agents CLI)"
teamSize: "1 (Solo)"
stack: ["Unity ML-Agents 4.0.1", "PPO", "C#", "Python", "Rigidbody2D", "New Input System"]
links:
  repo: "https://github.com/Beerkanwar/FlappyBirdRL"
relatedProject:
  title: "Flappy Bird (Base Game)"
  slug: "flappy-bird"
  relation: "Built on top of Stage 2-3"
hook: "A Proximal Policy Optimization (PPO) agent trained over 500,000 steps in Unity ML-Agents to master Flappy Bird from a 4-value continuous observation vector."
mission: "Transform the physics-based Flappy Bird game into a rigorous reinforcement-learning training environment without altering the underlying physics or giving the AI agent mechanical capabilities unavailable to a human player."
keySystems:
  - title: "Minimal 4-Continuous-Observation & 2-Discrete-Action Specification (BirdAgent.cs)"
    detail: "CollectObservations() feeds exactly 4 continuous floats per step: (1) Player Y position, (2) Player vertical velocity, (3) vertical distance from player to the next pipe's gap center, and (4) next pipe's X position, guarded by a defensive null-check during singleton initialization. OnActionReceived() maps a single discrete branch (0 = no-op, 1 = jump) to the exact same Jump() method used by human input."
  - title: "Event-Driven Sparse + Dense Reward Shaping"
    detail: "Subscribes directly to the existing PipesManager.OnScoreIncrease event to grant a sparse +1.0 reward whenever a pipe is cleared, paired with a continuous +0.1 * Time.fixedDeltaTime survival shaping bonus every physics step so early-stage policies receive a gradient signal before clearing their first obstacle."
  - title: "Dual Heuristic / Autonomous Policy Architecture"
    detail: "Implements Heuristic() using Unity's New Input System to map the Spacebar directly into the discrete action buffer, allowing instant switching between human baseline play and trained neural-network inference via the Inspector Behavior Type dropdown without maintaining two codebases."
bossFight:
  title: "Cold-Start Sparse Reward Collapse & Episode Reset Race Conditions"
  detail: "With only a +1.0 reward on passing a pipe, early random policies crashed into the floor or ceiling before ever reaching the first gap, yielding zero learning signal. Adding the +0.1 * Time.fixedDeltaTime per-step survival shaping reward stabilized early exploration, while adding defensive null checks in OnEpisodeBegin() and CollectObservations() prevented first-frame singleton order crashes across 500,000 training steps."
loot:
  - "Completed two full training runs preserved in results/ (TestRun01 and FlappyBird_Run1) trained to 500,000 max steps."
  - "Verified PPO Hyperparameters (FlappyBirdConfig.yaml): Batch Size = 1024, Buffer Size = 10,240, Learning Rate = 3.0e-4 (linear decay), Beta (entropy) = 1.0e-2, Epsilon (clip) = 0.2, Lambda (GAE) = 0.95, Gamma = 0.99, Time Horizon = 64, 2 hidden layers x 128 units (normalize: false)."
media:
  poster: "/media/projects/flappy-bird-rl/poster.webp"
  architectureSvgId: "flappy-bird-rl-arch"
  gallery:
    - src: "/media/projects/flappy-bird-rl/screen-1.webp"
      alt: "PPO agent playing Flappy Bird"
      caption: "Trained agent navigating pipes"
    - src: "/media/projects/flappy-bird-rl/screen-2.webp"
      alt: "Training curves in TensorBoard"
      caption: "Training progress over 500K steps"
---

## Architecture & Deep Dive

The RL pipeline layers a `BirdAgent` MonoBehaviour on top of the existing Flappy Bird game without modifying physics or movement code. The agent observes the environment through 4 floats and outputs a single discrete action.

### Observation Space

The 4 continuous observations are carefully chosen to give the agent minimal but sufficient information: its own Y position and velocity (for trajectory prediction) and the next pipe's gap center Y and X position (for timing the jump). No pipe velocity observation is needed because pipes move at a fixed constant speed.

### Reward Architecture

The reward function combines sparse task rewards (+1.0 per pipe cleared via event subscription) with dense survival shaping (+0.1 × fixedDeltaTime per physics step). This two-tier design solved the cold-start problem where random policies would die before ever reaching a pipe.

### Training Configuration

Training used PPO with a batch size of 1024, buffer size of 10,240, and a linearly decaying learning rate starting at 3.0e-4. The policy network uses 2 hidden layers of 128 units each, trained for 500,000 total steps across two preserved runs.
