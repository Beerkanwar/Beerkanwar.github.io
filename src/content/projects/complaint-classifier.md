---
title: "Complaint Classifier System"
track: "systems"
tier: "featured"
canonicalStage: "1-4"
orderDefault: 4
orderGameplay: 5
orderSystems: 2
statuses: ["PROTOTYPE"]
role: "ML-focused role (did not handle frontend)"
timeline: "2025"
platform: "Web Application (Node.js + Python FastAPI Microservice)"
teamSize: "2"
stack: ["Node.js", "Express", "Python", "FastAPI", "scikit-learn", "TF-IDF"]
links:
  repo: "https://github.com/Beerkanwar/ComplaintPortal"
hook: "A two-service student complaint triage system pairing a 3-model scikit-learn FastAPI inference server with a two-layer circuit-breaker fallback architecture."
mission: "Automate campus complaint routing by predicting complaint category, location, and priority from free-form student text using locally trained machine-learning models, while guaranteeing 100% system availability even if the ML service times out or fails."
keySystems:
  - title: "Multi-Output TF-IDF + 3 Independent scikit-learn Classifiers (model_server.py)"
    detail: "Loads four serialized joblib artifacts at FastAPI startup: tfidf_vectorizer.joblib, model_complaint_type.joblib, model_location.joblib, and model_priority.joblib (trained on a ~4,000-row dataset, cleaned_complaints_dataset.csv). Vectorizes incoming text once and runs inference across all three classifiers, extracting predict_proba().max() as a confidence score alongside an auto-generated 12-word summary."
  - title: "Two-Layer Independent Graceful Degradation (server.js & model_server.py)"
    detail: "Layer 1 (Python): If joblib artifacts fail to load at startup, FastAPI automatically falls back to a deterministic rule_based_classify() keyword engine covering 8 campus categories. Layer 2 (Node.js): Express wraps every HTTP call to FastAPI in an 8-second AbortController timeout; if the Python service is unreachable or slow, Node falls back to its own dummyClassify() engine and tags the payload with fallback: true and an explicit fallback_reason."
  - title: "Zero-Restart Runtime Configuration API (/config & /health)"
    detail: "Exposes GET/POST /config endpoints backed by a mutable in-memory configuration store so administrators can hot-swap between real ML inference and dummy fallback modes or update the FastAPI endpoint URL at runtime without restarting the Node server."
bossFight:
  title: "Preventing Cascading Failures Between the Node API Gateway and Python Inference Process"
  detail: "In a microservice split, a hung Python worker or missing model artifact can block the main web server indefinitely. Enforcing an 8-second AbortController timeout on the Node client paired with dual independent rule-based fallbacks ensured the student submission flow never breaks and transparently reports degraded predictions via fallback_reason."
loot:
  - "4 serialized production artifacts verified in Models/ trained on ~4,000 synthetic/cleaned student complaint records covering Electricity, Water Supply, IT/Network, Hostel, Civil/Infrastructure, Mess/Canteen, Library, and Transport."
  - "6 REST endpoints verified: POST /classify, POST /submit, GET /complaints, DELETE /complaints/:id, GET /health, and GET/POST /config."
media:
  poster: "/media/projects/complaint-classifier/poster.webp"
  architectureSvgId: "complaint-classifier-arch"
  gallery:
    - src: "/media/projects/complaint-classifier/screen-1.webp"
      alt: "Complaint submission interface"
      caption: "Student complaint form"
    - src: "/media/projects/complaint-classifier/screen-2.webp"
      alt: "Classification results"
      caption: "ML prediction output"
---

## Architecture & Deep Dive

The system is split into two independent services communicating over HTTP: a Node.js/Express API gateway handling student requests, and a Python FastAPI inference server running the ML models.

### ML Pipeline

At startup, the FastAPI server loads a pre-fitted TF-IDF vectorizer and three independent scikit-learn classifiers from joblib artifacts. Incoming complaint text is vectorized once and passed through all three models (complaint type, location, priority) in parallel, with confidence scores extracted from `predict_proba()`.

### Resilience Architecture

The two-layer fallback design ensures the system never goes down. If Python's model artifacts fail to load, FastAPI falls back to a deterministic keyword-based classifier. If the entire Python service is unreachable, the Node.js layer has its own independent fallback classifier. Every degraded response is transparently tagged with `fallback: true` and a human-readable `fallback_reason`.

### Runtime Configuration

The `/config` API allows administrators to hot-swap between real ML inference and dummy mode, or update the Python service URL, all without restarting either service.
