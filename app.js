// ── Utilities ─────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d + 'T12:00:00'); return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); };
const fmtTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const fmtTimeRange = (jam) => { if (!jam.time) return ''; return jam.endTime ? `${fmtTime(jam.time)} – ${fmtTime(jam.endTime)}` : fmtTime(jam.time); };
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css = (o) => Object.entries(o).map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';');

// ── Icons (inline SVG, currentColor — replaces emoji glyphs) ───
const ICONS = {
  lightning: '<path fill="currentColor" d="M13 2 3 14h7l-2 8 10-12h-7l2-8z"/>',
  pick: '<path fill="currentColor" d="M12 2C7 2 3 6.5 3 11.5 3 17 7 21 12 23c5-2 9-6 9-11.5C21 6.5 17 2 12 2z"/>',
  list: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 8h9M7.5 12h9M7.5 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  skull: '<circle cx="12" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="15" cy="10" r="1.3" fill="currentColor"/><path d="M9 16.5h6v1.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 18v1.5M12 18v1.8M14 18v1.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>',
  flame: '<path fill="currentColor" d="M12.5 2.5c.8 3-2.5 4.7-3.8 7.3-1 2-.7 4.6 1 6.2a5 5 0 0 0 7-.2c1.8-1.9 2-4.8.5-7-1 1.7-2 2-2.8 1.6.6-1.7-.3-4.4-1.9-7.9z"/>',
  bell: '<path d="M12 3a5 5 0 0 0-5 5v2.5c0 1.8-.7 3.5-2 4.8h14c-1.3-1.3-2-3-2-4.8V8a5 5 0 0 0-5-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  people: '<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 20c0-4 2.5-6.5 5.5-6.5s5.5 2.5 5.5 6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.5" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13.2 20c.3-3 2-5 3.6-5 2.3 0 4.2 2 4.7 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  link: '<path d="M9 15l6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 6.5l1-1a4 4 0 1 1 5.7 5.7l-1.7 1.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M13.5 17.5l-1 1a4 4 0 1 1-5.7-5.7l1.7-1.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  pin: '<path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.4" fill="#000"/>',
  checkCircle: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5 5-5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  bulb: '<path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 2a6 6 0 0 0-3.5 10.9c.7.5 1 1.3 1 2.1h5c0-.8.3-1.6 1-2.1A6 6 0 0 0 12 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 13.7-5.7M20 12a8 8 0 0 1-13.7 5.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17.5 4.8v3.6h-3.6M6.5 19.2v-3.6h3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  cloud: '<path d="M7 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.3-1.8A4.2 4.2 0 0 1 17.5 18H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  warning: '<path d="M12 3.5 21 20H3L12 3.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="currentColor"/>',
};
function icon(name, size = 16, extraStyle = '') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:inline-block;vertical-align:-3px;flex-shrink:0;${extraStyle}" xmlns="http://www.w3.org/2000/svg">${ICONS[name] || ''}</svg>`;
}

const detectPlatform = (url) => {
  if (!url) return 'link';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) return 'youtube';
  if (url.includes('music.apple.com')) return 'apple';
  return 'link';
};

const getEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname === 'open.spotify.com') return `https://open.spotify.com/embed${u.pathname}?utm_source=generator&theme=0`;
    if (u.hostname.includes('youtube.com')) {
      const list = u.searchParams.get('list'); const v = u.searchParams.get('v');
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`;
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === 'music.apple.com') return url.replace('music.apple.com', 'embed.music.apple.com');
  } catch {}
  return null;
};

const getTabSiteName = (url) => {
  if (!url) return null;
  if (url.includes('songsterr.com')) return 'Songsterr';
  if (url.includes('ultimate-guitar.com')) return 'Ultimate Guitar';
  if (url.includes('chordify.net')) return 'Chordify';
  if (url.includes('musescore.com')) return 'MuseScore';
  if (url.includes('cifraclub.com')) return 'Cifra Club';
  return 'View Tab';
};

// ── Design tokens ─────────────────────────────────────────────
const C = { bg:'#000000', surf:'#111111', raised:'#1B1B1B', border:'#2C2C2C', acc:'#E5383B', org:'#FF7A1A', sage:'#8B9E6F', blue:'#6B9FBF', txt:'#F2F2F2', sub:'#A0A0A0', dim:'#5A5A5A' };
const PINFO = {
  spotify: { name:'Spotify',      color:'#1DB954', bg:'#0A1E0D', icon:'♫' },
  youtube: { name:'YouTube',      color:'#FF4444', bg:'#200A0A', icon:'▶' },
  apple:   { name:'Apple Music',  color:'#FC3C44', bg:'#1F0B0C', icon:'♪' },
  link:    { name:'Link',         color:'#9B9184', bg:'#241E18', icon: icon('link', 11) },
};
const AVAIL_INFO = { in:[C.sage,'#1D2B18','✓ In'], out:[C.org,'#2B1510','✗ Out'], maybe:[C.acc,'#2B1013','? Maybe'] };

// ── Seed data ─────────────────────────────────────────────────
const S_MEMBERS = [
  { id:'M1', name:'Ivan',   instrument:'Guitar', color:'#D4A853' },
  { id:'M2', name:'Alex',   instrument:'Bass',   color:'#E8613C' },
  { id:'M3', name:'Sam',    instrument:'Drums',  color:'#8B9E6F' },
  { id:'M4', name:'Jordan', instrument:'Keys',   color:'#6B9FBF' },
];

const S_SONGS = [
  { id:'S1', title:'Summer Groove', artist:'Original', key:'Am', bpm:95, genre:'Funk', status:'ready', tags:'funk, opener',
    tabUrl:'https://www.songsterr.com/a/wsa/search?pattern=funk+groove',
    lyrics:`[Verse 1]\nWalking down the summer road\nSun on my back, feeling bold\nThe groove hits different in July\nLet the rhythm take us high\n\n[Pre-Chorus]\nOh feel it coming up\nCan't let it stop\n\n[Chorus]\nSummer groove, let it ride\nFeel the beat from side to side\nSummer groove, can't resist\nThis is what we always missed\n\n[Verse 2]\nBassline speaking, hi-hat tight\nJordan laying down the right\nEvery note a conversation\nPure and simple elevation\n\n[Chorus]\nSummer groove, let it ride\nFeel the beat from side to side\nSummer groove, can't resist\nThis is what we always missed\n\n[Outro]\nRide it out... let it breathe...\nDon't let go... just believe...`,
    tabs:`INTRO RIFF (Dm7 → Gm7)\ne|-5---5-8-5---3---3-6-3-|\nB|-6---6-8-6---3---3-6-3-|\nG|-5---5-7-5---3---3-5-3-|\nD|-7-----------5---------|\nA|-5-----------3---------|\nE|-x-----------x---------|\n\nVERSE (repeat x4, muted scratch)\nDm7\ne|-x-5-x-5-5-x-5-x-|\nB|-x-6-x-6-6-x-6-x-|\nG|-x-5-x-5-5-x-5-x-|\n\nCHORUS: Fmaj7 → E7 → Am\ne|-0---0---5---|\nB|-1---0---5---|\nG|-2---1---5---|\nD|-3---2---7---|\nA|-3---2---7---|\nE|-x---0---5---|\n\nBREAKDOWN (signal Sam with nod)\nDm7 vamp, 4-8 bars, let it breathe`,
    notes:'Start slow, build into it. Signal Sam for breakdown fill at 2nd chorus. Jordan comps lightly on verse, opens up on chorus. End on long Dm7 vamp.' },

  { id:'S2', title:'Midnight Blues', artist:'Original', key:'E', bpm:72, genre:'Blues', status:'learning', tags:'blues, slow, closer',
    tabUrl:'https://www.ultimate-guitar.com/search.php?search_type=title&value=midnight+blues',
    lyrics:`[Verse 1]\nWhen the midnight comes around\nAnd the city loses its sound\nI pick up my guitar and play\nThe blues that carry me away\n\n[Verse 2]\nTwelve bar road and I know the way\nSame old changes, different day\nBut the feeling never gets old\nSome stories need to be told\n\n[Solo — Jordan takes the wheel]\n\n[Verse 3]\nNeon lights on the empty street\nThe only sound is my heartbeat\nAnother night, another song\nThe blues is where I belong\n\n[Outro — slow fade]\nJust the blues...\nJust the blues...`,
    tabs:`12-BAR BLUES IN E (slow shuffle ♩=72)\nI:  E7 | E7 | E7 | E7 |\nIV: A7 | A7 | E7 | E7 |\nV:  B7 | A7 | E7 | B7 |\n\nTURNAROUND LICK\ne|-0-4-0---0-4-0---3-2-0---|\nB|-0-------0-------2-1-0---|\nG|-1-------1-------1-------|\nD|-2-------2---------------|\nA|-2-------2---------------|\nE|-0-------0---------------|\n\nE7 CHORD\ne|-0-| B|-3-| G|-1-| D|-2-| A|-2-| E|-0-|\n\nINTRO LICK\ne|-0-0-3-0---0-2-0---|\nB|-0-----------0-----|\nG|-1-----------1-----|`,
    notes:'Jordan solos on verse 2 (or verse 3). Sam brush-light until chorus. Watch Ivan for turnaround cue (nod). Optional key change to F for final verse.' },

  { id:'S3', title:'Groove Machine', artist:'Original', key:'Dm', bpm:108, genre:'Groove', status:'ready', tags:'groove, danceable',
    tabUrl:'',
    lyrics:`[Intro — instrumental 8 bars]\n\n[Verse 1]\nFeel the rhythm in your bones\nGroove machine hits different tones\nBass line thumpin, hi-hat tight\nThis is how we spend the night\n\n[Pre-Chorus]\nOne two three and four\nAlways coming back for more\n\n[Chorus]\nGroove machine, can't stop now\nGroove machine, show 'em how\nLock it in and hold it down\nFunkiest band in this whole town\n\n[Verse 2]\nEvery string a conversation\nEvery note a vibration\nDon't overthink the feel\nJust let the groove be real\n\n[Chorus]\nGroove machine, can't stop now\nGroove machine, show 'em how\n\n[Outro — vamp until cue]\nGroove... groove... groove...`,
    tabs:`MAIN RIFF (Dm7 — 16th note funk scratch)\ne|-x-x-x-x-x-x-x-x-|\nB|-6-x-6-x-8-x-6-x-|\nG|-7-x-7-x-9-x-7-x-|\nD|-7-x-7-x-9-x-7-x-|\nA|-5-x-5-x-7-x-5-x-|\nE|-x-x-x-x-x-x-x-x-|\n\nBb7 STAB (on 2 and 4)\ne|-6---| B|-6---| G|-7---| D|-8---| A|-8---| E|-6---|\n\nPRE-CHORUS: Gm7 → C9\ne|-3---3---| B|-6---3---| G|-5---3---| D|-5---2---|\n\nCHORUS CHART\n| Dm7 | Dm7 | Bb7 | C9 | (repeat 4x)`,
    notes:'Tight pocket — no rushing. Alex holds it down, Ivan comps scratchy 16ths. Vamp the outro until Ivan gives the cutoff cue (hand wave). Usually the opener.' },

  { id:'S4', title:'Canyon Wind', artist:'Original', key:'G', bpm:84, genre:'Folk-Rock', status:'shelved', tags:'mellow, acoustic',
    tabUrl:'',
    lyrics:`[Verse 1]\nThrough the canyon wind blows free\nOver mountains, over me\nAcoustic dreams and open sky\nWhere the eagles dare to fly`,
    tabs:`G      Cadd9    Em      D\ne|-3-----3------0------2--|\nB|-3-----3------0------3--|\nG|-0-----0------0------2--|\nD|-0-----2------2------0--|\nA|-2-----3------2------x--|\nE|-3-----x------0------x--|`,
    notes:'Shelved — needs acoustic arrangement and a bridge. Revisit in fall.' },
];

const S_SETLISTS = [
  { id:'SL1', name:'July 4th Backyard Jam', songIds:['S3','S1','S2'], created:'2026-06-15', notes:'Open with Groove Machine, close with Midnight Blues. ~45 min.' },
];

