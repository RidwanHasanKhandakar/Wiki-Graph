# WikiGraph Architecture

## Overview

WikiGraph is a full-stack application that visualizes a user's Wikipedia browsing journey as an interactive graph.

The system consists of four main parts:

1. Frontend
2. Backend
3. Database
4. Browser Extension

```
                Browser Extension
                        │
                        │ HTTP Request
                        ▼
                 FastAPI Backend
                        │
                SQLAlchemy ORM
                        │
                        ▼
                  SQLite Database
                        ▲
                        │
                 REST API Responses
                        │
                        ▼
          React + Cytoscape Frontend
```

---

## Components

### Frontend

Responsible for:

- Rendering the graph
- Displaying sessions
- Searching articles
- Opening Wikipedia pages
- Showing statistics

Technology:

- React
- TypeScript
- Cytoscape.js
- Tailwind CSS

---

### Backend

Responsible for:

- Receiving article events
- Saving graph data
- Managing sessions
- Returning graph data

Technology:

- FastAPI
- SQLAlchemy

---

### Database

Stores:

- Articles
- Sessions
- Connections
- Metadata

Technology:

- SQLite

---

### Browser Extension

Responsible for:

- Detecting Wikipedia pages
- Tracking navigation
- Sending data to backend

Technology:

- Manifest V3
- JavaScript

---

## Data Flow

```
User opens Wikipedia

↓

Browser Extension

↓

Backend API

↓

Database

↓

Frontend updates graph
```