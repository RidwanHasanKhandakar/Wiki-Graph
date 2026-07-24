import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [graph, setGraph] = useState({ nodes: [], edges: [], stats: { articles: 0, connections: 0 } });
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [sessionId, setSessionId] = useState('default');
  const [loading, setLoading] = useState(true);

  const loadGraph = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/graph?session_id=${sessionId}`);
    const data = await response.json();
    setGraph(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGraph();
  }, [sessionId]);

  const positions = useMemo(() => {
    return graph.nodes.map((node, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      return {
        ...node,
        x: 80 + column * 140,
        y: 80 + row * 120,
      };
    });
  }, [graph.nodes]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(`${API_URL}/api/articles/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, sessionId }),
    });
    setTitle('');
    setUrl('');
    loadGraph();
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">WikiGraph MVP</p>
          <h1>Trace your Wikipedia rabbit hole.</h1>
          <p className="subtitle">Every article becomes a node, and each jump becomes an edge.</p>
        </div>
      </header>

      <section className="panel controls">
        <form onSubmit={handleSubmit}>
          <label>
            Session
            <input value={sessionId} onChange={(event) => setSessionId(event.target.value)} />
          </label>
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            URL
            <input value={url} onChange={(event) => setUrl(event.target.value)} />
          </label>
          <button type="submit">Track article</button>
        </form>
        <button className="secondary" onClick={loadGraph}>Refresh graph</button>
      </section>

      <section className="panel stats">
        <div>
          <strong>{graph.stats.articles}</strong>
          <span>Articles</span>
        </div>
        <div>
          <strong>{graph.stats.connections}</strong>
          <span>Connections</span>
        </div>
      </section>

      <section className="panel graph-panel">
        {loading ? <p>Loading graph...</p> : (
          <>
            <svg viewBox="0 0 700 500" className="graph-svg">
              {graph.edges.map((edge, index) => {
                const source = positions.find((node) => node.id === edge.source);
                const target = positions.find((node) => node.id === edge.target);
                if (!source || !target) return null;
                return <line key={`${edge.source}-${edge.target}-${index}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} className="edge" />;
              })}
              {positions.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="28" className="node" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" className="node-label">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
            <ul className="node-list">
              {positions.map((node) => (
                <li key={node.id}>
                  <a href={node.url || '#'} target="_blank" rel="noreferrer">{node.label}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