const S_JAMS = [
  { id:'J0', date:'2026-06-14', time:'16:00', endTime:'19:00', location:"Ivan's backyard", status:'confirmed', notes:'First outdoor jam of the summer. Ran through 3 songs.', availability:{M1:'in',M2:'in',M3:'in',M4:'maybe'} },
  { id:'J00', date:'2026-05-30', time:'19:00', endTime:'21:30', location:"Alex's garage", status:'confirmed', notes:'Worked on Groove Machine arrangement.', availability:{M1:'in',M2:'in',M3:'out',M4:'in'} },
  { id:'J1', date:'2026-07-04', time:'17:00', endTime:'20:00', location:"Ivan's backyard", status:'confirmed', notes:'Cookout at 3pm, play at 5pm. Bring PA, DI box, extra cables.', availability:{M1:'in',M2:'in',M3:'maybe',M4:'in'} },
  { id:'J2', date:'2026-07-18', time:'19:00', endTime:'21:00', location:"Alex's garage", status:'proposed', notes:'Full run-through of the July 4th setlist. Bring lyric sheets.', availability:{M1:'in',M2:'in',M3:'in',M4:'out'} },
  { id:'J3', date:'2026-08-02', time:'14:00', endTime:'18:00', location:'Practice Studio — Room B', status:'proposed', notes:'Record scratch tracks for new material. 4 hours booked.', availability:{M1:'in',M2:'maybe',M3:'in',M4:'in'} },
  { id:'J4', date:'2026-08-09', time:'18:00', endTime:'', location:"Sam's place", status:'proposed', notes:'Casual hangout jam — no pressure, just vibe.', availability:{M1:'maybe',M2:'in',M3:'in',M4:'maybe'} },
];

const S_REMINDERS = [
  { id:'R1', text:'Fix strap button on Strat',                     dueDate:'2026-07-01', done:false, priority:'high' },
  { id:'R2', text:'Share July 4th setlist with band',              dueDate:'2026-07-03', done:false, priority:'high' },
  { id:'R3', text:'Download backing tracks for Midnight Blues',    dueDate:'2026-07-10', done:false, priority:'medium' },
  { id:'R4', text:'Order extra strings (10-46)',                    dueDate:'2026-07-05', done:false, priority:'low' },
  { id:'R5', text:'Book practice studio for August',               dueDate:'2026-07-15', done:false, priority:'medium' },
];

const S_PLAYLISTS = [
  { id:'PL1', memberId:'M1', name:'Funk & Soul Reference',    url:'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda', description:'Studying the pocket — inspiration for our set' },
  { id:'PL2', memberId:'M3', name:'Drum Groove Goldmine',     url:'https://www.youtube.com/playlist?list=PLhQjrBAgIEJua2oEDKhpBQZgXuMKGFOsj', description:'Pocket grooves and feel studies' },
  { id:'PL3', memberId:'M4', name:'Jazz Chord Voicings',      url:'https://open.spotify.com/playlist/37i9dQZF1DX5gKoM5cNOzQ', description:'Key voicings Jordan is learning for the set' },
];

const KEYS = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B','Am','Bm','Cm','Dm','Em','Fm','Gm'];
const INSTRUMENTS = ['Guitar','Bass','Drums','Keys','Vocals','Trumpet','Saxophone','Violin','Banjo','Other'];
const PAL = ['#D4A853','#E8613C','#8B9E6F','#6B9FBF','#A87BC2','#E0A060','#5BA8A0'];

// ── State ─────────────────────────────────────────────────────
const state = {
  nav: 'songs',
  songPage: null,
  songs: S_SONGS,
  setlists: S_SETLISTS,
  jams: S_JAMS,
  members: S_MEMBERS,
  reminders: S_REMINDERS,
  playlists: S_PLAYLISTS,
  modal: null,
  ui: {
    songFilter: 'all',
    songQuery: '',
    slExpanded: null,
    slPicker: null,
    jamShowOpen: true,
    jamShowProposed: true,
    jamShowPast: false,
    jamCardOpen: {},
    plMemberFilter: 'all',
    plShowEmbed: {},
    remShowDone: false,
    menuOpen: false,
  },
};

// Default Google Apps Script Web App URL (see apps-script/Code.gs and
// README). Overridable at runtime via the hamburger menu's Setup modal —
// that choice is persisted to localStorage under bq-sync-url.
const DEFAULT_SYNC_URL = 'https://script.google.com/macros/s/AKfycbz6c2D08WnBlkpb3gott61ZHo7UlFFPnYUVpHkx6Ix9WJODp6CoxmOqus8_uI8CrGwW/exec';

function loadPersisted() {
  const load = (key, fallback) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
  };
  state.songs = load('bq-songs', S_SONGS);
  state.setlists = load('bq-setlists', S_SETLISTS);
  state.jams = load('bq-jams', S_JAMS);
  state.members = load('bq-members', S_MEMBERS);
  state.reminders = load('bq-reminders', S_REMINDERS);
  state.playlists = load('bq-playlists', S_PLAYLISTS);
  SYNC_URL = load('bq-sync-url', DEFAULT_SYNC_URL);
}
function persist(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }
function updSongs(d) { state.songs = d; persist('bq-songs', d); pushRemote('songs', d); }
function updSetlists(d) { state.setlists = d; persist('bq-setlists', d); pushRemote('setlists', d); }
function updJams(d) { state.jams = d; persist('bq-jams', d); pushRemote('jams', d); }
function updMembers(d) { state.members = d; persist('bq-members', d); pushRemote('members', d); }
function updReminders(d) { state.reminders = d; persist('bq-reminders', d); pushRemote('reminders', d); }
function updPlaylists(d) { state.playlists = d; persist('bq-playlists', d); pushRemote('playlists', d); }

// ── Remote sync (Google Sheets via Apps Script Web App) ────────
// Set via the hamburger menu's Setup modal (persisted to bq-sync-url);
// defaults to DEFAULT_SYNC_URL. Leave blank there to disable and use
// localStorage only (single browser/device).
let SYNC_URL = '';

let syncStatus = 'idle'; // idle | syncing | ok | error
function syncStatusLabel() {
  if (!SYNC_URL) return '';
  if (syncStatus === 'syncing') return `${icon('refresh', 12)} Syncing…`;
  if (syncStatus === 'error') return `${icon('warning', 12)} Sync failed`;
  if (syncStatus === 'ok') return `${icon('cloud', 12)} Synced`;
  return '';
}
function setSyncStatus(s) {
  syncStatus = s;
  const el = document.getElementById('sync-status');
  if (el) el.innerHTML = syncStatusLabel();
}

async function pushRemote(key, value) {
  if (!SYNC_URL) return;
  try {
    setSyncStatus('syncing');
    await fetch(SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ key, value }),
    });
    setSyncStatus('ok');
  } catch (err) {
    setSyncStatus('error');
  }
}

async function fetchRemote() {
  if (!SYNC_URL) return false;
  try {
    setSyncStatus('syncing');
    const res = await fetch(SYNC_URL);
    const data = await res.json();
    if (data.songs) state.songs = data.songs;
    if (data.setlists) state.setlists = data.setlists;
    if (data.jams) state.jams = data.jams;
    if (data.members) state.members = data.members;
    if (data.reminders) state.reminders = data.reminders;
    if (data.playlists) state.playlists = data.playlists;
    setSyncStatus('ok');
    return true;
  } catch (err) {
    setSyncStatus('error');
    return false;
  }
}
function syncRefresh() { fetchRemote().then(() => render()); }

function openSetupModal() { state.modal = { type: 'setup' }; render(); }
function saveSetup() {
  const url = document.getElementById('stf-syncUrl').value.trim();
  SYNC_URL = url;
  persist('bq-sync-url', url);
  setSyncStatus('idle');
  state.modal = null;
  render();
  if (SYNC_URL) fetchRemote().then(ok => { if (ok) render(); });
}

// ── Render (focus-preserving) ──────────────────────────────────
function render() {
  const active = document.activeElement;
  const activeId = active && active.id;
  const selStart = active && 'selectionStart' in active ? active.selectionStart : null;
  const selEnd = active && 'selectionStart' in active ? active.selectionEnd : null;
  document.getElementById('root').innerHTML = appTemplate();
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      if (selStart != null && 'setSelectionRange' in el) {
        try { el.setSelectionRange(selStart, selEnd); } catch {}
      }
    }
  }
}

// ── Shared atoms ──────────────────────────────────────────────
function btn(label, { action = '', data = {}, variant = 'ghost', sm = false, extraStyle = {}, id = '' } = {}) {
  const base = { padding: sm ? '5px 10px' : '7px 14px', 'border-radius': '6px', border: 'none', cursor: 'pointer', 'font-size': sm ? '11px' : '13px', 'font-weight': 600, 'font-family': "'DM Sans', sans-serif", display: 'inline-flex', 'align-items': 'center', gap: '5px' };
  const v = { primary: { background: C.acc, color: C.txt }, ghost: { background: 'transparent', color: C.sub, border: `1px solid ${C.border}` }, danger: { background: 'transparent', color: C.org, border: `1px solid ${C.org}44` } };
  const style = css({ ...base, ...(v[variant] || v.ghost), ...extraStyle });
  const dataAttrs = Object.entries(data).map(([k, val]) => `data-${k}="${esc(val)}"`).join(' ');
  return `<button ${id ? `id="${id}"` : ''} data-action="${action}" ${dataAttrs} style="${style}">${label}</button>`;
}

function inputHTML({ id, value = '', placeholder = '', type = 'text', extraStyle = {} }) {
  const style = css({ background: C.raised, border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.txt, 'font-family': (type === 'date' || type === 'time') ? 'monospace' : "'DM Sans', sans-serif", 'font-size': '14px', padding: '8px 12px', width: '100%', outline: 'none', 'box-sizing': 'border-box', 'color-scheme': 'dark', ...extraStyle });
  return `<input id="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" style="${style}" />`;
}

