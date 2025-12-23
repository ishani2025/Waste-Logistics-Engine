# Network Optimizer – Smart Waste Network Optimization System

## Project Overview

The **Network Optimizer** is a smart waste management optimization system designed to model and analyze waste collection networks using classical graph algorithms. The project focuses on optimizing infrastructure cost and operational routing by applying **Minimum Spanning Tree (MST)** and **Shortest Path** algorithms.

The system is implemented as a **full-stack application** with:

* A **FastAPI backend** that performs graph computations
* A **modern frontend** that allows users to input graph data and visualize results

This project demonstrates the practical application of **Data Structures and Algorithms (DSA)** in real-world urban infrastructure problems such as waste collection and transportation planning.

---

## Problem Statement

Urban waste management requires:

* Minimizing the total cost of connecting waste collection points
* Finding the most efficient routes for daily waste transportation

Manual planning is inefficient and error-prone. This project provides a computational approach to:

* Design an optimized network
* Compute shortest paths from a source node
* Visualize algorithm execution clearly

---

## Solution Approach

The system uses two core algorithms:

### 1. Kruskal’s Algorithm (with Disjoint Set Union)

* Used to construct a **Minimum Spanning Tree**
* Ensures all nodes are connected with minimum total edge weight
* Disjoint Set Union (DSU) is used to prevent cycles efficiently

### 2. Dijkstra’s Algorithm

* Computes the **shortest path distances** from a given source node
* Uses a priority queue for optimal performance
* Outputs both distances and visit order for transparency

---

## Project Architecture

```
Network-Optimizer/
├── backend/
│   ├── main.py
│   ├── req.txt
│   └── run.sh
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## Backend Responsibilities

* Accepts graph data through REST APIs
* Implements Kruskal’s and Dijkstra’s algorithms
* Returns structured JSON responses
* Enables CORS for frontend communication
* Built using FastAPI and Pydantic

---

## Frontend Responsibilities

* Collects user input for graph nodes and edges
* Sends data to backend APIs
* Displays:

  * Accepted MST edges
  * Shortest path distances
  * Algorithm execution logs
* Built using a modern JavaScript framework with Vite

---

## Technology Stack

### Backend

* Python 3.10
* FastAPI
* Uvicorn
* Pydantic

### Frontend

* JavaScript
* Vite
* Node.js

---

## Setup Instructions

### Prerequisites

* Python 3.10 or later
* Node.js (LTS version recommended)
* Git

---

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r req.txt
   ```

4. Start the backend server:

   ```bash
   uvicorn main:app --reload
   ```

5. Backend will be available at:

   ```
   http://127.0.0.1:8000
   ```

6. API documentation:

   ```
   http://127.0.0.1:8000/docs
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:

   ```bash
   npm run dev
   ```

4. Frontend will be available at:

   ```
   http://localhost:5173
   ```

---

## How the System Works

1. User enters graph data in the frontend
2. Frontend sends data to backend APIs
3. Backend computes:

   * Minimum Spanning Tree using Kruskal’s algorithm
   * Shortest paths using Dijkstra’s algorithm
4. Results are returned as JSON
5. Frontend visualizes outputs and logs

---
