import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
console.log("ENV:", import.meta.env.VITE_API_URL);
const fetchData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/health`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const edgeId = (u, v) => `${Math.min(u, v)}-${Math.max(u, v)}`;
const binIcon = "https://cdn-icons-png.flaticon.com/512/5028/5028066.png";

export default function App()
{
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [edgeHistory, setEdgeHistory] = useState([]);
  const [source, setSource] = useState(1);
  const [mstEdges, setMstEdges] = useState([]);
  const [distances, setDistances] = useState({});
  const [log, setLog] = useState([]);
  const parentRef = useRef({});
  const [nodeId, setNodeId] = useState("");
  const [edgeForm, setEdgeForm] = useState({ u: "", v: "", w: "" });
  const containerRef = useRef(null);
  const visRef = useRef({ net: null, visNodes: null, visEdges: null });

  const n = useMemo(() => (
    nodes.length ? Math.max(...nodes.map((n) => n.id)) : 0
  ), [nodes]);
  useEffect(() => {
    if (!containerRef.current) return;

    const visNodes = new window.vis.DataSet(
      nodes.map((n) => ({
        id: n.id,
        label: String(n.id),
        shape: "image",
        image: binIcon,
        size: 15,
        labelYOffset: 12
      }))
    );

    const visEdges = new window.vis.DataSet(
      edges.map((e) => ({
        id: edgeId(e.u, e.v),
        from: e.u,
        to: e.v,
        label: String(e.w),
      }))
    );

    const net = new window.vis.Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      { physics: { stabilization: true } }
    );

    visRef.current = { net, visNodes, visEdges };
  }, [nodes, edges]);

  const resetStyles = () => {
    const { visNodes, visEdges } = visRef.current;
    visNodes.update(nodes.map(n => ({ id: n.id, color: undefined, borderWidth: undefined })));
    visEdges.update(edges.map(e => ({ id: edgeId(e.u, e.v), color: undefined, width: 1 })));
  };

  const addNode = () => {
    const id = Number(nodeId);
    if (!id || nodes.some(n => n.id === id)) return;
    setNodes([...nodes, { id }]);
    setNodeId("");
  };

  const addEdge = () => {
    const u = Number(edgeForm.u), v = Number(edgeForm.v), w = Number(edgeForm.w);
    if (!u || !v || !Number.isFinite(w)) return;
    if (!nodes.some(n => n.id === u) || !nodes.some(n => n.id === v)) return alert("Add nodes first");
    if (edges.some(e => edgeId(e.u,e.v) === edgeId(u,v))) return alert("Edge exists");

    const e = { u,v,w };
    setEdges(prev => [...prev, e]);
    setEdgeHistory(prev => [...prev, e]);
    setEdgeForm({ u:"", v:"", w:"" });
  };

  const undoEdge = () => {
    if (!edgeHistory.length) return;
    const last = edgeHistory[edgeHistory.length-1];
    setEdges(edges.filter(e => !(e.u===last.u && e.v===last.v)));
    setEdgeHistory(edgeHistory.slice(0,-1));
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setEdgeHistory([]);
    setDistances({});
    setLog([]);
    setMstEdges([]);
  };

  // Run Kruskal
  const runKruskal = async () => {
    resetStyles();
    setMstEdges([]);
    const { visEdges } = visRef.current;

    const res =await axios.post(`${API_BASE_URL}/kruskal`, { n, edges });

    const accepted = [];

    for (const step of res.data.steps) {
      const [u,v,w] = step.edge;
      const ok = step.action === "accepted";

      if (ok) {
        accepted.push({u,v,w});
        setMstEdges([...accepted]);
      }

      visEdges.update({
        id: edgeId(u,v),
        color:{ color: ok ? "#16a34a" : "#e74c3c" },
        width: ok ? 4 : 1,
      });

      await sleep(550);
    }
  };
  const runDijkstra = async () => {
    resetStyles();
    parentRef.current = {};
    setDistances(Object.fromEntries(nodes.map(n => [n.id, Infinity])));
    setLog([]);
    const visited = new Set();
    
    const res = await axios.post(`${API_BASE_URL}/dijkstra`, { n, edges, source: Number(source) });
    setDistances(d => ({ ...d, [source]:0 }));

    for (const step of res.data.steps) {
      if (step.visit_node !== undefined) {
      const u = step.visit_node;
  if (visited.has(u)) continue;
  visited.add(u);

  setDistances((d) => ({ ...d, [u]: step.distance }));
  setLog((l) => [...l, `Visit ${u}`]);
  await sleep(350);
}

    }
  };

  return (
    <div style={{ display:"flex", gap:"25px", padding:"20px" }}>

      {/* Left Panel */}
      <div style={{ width:"260px" }}>
        <h2 style={{ fontSize:"20px", marginBottom:"10px", color:"#0a7c3b" }}>
          Smart Waste Network Control
        </h2>

        <div>
          <input placeholder="Node ID" value={nodeId} onChange={e=>setNodeId(e.target.value)} />
          <button onClick={addNode}>Add Node</button>
        </div>

        <div style={{ marginTop:"8px" }}>
          <input placeholder="u" value={edgeForm.u} onChange={e=>setEdgeForm({...edgeForm,u:e.target.value})} />
          <input placeholder="v" value={edgeForm.v} onChange={e=>setEdgeForm({...edgeForm,v:e.target.value})} />
          <input placeholder="w" value={edgeForm.w} onChange={e=>setEdgeForm({...edgeForm,w:e.target.value})} />
          <button onClick={addEdge}>Add Edge</button>
        </div>

        <div style={{ marginTop:"8px" }}>
          <input placeholder="Source" value={source} onChange={e=>setSource(e.target.value)} />
        </div>

        <div style={{ marginTop:"10px" }}>
          <button onClick={runKruskal}>Run Kruskal</button>
          <button onClick={runDijkstra} style={{ marginLeft:"6px" }}>Run Dijkstra</button>
        </div>

        <div style={{ marginTop:"8px" }}>
          <button onClick={undoEdge} style={{ background:"#f1c40f", marginRight:"6px" }}>Undo Edge</button>
          <button onClick={resetGraph} style={{ background:"#e74c3c" }}>Reset Graph</button>
        </div>

        {/* Entered Edges */}
        <div className="card" style={{ marginTop:"12px" }}>
          <b>Entered Edges</b>
          <ul className="list">
            {edges.map((e,i)=>(
              <li key={i}>{e.u} → {e.v} (w:{e.w})</li>
            ))}
          </ul>
        </div>

        {/* Accepted MST Edges */}
        <div className="card" style={{ marginTop:"12px" }}>
          <b>Accepted MST Edges</b>
          {mstEdges.length === 0 && <div style={{fontSize:12,opacity:0.6}}>Run Kruskal</div>}
          <ul className="list">
            {mstEdges.map((e,i)=>(
              <li key={i}>{e.u} → {e.v} (w:{e.w})</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Graph */}
      <div style={{ flex:1 }}>
        <h1 style={{ textAlign:"center", fontSize:"26px", marginBottom:"8px", color:"#007a2f" }}>
          Smart Waste Network
        </h1>
        <div ref={containerRef} style={{ height:"600px", border:"2px solid #222", borderRadius:"6px" }} />
      </div>

      {/* Right Panel */}
      <div style={{ width:"200px" }}>
        <h4>Distances</h4>
        {Object.entries(distances).map(([k,v])=>(
          <div key={k}>{k}: {Number.isFinite(v)?v.toFixed(2):"∞"}</div>
        ))}

        <h4 style={{ marginTop:"10px" }}>Log</h4>
        {log.map((l,i)=><div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