function selHTML({ id, value, options, extraStyle = {} }) {
  const style = css({ background: C.raised, border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.txt, 'font-family': "'DM Sans', sans-serif", 'font-size': '14px', padding: '8px 12px', outline: 'none', cursor: 'pointer', width: '100%', ...extraStyle });
  const opts = options.map(o => `<option value="${esc(o.value)}" ${o.value === value ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
  return `<select id="${id}" style="${style}">${opts}</select>`;
}

function taHTML({ id, value = '', placeholder = '', rows = 4, mono = false }) {
  const style = css({ background: mono ? '#080808' : C.raised, border: `1px solid ${C.border}`, 'border-radius': '6px', color: mono ? C.acc : C.txt, 'font-family': mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif", 'font-size': mono ? '12px' : '14px', padding: '10px 12px', width: '100%', outline: 'none', resize: 'vertical', 'line-height': 1.6, 'box-sizing': 'border-box' });
  return `<textarea id="${id}" placeholder="${esc(placeholder)}" rows="${rows}" style="${style}">${esc(value)}</textarea>`;
}

function lbl(text) { return `<div style="${css({ 'font-size': '10px', 'font-weight': 700, color: C.sub, 'letter-spacing': '0.06em', 'text-transform': 'uppercase', 'margin-bottom': '5px' })}">${text}</div>`; }

function statusBadge(status) {
  const m = { ready: [C.sage, '#1D2B18', 'Ready'], learning: [C.acc, '#2B1013', 'Learning'], shelved: [C.dim, '#1E1E1E', 'Shelved'] };
  const [c, bg, l] = m[status] || m.shelved;
  return `<span style="${css({ background: bg, color: c, padding: '2px 7px', 'border-radius': '4px', 'font-size': '10px', 'font-weight': 700, 'letter-spacing': '0.04em' })}">${l}</span>`;
}
function priBadge(p) {
  const m = { high: [C.org, '#2B1510'], medium: [C.acc, '#2B1013'], low: [C.sage, '#1D2B18'] };
  const [c, bg] = m[p] || m.low;
  return `<span style="${css({ background: bg, color: c, padding: '2px 7px', 'border-radius': '4px', 'font-size': '10px', 'font-weight': 700, 'letter-spacing': '0.04em', 'text-transform': 'uppercase' })}">${esc(p)}</span>`;
}
function empty(iconName, text) {
  return `<div style="${css({ 'text-align': 'center', padding: '48px 0', color: C.dim })}"><div style="${css({ 'margin-bottom': '10px' })}">${icon(iconName, 36)}</div><div style="${css({ 'font-size': '14px' })}">${esc(text)}</div></div>`;
}
function sh(title, sub, action) {
  return `<div style="${css({ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '18px' })}">
    <div><span style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '22px', 'font-weight': 500, 'letter-spacing': '0.03em' })}">${title}</span>${sub ? `<span style="${css({ color: C.sub, 'font-size': '15px', 'margin-left': '8px' })}">${sub}</span>` : ''}</div>
    ${action || ''}
  </div>`;
}
function chipStyle(active) { return css({ padding: '5px 12px', 'border-radius': '16px', border: `1px solid ${active ? C.acc : C.border}`, background: active ? C.acc : 'transparent', color: active ? C.txt : C.sub, 'font-size': '12px', 'font-weight': 600, cursor: 'pointer' }); }
function modalWrap(title, bodyHTML) {
  return `<div id="modal-backdrop" data-action="close-modal" style="${css({ position: 'fixed', inset: 0, background: '#00000094', 'z-index': 100, display: 'flex', 'align-items': 'center', 'justify-content': 'center', padding: '16px' })}">
    <div data-action="noop" style="${css({ background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '14px', padding: '24px', width: '100%', 'max-width': '580px', 'max-height': '90vh', 'overflow-y': 'auto' })}">
      <div style="${css({ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'margin-bottom': '20px' })}">
        <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '19px', 'font-weight': 500, color: C.txt, 'letter-spacing': '0.03em' })}">${title}</div>
        <button data-action="close-modal" style="${css({ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', 'font-size': '18px' })}">✕</button>
      </div>
      ${bodyHTML}
    </div>
  </div>`;
}

// ── Song form (shared add/edit) ────────────────────────────────
const BLANK_SONG = { title:'', artist:'', key:'Am', bpm:120, genre:'', status:'learning', tags:'', lyrics:'', tabs:'', notes:'', tabUrl:'' };

function songFormHTML(song, saveAction, saveData, saveLabel) {
  const s = song || BLANK_SONG;
  return `
    <div style="${css({ display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '12px', 'margin-bottom': '12px' })}">
      <div>${lbl('Title *')}${inputHTML({ id: 'sf-title', value: s.title, placeholder: 'Song title' })}</div>
      <div>${lbl('Artist / Original')}${inputHTML({ id: 'sf-artist', value: s.artist, placeholder: 'Artist' })}</div>
    </div>
    <div style="${css({ display: 'grid', 'grid-template-columns': '1fr 1fr 1fr', gap: '12px', 'margin-bottom': '12px' })}">
      <div>${lbl('Key')}${selHTML({ id: 'sf-key', value: s.key, options: KEYS.map(k => ({ value: k, label: k })) })}</div>
      <div>${lbl('BPM')}${inputHTML({ id: 'sf-bpm', value: s.bpm, placeholder: '120' })}</div>
      <div>${lbl('Genre')}${inputHTML({ id: 'sf-genre', value: s.genre, placeholder: 'Funk, Blues…' })}</div>
    </div>
    <div style="${css({ display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '12px', 'margin-bottom': '12px' })}">
      <div>${lbl('Status')}${selHTML({ id: 'sf-status', value: s.status, options: [{ value: 'learning', label: 'Learning' }, { value: 'ready', label: 'Ready' }, { value: 'shelved', label: 'Shelved' }] })}</div>
      <div>${lbl('Tags (comma-separated)')}${inputHTML({ id: 'sf-tags', value: s.tags, placeholder: 'funk, opener…' })}</div>
    </div>
    <div style="${css({ 'margin-bottom': '12px' })}">
      ${lbl('Tab Website (Songsterr, Ultimate Guitar, etc.)')}
      ${inputHTML({ id: 'sf-tabUrl', value: s.tabUrl, placeholder: 'https://www.songsterr.com/...' })}
      <div id="sf-tabsite-preview" style="${css({ 'font-size': '11px', color: C.acc, 'margin-top': '4px' })}">${s.tabUrl ? `→ ${getTabSiteName(s.tabUrl) || 'Custom link'}` : ''}</div>
    </div>
    <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Lyrics')}${taHTML({ id: 'sf-lyrics', value: s.lyrics, placeholder: 'Paste or write lyrics…', rows: 5 })}</div>
    <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Tabs / Chords')}${taHTML({ id: 'sf-tabs', value: s.tabs, placeholder: 'Guitar tabs, chord charts…', rows: 5, mono: true })}</div>
    <div style="${css({ 'margin-bottom': '20px' })}">${lbl('Notes')}${taHTML({ id: 'sf-notes', value: s.notes, placeholder: 'Performance notes, cues, arrangement tips…', rows: 3 })}</div>
    <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
      ${btn('Cancel', { action: 'close-modal' })}
      ${btn(saveLabel, { action: saveAction, data: saveData, variant: 'primary' })}
    </div>
  `;
}

function readSongForm() {
  return {
    title: document.getElementById('sf-title').value.trim(),
    artist: document.getElementById('sf-artist').value,
    key: document.getElementById('sf-key').value,
    bpm: (() => { const v = document.getElementById('sf-bpm').value; const n = Number(v); return v !== '' && !isNaN(n) ? n : v; })(),
    genre: document.getElementById('sf-genre').value,
    status: document.getElementById('sf-status').value,
    tags: document.getElementById('sf-tags').value,
    tabUrl: document.getElementById('sf-tabUrl').value,
    lyrics: document.getElementById('sf-lyrics').value,
    tabs: document.getElementById('sf-tabs').value,
    notes: document.getElementById('sf-notes').value,
  };
}

// ── Song Detail Page (teleprompter) ────────────────────────────
let sdTab = 'lyrics', sdPlaying = false, sdSpeed = 3, sdInterval = null, sdPlaylistId = '';

function stopTeleprompterInterval() { if (sdInterval) { clearInterval(sdInterval); sdInterval = null; } }
function openSong(song) { state.songPage = song; sdTab = 'lyrics'; sdPlaying = false; sdSpeed = 3; stopTeleprompterInterval(); render(); }
function closeSong() { stopTeleprompterInterval(); state.songPage = null; render(); }
function switchSongTab(t) {
  sdTab = t;
  sdPlaying = false;
  stopTeleprompterInterval();
  // Targeted DOM update (not a full render()) so the playlist sidebar's
  // iframe isn't recreated and reset when just switching lyrics/tabs/notes.
  const box = document.getElementById('sd-scrollbox');
  if (box && state.songPage) {
    box.innerHTML = songDetailContentHTML(state.songPage);
    box.style.background = sdTab === 'tabs' ? '#080808' : C.surf;
    box.scrollTop = 0;
  }
  document.querySelectorAll('[data-action="switch-song-tab"]').forEach(b => {
    const active = b.dataset.tab === sdTab;
    b.style.background = active ? C.raised : 'transparent';
    b.style.color = active ? C.txt : C.sub;
  });
  updatePlayButtonUI();
  updateProgressUI(0);
}

function updatePlayButtonUI() {
  const b = document.getElementById('sd-play-btn');
  if (!b) return;
  b.textContent = sdPlaying ? '⏸ Pause' : '▶ Auto-Scroll';
  b.style.background = sdPlaying ? `${C.org}1A` : `${C.acc}1A`;
  b.style.borderColor = sdPlaying ? `${C.org}44` : `${C.acc}44`;
  b.style.color = sdPlaying ? C.org : C.acc;
}
function updateProgressUI(p) {
  const bar = document.getElementById('sd-progress-bar');
  const label = document.getElementById('sd-progress-label');
  if (bar) { bar.style.width = p + '%'; bar.style.background = sdPlaying ? C.acc : C.dim; }
  if (label) label.textContent = Math.round(p) + '%';
}
function teleprompterToggle() {
  sdPlaying = !sdPlaying;
  updatePlayButtonUI();
  if (sdPlaying) {
    sdInterval = setInterval(() => {
      const el = document.getElementById('sd-scrollbox');
      if (!el) { stopTeleprompterInterval(); return; }
      el.scrollTop += sdSpeed * 0.7;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;
      updateProgressUI(progress);
      if (el.scrollTop >= max - 1) { sdPlaying = false; stopTeleprompterInterval(); updatePlayButtonUI(); }
    }, 50);
  } else {
    stopTeleprompterInterval();
  }
}
function teleprompterReset() {
  sdPlaying = false; stopTeleprompterInterval();
  const el = document.getElementById('sd-scrollbox');
  if (el) el.scrollTop = 0;
  updateProgressUI(0);
  updatePlayButtonUI();
}
function openEditSongModal(id) {
  sdPlaying = false; stopTeleprompterInterval();
  state.modal = { type: 'editSong', id };
  render();
}
function saveSong(mode, id) {
  const form = readSongForm();
  if (!form.title) return;
  if (mode === 'add') {
    updSongs([...state.songs, { ...form, id: uid() }]);
  } else {
    const updated = { ...form, id };
    updSongs(state.songs.map(s => s.id === id ? updated : s));
    if (state.songPage && state.songPage.id === id) state.songPage = updated;
  }
  state.modal = null;
  render();
}
function deleteSong(id) { updSongs(state.songs.filter(s => s.id !== id)); render(); }

function songDetailPlaylistPanel() {
  const options = [{ value: '', label: 'Select a playlist…' }, ...state.playlists.map(pl => {
    const member = state.members.find(m => m.id === pl.memberId);
    return { value: pl.id, label: member ? `${pl.name} — ${member.name}` : pl.name };
  })];
  const selected = state.playlists.find(pl => pl.id === sdPlaylistId);
  const platform = selected ? detectPlatform(selected.url) : null;
  const pInfo = platform ? PINFO[platform] : null;
  const embedUrl = selected ? getEmbedUrl(selected.url) : null;
  const embedH = platform === 'spotify' ? 352 : platform === 'youtube' ? 240 : platform === 'apple' ? 450 : 300;

  return `<div style="${css({ width: '300px', flexShrink: 0 })}">
    <div style="${css({ position: 'sticky', top: '70px' })}">
      <div style="${css({ background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '10px', padding: '14px' })}">
        ${lbl('Playlist Player')}
        <select id="sd-playlist-select" style="${css({ background: C.raised, border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.txt, 'font-family': "'DM Sans', sans-serif", 'font-size': '13px', padding: '8px 10px', outline: 'none', cursor: 'pointer', width: '100%', 'margin-top': '6px' })}">
          ${options.map(o => `<option value="${esc(o.value)}" ${o.value === sdPlaylistId ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
        </select>
        ${selected ? `
          <div style="${css({ 'margin-top': '12px' })}">
            ${embedUrl
              ? `<iframe src="${esc(embedUrl)}" style="${css({ width: '100%', border: 'none', 'border-radius': '8px', height: embedH + 'px', display: 'block' })}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="${esc(selected.name)}"></iframe>`
              : `<div style="${css({ 'font-size': '12px', color: C.dim, padding: '20px 0', 'text-align': 'center' })}">No embeddable player for this link.</div>`}
            <div style="${css({ display: 'flex', gap: '6px', 'margin-top': '10px', 'flex-wrap': 'wrap' })}">
              <a href="${esc(selected.url)}" target="_blank" rel="noopener noreferrer" style="${css({ display: 'inline-flex', 'align-items': 'center', gap: '5px', padding: '5px 10px', background: pInfo.bg, border: `1px solid ${pInfo.color}44`, 'border-radius': '6px', color: pInfo.color, 'font-size': '11px', 'font-weight': 600, 'text-decoration': 'none' })}">${icon('link', 12)} Open in ${pInfo.name}</a>
              ${embedUrl ? `<a href="${esc(embedUrl)}" target="_blank" rel="noopener noreferrer" style="${css({ display: 'inline-flex', 'align-items': 'center', gap: '5px', padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.sub, 'font-size': '11px', 'font-weight': 600, 'text-decoration': 'none' })}">↗ Full Player</a>` : ''}
            </div>
          </div>
        ` : `<div style="${css({ 'font-size': '12px', color: C.dim, 'margin-top': '12px', 'text-align': 'center', padding: '20px 0' })}">Pick a playlist to play while you practice.</div>`}
      </div>
    </div>
  </div>`;
}

function songDetailContentHTML(song) {
  if (sdTab === 'lyrics') return `<div style="${css({ 'white-space': 'pre-wrap', 'font-size': '15px', color: C.sub, 'line-height': 2.0, 'font-family': "'DM Sans', sans-serif" })}">${song.lyrics ? esc(song.lyrics) : `<em style="color:${C.dim}">No lyrics yet — click Edit Song to add.</em>`}</div>`;
  if (sdTab === 'tabs') return `<div style="${css({ 'font-family': "'JetBrains Mono', monospace", 'font-size': '13px', color: C.acc, 'white-space': 'pre', 'line-height': 1.8 })}">${song.tabs ? esc(song.tabs) : `<span style="color:${C.dim};font-family:'DM Sans', sans-serif;font-style:italic">No tabs yet — click Edit Song to add.</span>`}</div>`;
  return `<div style="${css({ 'font-size': '15px', color: C.sub, 'line-height': 1.8, 'white-space': 'pre-wrap' })}">${song.notes ? esc(song.notes) : `<em style="color:${C.dim}">No notes yet — click Edit Song to add.</em>`}</div>`;
}

function songDetailTemplate(song) {
  const tabSite = getTabSiteName(song.tabUrl);
  const tabsRow = ['lyrics', 'tabs', 'notes'].map(t => `<button data-action="switch-song-tab" data-tab="${t}" style="${css({ padding: '6px 18px', 'border-radius': '6px', border: 'none', background: sdTab === t ? C.raised : 'transparent', color: sdTab === t ? C.txt : C.sub, 'font-size': '13px', 'font-weight': 600, cursor: 'pointer', 'font-family': "'DM Sans', sans-serif", 'text-transform': 'capitalize' })}">${t}</button>`).join('');
  const content = songDetailContentHTML(song);

  const tagsHTML = song.tags ? `<div style="${css({ display: 'flex', gap: '4px', 'flex-wrap': 'wrap', 'margin-bottom': '10px' })}">${song.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `<span style="${css({ background: C.raised, color: C.dim, padding: '1px 7px', 'border-radius': '3px', 'font-size': '10px', border: `1px solid ${C.border}` })}">${esc(t)}</span>`).join('')}</div>` : '';

  return `<div>
    <div style="${css({ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '20px' })}">
      <button data-action="back-to-songs" style="${css({ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', 'font-size': '13px', 'font-weight': 600, 'font-family': "'DM Sans', sans-serif", display: 'flex', 'align-items': 'center', gap: '5px', padding: 0 })}">← Songs</button>
      ${btn('✏ Edit Song', { action: 'open-edit-song-modal', data: { id: song.id } })}
    </div>
    <div style="${css({ 'margin-bottom': '18px', 'padding-bottom': '18px', 'border-bottom': `1px solid ${C.border}` })}">
      <h1 style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '28px', 'font-weight': 500, 'letter-spacing': '0.02em', color: C.txt, margin: '0 0 10px 0' })}">${esc(song.title)}</h1>
      <div style="${css({ display: 'flex', gap: '8px', 'align-items': 'center', 'flex-wrap': 'wrap', 'margin-bottom': '8px' })}">
        ${statusBadge(song.status)}
        <span style="${css({ color: C.sub, 'font-size': '13px' })}">${esc(song.key)}</span>
        ${song.bpm ? `<span style="${css({ color: C.dim, 'font-size': '13px' })}">· ${esc(song.bpm)} BPM</span>` : ''}
        ${song.genre ? `<span style="${css({ color: C.dim, 'font-size': '13px' })}">· ${esc(song.genre)}</span>` : ''}
        ${song.artist && song.artist !== 'Original' ? `<span style="${css({ color: C.dim, 'font-size': '13px' })}">· ${esc(song.artist)}</span>` : ''}
      </div>
      ${tagsHTML}
      ${song.tabUrl ? `<a href="${esc(song.tabUrl)}" target="_blank" rel="noopener noreferrer" style="${css({ display: 'inline-flex', 'align-items': 'center', gap: '6px', padding: '6px 14px', background: C.raised, border: `1px solid ${C.acc}44`, 'border-radius': '6px', color: C.acc, 'font-size': '12px', 'font-weight': 600, 'text-decoration': 'none' })}">${icon('pick', 14)} ${esc(tabSite || 'View Tab')} ↗</a>` : ''}
    </div>
    <div style="${css({ display: 'flex', gap: '2px', background: '#080808', 'border-radius': '8px', padding: '3px', width: 'fit-content', 'margin-bottom': '10px' })}">${tabsRow}</div>
    <div style="${css({ border: `1px solid ${C.border}`, 'border-radius': '10px', overflow: 'hidden' })}">
      <div id="sd-scrollbox" style="${css({ height: 'calc(100vh - 420px)', 'min-height': '220px', 'overflow-y': 'auto', background: sdTab === 'tabs' ? '#080808' : C.surf, padding: '20px 24px' })}">${content}</div>
      <div style="${css({ background: C.raised, 'border-top': `1px solid ${C.border}`, padding: '9px 16px', display: 'flex', 'align-items': 'center', gap: '12px', 'flex-wrap': 'wrap' })}">
        <button data-action="teleprompter-reset" style="${css({ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', 'font-size': '12px', 'font-weight': 600, 'font-family': "'DM Sans', sans-serif", display: 'flex', 'align-items': 'center', gap: '4px', padding: 0 })}">↑ Top</button>
        <div style="${css({ width: '1px', height: '16px', background: C.border })}"></div>
        <button id="sd-play-btn" data-action="teleprompter-toggle" style="${css({ background: sdPlaying ? `${C.org}1A` : `${C.acc}1A`, border: `1px solid ${sdPlaying ? C.org : C.acc}44`, color: sdPlaying ? C.org : C.acc, padding: '5px 14px', 'border-radius': '6px', cursor: 'pointer', 'font-size': '12px', 'font-weight': 700, 'font-family': "'DM Sans', sans-serif", display: 'flex', 'align-items': 'center', gap: '5px' })}">${sdPlaying ? '⏸ Pause' : '▶ Auto-Scroll'}</button>
        <div style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', flex: 1, 'min-width': '120px' })}">
          <span style="${css({ 'font-size': '10px', color: C.dim, 'white-space': 'nowrap', 'letter-spacing': '0.05em', 'text-transform': 'uppercase' })}">Speed</span>
          <input id="sd-speed-input" type="range" min="1" max="10" value="${sdSpeed}" style="${css({ flex: 1, 'accent-color': C.acc, cursor: 'pointer' })}" />
          <span id="sd-speed-label" style="${css({ 'font-size': '11px', color: C.sub, 'min-width': '10px' })}">${sdSpeed}</span>
        </div>
        <div style="${css({ display: 'flex', 'align-items': 'center', gap: '6px', 'min-width': '90px' })}">
          <div style="${css({ flex: 1, height: '3px', background: C.border, 'border-radius': '2px', overflow: 'hidden', 'min-width': '70px' })}"><div id="sd-progress-bar" style="${css({ height: '100%', width: '0%', background: C.dim, 'border-radius': '2px' })}"></div></div>
          <span id="sd-progress-label" style="${css({ 'font-size': '10px', color: C.dim, 'min-width': '28px', 'text-align': 'right' })}">0%</span>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Songs List View ────────────────────────────────────────────
function openAddSongModal() { state.modal = { type: 'addSong' }; render(); }
function setSongFilter(f) { state.ui.songFilter = f; render(); }
function setSongQuery(q) { state.ui.songQuery = q; render(); }

function songsViewTemplate() {
  const { songFilter, songQuery } = state.ui;
  const filtered = state.songs.filter(s => {
    const ok = songFilter === 'all' || s.status === songFilter;
    const q = songQuery.toLowerCase();
    return ok && (!q || s.title.toLowerCase().includes(q) || (s.genre || '').toLowerCase().includes(q) || (s.tags || '').toLowerCase().includes(q));
  });
  const filterChips = ['all', 'ready', 'learning', 'shelved'].map(f => `<button data-action="set-song-filter" data-filter="${f}" style="${chipStyle(songFilter === f)}">${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>`).join('');

  let grid;
  if (filtered.length === 0) {
    grid = empty('pick', songQuery || songFilter !== 'all' ? 'No songs match.' : 'Add your first song!');
  } else {
    grid = `<div style="${css({ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' })}">
      ${filtered.map(song => `
        <div data-action="open-song" data-id="${song.id}" style="${css({ background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '8px', padding: '11px 14px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative', display: 'flex', 'align-items': 'center', gap: '10px' })}">
          <div style="${css({ flex: 1, 'min-width': 0 })}">
            <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '15px', 'font-weight': 500, color: C.txt, 'letter-spacing': '0.02em', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' })}">${esc(song.title)}</div>
            ${song.artist ? `<div style="${css({ 'font-size': '11px', color: C.dim, 'margin-top': '2px', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' })}">${esc(song.artist)}</div>` : ''}
          </div>
          <span style="${css({ color: C.acc, 'font-size': '13px', flexShrink: 0 })}">→</span>
          <button data-action="delete-song" data-id="${song.id}" style="${css({ position: 'absolute', top: '8px', right: '26px', background: 'none', border: 'none', color: C.org, cursor: 'pointer', 'font-size': '11px', 'font-weight': 700, 'line-height': 1 })}">✕</button>
        </div>
      `).join('')}
    </div>`;
  }

  return `<div>
    ${sh('Songs', `(${state.songs.length})`, btn('+ Add Song', { action: 'open-add-song-modal', variant: 'primary' }))}
    <div style="${css({ display: 'flex', gap: '8px', 'margin-bottom': '16px', 'flex-wrap': 'wrap', 'align-items': 'center' })}">
      <input id="song-search" value="${esc(songQuery)}" placeholder="Search by title, genre, tag…" style="${css({ background: C.raised, border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.txt, 'font-family': "'DM Sans', sans-serif", 'font-size': '14px', padding: '8px 12px', outline: 'none', flex: 1, 'min-width': '150px', 'max-width': '220px' })}" />
      ${filterChips}
    </div>
    ${grid}
  </div>`;
}

// ── Setlists View ───────────────────────────────────────────────
function toggleSetlistExpand(id) { state.ui.slExpanded = state.ui.slExpanded === id ? null : id; render(); }
function openAddSetlistModal() { state.modal = { type: 'addSetlist' }; render(); }
function openEditSetlistModal(id) { state.modal = { type: 'editSetlist', id }; render(); }
function saveSetlist(mode, id) {
  const name = document.getElementById('slf-name').value.trim();
  const notes = document.getElementById('slf-notes').value;
  if (!name) return;
  if (mode === 'add') updSetlists([...state.setlists, { name, notes, id: uid(), songIds: [], created: TODAY }]);
  else updSetlists(state.setlists.map(sl => sl.id === id ? { ...sl, name, notes } : sl));
  state.modal = null;
  render();
}
function deleteSetlist(id) { updSetlists(state.setlists.filter(sl => sl.id !== id)); render(); }
function moveSetlistSong(slId, i, dir) {
  updSetlists(state.setlists.map(sl => {
    if (sl.id !== slId) return sl;
    const ids = [...sl.songIds]; const to = i + dir;
    if (to < 0 || to >= ids.length) return sl;
    [ids[i], ids[to]] = [ids[to], ids[i]];
    return { ...sl, songIds: ids };
  }));
  render();
}
function removeSetlistSong(slId, sId) { updSetlists(state.setlists.map(sl => sl.id === slId ? { ...sl, songIds: sl.songIds.filter(id => id !== sId) } : sl)); render(); }
function openSetlistPicker(slId) { state.ui.slPicker = slId; render(); }
function addSongToSetlist(slId, sId) {
  updSetlists(state.setlists.map(sl => sl.id === slId ? { ...sl, songIds: [...sl.songIds.filter(id => id !== sId), sId] } : sl));
  state.ui.slPicker = null;
  state.modal = null;
  render();
}

function setlistsViewTemplate() {
  const { slExpanded } = state.ui;
  const list = state.setlists.length === 0 ? empty('list', 'No setlists yet.') : state.setlists.map(sl => {
    const open = slExpanded === sl.id;
    const slSongs = (sl.songIds || []).map(id => state.songs.find(s => s.id === id)).filter(Boolean);
    const songsHTML = slSongs.length === 0
      ? `<div style="${css({ 'text-align': 'center', padding: '16px 0', color: C.dim, 'font-size': '13px' })}">No songs yet.</div>`
      : slSongs.map((song, i) => `
        <div style="${css({ display: 'flex', 'align-items': 'center', gap: '10px', padding: '8px 10px', background: C.raised, 'border-radius': '8px', 'margin-bottom': '6px' })}">
          <span style="${css({ 'font-family': "'Bebas Neue', sans-serif", color: C.acc, 'font-size': '18px', width: '22px', 'text-align': 'right', flexShrink: 0 })}">${i + 1}</span>
          <div style="${css({ flex: 1 })}">
            <div style="${css({ 'font-size': '14px', 'font-weight': 500, color: C.txt })}">${esc(song.title)}</div>
            <div style="${css({ 'font-size': '11px', color: C.sub })}">${esc(song.key)} · ${esc(song.bpm)} BPM${song.genre ? ` · ${esc(song.genre)}` : ''}</div>
          </div>
          ${statusBadge(song.status)}
          <div style="${css({ display: 'flex', gap: '3px' })}">
            <button data-action="move-setlist-song" data-setlist-id="${sl.id}" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} style="${css({ background: 'none', border: 'none', color: i === 0 ? C.dim : C.sub, cursor: i === 0 ? 'default' : 'pointer', 'font-size': '14px', padding: '2px 4px' })}">▲</button>
            <button data-action="move-setlist-song" data-setlist-id="${sl.id}" data-index="${i}" data-dir="1" ${i === slSongs.length - 1 ? 'disabled' : ''} style="${css({ background: 'none', border: 'none', color: i === slSongs.length - 1 ? C.dim : C.sub, cursor: i === slSongs.length - 1 ? 'default' : 'pointer', 'font-size': '14px', padding: '2px 4px' })}">▼</button>
            <button data-action="remove-setlist-song" data-setlist-id="${sl.id}" data-song-id="${song.id}" style="${css({ background: 'none', border: 'none', color: C.org, cursor: 'pointer', 'font-size': '14px', padding: '2px 4px' })}">✕</button>
          </div>
        </div>
      `).join('');

    return `<div style="${css({ background: C.surf, border: `1px solid ${open ? C.acc : C.border}`, 'border-radius': '10px', padding: '16px', 'margin-bottom': '10px', transition: 'border-color 0.15s' })}">
      <div data-action="toggle-setlist-expand" data-id="${sl.id}" style="${css({ cursor: 'pointer', display: 'flex', 'justify-content': 'space-between', 'align-items': 'flex-start' })}">
        <div>
          <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '17px', 'font-weight': 500, color: C.txt, 'letter-spacing': '0.02em', 'margin-bottom': '4px' })}">${esc(sl.name)}</div>
          <div style="${css({ 'font-size': '12px', color: C.sub })}">${slSongs.length} song${slSongs.length !== 1 ? 's' : ''}${sl.created ? `<span style="color:${C.dim}"> · ${fmtDate(sl.created)}</span>` : ''}</div>
        </div>
        <div style="${css({ display: 'flex', gap: '6px', 'align-items': 'center' })}">
          ${btn('Edit', { action: 'open-edit-setlist-modal', data: { id: sl.id }, sm: true })}
          <span style="${css({ color: C.dim })}">${open ? '▲' : '▼'}</span>
        </div>
      </div>
      ${open ? `<div style="${css({ 'margin-top': '14px', 'border-top': `1px solid ${C.border}`, 'padding-top': '14px' })}">
        ${sl.notes ? `<div style="${css({ 'font-size': '13px', color: C.sub, 'font-style': 'italic', 'margin-bottom': '12px' })}">"${esc(sl.notes)}"</div>` : ''}
        ${songsHTML}
        <div style="${css({ display: 'flex', gap: '8px', 'margin-top': '10px' })}">
          ${btn('+ Add Song', { action: 'open-setlist-picker', data: { id: sl.id }, sm: true })}
          ${btn('Delete Setlist', { action: 'delete-setlist', data: { id: sl.id }, sm: true, variant: 'danger' })}
        </div>
      </div>` : ''}
    </div>`;
  }).join('');

  return `<div>${sh('Setlists', '', btn('+ New Setlist', { action: 'open-add-setlist-modal', variant: 'primary' }))}${list}</div>`;
}

// ── Jams View ───────────────────────────────────────────────────
function toggleJamSection(section) {
  if (section === 'open') state.ui.jamShowOpen = !state.ui.jamShowOpen;
  if (section === 'proposed') state.ui.jamShowProposed = !state.ui.jamShowProposed;
  if (section === 'past') state.ui.jamShowPast = !state.ui.jamShowPast;
  render();
}
function toggleJamCard(id) { state.ui.jamCardOpen[id] = !state.ui.jamCardOpen[id]; render(); }
function cycleJamAvail(jamId, memberId) {
  updJams(state.jams.map(j => {
    if (j.id !== jamId) return j;
    const cur = (j.availability || {})[memberId];
    const next = !cur || cur === 'maybe' ? 'in' : cur === 'in' ? 'out' : 'maybe';
    return { ...j, availability: { ...(j.availability || {}), [memberId]: next } };
  }));
  render();
}
function confirmJam(id) { updJams(state.jams.map(j => j.id === id ? { ...j, status: 'confirmed' } : j)); render(); }
function unconfirmJam(id) { updJams(state.jams.map(j => j.id === id ? { ...j, status: 'proposed' } : j)); render(); }
function deleteJam(id) { updJams(state.jams.filter(j => j.id !== id)); render(); }
function openAddJamModal() { state.modal = { type: 'addJam' }; render(); }
function openEditJamModal(id) { state.modal = { type: 'editJam', id }; render(); }
function saveJam(mode, id) {
  const date = document.getElementById('jf-date').value;
  const time = document.getElementById('jf-time').value;
  const endTime = document.getElementById('jf-endTime').value;
  const location = document.getElementById('jf-location').value;
  const notes = document.getElementById('jf-notes').value;
  if (!date) return;
  if (mode === 'add') updJams([...state.jams, { date, time, endTime, location, notes, id: uid(), status: 'proposed', availability: {} }]);
  else updJams(state.jams.map(j => j.id === id ? { ...j, date, time, endTime, location, notes } : j));
  state.modal = null;
  render();
}

function jamMemberRow(jam, m, clickable) {
  const avail = jam.availability || {};
  const a = avail[m.id];
  const [c, bg] = AVAIL_INFO[a] || [C.dim, C.raised];
  const statusLabel = a === 'in' ? 'In' : a === 'out' ? 'Out' : a === 'maybe' ? 'Maybe' : 'No vote';
  const statusIcon = a === 'in' ? '✓' : a === 'out' ? '✗' : a === 'maybe' ? '?' : '◌';
  return `<div ${clickable ? `data-action="cycle-jam-avail" data-jam-id="${jam.id}" data-member-id="${m.id}"` : ''} style="${css({ display: 'flex', 'align-items': 'center', gap: '10px', padding: '9px 12px', cursor: clickable ? 'pointer' : 'default' })}">
    <span style="${css({ width: '8px', height: '8px', 'border-radius': '50%', background: m.color, display: 'inline-block', flexShrink: 0 })}"></span>
    <span style="${css({ flex: 1, 'font-size': '13px', color: C.txt, 'font-weight': 500 })}">${esc(m.name)}</span>
    <span style="${css({ 'font-size': '11px', 'font-weight': 700, color: c, background: bg, padding: '2px 9px', 'border-radius': '4px', 'letter-spacing': '0.02em', flexShrink: 0 })}">${statusIcon} ${statusLabel}</span>
  </div>`;
}

function jamCardTemplate(jam, variant) {
  const avail = jam.availability || {};
  const inMembers = state.members.filter(m => avail[m.id] === 'in');
  const outMembers = state.members.filter(m => avail[m.id] === 'out');
  const mayMembers = state.members.filter(m => avail[m.id] === 'maybe');
  const noMembers = state.members.filter(m => !avail[m.id]);
  const total = state.members.length;
  const canConfirm = inMembers.length >= Math.ceil(total / 2);
  const leftColor = variant === 'open' ? C.sage : C.dim;
  const borderColor = variant === 'open' ? `${C.sage}44` : C.border;
  const open = !!state.ui.jamCardOpen[jam.id];

  return `<div style="${css({ background: C.surf, border: `1px solid ${borderColor}`, 'border-left': `3px solid ${leftColor}`, 'border-radius': '10px', padding: '16px', 'margin-bottom': '8px', opacity: variant === 'past' ? 0.7 : 1 })}">
    <div data-action="toggle-jam-card" data-id="${jam.id}" style="${css({ cursor: 'pointer', display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' })}">
      <div style="${css({ flex: 1, 'min-width': 0 })}">
        <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '16px', 'font-weight': 500, color: variant === 'past' ? C.sub : C.txt, 'letter-spacing': '0.02em', display: 'flex', 'align-items': 'center', gap: '8px', 'flex-wrap': 'wrap' })}">
          ${fmtDate(jam.date)}
          ${jam.time ? `<span style="${css({ color: variant === 'past' ? C.dim : C.acc, 'font-size': '13px', 'font-weight': 400, 'font-family': "'DM Sans', sans-serif" })}">${fmtTimeRange(jam)}</span>` : ''}
          ${jam.location ? `<span style="${css({ color: C.dim, 'font-size': '13px', 'font-weight': 400, 'font-family': "'DM Sans', sans-serif" })}">· ${esc(jam.location)}</span>` : ''}
        </div>
      </div>
      <div style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', 'margin-left': '10px', flexShrink: 0 })}">
        <div style="${css({ display: 'flex', gap: '6px', 'font-size': '12px', 'font-weight': 700 })}">
          <span style="color:${C.sage}">${inMembers.length}✓</span>
          ${mayMembers.length > 0 ? `<span style="color:${C.acc}">${mayMembers.length}?</span>` : ''}
          ${outMembers.length > 0 ? `<span style="color:${C.org}">${outMembers.length}✗</span>` : ''}
        </div>
        <span style="${css({ color: C.dim, 'font-size': '12px' })}">${open ? '▲' : '▼'}</span>
      </div>
    </div>
    ${open ? `<div style="${css({ 'margin-top': '12px', 'border-top': `1px solid ${C.border}`, 'padding-top': '12px' })}">
      ${lbl(variant === 'open' ? 'Attendance' : 'Attended')}
      <div style="${css({ 'margin-top': '6px', 'margin-bottom': '12px', border: `1px solid ${C.border}`, 'border-radius': '8px', overflow: 'hidden' })}">
        ${state.members.map(m => jamMemberRow(jam, m, variant !== 'past')).join('')}
      </div>
      <div style="${css({ display: 'flex', gap: '8px', 'flex-wrap': 'wrap', 'align-items': 'center' })}">
        ${variant === 'open' ? btn('↩ Unconfirm', { action: 'unconfirm-jam', data: { id: jam.id }, sm: true }) : ''}
        ${variant !== 'past' ? btn('✏ Edit', { action: 'open-edit-jam-modal', data: { id: jam.id }, sm: true }) : ''}
        ${btn('Delete', { action: 'delete-jam', data: { id: jam.id }, sm: true, variant: 'danger' })}
      </div>
    </div>` : ''}
  </div>`;
}

function proposedJamBlockTemplate(jam) {
  const avail = jam.availability || {};
  const inMembers = state.members.filter(m => avail[m.id] === 'in');
  const outMembers = state.members.filter(m => avail[m.id] === 'out');
  const mayMembers = state.members.filter(m => avail[m.id] === 'maybe');
  const noMembers = state.members.filter(m => !avail[m.id]);
  const total = state.members.length;
  const canConfirm = inMembers.length >= Math.ceil(total / 2);

  return `<div style="${css({ 'margin-bottom': '22px' })}">
    <div style="${css({ background: C.surf, border: `1px solid ${C.acc}44`, 'border-left': `3px solid ${C.acc}`, 'border-radius': '10px', padding: '13px 16px', display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '6px' })}">
      <div>
        <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '20px', 'font-weight': 500, color: C.txt, 'letter-spacing': '0.02em', 'margin-bottom': '3px' })}">
          ${fmtDate(jam.date)}${jam.time ? `<span style="color:${C.acc};font-size:15px;font-weight:400;font-family:'DM Sans', sans-serif;margin-left:10px">${fmtTimeRange(jam)}</span>` : ''}
        </div>
        ${jam.location ? `<div style="${css({ 'font-size': '12px', color: C.sub })}">${icon('pin', 13)} ${esc(jam.location)}</div>` : ''}
      </div>
      <div style="${css({ display: 'flex', gap: '6px', flexShrink: 0, 'margin-left': '16px' })}">
        <span style="${css({ background: '#1D2B18', color: C.sage, padding: '3px 9px', 'border-radius': '5px', 'font-size': '12px', 'font-weight': 700 })}">${inMembers.length}✓</span>
        ${mayMembers.length > 0 ? `<span style="${css({ background: '#2B1013', color: C.acc, padding: '3px 9px', 'border-radius': '5px', 'font-size': '12px', 'font-weight': 700 })}">${mayMembers.length}?</span>` : ''}
        ${outMembers.length > 0 ? `<span style="${css({ background: '#2B1510', color: C.org, padding: '3px 9px', 'border-radius': '5px', 'font-size': '12px', 'font-weight': 700 })}">${outMembers.length}✗</span>` : ''}
        ${noMembers.length > 0 ? `<span style="${css({ background: C.raised, color: C.dim, padding: '3px 9px', 'border-radius': '5px', 'font-size': '12px', 'font-weight': 700 })}">${noMembers.length}◌</span>` : ''}
      </div>
    </div>
    <div style="${css({ 'padding-left': '4px' })}">${state.members.map(m => jamMemberRow(jam, m, true)).join('')}</div>
    <div style="${css({ display: 'flex', gap: '8px', 'margin-top': '10px', 'padding-left': '4px', 'flex-wrap': 'wrap', 'align-items': 'center' })}">
      <button data-action="confirm-jam" data-id="${jam.id}" style="${css({ background: canConfirm ? C.sage : 'transparent', color: canConfirm ? C.bg : C.sage, border: `1.5px solid ${C.sage}`, padding: '5px 14px', 'border-radius': '6px', cursor: 'pointer', 'font-size': '12px', 'font-weight': 700, 'font-family': "'DM Sans', sans-serif", display: 'flex', 'align-items': 'center', gap: '5px' })}">${canConfirm ? `${icon('checkCircle', 14)} Confirm Jam` : `Confirm (${inMembers.length}/${Math.ceil(total / 2)} votes)`}</button>
      ${btn('✏ Edit', { action: 'open-edit-jam-modal', data: { id: jam.id }, sm: true })}
      ${btn('Delete', { action: 'delete-jam', data: { id: jam.id }, sm: true, variant: 'danger' })}
    </div>
  </div>`;
}

function collapseHead(show, section, icon, label, count, color) {
  return `<div data-action="toggle-jam-section" data-section="${section}" style="${css({ cursor: 'pointer', display: 'flex', 'align-items': 'center', gap: '10px', 'margin-bottom': show ? '12px' : 0, 'user-select': 'none' })}">
    <span style="${css({ 'font-size': '10px', color, flexShrink: 0 })}">${show ? '▼' : '▶'}</span>
    <span style="${css({ 'font-size': '11px', 'font-weight': 700, color, 'letter-spacing': '0.07em', 'text-transform': 'uppercase', flexShrink: 0 })}">${icon} ${label}</span>
    <span style="${css({ background: `${color}22`, color, padding: '1px 8px', 'border-radius': '10px', 'font-size': '11px', 'font-weight': 700, flexShrink: 0 })}">${count}</span>
    <div style="${css({ flex: 1, height: '1px', background: `${color}22` })}"></div>
  </div>`;
}

function jamsViewTemplate() {
  const upcoming = state.jams.filter(j => j.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const past = state.jams.filter(j => j.date < TODAY).sort((a, b) => b.date.localeCompare(a.date));
  const openJams = upcoming.filter(j => j.status === 'confirmed');
  const proposed = upcoming.filter(j => j.status === 'proposed');
  const { jamShowOpen, jamShowProposed, jamShowPast } = state.ui;

  return `<div>
    ${sh('Jams', '', btn('+ Propose Date', { action: 'open-add-jam-modal', variant: 'primary' }))}
    <div style="${css({ 'margin-bottom': '22px' })}">
      ${collapseHead(jamShowOpen, 'open', '●', 'Open Jams', openJams.length, C.sage)}
      ${jamShowOpen ? (openJams.length === 0 ? `<div style="${css({ 'font-size': '13px', color: C.dim, padding: '6px 0 4px', 'line-height': 1.6 })}">No confirmed jams yet — confirm a proposal once the band votes in.</div>` : openJams.map(j => jamCardTemplate(j, 'open')).join('')) : ''}
    </div>
    <div style="${css({ 'margin-bottom': '22px' })}">
      ${collapseHead(jamShowProposed, 'proposed', '◐', 'Proposed Dates', proposed.length, C.acc)}
      ${jamShowProposed ? (proposed.length === 0 ? `<div style="${css({ 'font-size': '13px', color: C.dim, padding: '6px 0 4px', 'line-height': 1.6 })}">No proposals yet — propose a date and let everyone vote.</div>` : proposed.map(j => proposedJamBlockTemplate(j)).join('')) : ''}
    </div>
    <div>
      ${collapseHead(jamShowPast, 'past', '○', 'Past Jams', past.length, C.dim)}
      ${jamShowPast ? (past.length === 0 ? `<div style="${css({ 'font-size': '13px', color: C.dim, padding: '6px 0' })}">No past jams recorded.</div>` : past.map(j => jamCardTemplate(j, 'past')).join('')) : ''}
    </div>
  </div>`;
}

// ── Playlists View ────────────────────────────────────────────
const BLANK_PL = { name: '', memberId: '', url: '', description: '' };
function setPlaylistMemberFilter(m) { state.ui.plMemberFilter = m; render(); }
function togglePlaylistEmbed(id) { state.ui.plShowEmbed[id] = !state.ui.plShowEmbed[id]; render(); }
function openAddPlaylistModal() { state.modal = { type: 'addPlaylist' }; render(); }
function deletePlaylist(id) { updPlaylists(state.playlists.filter(pl => pl.id !== id)); render(); }
function savePlaylist() {
  const name = document.getElementById('plf-name').value.trim();
  const memberId = document.getElementById('plf-memberId').value;
  const url = document.getElementById('plf-url').value.trim();
  const description = document.getElementById('plf-description').value;
  const songsRaw = document.getElementById('plf-songs').value;
  if (!name || !url) return;
  updPlaylists([...state.playlists, { name, memberId, url, description, id: uid() }]);
  const lines = songsRaw.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length) {
    const newSongs = lines.map(line => {
      const [title, artist] = line.split(/\s+-\s+/, 2);
      return { ...BLANK_SONG, title: (title || line).trim(), artist: (artist || '').trim(), id: uid() };
    });
    updSongs([...state.songs, ...newSongs]);
  }
  state.modal = null;
  render();
}

function playlistsViewTemplate() {
  const { plMemberFilter, plShowEmbed } = state.ui;
  const filtered = state.playlists.filter(pl => plMemberFilter === 'all' || pl.memberId === plMemberFilter);
  const memberChips = state.members.map(m => `<button data-action="set-playlist-member-filter" data-member="${m.id}" style="${chipStyle(plMemberFilter === m.id)}"><span style="${css({ width: '7px', height: '7px', 'border-radius': '50%', background: m.color, display: 'inline-block', 'margin-right': '4px' })}"></span>${esc(m.name)}</button>`).join('');

  const list = filtered.length === 0 ? empty('flame', 'No playlists yet.') : filtered.map(pl => {
    const member = state.members.find(m => m.id === pl.memberId);
    const platform = detectPlatform(pl.url);
    const pInfo = PINFO[platform];
    const embedUrl = getEmbedUrl(pl.url);
    const isExpanded = plShowEmbed[pl.id];
    const embedH = platform === 'spotify' ? 352 : platform === 'youtube' ? 240 : platform === 'apple' ? 450 : 175;

    return `<div style="${css({ background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '10px', padding: '16px', 'margin-bottom': '10px' })}">
      <div style="${css({ display: 'flex', 'justify-content': 'space-between', 'align-items': 'flex-start', 'margin-bottom': '10px' })}">
        <div style="${css({ flex: 1 })}">
          <div style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', 'margin-bottom': '6px' })}">
            <span style="${css({ background: pInfo.bg, color: pInfo.color, padding: '2px 8px', 'border-radius': '4px', 'font-size': '10px', 'font-weight': 700, 'letter-spacing': '0.04em' })}">${pInfo.icon} ${pInfo.name}</span>
            ${member ? `<span style="${css({ display: 'flex', 'align-items': 'center', gap: '4px', 'font-size': '12px', color: C.sub })}"><span style="${css({ width: '7px', height: '7px', 'border-radius': '50%', background: member.color, display: 'inline-block' })}"></span>${esc(member.name)}</span>` : ''}
          </div>
          <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '16px', 'font-weight': 500, color: C.txt, 'letter-spacing': '0.02em', 'margin-bottom': '4px' })}">${esc(pl.name)}</div>
          ${pl.description ? `<div style="${css({ 'font-size': '12px', color: C.sub, 'line-height': 1.5 })}">${esc(pl.description)}</div>` : ''}
        </div>
        <button data-action="delete-playlist" data-id="${pl.id}" style="${css({ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', 'font-size': '14px', 'margin-left': '8px', flexShrink: 0 })}">✕</button>
      </div>
      <div style="${css({ display: 'flex', gap: '8px', 'flex-wrap': 'wrap', 'align-items': 'center' })}">
        <a href="${esc(pl.url)}" target="_blank" rel="noopener noreferrer" style="${css({ display: 'inline-flex', 'align-items': 'center', gap: '5px', padding: '5px 12px', background: pInfo.bg, border: `1px solid ${pInfo.color}44`, 'border-radius': '6px', color: pInfo.color, 'font-size': '12px', 'font-weight': 600, 'text-decoration': 'none' })}">${icon('link', 13)} Open in ${pInfo.name}</a>
        ${embedUrl ? btn(isExpanded ? '▲ Hide Player' : '▶ Show Player', { action: 'toggle-playlist-embed', data: { id: pl.id }, sm: true }) : ''}
        ${embedUrl ? `<a href="${esc(embedUrl)}" target="_blank" rel="noopener noreferrer" style="${css({ display: 'inline-flex', 'align-items': 'center', gap: '5px', padding: '5px 12px', background: 'transparent', border: `1px solid ${C.border}`, 'border-radius': '6px', color: C.sub, 'font-size': '12px', 'font-weight': 600, 'text-decoration': 'none' })}">↗ Open Full Player</a>` : ''}
      </div>
      ${isExpanded && embedUrl ? `<div style="${css({ 'margin-top': '14px' })}">
        <iframe src="${esc(embedUrl)}" style="${css({ width: '100%', border: 'none', 'border-radius': '8px', height: embedH + 'px', display: 'block' })}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="${esc(pl.name)}"></iframe>
        <div style="${css({ 'font-size': '10px', color: C.dim, 'margin-top': '6px', 'text-align': 'center' })}">If the player doesn't appear, <a href="${esc(pl.url)}" target="_blank" rel="noopener noreferrer" style="color:${pInfo.color}">open in ${pInfo.name} directly ↗</a></div>
      </div>` : ''}
    </div>`;
  }).join('');

  return `<div>
    ${sh('Playlists', '', btn('+ Add Playlist', { action: 'open-add-playlist-modal', variant: 'primary' }))}
    <div style="${css({ 'margin-bottom': '6px', 'font-size': '12px', color: C.dim })}">Share public playlists from Spotify, YouTube, or Apple Music for the band to reference.</div>
    <div style="${css({ display: 'flex', gap: '8px', 'margin-bottom': '20px', 'flex-wrap': 'wrap', 'margin-top': '12px' })}">
      <button data-action="set-playlist-member-filter" data-member="all" style="${chipStyle(plMemberFilter === 'all')}">All</button>
      ${memberChips}
    </div>
    ${list}
  </div>`;
}

// ── Reminders View ──────────────────────────────────────────────
function setReminderTab(done) { state.ui.remShowDone = done; render(); }
function toggleReminder(id) { updReminders(state.reminders.map(r => r.id === id ? { ...r, done: !r.done } : r)); render(); }
function deleteReminder(id) { updReminders(state.reminders.filter(r => r.id !== id)); render(); }
function openAddReminderModal() { state.modal = { type: 'addReminder' }; render(); }
function saveReminder() {
  const text = document.getElementById('rf-text').value.trim();
  const dueDate = document.getElementById('rf-dueDate').value;
  const priority = document.getElementById('rf-priority').value;
  if (!text) return;
  updReminders([...state.reminders, { text, dueDate, priority, id: uid(), done: false }]);
  state.modal = null;
  render();
}

function remindersViewTemplate() {
  const { remShowDone } = state.ui;
  const priOrd = { high: 0, medium: 1, low: 2 };
  const visible = state.reminders.filter(r => remShowDone ? r.done : !r.done).sort((a, b) => (priOrd[a.priority] ?? 2) - (priOrd[b.priority] ?? 2) || (a.dueDate || '').localeCompare(b.dueDate || ''));
  const overdueCount = state.reminders.filter(r => !r.done && r.dueDate && r.dueDate < TODAY).length;

  const list = visible.length === 0 ? empty(remShowDone ? 'list' : 'checkCircle', remShowDone ? 'Nothing completed yet.' : 'All clear!') : visible.map(r => {
    const overdue = !r.done && r.dueDate && r.dueDate < TODAY;
    return `<div style="${css({ background: C.surf, border: `1px solid ${overdue ? C.org + '44' : C.border}`, 'border-radius': '8px', padding: '12px 14px', 'margin-bottom': '8px', display: 'flex', 'align-items': 'flex-start', gap: '12px' })}">
      <div data-action="toggle-reminder" data-id="${r.id}" style="${css({ width: '20px', height: '20px', 'border-radius': '5px', border: `1.5px solid ${r.done ? C.sage : C.border}`, background: r.done ? C.sage : 'transparent', cursor: 'pointer', flexShrink: 0, 'margin-top': '2px', display: 'flex', 'align-items': 'center', 'justify-content': 'center', transition: 'all 0.15s' })}">${r.done ? `<span style="color:${C.bg};font-size:11px;font-weight:900">✓</span>` : ''}</div>
      <div style="${css({ flex: 1, 'min-width': 0 })}">
        <div style="${css({ 'font-size': '14px', color: r.done ? C.dim : C.txt, 'text-decoration': r.done ? 'line-through' : 'none', 'margin-bottom': '5px', 'word-break': 'break-word' })}">${esc(r.text)}</div>
        <div style="${css({ display: 'flex', gap: '8px', 'align-items': 'center', 'flex-wrap': 'wrap' })}">
          ${priBadge(r.priority)}
          ${r.dueDate ? `<span style="${css({ 'font-size': '11px', color: overdue ? C.org : C.sub })}">${overdue ? icon('warning', 12) + ' ' : ''}Due ${fmtDate(r.dueDate)}</span>` : ''}
        </div>
      </div>
      <button data-action="delete-reminder" data-id="${r.id}" style="${css({ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', 'font-size': '14px', flexShrink: 0 })}">✕</button>
    </div>`;
  }).join('');

  return `<div>
    ${sh(`Reminders ${overdueCount > 0 ? `<span style="margin-left:10px;background:#2B1510;color:${C.org};padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">${overdueCount} overdue</span>` : ''}`, '', btn('+ Add', { action: 'open-add-reminder-modal', variant: 'primary' }))}
    <div style="${css({ display: 'flex', gap: '8px', 'margin-bottom': '18px' })}">
      <button data-action="set-reminder-tab" data-done="false" style="${chipStyle(!remShowDone)}">Active (${state.reminders.filter(r => !r.done).length})</button>
      <button data-action="set-reminder-tab" data-done="true" style="${chipStyle(remShowDone)}">Done (${state.reminders.filter(r => r.done).length})</button>
    </div>
    ${list}
  </div>`;
}

// ── Members View ──────────────────────────────────────────────
function openAddMemberModal() { state.modal = { type: 'addMember' }; render(); }
function openEditMemberModal(id) { state.modal = { type: 'editMember', id }; render(); }
function deleteMember(id) { updMembers(state.members.filter(m => m.id !== id)); render(); }
function saveMember(mode, id) {
  const name = document.getElementById('mf-name').value.trim();
  const instrument = document.getElementById('mf-instrument').value;
  const color = document.getElementById('mf-color').value;
  if (!name) return;
  if (mode === 'add') updMembers([...state.members, { name, instrument, color, id: uid() }]);
  else updMembers(state.members.map(m => m.id === id ? { name, instrument, color, id } : m));
  state.modal = null;
  render();
}

function membersViewTemplate() {
  const list = state.members.length === 0 ? empty('people', 'No members yet.') : `<div style="${css({ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' })}">
    ${state.members.map(m => `<div style="${css({ background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '10px', padding: '16px' })}">
      <div style="${css({ display: 'flex', 'align-items': 'center', gap: '12px', 'margin-bottom': '12px' })}">
        <div style="${css({ width: '42px', height: '42px', 'border-radius': '50%', background: m.color, display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'font-family': "'Bebas Neue', sans-serif", 'font-size': '20px', color: C.bg, 'font-weight': 700, flexShrink: 0 })}">${esc(m.name.charAt(0).toUpperCase())}</div>
        <div>
          <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '15px', 'font-weight': 500, color: C.txt })}">${esc(m.name)}</div>
          <div style="${css({ 'font-size': '12px', color: C.sub })}">${esc(m.instrument || '—')}</div>
        </div>
      </div>
      <div style="${css({ display: 'flex', gap: '6px' })}">
        ${btn('Edit', { action: 'open-edit-member-modal', data: { id: m.id }, sm: true })}
        ${btn('Remove', { action: 'delete-member', data: { id: m.id }, sm: true, variant: 'danger' })}
      </div>
    </div>`).join('')}
  </div>`;

  return `<div>${sh('Members', '', btn('+ Add Member', { action: 'open-add-member-modal', variant: 'primary' }))}${list}</div>`;
}

// ── Top bar / content / modal assembly ─────────────────────────
const NAV = [
  { id: 'songs', icon: 'pick', label: 'Songs' },
  { id: 'setlists', icon: 'list', label: 'Setlists' },
  { id: 'jams', icon: 'skull', label: 'Jams' },
  { id: 'playlists', icon: 'flame', label: 'Playlists' },
];
const MENU_NAV = [
  { id: 'reminders', icon: 'bell', label: 'Reminders' },
  { id: 'members', icon: 'people', label: 'Members' },
];

function navClick(id) { state.nav = id; state.songPage = null; sdPlaying = false; stopTeleprompterInterval(); render(); }

function topBarTemplate() {
  const pendingRem = state.reminders.filter(r => !r.done).length;
  const items = NAV.map(({ id, icon: iconName, label }) => {
    const active = state.nav === id;
    const openBadge = id === 'songs' && state.songPage && active ? `<span style="${css({ background: C.acc, color: C.txt, 'border-radius': '4px', padding: '1px 5px', 'font-size': '9px', 'font-weight': 700, 'margin-left': '2px' })}">OPEN</span>` : '';
    return `<button data-action="nav" data-id="${id}" style="${css({ padding: '5px 11px', 'border-radius': '6px', border: 'none', cursor: 'pointer', 'font-size': '13px', 'font-weight': 500, 'white-space': 'nowrap', 'font-family': "'DM Sans', sans-serif", background: active ? C.raised : 'transparent', color: active ? C.acc : C.sub, display: 'flex', 'align-items': 'center', gap: '5px', position: 'relative' })}">${icon(iconName, 15)}<span>${label}</span>${openBadge}</button>`;
  }).join('');

  const menuItems = MENU_NAV.map(({ id, icon: iconName, label }) => {
    const active = state.nav === id;
    const count = id === 'reminders' && pendingRem > 0 ? `<span style="${css({ background: C.org, color: 'white', 'border-radius': '10px', padding: '0 6px', 'font-size': '10px', 'font-weight': 700, 'margin-left': 'auto' })}">${pendingRem}</span>` : '';
    return `<button data-action="nav" data-id="${id}" style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', width: '100%', background: active ? C.raised : 'none', border: 'none', color: active ? C.acc : C.txt, cursor: 'pointer', 'font-size': '13px', 'font-family': "'DM Sans', sans-serif", padding: '8px 10px', 'border-radius': '5px', 'text-align': 'left' })}">${icon(iconName, 15)}<span>${label}</span>${count}</button>`;
  }).join('');

  const syncRow = SYNC_URL ? `<div style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', width: '100%', padding: '8px 10px' })}">
    <span id="sync-status" style="${css({ 'font-size': '12px', color: C.sub, 'white-space': 'nowrap', flex: 1, display: 'flex', 'align-items': 'center', gap: '6px' })}">${syncStatusLabel()}</span>
    <button data-action="sync-refresh" title="Reload from Google Sheet" style="${css({ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', padding: '2px', display: 'flex', 'align-items': 'center' })}">${icon('refresh', 14)}</button>
  </div>
  <div style="${css({ height: '1px', background: C.border, margin: '4px 6px' })}"></div>` : '';

  return `<div style="${css({ background: C.surf, 'border-bottom': `1px solid ${C.border}`, padding: '0 16px', height: '52px', display: 'flex', 'align-items': 'center', gap: '6px', position: 'sticky', top: 0, 'z-index': 40 })}">
    <div style="${css({ 'font-family': "'Bebas Neue', sans-serif", 'font-size': '16px', 'font-weight': 600, color: C.acc, 'letter-spacing': '0.1em', 'margin-right': '10px', 'white-space': 'nowrap', display: 'flex', 'align-items': 'center', gap: '5px' })}">LUCKY MACHOS</div>
    <div style="${css({ display: 'flex', gap: '2px', flex: 1, 'overflow-x': 'auto' })}">${items}</div>
    <div id="hamburger-wrapper" style="${css({ position: 'relative', flexShrink: 0, 'margin-left': '8px' })}">
      <button data-action="toggle-menu" title="Menu" style="${css({ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', 'font-size': '17px', padding: '4px 6px', position: 'relative' })}">☰${pendingRem > 0 ? `<span style="${css({ position: 'absolute', top: '2px', right: '2px', width: '7px', height: '7px', 'border-radius': '50%', background: C.org })}"></span>` : ''}</button>
      ${state.ui.menuOpen ? `<div style="${css({ position: 'absolute', top: '100%', right: 0, background: C.surf, border: `1px solid ${C.border}`, 'border-radius': '8px', padding: '4px', 'min-width': '190px', 'z-index': 60, 'box-shadow': '0 8px 24px #00000066' })}">
        ${syncRow}
        ${menuItems}
        <div style="${css({ height: '1px', background: C.border, margin: '4px 6px' })}"></div>
        <button data-action="open-setup-modal" style="${css({ display: 'flex', 'align-items': 'center', gap: '8px', width: '100%', background: 'none', border: 'none', color: C.txt, cursor: 'pointer', 'font-size': '13px', 'font-family': "'DM Sans', sans-serif", padding: '8px 10px', 'border-radius': '5px', 'text-align': 'left' })}">⚙ Setup</button>
      </div>` : ''}
    </div>
  </div>`;
}

