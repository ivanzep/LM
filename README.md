# ⚡ Band HQ

Personal band management tool. Tracks songs, setlists, jam scheduling (with availability voting), member playlists, and reminders.

---

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

---

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and pushes `dist/` to a `gh-pages` branch.

One-time setup: in the repo's **Settings → Pages → Build and deployment**, set **Source** to "Deploy from a branch", branch `gh-pages`, folder `/ (root)`. The `gh-pages` branch is created automatically the first time the workflow runs.

The site will be served at `https://ivanzep.github.io/LM/`. The Vite `base` in `vite.config.js` is set to `/LM/` to match — update it if the repo is ever renamed.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (hooks only, no Redux) |
| Build | Vite 5 |
| Styling | Inline styles with a shared design-token object `C` |
| Fonts | Oswald (headings), DM Sans (body), JetBrains Mono (tabs/chords) via Google Fonts |
| Persistence | `localStorage` — all state is synced on every update |
| Dependencies | Zero runtime deps beyond React |

Everything lives in a **single file**: `src/App.jsx`. Components are defined at module scope and composed in the default export `BandApp`.

---

## Architecture

### State (all in `BandApp`)

```
songs[]      → bq-songs      (localStorage)
setlists[]   → bq-setlists
jams[]       → bq-jams
members[]    → bq-members
reminders[]  → bq-reminders
playlists[]  → bq-playlists
songPage     → transient (which song detail is open, not persisted)
```

Every updater follows the same pattern:
```js
const updSongs = d => { setSongs(d); persist('bq-songs')(d); };
```

### Design tokens

All colors live in the `C` object at the top of App.jsx:
```js
const C = {
  bg: '#0C0A09', surf: '#1A1612', raised: '#241E18', border: '#332B22',
  acc: '#D4A853',  // amber — primary accent
  org: '#E8613C',  // orange-red — danger / out
  sage: '#8B9E6F', // green — confirmed / in
  blue: '#6B9FBF',
  txt: '#F2EEE6', sub: '#9B9184', dim: '#5C5248',
};
```

---

## Data Models

### Song
```js
{
  id: string,
  title: string,
  artist: string,        // "Original" for originals
  key: string,           // e.g. "Am", "G"
  bpm: number,
  genre: string,
  status: 'ready' | 'learning' | 'shelved',
  tags: string,          // comma-separated, e.g. "funk, opener"
  tabUrl: string,        // link to Songsterr, Ultimate Guitar, etc.
  lyrics: string,        // pre-formatted, uses \n
  tabs: string,          // ASCII tab notation, monospace
  notes: string,         // performance notes
}
```

### Setlist
```js
{
  id: string,
  name: string,
  songIds: string[],     // ordered array of song IDs
  created: string,       // ISO date YYYY-MM-DD
  notes: string,
}
```

### Jam
```js
{
  id: string,
  date: string,          // ISO date YYYY-MM-DD
  time: string,          // HH:MM (24h)
  location: string,
  notes: string,
  status: 'proposed' | 'confirmed',
  availability: {        // keyed by member ID
    M1: 'in' | 'out' | 'maybe'
    // absent key = no vote yet
  }
}
```

Jams are partitioned at render time:
- **Open Jams** → `status === 'confirmed'` and `date >= today`
- **Proposed Dates** → `status === 'proposed'` and `date >= today`
- **Past Jams** → `date < today` (any status)

### Member
```js
{
  id: string,
  name: string,
  instrument: string,
  color: string,         // hex — used for avatar and availability dots
}
```

### Reminder
```js
{
  id: string,
  text: string,
  dueDate: string,       // ISO date YYYY-MM-DD
  priority: 'high' | 'medium' | 'low',
  done: boolean,
}
```

### Playlist
```js
{
  id: string,
  memberId: string,      // which member shared it
  name: string,
  url: string,           // Spotify / YouTube / Apple Music URL
  description: string,
}
```

Platform is auto-detected from the URL at render time via `detectPlatform(url)`.
Embed URLs are generated via `getEmbedUrl(url)` — supports Spotify playlists/albums, YouTube playlists/videos, Apple Music.

---

## Key Components

| Component | What it does |
|---|---|
| `BandApp` | Root — holds all state, nav, persistence |
| `SongsView` | Song list grid, filter/search, add modal |
| `SongDetailPage` | Full-page song view with teleprompter auto-scroll (play/pause, speed 1–10, progress %) |
| `SongForm` | Shared add/edit form used by both SongsView and SongDetailPage |
| `SetlistsView` | Setlist CRUD, song picker, reorder with ▲▼ |
| `JamsView` | Three sections: Open / Proposed / Past (all collapsible) |
| `JamCard` | Expandable card for Open and Past jams |
| `ProposedJamBlock` | Proposed date layout: prominent date card + member vote list outside the card border |
| `PlaylistsView` | Per-member playlists with iframe embed toggle |
| `RemindersView` | Priority-sorted checklist with overdue detection |
| `MembersView` | Band roster with color picker |

### Shared atoms (all in App.jsx)
`Btn`, `Input`, `Sel`, `TA`, `Lbl`, `Modal`, `Card`, `Empty`, `SH`, `StatusBadge`, `PriBadge`, `SecLabel`, `CollapseHead`

---

## Current Band

Seed data uses these four members. Edit `S_MEMBERS` in App.jsx or use the Members UI:

| ID | Name | Instrument | Color |
|---|---|---|---|
| M1 | Ivan | Guitar | `#D4A853` amber |
| M2 | Alex | Bass | `#E8613C` orange |
| M3 | Sam | Drums | `#8B9E6F` sage |
| M4 | Jordan | Keys | `#6B9FBF` blue |

---

## Seed Data

All seed data is defined as constants at the top of App.jsx (`S_SONGS`, `S_JAMS`, etc.). On first load, if `localStorage` is empty the app falls back to seed data. After any edit, localStorage takes over permanently.

To reset to seed data: open DevTools → Application → Local Storage → clear all `bq-*` keys, then refresh.

---

## Potential Next Steps

- **Split into multiple files** — extract each view into `src/views/` and atoms into `src/components/`
- **Setlist PDF export** — print-ready setlist for the stage
- **Song auto-scroll tuning** — per-song saved speed preference
- **Jam calendar view** — monthly grid instead of list
- **Notifications / reminders** — Web Notifications API for due reminders
- **Multi-user sync** — replace localStorage with a backend (Supabase, Firebase, etc.)
- **Dark/light mode toggle** — design tokens are already centralized in `C`
- **Tab link auto-detection** — detect Songsterr/UG from URL without manual entry
- **Playlist embed fallback** — when iframe is blocked, show a richer link preview card

---

## File Structure

```
band-hq/
├── index.html          ← HTML shell + Google Fonts link tags
├── vite.config.js
├── package.json
├── .gitignore
└── src/
    ├── main.jsx        ← ReactDOM.createRoot
    └── App.jsx         ← Entire application (~1100 lines, single file)
```
