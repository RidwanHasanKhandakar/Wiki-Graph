# WIKI-Graph

> **Visualize your Wikipedia learning journey as an interactive knowledge graph.**

WikiGraph is an open-source application that transforms your Wikipedia browsing history into an interactive graph, allowing you to see how your curiosity evolves over time. Instead of losing track of dozens of opened articles, WikiGraph records your exploration path and displays it as a connected knowledge graph.

---

## Vision

Reading Wikipedia often leads to endless rabbit holes.

For example:

```
History
    ↓
Roman Empire
    ↓
Julius Caesar
    ↓
Cleopatra
    ↓
Ptolemaic Kingdom
```

After an hour of reading, it becomes difficult to remember how you arrived at a particular article.

WikiGraph solves this problem by automatically recording your exploration and presenting it as an interactive graph.

Instead of remembering:

> "How did I end up reading about Ancient Egypt?"

You'll simply open your graph and retrace your learning journey.

---

# Features

### Automatic Article Tracking

Track every Wikipedia article visited.

---

### Interactive Knowledge Graph

Visualize your browsing path as an expandable graph.

```
History
    │
    ├── Roman Empire
    │       │
    │       ├── Julius Caesar
    │       └── Augustus
    │
    └── Ancient Greece
```

---

### Relationship Tracking

Every edge represents how one article led to another.

```
Roman Empire
        │
        ▼
Julius Caesar
```

---

### Search

Instantly search for any visited article.

---

### Multiple Sessions

Organize browsing into sessions.

Examples:

- Ancient History
- Physics
- Programming
- Biology

---

### One-Click Navigation

Click any node to reopen its Wikipedia page.

---

### Session Statistics

Examples:

- Total articles visited
- Total connections
- Most visited article
- Longest exploration chain
- Time spent browsing

---

### Persistent Storage

Graphs are automatically saved locally.

---

### Interactive Graph

- Zoom
- Pan
- Drag Nodes
- Fit View
- Auto Layout

---

## Future Features

- AI-generated article recommendations
- Semantic similarity graph
- Export graph as PNG/SVG/PDF
- Import & Export sessions
- Timeline view
- Dark & Light themes
- Reading analytics
- Browser sync
- Multi-device support
- Neo4j graph database support
- Public graph sharing

---

# Project Architecture

```
Browser Extension
        │
        ▼
    FastAPI Backend
        │
        ▼
     SQLite Database
        │
        ▼
 React + Cytoscape Frontend
```

---

# Project Structure

```
wiki-graph/

├── backend/
│   ├── app/
│   ├── database/
│   ├── api/
│   ├── models/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   └── content.js
│
├── docs/
│
├── assets/
│
├── README.md
│
├── LICENSE
│
└── .gitignore
```

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Cytoscape.js
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- SQLite

---

## Browser Extension

- Chrome Extension API
- Manifest V3

---

## Development

- Git
- GitHub
- VS Code

---

# 📌 Development Roadmap

## Phase 1

- Project setup
- React application
- FastAPI backend
- Database
- Graph visualization

---

## Phase 2

- Manual graph creation
- Save graph
- Load graph
- Search

---

## Phase 3

- Browser extension
- Detect Wikipedia articles
- Live graph updates

---

## Phase 4

- Sessions
- Statistics
- Themes
- Export

---

## Phase 5

- AI enhancements
- Semantic graph
- Recommendations

---

# How It Works

1. Open a Wikipedia article.
2. Navigate to another article.
3. WikiTrail records the relationship.
4. The graph updates in real time.
5. Continue exploring.

Example:

```
Physics
      │
      ▼
Gravity
      │
      ▼
Isaac Newton
      │
      ▼
Calculus
```

---

# Project Goals

- Help users remember their learning journey.
- Encourage curiosity-driven exploration.
- Make Wikipedia navigation visual.
- Build a personal knowledge graph.
- Create a modern educational tool.

---

# 📸 Screenshots

> Coming soon.

---

# Contributing

Contributions are welcome.

If you'd like to improve WikiTrail:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Ridwan Hasan Khandakar**

Computer Science Student

Independent University, Bangladesh

GitHub: *Coming Soon*

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