function contentTemplate() {
  if (state.nav === 'songs') {
    const main = state.songPage ? songDetailTemplate(state.songPage) : songsViewTemplate();
    return `<div style="${css({ display: 'flex', gap: '20px', 'flex-wrap': 'wrap', 'align-items': 'flex-start' })}">
      <div style="${css({ flex: 1, 'min-width': '320px' })}">${main}</div>
      ${songDetailPlaylistPanel()}
    </div>`;
  }
  if (state.nav === 'setlists') return setlistsViewTemplate();
  if (state.nav === 'jams') return jamsViewTemplate();
  if (state.nav === 'playlists') return playlistsViewTemplate();
  if (state.nav === 'reminders') return remindersViewTemplate();
  if (state.nav === 'members') return membersViewTemplate();
  return '';
}

function modalTemplate() {
  const m = state.modal;
  if (m.type === 'addSong') return modalWrap('Add Song', songFormHTML(null, 'save-song', { mode: 'add' }, 'Add Song'));
  if (m.type === 'editSong') {
    const song = state.songs.find(s => s.id === m.id);
    return modalWrap('Edit Song', songFormHTML(song, 'save-song', { mode: 'edit', id: m.id }, 'Save Changes'));
  }
  if (m.type === 'addSetlist' || m.type === 'editSetlist') {
    const isAdd = m.type === 'addSetlist';
    const sl = isAdd ? { name: '', notes: '' } : state.setlists.find(s => s.id === m.id);
    return modalWrap(isAdd ? 'New Setlist' : 'Edit Setlist', `
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Name *')}${inputHTML({ id: 'slf-name', value: sl.name, placeholder: 'e.g. July 4th Backyard Jam' })}</div>
      <div style="${css({ 'margin-bottom': '20px' })}">${lbl('Notes')}${taHTML({ id: 'slf-notes', value: sl.notes || '', placeholder: 'Set notes, timing, cues…', rows: 3 })}</div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn(isAdd ? 'Create' : 'Save', { action: 'save-setlist', data: { mode: isAdd ? 'add' : 'edit', id: m.id || '' }, variant: 'primary' })}
      </div>
    `);
  }
  if (m.type === 'pickSetlistSong') {
    const sl = state.setlists.find(s => s.id === state.ui.slPicker);
    if (!sl) return '';
    const available = state.songs.filter(s => !sl.songIds.includes(s.id));
    const body = available.length === 0
      ? `<div style="${css({ 'text-align': 'center', padding: '20px 0', color: C.sub })}">All songs already in this setlist.</div>`
      : available.map(s => `<div data-action="add-song-to-setlist" data-setlist-id="${sl.id}" data-song-id="${s.id}" style="${css({ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', padding: '10px 12px', background: C.raised, 'border-radius': '8px', 'margin-bottom': '6px', cursor: 'pointer', border: `1px solid ${C.border}` })}">
        <div><div style="${css({ 'font-size': '14px', 'font-weight': 500, color: C.txt })}">${esc(s.title)}</div><div style="${css({ 'font-size': '11px', color: C.sub })}">${esc(s.key)} · ${esc(s.bpm)} BPM · ${esc(s.genre)}</div></div>
        ${statusBadge(s.status)}
      </div>`).join('');
    return modalWrap(`Add Song — ${esc(sl.name)}`, body);
  }
  if (m.type === 'addJam' || m.type === 'editJam') {
    const isAdd = m.type === 'addJam';
    const jam = isAdd ? { date: '', time: '', endTime: '', location: '', notes: '' } : state.jams.find(j => j.id === m.id);
    return modalWrap(isAdd ? 'Propose a Date' : 'Edit Jam', `
      ${isAdd ? `<div style="${css({ 'font-size': '13px', color: C.sub, 'margin-bottom': '16px', background: C.raised, 'border-radius': '6px', padding: '8px 12px', 'line-height': 1.6 })}">${icon('bulb', 14)} Propose a date and the band votes In / Maybe / Out. Confirm it once there's enough interest.</div>` : ''}
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Date *')}${inputHTML({ id: 'jf-date', value: jam.date, type: 'date' })}</div>
      <div style="${css({ display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '12px', 'margin-bottom': '12px' })}">
        <div>${lbl('Start Time')}${inputHTML({ id: 'jf-time', value: jam.time || '', type: 'time' })}</div>
        <div>${lbl('End Time')}${inputHTML({ id: 'jf-endTime', value: jam.endTime || '', type: 'time' })}</div>
      </div>
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Location')}${inputHTML({ id: 'jf-location', value: jam.location || '', placeholder: "Ivan's backyard, Studio B…" })}</div>
      <div style="${css({ 'margin-bottom': '20px' })}">${lbl('Notes')}${taHTML({ id: 'jf-notes', value: jam.notes || '', placeholder: 'What to bring, goals, vibe…', rows: 3 })}</div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn(isAdd ? 'Submit Proposal' : 'Save Changes', { action: 'save-jam', data: { mode: isAdd ? 'add' : 'edit', id: m.id || '' }, variant: 'primary' })}
      </div>
    `);
  }
  if (m.type === 'addPlaylist') {
    const detected = 'link';
    return modalWrap('Add Playlist', `
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Playlist Name *')}${inputHTML({ id: 'plf-name', value: '', placeholder: 'e.g. Funk Reference Jams' })}</div>
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Member')}${selHTML({ id: 'plf-memberId', value: '', options: [{ value: '', label: 'Band / General' }, ...state.members.map(mm => ({ value: mm.id, label: `${mm.name} — ${mm.instrument}` }))] })}</div>
      <div style="${css({ 'margin-bottom': '12px' })}">
        ${lbl('Playlist URL * (Spotify, YouTube, Apple Music)')}
        ${inputHTML({ id: 'plf-url', value: '', placeholder: 'https://open.spotify.com/playlist/...' })}
        <div id="plf-platform-preview" style="${css({ 'margin-top': '5px', 'font-size': '11px', color: C.dim })}"></div>
      </div>
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Description')}${taHTML({ id: 'plf-description', value: '', placeholder: "What's this playlist for the band?", rows: 3 })}</div>
      <div style="${css({ 'margin-bottom': '20px' })}">
        ${lbl('Add songs from this playlist (optional)')}
        ${taHTML({ id: 'plf-songs', value: '', placeholder: 'One song per line, e.g.\nSummer Groove - Original\nMidnight Blues', rows: 4 })}
        <div style="${css({ 'font-size': '11px', color: C.dim, 'margin-top': '4px' })}">Each line becomes a new song in the Songs section (title, or "Title - Artist"). Fill in key/BPM/lyrics later from there.</div>
      </div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn('Add Playlist', { action: 'save-playlist', variant: 'primary' })}
      </div>
    `);
  }
  if (m.type === 'addReminder') {
    return modalWrap('Add Reminder', `
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Reminder *')}${inputHTML({ id: 'rf-text', value: '', placeholder: 'What needs to happen?' })}</div>
      <div style="${css({ display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '12px', 'margin-bottom': '20px' })}">
        <div>${lbl('Due Date')}${inputHTML({ id: 'rf-dueDate', value: '', type: 'date' })}</div>
        <div>${lbl('Priority')}${selHTML({ id: 'rf-priority', value: 'medium', options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] })}</div>
      </div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn('Add', { action: 'save-reminder', variant: 'primary' })}
      </div>
    `);
  }
  if (m.type === 'addMember' || m.type === 'editMember') {
    const isAdd = m.type === 'addMember';
    const mem = isAdd ? { name: '', instrument: '', color: PAL[0] } : state.members.find(x => x.id === m.id);
    const swatches = PAL.map(c => `<div data-action="pick-member-color" data-color="${c}" class="color-swatch" data-color-attr="${c}" style="${css({ width: '28px', height: '28px', 'border-radius': '50%', background: c, cursor: 'pointer', border: `2.5px solid ${mem.color === c ? C.txt : 'transparent'}`, transition: 'border-color 0.15s', flexShrink: 0 })}"></div>`).join('');
    return modalWrap(isAdd ? 'Add Member' : 'Edit Member', `
      <div style="${css({ 'margin-bottom': '12px' })}">${lbl('Name *')}${inputHTML({ id: 'mf-name', value: mem.name, placeholder: 'Member name' })}</div>
      <div style="${css({ 'margin-bottom': '14px' })}">${lbl('Instrument')}${selHTML({ id: 'mf-instrument', value: mem.instrument || '', options: [{ value: '', label: 'Select…' }, ...INSTRUMENTS.map(i => ({ value: i, label: i }))] })}</div>
      <div style="${css({ 'margin-bottom': '20px' })}">
        ${lbl('Color')}
        <div style="${css({ display: 'flex', gap: '8px', 'margin-top': '6px', 'flex-wrap': 'wrap', 'align-items': 'center' })}">
          ${swatches}
          <input id="mf-custom-color" type="color" value="${esc(mem.color)}" style="${css({ width: '28px', height: '28px', 'border-radius': '50%', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' })}" title="Custom" />
        </div>
        <input type="hidden" id="mf-color" value="${esc(mem.color)}" />
      </div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn(isAdd ? 'Add Member' : 'Save', { action: 'save-member', data: { mode: isAdd ? 'add' : 'edit', id: m.id || '' }, variant: 'primary' })}
      </div>
    `);
  }
  if (m.type === 'setup') {
    return modalWrap('Setup', `
      <div style="${css({ 'margin-bottom': '8px' })}">${lbl('Google Sheets Sync URL')}${inputHTML({ id: 'stf-syncUrl', value: SYNC_URL, placeholder: 'https://script.google.com/macros/s/.../exec' })}</div>
      <div style="${css({ 'font-size': '11px', color: C.dim, 'margin-bottom': '20px', 'line-height': 1.6 })}">Paste your deployed Google Apps Script Web App URL to enable cross-device sync (see apps-script/Code.gs and README). Leave blank to disable sync and use local storage only on this device.</div>
      <div style="${css({ display: 'flex', gap: '8px', 'justify-content': 'flex-end' })}">
        ${btn('Cancel', { action: 'close-modal' })}
        ${btn('Save', { action: 'save-setup', variant: 'primary' })}
      </div>
    `);
  }
  return '';
}

function appTemplate() {
  const wide = state.nav === 'songs';
  return `<div style="${css({ 'min-height': '100vh', background: C.bg, color: C.txt, 'font-family': "'DM Sans', sans-serif", 'font-size': '14px' })}">
    ${topBarTemplate()}
    <div style="${css({ 'max-width': wide ? '1320px' : '1000px', margin: '0 auto', padding: '22px 16px' })}">${contentTemplate()}</div>
  </div>
  ${state.modal ? modalTemplate() : ''}`;
}

// ── Event delegation ────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) {
    if (state.ui.menuOpen) { state.ui.menuOpen = false; render(); }
    return;
  }
  const action = el.dataset.action;
  const id = el.dataset.id;
  if (state.ui.menuOpen && action !== 'toggle-menu') state.ui.menuOpen = false;

  switch (action) {
    case 'noop': return;
    case 'toggle-menu': state.ui.menuOpen = !state.ui.menuOpen; render(); return;
    case 'open-setup-modal': openSetupModal(); return;
    case 'save-setup': saveSetup(); return;
    case 'close-modal':
      state.modal = null; state.ui.slPicker = null; render(); return;
    case 'nav': navClick(id); return;
    case 'open-song': { const song = state.songs.find(s => s.id === id); if (song) openSong(song); return; }
    case 'delete-song': deleteSong(id); return;
    case 'back-to-songs': closeSong(); return;
    case 'open-add-song-modal': openAddSongModal(); return;
    case 'open-edit-song-modal': openEditSongModal(id); return;
    case 'save-song': saveSong(el.dataset.mode, el.dataset.id); return;
    case 'set-song-filter': setSongFilter(el.dataset.filter); return;
    case 'switch-song-tab': switchSongTab(el.dataset.tab); return;
    case 'teleprompter-toggle': teleprompterToggle(); return;
    case 'teleprompter-reset': teleprompterReset(); return;

    case 'open-add-setlist-modal': openAddSetlistModal(); return;
    case 'open-edit-setlist-modal': openEditSetlistModal(id); return;
    case 'save-setlist': saveSetlist(el.dataset.mode, el.dataset.id); return;
    case 'delete-setlist': deleteSetlist(id); return;
    case 'toggle-setlist-expand': toggleSetlistExpand(id); return;
    case 'move-setlist-song': moveSetlistSong(el.dataset.setlistId, Number(el.dataset.index), Number(el.dataset.dir)); return;
    case 'remove-setlist-song': removeSetlistSong(el.dataset.setlistId, el.dataset.songId); return;
    case 'open-setlist-picker': state.modal = { type: 'pickSetlistSong' }; openSetlistPicker(id); return;
    case 'add-song-to-setlist': addSongToSetlist(el.dataset.setlistId, el.dataset.songId); return;

    case 'open-add-jam-modal': openAddJamModal(); return;
    case 'open-edit-jam-modal': openEditJamModal(id); return;
    case 'save-jam': saveJam(el.dataset.mode, el.dataset.id); return;
    case 'delete-jam': deleteJam(id); return;
    case 'confirm-jam': confirmJam(id); return;
    case 'unconfirm-jam': unconfirmJam(id); return;
    case 'toggle-jam-section': toggleJamSection(el.dataset.section); return;
    case 'toggle-jam-card': toggleJamCard(id); return;
    case 'cycle-jam-avail': cycleJamAvail(el.dataset.jamId, el.dataset.memberId); return;

    case 'open-add-playlist-modal': openAddPlaylistModal(); return;
    case 'set-playlist-member-filter': setPlaylistMemberFilter(el.dataset.member); return;
    case 'delete-playlist': deletePlaylist(id); return;
    case 'toggle-playlist-embed': togglePlaylistEmbed(id); return;
    case 'save-playlist': savePlaylist(); return;

    case 'open-add-reminder-modal': openAddReminderModal(); return;
    case 'set-reminder-tab': setReminderTab(el.dataset.done === 'true'); return;
    case 'toggle-reminder': toggleReminder(id); return;
    case 'delete-reminder': deleteReminder(id); return;
    case 'save-reminder': saveReminder(); return;

    case 'open-add-member-modal': openAddMemberModal(); return;
    case 'open-edit-member-modal': openEditMemberModal(id); return;
    case 'delete-member': deleteMember(id); return;
    case 'save-member': saveMember(el.dataset.mode, el.dataset.id); return;
    case 'pick-member-color': {
      const color = el.dataset.color;
      const hidden = document.getElementById('mf-color');
      if (hidden) hidden.value = color;
      document.querySelectorAll('.color-swatch').forEach(s => { s.style.borderColor = s.dataset.colorAttr === color ? C.txt : 'transparent'; });
      const custom = document.getElementById('mf-custom-color');
      if (custom) custom.value = color;
      return;
    }
    case 'sync-refresh': syncRefresh(); return;
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'song-search') { setSongQuery(t.value); return; }
  if (t.id === 'sf-tabUrl') {
    const preview = document.getElementById('sf-tabsite-preview');
    if (preview) preview.textContent = t.value ? `→ ${getTabSiteName(t.value) || 'Custom link'}` : '';
    return;
  }
  if (t.id === 'plf-url') {
    const preview = document.getElementById('plf-platform-preview');
    if (preview) {
      const platform = detectPlatform(t.value);
      const info = PINFO[platform];
      preview.style.color = info.color;
      preview.innerHTML = t.value ? `${info.icon} Detected: ${esc(info.name)}` : '';
    }
    return;
  }
  if (t.id === 'sd-speed-input') {
    sdSpeed = Number(t.value);
    const label = document.getElementById('sd-speed-label');
    if (label) label.textContent = sdSpeed;
    return;
  }
  if (t.id === 'mf-custom-color') {
    const hidden = document.getElementById('mf-color');
    if (hidden) hidden.value = t.value;
    document.querySelectorAll('.color-swatch').forEach(s => { s.style.borderColor = 'transparent'; });
    return;
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'sd-playlist-select') {
    sdPlaylistId = e.target.value;
    render();
  }
});

// ── Init ──────────────────────────────────────────────────────
loadPersisted();
render();
if (SYNC_URL) fetchRemote().then(ok => { if (ok) render(); });
