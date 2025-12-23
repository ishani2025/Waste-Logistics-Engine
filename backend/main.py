from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import heapq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Edge(BaseModel):
    u: int
    v: int
    w: float

class GraphData(BaseModel):
    n: int
    edges: list[Edge]
    source: int = 1

class DSU:
    def __init__(self, n):
        self.parent = list(range(n+1))
        self.rank = [0]*(n+1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.rank[ra] < self.rank[rb]:
            self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]:
            self.parent[rb] = ra
        else:
            self.parent[rb] = ra
            self.rank[ra] += 1
        return True

from typing import List, Dict, Union

@app.post("/kruskal")
def kruskal(data: GraphData):
    edges = sorted([(e.w, e.u, e.v) for e in data.edges])
    dsu = DSU(data.n)

    steps: List[Dict[str, Union[list, str]]] = []  # ✅ correct typing
    mst = []

    for w, u, v in edges:
        step: Dict[str, Union[list, str]] = {"edge": [u, v, w]}
        if dsu.union(u, v):
            mst.append((u, v, w))
            step["action"] = "accepted"
        else:
            step["action"] = "rejected"
        steps.append(step)

    return {"mst": mst, "steps": steps}


@app.post("/dijkstra")
def dijkstra(data: GraphData):
    adj = [[] for _ in range(data.n+1)]
    for e in data.edges:
        adj[e.u].append((e.v,e.w))
        adj[e.v].append((e.u,e.w))

    dist = [float("inf")] * (data.n+1)
    src = data.source
    dist[src] = 0
    pq = [(0,src)]
    steps = []

    while pq:
        d,u = heapq.heappop(pq)
        steps.append({"visit_node": u, "distance": d})
        for v,w in adj[u]:
            nd = d+w
            if nd < dist[v]:
                dist[v] = nd
                steps.append({"relax": [u,v,w], "new_dist": nd})
                heapq.heappush(pq, (nd,v))

    return {"distances": dist[1:], "steps": steps}
