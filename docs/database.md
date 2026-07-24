# Database Design

## Planned Tables

### Session

Represents one browsing session.

Fields:

- id
- name
- created_at

---

### Article

Represents one Wikipedia article.

Fields:

- id
- title
- url
- opened_at
- session_id

---

### Connection

Represents navigation between two articles.

Fields:

- id
- source_article
- destination_article
- created_at

---

## Relationships

```
Session

│

├── Articles

│

└── Connections
```

Future versions may migrate to Neo4j for native graph storage.