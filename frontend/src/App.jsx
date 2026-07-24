//import { useEffect, useRef, useState } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [graph, setGraph] = useState({ nodes: [], edges: [], stats: { articles: 0, connections: 0 } });
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [sessionId, setSessionId] = useState('default');
  const [sessionInput, setSessionInput] = useState('default');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const cyRef = useRef(null);

  const loadSessions = async () => {
    const response = await fetch(`${API_URL}/api/sessions`);
    const data = await response.json();
    setSessions(data.sessions || []);
  };

  const loadGraph = async (selectedSession = sessionId) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/graph?session_id=${selectedSession}`);
    const data = await response.json();
    setGraph(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    loadGraph(sessionId);
  }, [sessionId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!cyRef.current) return;

    const elements = {
      nodes: graph.nodes.map((node) => ({
        data: { id: String(node.id), label: node.label, url: node.url },
      })),
      edges: graph.edges.map((edge) => ({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: String(edge.source),
          target: String(edge.target),
        },
      })),
    };

    const instance = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': theme === 'dark' ? '#000000' : '#ffffff',
            'border-color': theme === 'dark' ? '#ffffff' : '#000000',
            'border-width': 2,
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-valign': 'center',
            'text-halign': 'center',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            width: 44,
            height: 44,
            'font-size': 10,
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#2563eb',
            width: 2,
            'target-arrow-color': '#2563eb',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: graph.nodes.length ? [String(graph.nodes[0].id)] : [],
        padding: 18,
      },
      zoom: 1,
      minZoom: 0.7,
      maxZoom: 1.7,
      userZoomingEnabled: true,
      userPanningEnabled: true,
    });

    instance.on('tap', 'node', (event) => {
      const url = event.target.data('url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });

    return () => instance.destroy();
  }, [graph, theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const targetSession = sessionInput.trim() || 'default';
    setSessionId(targetSession);

    await fetch(`${API_URL}/api/articles/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, sessionId: targetSession }),
    });
    setTitle('');
    setUrl('');
    loadGraph(targetSession);
    loadSessions();
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">WikiGraph MVP</p>
          <h1>Trace your Wikipedia rabbit hole.</h1>
          <p className="subtitle">Every hop becomes a node and every jump becomes a connection.</p>
        </div>
      </header>

      <section className="panel controls">
        <form onSubmit={handleSubmit}>
          <label>
            Session
            <input value={sessionInput} onChange={(event) => setSessionInput(event.target.value)} />
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
        <div className="session-list">
          <span>Recent sessions</span>
          <div className="pill-row">
            {sessions.map((session) => (
              <button
                key={session.id}
                className={`pill ${session.id === sessionId ? 'active' : ''}`}
                onClick={() => {
                  setSessionId(session.id);
                  setSessionInput(session.id);
                }}
                type="button"
              >
                {session.name}
              </button>
            ))}
          </div>
        </div>
        <div className="action-row">
          <button className="secondary" onClick={() => loadGraph(sessionId)} type="button">Refresh graph</button>
          <button className="secondary theme-toggle" onClick={toggleTheme} type="button">
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>
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
            <div ref={cyRef} className="graph-canvas" />
            <ul className="node-list">
              {graph.nodes.map((node) => (
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
