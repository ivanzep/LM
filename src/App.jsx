import { useState, useEffect, useRef } from "react";

// ── Utilities ─────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d + 'T12:00:00'); return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); };
const fmtTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const TODAY = new Date().toISOString().slice(0, 10);

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
const C = { bg:'#0C0A09', surf:'#1A1612', raised:'#241E18', border:'#332B22', acc:'#D4A853', org:'#E8613C', sage:'#8B9E6F', blue:'#6B9FBF', txt:'#F2EEE6', sub:'#9B9184', dim:'#5C5248' };
const PINFO = {
  spotify: { name:'Spotify',      color:'#1DB954', bg:'#0A1E0D', icon:'♫' },
  youtube: { name:'YouTube',      color:'#FF4444', bg:'#200A0A', icon:'▶' },
  apple:   { name:'Apple Music',  color:'#FC3C44', bg:'#1F0B0C', icon:'♪' },
  link:    { name:'Link',         color:'#9B9184', bg:'#241E18', icon:'🔗' },
};

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
  // Past jams
  { id:'J0', date:'2026-06-14', time:'16:00', location:"Ivan's backyard", status:'confirmed', notes:'First outdoor jam of the summer. Ran through 3 songs.', availability:{M1:'in',M2:'in',M3:'in',M4:'maybe'} },
  { id:'J00', date:'2026-05-30', time:'19:00', location:"Alex's garage", status:'confirmed', notes:'Worked on Groove Machine arrangement.', availability:{M1:'in',M2:'in',M3:'out',M4:'in'} },
  // Confirmed (open) — upcoming
  { id:'J1', date:'2026-07-04', time:'17:00', location:"Ivan's backyard", status:'confirmed', notes:'Cookout at 3pm, play at 5pm. Bring PA, DI box, extra cables.', availability:{M1:'in',M2:'in',M3:'maybe',M4:'in'} },
  // Proposed — voting open
  { id:'J2', date:'2026-07-18', time:'19:00', location:"Alex's garage", status:'proposed', notes:'Full run-through of the July 4th setlist. Bring lyric sheets.', availability:{M1:'in',M2:'in',M3:'in',M4:'out'} },
  { id:'J3', date:'2026-08-02', time:'14:00', location:'Practice Studio — Room B', status:'proposed', notes:'Record scratch tracks for new material. 4 hours booked.', availability:{M1:'in',M2:'maybe',M3:'in',M4:'in'} },
  { id:'J4', date:'2026-08-09', time:'18:00', location:"Sam's place", status:'proposed', notes:'Casual hangout jam — no pressure, just vibe.', availability:{M1:'maybe',M2:'in',M3:'in',M4:'maybe'} },
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

// ── Atom components ───────────────────────────────────────────
const Btn = ({ children, onClick, variant='ghost', sm, style:sx={} }) => {
  const base = { padding:sm?'5px 10px':'7px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:sm?11:13, fontWeight:600, fontFamily:"'DM Sans', sans-serif", display:'inline-flex', alignItems:'center', gap:5 };
  const v = { primary:{background:C.acc,color:'#0C0A09'}, ghost:{background:'transparent',color:C.sub,border:`1px solid ${C.border}`}, danger:{background:'transparent',color:C.org,border:`1px solid ${C.org}44`} };
  return <button onClick={onClick} style={{...base,...(v[variant]||v.ghost),...sx}}>{children}</button>;
};

const Input = ({ value, onChange, placeholder, type='text', style:sx={} }) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontFamily:(type==='date'||type==='time')?'monospace':"'DM Sans', sans-serif",fontSize:14,padding:'8px 12px',width:'100%',outline:'none',boxSizing:'border-box',colorScheme:'dark',...sx}} />
);

const Sel = ({ value, onChange, children, style:sx={} }) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontFamily:"'DM Sans', sans-serif",fontSize:14,padding:'8px 12px',outline:'none',cursor:'pointer',width:'100%',...sx}}>
    {children}
  </select>
);

const TA = ({ value, onChange, placeholder, rows=4, mono }) => (
  <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{background:mono?'#0A0806':C.raised,border:`1px solid ${C.border}`,borderRadius:6,color:mono?C.acc:C.txt,fontFamily:mono?"'JetBrains Mono', monospace":"'DM Sans', sans-serif",fontSize:mono?12:14,padding:'10px 12px',width:'100%',outline:'none',resize:'vertical',lineHeight:1.6,boxSizing:'border-box'}} />
);

const Lbl = ({ children }) => <div style={{fontSize:10,fontWeight:700,color:C.sub,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:5}}>{children}</div>;

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:'fixed',inset:0,background:'#00000094',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:24,width:'100%',maxWidth:580,maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontFamily:"'Oswald', sans-serif",fontSize:19,fontWeight:500,color:C.txt,letterSpacing:'0.03em'}}>{title}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:18}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const m = { ready:[C.sage,'#1D2B18','Ready'], learning:[C.acc,'#2B2110','Learning'], shelved:[C.dim,'#1E1A16','Shelved'] };
  const [c,bg,l] = m[status]||m.shelved;
  return <span style={{background:bg,color:c,padding:'2px 7px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:'0.04em'}}>{l}</span>;
};

const PriBadge = ({ p }) => {
  const m = { high:[C.org,'#2B1510'], medium:[C.acc,'#2B2110'], low:[C.sage,'#1D2B18'] };
  const [c,bg] = m[p]||m.low;
  return <span style={{background:bg,color:c,padding:'2px 7px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase'}}>{p}</span>;
};

const Empty = ({ icon, text }) => (
  <div style={{textAlign:'center',padding:'48px 0',color:C.dim}}>
    <div style={{fontSize:36,marginBottom:10}}>{icon}</div>
    <div style={{fontSize:14}}>{text}</div>
  </div>
);

const SH = ({ title, sub, action }) => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
    <div>
      <span style={{fontFamily:"'Oswald', sans-serif",fontSize:22,fontWeight:500,letterSpacing:'0.03em'}}>{title}</span>
      {sub && <span style={{color:C.sub,fontSize:15,marginLeft:8}}>{sub}</span>}
    </div>
    {action}
  </div>
);

const chip = (active) => ({ padding:'5px 12px', borderRadius:16, border:`1px solid ${active?C.acc:C.border}`, background:active?C.acc:'transparent', color:active?'#0C0A09':C.sub, fontSize:12, fontWeight:600, cursor:'pointer' });

// ── Song Form (shared) ────────────────────────────────────────
const KEYS = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B','Am','Bm','Cm','Dm','Em','Fm','Gm'];
const BLANK_SONG = { title:'', artist:'', key:'Am', bpm:120, genre:'', status:'learning', tags:'', lyrics:'', tabs:'', notes:'', tabUrl:'' };

function SongForm({ form, setForm, onSave, onCancel, label }) {
  const ff = k => v => setForm(p => ({...p, [k]:v}));
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div><Lbl>Title *</Lbl><Input value={form.title} onChange={ff('title')} placeholder="Song title" /></div>
        <div><Lbl>Artist / Original</Lbl><Input value={form.artist} onChange={ff('artist')} placeholder="Artist" /></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
        <div><Lbl>Key</Lbl><Sel value={form.key} onChange={ff('key')}>{KEYS.map(k=><option key={k}>{k}</option>)}</Sel></div>
        <div><Lbl>BPM</Lbl><Input value={form.bpm} onChange={v=>ff('bpm')(Number(v)||v)} placeholder="120" /></div>
        <div><Lbl>Genre</Lbl><Input value={form.genre} onChange={ff('genre')} placeholder="Funk, Blues…" /></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div><Lbl>Status</Lbl><Sel value={form.status} onChange={ff('status')}><option value="learning">Learning</option><option value="ready">Ready</option><option value="shelved">Shelved</option></Sel></div>
        <div><Lbl>Tags (comma-separated)</Lbl><Input value={form.tags} onChange={ff('tags')} placeholder="funk, opener…" /></div>
      </div>
      <div style={{marginBottom:12}}>
        <Lbl>Tab Website (Songsterr, Ultimate Guitar, etc.)</Lbl>
        <Input value={form.tabUrl} onChange={ff('tabUrl')} placeholder="https://www.songsterr.com/..." />
        {form.tabUrl && <div style={{fontSize:11,color:C.acc,marginTop:4}}>→ {getTabSiteName(form.tabUrl)||'Custom link'}</div>}
      </div>
      <div style={{marginBottom:12}}><Lbl>Lyrics</Lbl><TA value={form.lyrics} onChange={ff('lyrics')} placeholder="Paste or write lyrics…" rows={5} /></div>
      <div style={{marginBottom:12}}><Lbl>Tabs / Chords</Lbl><TA value={form.tabs} onChange={ff('tabs')} placeholder="Guitar tabs, chord charts…" rows={5} mono /></div>
      <div style={{marginBottom:20}}><Lbl>Notes</Lbl><TA value={form.notes} onChange={ff('notes')} placeholder="Performance notes, cues, arrangement tips…" rows={3} /></div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="primary" onClick={onSave}>{label}</Btn>
      </div>
    </>
  );
}

// ── Song Detail Page ──────────────────────────────────────────
function SongDetailPage({ song, songs, updSongs, onBack, onSongUpdated }) {
  const [tab, setTab] = useState('lyrics');
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [progress, setProgress] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({...song});
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      const el = scrollRef.current; if (!el) return;
      el.scrollTop += speed * 0.7;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
      if (el.scrollTop >= max - 1) setPlaying(false);
    }, 50);
    return () => clearInterval(iv);
  }, [playing, speed]);

  const reset = () => { setPlaying(false); setProgress(0); if (scrollRef.current) scrollRef.current.scrollTop = 0; };
  const changeTab = t => { setTab(t); setPlaying(false); setProgress(0); setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, 0); };

  const saveEdit = () => {
    if (!form.title.trim()) return;
    const u = {...form};
    updSongs(songs.map(s => s.id === u.id ? u : s));
    onSongUpdated(u);
    setEditModal(false);
  };

  const tabSite = getTabSiteName(song.tabUrl);

  return (
    <div>
      {/* Nav */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C.sub,cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'DM Sans', sans-serif",display:'flex',alignItems:'center',gap:5,padding:0}}>
          ← Songs
        </button>
        <Btn variant="ghost" onClick={() => { setForm({...song}); setEditModal(true); }}>✏ Edit Song</Btn>
      </div>

      {/* Hero */}
      <div style={{marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${C.border}`}}>
        <h1 style={{fontFamily:"'Oswald', sans-serif",fontSize:28,fontWeight:500,letterSpacing:'0.02em',color:C.txt,margin:'0 0 10px 0'}}>{song.title}</h1>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:8}}>
          <StatusBadge status={song.status} />
          <span style={{color:C.sub,fontSize:13}}>{song.key}</span>
          {song.bpm && <span style={{color:C.dim,fontSize:13}}>· {song.bpm} BPM</span>}
          {song.genre && <span style={{color:C.dim,fontSize:13}}>· {song.genre}</span>}
          {song.artist && song.artist !== 'Original' && <span style={{color:C.dim,fontSize:13}}>· {song.artist}</span>}
        </div>
        {song.tags && (
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:10}}>
            {song.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=>(
              <span key={t} style={{background:C.raised,color:C.dim,padding:'1px 7px',borderRadius:3,fontSize:10,border:`1px solid ${C.border}`}}>{t}</span>
            ))}
          </div>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',background:C.raised,border:`1px solid ${C.acc}44`,borderRadius:6,color:C.acc,fontSize:12,fontWeight:600,textDecoration:'none'}}>
            🎸 {tabSite || 'View Tab'} ↗
          </a>
        )}
      </div>

      {/* Tab switcher */}
      <div style={{display:'flex',gap:2,background:'#0A0806',borderRadius:8,padding:3,width:'fit-content',marginBottom:10}}>
        {['lyrics','tabs','notes'].map(t=>(
          <button key={t} onClick={()=>changeTab(t)} style={{padding:'6px 18px',borderRadius:6,border:'none',background:tab===t?C.raised:'transparent',color:tab===t?C.txt:C.sub,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans', sans-serif",textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>

      {/* Scroll box */}
      <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
        <div ref={scrollRef} style={{height:'calc(100vh - 420px)',minHeight:220,overflowY:'auto',background:tab==='tabs'?'#0A0806':C.surf,padding:'20px 24px'}}>
          {tab === 'lyrics' && (
            <div style={{whiteSpace:'pre-wrap',fontSize:15,color:C.sub,lineHeight:2.0,fontFamily:"'DM Sans', sans-serif"}}>
              {song.lyrics || <em style={{color:C.dim}}>No lyrics yet — click Edit Song to add.</em>}
            </div>
          )}
          {tab === 'tabs' && (
            <div style={{fontFamily:"'JetBrains Mono', monospace",fontSize:13,color:C.acc,whiteSpace:'pre',lineHeight:1.8}}>
              {song.tabs || <span style={{color:C.dim,fontFamily:"'DM Sans', sans-serif",fontStyle:'italic'}}>No tabs yet — click Edit Song to add.</span>}
            </div>
          )}
          {tab === 'notes' && (
            <div style={{fontSize:15,color:C.sub,lineHeight:1.8,whiteSpace:'pre-wrap'}}>
              {song.notes || <em style={{color:C.dim}}>No notes yet — click Edit Song to add.</em>}
            </div>
          )}
        </div>

        {/* Auto-scroll controls */}
        <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:'9px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <button onClick={reset} style={{background:'none',border:'none',color:C.sub,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'DM Sans', sans-serif",display:'flex',alignItems:'center',gap:4,padding:0}}>↑ Top</button>
          <div style={{width:1,height:16,background:C.border}} />
          <button onClick={()=>setPlaying(p=>!p)} style={{background:playing?`${C.org}1A`:`${C.acc}1A`,border:`1px solid ${playing?C.org:C.acc}44`,color:playing?C.org:C.acc,padding:'5px 14px',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'DM Sans', sans-serif",display:'flex',alignItems:'center',gap:5}}>
            {playing ? '⏸ Pause' : '▶ Auto-Scroll'}
          </button>
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:120}}>
            <span style={{fontSize:10,color:C.dim,whiteSpace:'nowrap',letterSpacing:'0.05em',textTransform:'uppercase'}}>Speed</span>
            <input type="range" min={1} max={10} value={speed} onChange={e=>setSpeed(Number(e.target.value))} style={{flex:1,accentColor:C.acc,cursor:'pointer'}} />
            <span style={{fontSize:11,color:C.sub,minWidth:10}}>{speed}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,minWidth:90}}>
            <div style={{flex:1,height:3,background:C.border,borderRadius:2,overflow:'hidden',minWidth:70}}>
              <div style={{height:'100%',width:`${progress}%`,background:playing?C.acc:C.dim,transition:'width 0.1s, background 0.3s',borderRadius:2}} />
            </div>
            <span style={{fontSize:10,color:C.dim,minWidth:28,textAlign:'right'}}>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {editModal && (
        <Modal title="Edit Song" onClose={()=>setEditModal(false)}>
          <SongForm form={form} setForm={setForm} onSave={saveEdit} onCancel={()=>setEditModal(false)} label="Save Changes" />
        </Modal>
      )}
    </div>
  );
}

// ── Songs List View ───────────────────────────────────────────
function SongsView({ songs, updSongs, onOpenSong }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(BLANK_SONG);
  const [hovered, setHovered] = useState(null);

  const filtered = songs.filter(s => {
    const ok = filter==='all' || s.status===filter;
    const q = query.toLowerCase();
    return ok && (!q || s.title.toLowerCase().includes(q) || (s.genre||'').toLowerCase().includes(q) || (s.tags||'').toLowerCase().includes(q));
  });

  const save = () => { if (!form.title.trim()) return; updSongs([...songs,{...form,id:uid()}]); setModal(false); setForm(BLANK_SONG); };
  const del = (id, e) => { e.stopPropagation(); updSongs(songs.filter(s=>s.id!==id)); };

  return (
    <div>
      <SH title="Songs" sub={`(${songs.length})`} action={<Btn variant="primary" onClick={()=>{setForm(BLANK_SONG);setModal(true);}}>+ Add Song</Btn>} />

      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <Input value={query} onChange={setQuery} placeholder="Search by title, genre, tag…" style={{flex:1,minWidth:150,maxWidth:220}} />
        {['all','ready','learning','shelved'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={chip(filter===f)}>{f==='all'?'All':f.charAt(0).toUpperCase()+f.slice(1)}</button>
        ))}
      </div>

      {filtered.length === 0 ? <Empty icon="🎸" text={query||filter!=='all'?'No songs match.':'Add your first song!'} /> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:8}}>
          {filtered.map(song=>(
            <div key={song.id}
              onClick={()=>onOpenSong(song)}
              onMouseEnter={()=>setHovered(song.id)} onMouseLeave={()=>setHovered(null)}
              style={{background:hovered===song.id?'#1E1A14':C.surf,border:`1px solid ${hovered===song.id?C.acc:C.border}`,borderRadius:8,padding:'11px 14px',cursor:'pointer',transition:'all 0.15s',position:'relative',display:'flex',alignItems:'center',gap:10}}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:15,fontWeight:500,color:C.txt,letterSpacing:'0.02em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{song.title}</div>
                {song.artist && <div style={{fontSize:11,color:C.dim,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{song.artist}</div>}
              </div>
              <span style={{color:C.acc,fontSize:13,flexShrink:0}}>→</span>
              {hovered===song.id && (
                <button onClick={e=>del(song.id,e)} style={{position:'absolute',top:8,right:26,background:'none',border:'none',color:C.org,cursor:'pointer',fontSize:11,fontWeight:700,lineHeight:1}}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="Add Song" onClose={()=>setModal(false)}>
          <SongForm form={form} setForm={setForm} onSave={save} onCancel={()=>setModal(false)} label="Add Song" />
        </Modal>
      )}
    </div>
  );
}

// ── Setlists View ─────────────────────────────────────────────
function SetlistsView({ setlists, songs, updSetlists }) {
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(null);
  const [picker, setPicker] = useState(null);
  const [form, setForm] = useState({name:'',notes:''});

  const save = () => {
    if (!form.name.trim()) return;
    updSetlists(modal==='add' ? [...setlists,{...form,id:uid(),songIds:[],created:TODAY}] : setlists.map(sl=>sl.id===form.id?{...sl,name:form.name,notes:form.notes}:sl));
    setModal(null);
  };
  const del = id => updSetlists(setlists.filter(sl=>sl.id!==id));
  const move = (slId,i,dir) => updSetlists(setlists.map(sl=>{ if(sl.id!==slId)return sl; const ids=[...sl.songIds]; const to=i+dir; if(to<0||to>=ids.length)return sl; [ids[i],ids[to]]=[ids[to],ids[i]]; return{...sl,songIds:ids}; }));
  const removeSong = (slId,sId) => updSetlists(setlists.map(sl=>sl.id===slId?{...sl,songIds:sl.songIds.filter(id=>id!==sId)}:sl));
  const addToSet = (slId,sId) => { updSetlists(setlists.map(sl=>sl.id===slId?{...sl,songIds:[...sl.songIds.filter(id=>id!==sId),sId]}:sl)); setPicker(null); };
  const curSL = picker ? setlists.find(sl=>sl.id===picker) : null;

  return (
    <div>
      <SH title="Setlists" action={<Btn variant="primary" onClick={()=>{setForm({name:'',notes:''});setModal('add');}}>+ New Setlist</Btn>} />
      {setlists.length===0 ? <Empty icon="📋" text="No setlists yet." /> : setlists.map(sl=>{
        const open = expanded===sl.id;
        const slSongs = (sl.songIds||[]).map(id=>songs.find(s=>s.id===id)).filter(Boolean);
        return (
          <div key={sl.id} style={{background:C.surf,border:`1px solid ${open?C.acc:C.border}`,borderRadius:10,padding:16,marginBottom:10,transition:'border-color 0.15s'}}>
            <div style={{cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}} onClick={()=>setExpanded(open?null:sl.id)}>
              <div>
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:17,fontWeight:500,color:C.txt,letterSpacing:'0.02em',marginBottom:4}}>{sl.name}</div>
                <div style={{fontSize:12,color:C.sub}}>{slSongs.length} song{slSongs.length!==1?'s':''}{sl.created&&<span style={{color:C.dim}}> · {fmtDate(sl.created)}</span>}</div>
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <Btn sm variant="ghost" onClick={e=>{e.stopPropagation();setForm({id:sl.id,name:sl.name,notes:sl.notes||''});setModal(sl);}}>Edit</Btn>
                <span style={{color:C.dim}}>{open?'▲':'▼'}</span>
              </div>
            </div>
            {open && (
              <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                {sl.notes && <div style={{fontSize:13,color:C.sub,fontStyle:'italic',marginBottom:12}}>"{sl.notes}"</div>}
                {slSongs.length===0 ? <div style={{textAlign:'center',padding:'16px 0',color:C.dim,fontSize:13}}>No songs yet.</div>
                  : slSongs.map((song,i)=>(
                  <div key={song.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:C.raised,borderRadius:8,marginBottom:6}}>
                    <span style={{fontFamily:"'Oswald', sans-serif",color:C.acc,fontSize:18,width:22,textAlign:'right',flexShrink:0}}>{i+1}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:C.txt}}>{song.title}</div>
                      <div style={{fontSize:11,color:C.sub}}>{song.key} · {song.bpm} BPM{song.genre?` · ${song.genre}`:''}</div>
                    </div>
                    <StatusBadge status={song.status} />
                    <div style={{display:'flex',gap:3}}>
                      <button onClick={()=>move(sl.id,i,-1)} disabled={i===0} style={{background:'none',border:'none',color:i===0?C.dim:C.sub,cursor:i===0?'default':'pointer',fontSize:14,padding:'2px 4px'}}>▲</button>
                      <button onClick={()=>move(sl.id,i,1)} disabled={i===slSongs.length-1} style={{background:'none',border:'none',color:i===slSongs.length-1?C.dim:C.sub,cursor:i===slSongs.length-1?'default':'pointer',fontSize:14,padding:'2px 4px'}}>▼</button>
                      <button onClick={()=>removeSong(sl.id,song.id)} style={{background:'none',border:'none',color:C.org,cursor:'pointer',fontSize:14,padding:'2px 4px'}}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  <Btn sm variant="ghost" onClick={()=>setPicker(sl.id)}>+ Add Song</Btn>
                  <Btn sm variant="danger" onClick={()=>del(sl.id)}>Delete Setlist</Btn>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {modal && (
        <Modal title={modal==='add'?'New Setlist':'Edit Setlist'} onClose={()=>setModal(null)}>
          <div style={{marginBottom:12}}><Lbl>Name *</Lbl><Input value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. July 4th Backyard Jam" /></div>
          <div style={{marginBottom:20}}><Lbl>Notes</Lbl><TA value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Set notes, timing, cues…" rows={3} /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal==='add'?'Create':'Save'}</Btn>
          </div>
        </Modal>
      )}
      {picker && curSL && (
        <Modal title={`Add Song — ${curSL.name}`} onClose={()=>setPicker(null)}>
          {songs.filter(s=>!curSL.songIds.includes(s.id)).length===0
            ? <div style={{textAlign:'center',padding:'20px 0',color:C.sub}}>All songs already in this setlist.</div>
            : songs.filter(s=>!curSL.songIds.includes(s.id)).map(s=>(
            <div key={s.id} onClick={()=>addToSet(picker,s.id)}
              style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:C.raised,borderRadius:8,marginBottom:6,cursor:'pointer',border:`1px solid ${C.border}`}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.acc} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              <div>
                <div style={{fontSize:14,fontWeight:500,color:C.txt}}>{s.title}</div>
                <div style={{fontSize:11,color:C.sub}}>{s.key} · {s.bpm} BPM · {s.genre}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

// ── Jams View ─────────────────────────────────────────────────
const AVAIL_INFO = { in:[C.sage,'#1D2B18','✓ In'], out:[C.org,'#2B1510','✗ Out'], maybe:[C.acc,'#2B2110','? Maybe'] };

const SecLabel = ({ icon, label, count, color, right }) => (
  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
    <span style={{fontSize:11,fontWeight:700,color,letterSpacing:'0.07em',textTransform:'uppercase',flexShrink:0,display:'flex',alignItems:'center',gap:5}}>
      <span style={{fontSize:9}}>{icon}</span> {label}
    </span>
    <span style={{background:`${color}22`,color,padding:'1px 8px',borderRadius:10,fontSize:11,fontWeight:700,flexShrink:0}}>{count}</span>
    <div style={{flex:1,height:1,background:`${color}22`}} />
    {right}
  </div>
);

function JamCard({ jam, members, variant, onCycle, onConfirm, onUnconfirm, onDel, onEdit }) {
  const [open, setOpen] = useState(variant === 'proposed');
  const avail = jam.availability || {};
  const inMembers  = members.filter(m => avail[m.id] === 'in');
  const outMembers = members.filter(m => avail[m.id] === 'out');
  const mayMembers = members.filter(m => avail[m.id] === 'maybe');
  const noMembers  = members.filter(m => !avail[m.id]);
  const total = members.length;
  const canConfirm = inMembers.length >= Math.ceil(total / 2);

  const leftColor   = variant === 'open' ? C.sage : variant === 'proposed' ? C.acc : C.dim;
  const borderColor = variant === 'open' ? `${C.sage}44` : variant === 'proposed' ? `${C.acc}33` : C.border;

  return (
    <div style={{background:C.surf, border:`1px solid ${borderColor}`, borderLeft:`3px solid ${leftColor}`, borderRadius:10, padding:16, marginBottom:8, opacity:variant==='past'?0.7:1}}>

      {/* Header — always visible */}
      <div style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={() => setOpen(p => !p)}>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontFamily:"'Oswald', sans-serif", fontSize:16, fontWeight:500, color:variant==='past'?C.sub:C.txt, letterSpacing:'0.02em', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
            {fmtDate(jam.date)}
            {jam.time && <span style={{color:variant==='past'?C.dim:C.acc, fontSize:13, fontWeight:400, fontFamily:"'DM Sans', sans-serif"}}>{fmtTime(jam.time)}</span>}
            {jam.location && <span style={{color:C.dim, fontSize:13, fontWeight:400, fontFamily:"'DM Sans', sans-serif"}}>· {jam.location}</span>}
          </div>
        </div>
        {/* Compact vote tally */}
        <div style={{display:'flex', alignItems:'center', gap:8, marginLeft:10, flexShrink:0}}>
          <div style={{display:'flex', gap:6, fontSize:12, fontWeight:700}}>
            <span style={{color:C.sage}}>{inMembers.length}✓</span>
            {mayMembers.length > 0 && <span style={{color:C.acc}}>{mayMembers.length}?</span>}
            {outMembers.length > 0 && <span style={{color:C.org}}>{outMembers.length}✗</span>}
            {noMembers.length > 0 && variant === 'proposed' && <span style={{color:C.dim}}>{noMembers.length}◌</span>}
          </div>
          <span style={{color:C.dim, fontSize:12}}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12}}>

          {/* Member vote list */}
          <Lbl>{variant === 'proposed' ? 'Tap to change vote' : variant === 'open' ? 'Attendance' : 'Attended'}</Lbl>
          <div style={{marginTop:6, marginBottom:12, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden'}}>
            {members.map((m, i) => {
              const a = avail[m.id];
              const [c, bg] = AVAIL_INFO[a] || [C.dim, C.raised];
              const statusLabel = a === 'in' ? 'In' : a === 'out' ? 'Out' : a === 'maybe' ? 'Maybe' : 'No vote';
              const statusIcon  = a === 'in' ? '✓' : a === 'out' ? '✗' : a === 'maybe' ? '?' : '◌';
              const clickable = variant !== 'past';
              return (
                <div key={m.id} onClick={clickable ? () => onCycle(jam.id, m.id) : undefined}
                  style={{display:'flex', alignItems:'center', gap:10, padding:'9px 12px', cursor:clickable?'pointer':'default', background: i % 2 === 0 ? 'transparent' : `${C.raised}66`, borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, transition:'background 0.1s'}}
                  onMouseOver={clickable ? e => e.currentTarget.style.background = C.raised : undefined}
                  onMouseOut={clickable ? e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : `${C.raised}66` : undefined}>
                  <span style={{width:8, height:8, borderRadius:'50%', background:m.color, display:'inline-block', flexShrink:0}} />
                  <span style={{flex:1, fontSize:13, color:C.txt, fontWeight:500}}>{m.name}</span>
                  <span style={{fontSize:11, fontWeight:700, color:c, background:bg, padding:'2px 9px', borderRadius:4, letterSpacing:'0.02em', flexShrink:0}}>
                    {statusIcon} {statusLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            {variant === 'proposed' && (
              <button onClick={() => onConfirm(jam.id)} style={{
                background: canConfirm ? C.sage : 'transparent',
                color: canConfirm ? '#0C0A09' : C.sage,
                border: `1.5px solid ${C.sage}`,
                padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:700,
                fontFamily:"'DM Sans', sans-serif", display:'flex', alignItems:'center', gap:5,
              }}>
                {canConfirm ? '✅ Confirm Jam' : `Confirm (${inMembers.length}/${Math.ceil(total/2)} votes)`}
              </button>
            )}
            {variant === 'open' && <Btn sm variant="ghost" onClick={() => onUnconfirm(jam.id)}>↩ Unconfirm</Btn>}
            {variant !== 'past' && <Btn sm variant="ghost" onClick={() => onEdit(jam)}>✏ Edit</Btn>}
            <Btn sm variant="danger" onClick={() => onDel(jam.id)}>Delete</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// Proposed dates render their date card prominently, with the member list
// and action buttons living OUTSIDE the card border below it.
function ProposedJamBlock({ jam, members, onCycle, onConfirm, onDel, onEdit }) {
  const avail = jam.availability || {};
  const inMembers  = members.filter(m => avail[m.id] === 'in');
  const outMembers = members.filter(m => avail[m.id] === 'out');
  const mayMembers = members.filter(m => avail[m.id] === 'maybe');
  const noMembers  = members.filter(m => !avail[m.id]);
  const total = members.length;
  const canConfirm = inMembers.length >= Math.ceil(total / 2);

  return (
    <div style={{marginBottom:22}}>
      {/* Prominent date card — standalone, no expand toggle */}
      <div style={{background:C.surf, border:`1px solid ${C.acc}44`, borderLeft:`3px solid ${C.acc}`, borderRadius:10, padding:'13px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6}}>
        <div>
          <div style={{fontFamily:"'Oswald', sans-serif", fontSize:20, fontWeight:500, color:C.txt, letterSpacing:'0.02em', marginBottom:3}}>
            {fmtDate(jam.date)}
            {jam.time && <span style={{color:C.acc, fontSize:15, fontWeight:400, fontFamily:"'DM Sans', sans-serif", marginLeft:10}}>{fmtTime(jam.time)}</span>}
          </div>
          {jam.location && <div style={{fontSize:12, color:C.sub}}>📍 {jam.location}</div>}
        </div>
        {/* Vote tally badges */}
        <div style={{display:'flex', gap:6, flexShrink:0, marginLeft:16}}>
          <span style={{background:'#1D2B18', color:C.sage, padding:'3px 9px', borderRadius:5, fontSize:12, fontWeight:700}}>{inMembers.length}✓</span>
          {mayMembers.length > 0 && <span style={{background:'#2B2110', color:C.acc, padding:'3px 9px', borderRadius:5, fontSize:12, fontWeight:700}}>{mayMembers.length}?</span>}
          {outMembers.length > 0 && <span style={{background:'#2B1510', color:C.org, padding:'3px 9px', borderRadius:5, fontSize:12, fontWeight:700}}>{outMembers.length}✗</span>}
          {noMembers.length > 0 && <span style={{background:C.raised, color:C.dim, padding:'3px 9px', borderRadius:5, fontSize:12, fontWeight:700}}>{noMembers.length}◌</span>}
        </div>
      </div>

      {/* Member vote list — outside the date card */}
      <div style={{paddingLeft:4}}>
        {members.map((m, i) => {
          const a = avail[m.id];
          const [c, bg] = AVAIL_INFO[a] || [C.dim, C.raised];
          const statusLabel = a === 'in' ? 'In' : a === 'out' ? 'Out' : a === 'maybe' ? 'Maybe' : 'No vote';
          const statusIcon  = a === 'in' ? '✓' : a === 'out' ? '✗' : a === 'maybe' ? '?' : '◌';
          return (
            <div key={m.id} onClick={() => onCycle(jam.id, m.id)}
              style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', cursor:'pointer', borderTop:`1px solid ${C.border}`, transition:'background 0.1s', borderRadius: i === members.length - 1 ? '0 0 6px 6px' : 0}}
              onMouseOver={e => e.currentTarget.style.background = C.raised}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{width:8, height:8, borderRadius:'50%', background:m.color, display:'inline-block', flexShrink:0}} />
              <span style={{flex:1, fontSize:13, color:C.txt, fontWeight:500}}>{m.name}</span>
              <span style={{fontSize:11, fontWeight:700, color:c, background:bg, padding:'2px 9px', borderRadius:4, letterSpacing:'0.02em', flexShrink:0}}>{statusIcon} {statusLabel}</span>
            </div>
          );
        })}
      </div>

      {/* Action buttons — outside the date card */}
      <div style={{display:'flex', gap:8, marginTop:10, paddingLeft:4, flexWrap:'wrap', alignItems:'center'}}>
        <button onClick={() => onConfirm(jam.id)} style={{
          background: canConfirm ? C.sage : 'transparent',
          color: canConfirm ? '#0C0A09' : C.sage,
          border: `1.5px solid ${C.sage}`,
          padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:700,
          fontFamily:"'DM Sans', sans-serif", display:'flex', alignItems:'center', gap:5,
        }}>
          {canConfirm ? '✅ Confirm Jam' : `Confirm (${inMembers.length}/${Math.ceil(total/2)} votes)`}
        </button>
        <Btn sm variant="ghost" onClick={() => onEdit(jam)}>✏ Edit</Btn>
        <Btn sm variant="danger" onClick={() => onDel(jam.id)}>Delete</Btn>
      </div>
    </div>
  );
}

function JamsView({ jams, members, updJams }) {
  const [showOpen,     setShowOpen]     = useState(true);
  const [showProposed, setShowProposed] = useState(true);
  const [showPast,     setShowPast]     = useState(false);
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({date:'', time:'', location:'', notes:''});
  const ff = k => v => setForm(p => ({...p, [k]:v}));

  const upcoming = jams.filter(j => j.date >= TODAY).sort((a,b) => a.date.localeCompare(b.date));
  const past     = jams.filter(j => j.date <  TODAY).sort((a,b) => b.date.localeCompare(a.date));
  const openJams = upcoming.filter(j => j.status === 'confirmed');
  const proposed = upcoming.filter(j => j.status === 'proposed');

  const save = () => {
    if (!form.date) return;
    if (modal === 'add') {
      updJams([...jams, {...form, id:uid(), status:'proposed', availability:{}}]);
    } else {
      updJams(jams.map(j => j.id === form.id ? {...j, date:form.date, time:form.time, location:form.location, notes:form.notes} : j));
    }
    setModal(null);
  };

  // No window.confirm — delete directly
  const del       = id => updJams(jams.filter(j => j.id !== id));
  const confirm   = id => updJams(jams.map(j => j.id === id ? {...j, status:'confirmed'} : j));
  const unconfirm = id => updJams(jams.map(j => j.id === id ? {...j, status:'proposed'}  : j));
  const cycleAvail = (jamId, memberId) => updJams(jams.map(j => {
    if (j.id !== jamId) return j;
    const cur  = (j.availability||{})[memberId];
    const next = !cur || cur==='maybe' ? 'in' : cur==='in' ? 'out' : 'maybe';
    return {...j, availability:{...(j.availability||{}), [memberId]:next}};
  }));
  const editJam = j => { setForm({id:j.id, date:j.date, time:j.time||'', location:j.location||'', notes:j.notes||''}); setModal(j); };

  const cardProps = { members, onCycle:cycleAvail, onConfirm:confirm, onUnconfirm:unconfirm, onDel:del, onEdit:editJam };

  // Reusable collapsible section header
  const CollapseHead = ({ show, onToggle, icon, label, count, color }) => (
    <div onClick={onToggle} style={{cursor:'pointer', display:'flex', alignItems:'center', gap:10, marginBottom:show?12:0, userSelect:'none'}}>
      <span style={{fontSize:10, color, flexShrink:0}}>{show ? '▼' : '▶'}</span>
      <span style={{fontSize:11, fontWeight:700, color, letterSpacing:'0.07em', textTransform:'uppercase', flexShrink:0}}>{icon} {label}</span>
      <span style={{background:`${color}22`, color, padding:'1px 8px', borderRadius:10, fontSize:11, fontWeight:700, flexShrink:0}}>{count}</span>
      <div style={{flex:1, height:1, background:`${color}22`}} />
    </div>
  );

  return (
    <div>
      <SH title="Jams" action={<Btn variant="primary" onClick={() => { setForm({date:'',time:'',location:'',notes:''}); setModal('add'); }}>+ Propose Date</Btn>} />

      {/* ── Open Jams ── */}
      <div style={{marginBottom:22}}>
        <CollapseHead show={showOpen} onToggle={() => setShowOpen(p=>!p)} icon="●" label="Open Jams" count={openJams.length} color={C.sage} />
        {showOpen && (openJams.length === 0
          ? <div style={{fontSize:13,color:C.dim,padding:'6px 0 4px',lineHeight:1.6}}>No confirmed jams yet — confirm a proposal once the band votes in.</div>
          : openJams.map(j => <JamCard key={j.id} jam={j} variant="open" {...cardProps} />)
        )}
      </div>

      {/* ── Proposed Dates ── */}
      <div style={{marginBottom:22}}>
        <CollapseHead show={showProposed} onToggle={() => setShowProposed(p=>!p)} icon="◐" label="Proposed Dates" count={proposed.length} color={C.acc} />
        {showProposed && (proposed.length === 0
          ? <div style={{fontSize:13,color:C.dim,padding:'6px 0 4px',lineHeight:1.6}}>No proposals yet — propose a date and let everyone vote.</div>
          : proposed.map(j => <ProposedJamBlock key={j.id} jam={j} members={members} onCycle={cycleAvail} onConfirm={confirm} onDel={del} onEdit={editJam} />)
        )}
      </div>

      {/* ── Past Jams ── */}
      <div>
        <CollapseHead show={showPast} onToggle={() => setShowPast(p=>!p)} icon="○" label="Past Jams" count={past.length} color={C.dim} />
        {showPast && (past.length === 0
          ? <div style={{fontSize:13,color:C.dim,padding:'6px 0'}}>No past jams recorded.</div>
          : past.map(j => <JamCard key={j.id} jam={j} variant="past" {...cardProps} />)
        )}
      </div>

      {/* Propose / Edit Modal */}
      {modal && (
        <Modal title={modal==='add' ? 'Propose a Date' : 'Edit Jam'} onClose={() => setModal(null)}>
          {modal === 'add' && (
            <div style={{fontSize:13,color:C.sub,marginBottom:16,background:C.raised,borderRadius:6,padding:'8px 12px',lineHeight:1.6}}>
              💡 Propose a date and the band votes In / Maybe / Out. Confirm it once there's enough interest.
            </div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div><Lbl>Date *</Lbl><Input value={form.date} onChange={ff('date')} type="date" /></div>
            <div><Lbl>Time</Lbl><Input value={form.time} onChange={ff('time')} type="time" /></div>
          </div>
          <div style={{marginBottom:12}}><Lbl>Location</Lbl><Input value={form.location} onChange={ff('location')} placeholder="Ivan's backyard, Studio B…" /></div>
          <div style={{marginBottom:20}}><Lbl>Notes</Lbl><TA value={form.notes} onChange={ff('notes')} placeholder="What to bring, goals, vibe…" rows={3} /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal==='add' ? 'Submit Proposal' : 'Save Changes'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Playlists View ────────────────────────────────────────────
const BLANK_PL = { name:'', memberId:'', url:'', description:'' };

function PlaylistsView({ playlists, members, updPlaylists }) {
  const [memberFilter, setMemberFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(BLANK_PL);
  const [showEmbed, setShowEmbed] = useState({});
  const ff = k => v => setForm(p=>({...p,[k]:v}));

  const filtered = playlists.filter(pl=>memberFilter==='all'||pl.memberId===memberFilter);
  const save = () => {
    if (!form.name.trim()||!form.url.trim()) return;
    updPlaylists([...playlists,{...form,id:uid()}]);
    setModal(false); setForm(BLANK_PL);
  };
  const del = id => updPlaylists(playlists.filter(pl=>pl.id!==id));
  const toggleEmbed = id => setShowEmbed(p=>({...p,[id]:!p[id]}));

  const detectedPlatform = detectPlatform(form.url);

  return (
    <div>
      <SH title="Playlists" action={<Btn variant="primary" onClick={()=>{setForm(BLANK_PL);setModal(true);}}>+ Add Playlist</Btn>} />

      <div style={{marginBottom:6,fontSize:12,color:C.dim}}>Share public playlists from Spotify, YouTube, or Apple Music for the band to reference.</div>

      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',marginTop:12}}>
        <button style={chip(memberFilter==='all')} onClick={()=>setMemberFilter('all')}>All</button>
        {members.map(m=>(
          <button key={m.id} style={chip(memberFilter===m.id)} onClick={()=>setMemberFilter(m.id)}>
            <span style={{width:7,height:7,borderRadius:'50%',background:m.color,display:'inline-block',marginRight:4}} />{m.name}
          </button>
        ))}
      </div>

      {filtered.length===0 ? <Empty icon="🎵" text="No playlists yet." /> : filtered.map(pl=>{
        const member = members.find(m=>m.id===pl.memberId);
        const platform = detectPlatform(pl.url);
        const pInfo = PINFO[platform];
        const embedUrl = getEmbedUrl(pl.url);
        const isExpanded = showEmbed[pl.id];
        const embedH = platform==='spotify'?352:platform==='youtube'?240:175;

        return (
          <div key={pl.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{background:pInfo.bg,color:pInfo.color,padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:'0.04em'}}>{pInfo.icon} {pInfo.name}</span>
                  {member && (
                    <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.sub}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:member.color,display:'inline-block'}} />{member.name}
                    </span>
                  )}
                </div>
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:16,fontWeight:500,color:C.txt,letterSpacing:'0.02em',marginBottom:4}}>{pl.name}</div>
                {pl.description && <div style={{fontSize:12,color:C.sub,lineHeight:1.5}}>{pl.description}</div>}
              </div>
              <button onClick={()=>del(pl.id)} style={{background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:14,marginLeft:8,flexShrink:0}}>✕</button>
            </div>

            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <a href={pl.url} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:5,padding:'5px 12px',background:pInfo.bg,border:`1px solid ${pInfo.color}44`,borderRadius:6,color:pInfo.color,fontSize:12,fontWeight:600,textDecoration:'none'}}>
                🔗 Open in {pInfo.name}
              </a>
              {embedUrl && (
                <Btn sm variant="ghost" onClick={()=>toggleEmbed(pl.id)}>
                  {isExpanded ? '▲ Hide Player' : '▶ Show Player'}
                </Btn>
              )}
            </div>

            {isExpanded && embedUrl && (
              <div style={{marginTop:14}}>
                <iframe src={embedUrl} style={{width:'100%',border:'none',borderRadius:8,height:embedH,display:'block'}}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen loading="lazy" title={pl.name} />
                <div style={{fontSize:10,color:C.dim,marginTop:6,textAlign:'center'}}>
                  If the player doesn't appear, <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{color:pInfo.color}}>open in {pInfo.name} directly ↗</a>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {modal && (
        <Modal title="Add Playlist" onClose={()=>setModal(false)}>
          <div style={{marginBottom:12}}><Lbl>Playlist Name *</Lbl><Input value={form.name} onChange={ff('name')} placeholder="e.g. Funk Reference Jams" /></div>
          <div style={{marginBottom:12}}>
            <Lbl>Member</Lbl>
            <Sel value={form.memberId} onChange={ff('memberId')}>
              <option value="">Band / General</option>
              {members.map(m=><option key={m.id} value={m.id}>{m.name} — {m.instrument}</option>)}
            </Sel>
          </div>
          <div style={{marginBottom:12}}>
            <Lbl>Playlist URL * (Spotify, YouTube, Apple Music)</Lbl>
            <Input value={form.url} onChange={ff('url')} placeholder="https://open.spotify.com/playlist/..." />
            {form.url && (
              <div style={{marginTop:5,fontSize:11,color:PINFO[detectedPlatform]?.color||C.dim,display:'flex',alignItems:'center',gap:4}}>
                {PINFO[detectedPlatform]?.icon} Detected: {PINFO[detectedPlatform]?.name||'Unknown platform'}
              </div>
            )}
          </div>
          <div style={{marginBottom:20}}><Lbl>Description</Lbl><TA value={form.description} onChange={ff('description')} placeholder="What's this playlist for the band?" rows={3} /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>Add Playlist</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Reminders View ────────────────────────────────────────────
function RemindersView({ reminders, updReminders }) {
  const [showDone, setShowDone] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({text:'',dueDate:'',priority:'medium'});
  const ff = k => v => setForm(p=>({...p,[k]:v}));

  const toggle = id => updReminders(reminders.map(r=>r.id===id?{...r,done:!r.done}:r));
  const del = id => updReminders(reminders.filter(r=>r.id!==id));
  const add = () => { if(!form.text.trim())return; updReminders([...reminders,{...form,id:uid(),done:false}]); setModal(false); setForm({text:'',dueDate:'',priority:'medium'}); };

  const priOrd = {high:0,medium:1,low:2};
  const visible = reminders.filter(r=>showDone?r.done:!r.done).sort((a,b)=>(priOrd[a.priority]??2)-(priOrd[b.priority]??2)||(a.dueDate||'').localeCompare(b.dueDate||''));
  const overdueCount = reminders.filter(r=>!r.done&&r.dueDate&&r.dueDate<TODAY).length;

  return (
    <div>
      <SH
        title={<>Reminders {overdueCount>0&&<span style={{marginLeft:10,background:'#2B1510',color:C.org,padding:'2px 8px',borderRadius:4,fontSize:12,fontWeight:700}}>{overdueCount} overdue</span>}</>}
        action={<Btn variant="primary" onClick={()=>setModal(true)}>+ Add</Btn>}
      />
      <div style={{display:'flex',gap:8,marginBottom:18}}>
        <button style={chip(!showDone)} onClick={()=>setShowDone(false)}>Active ({reminders.filter(r=>!r.done).length})</button>
        <button style={chip(showDone)} onClick={()=>setShowDone(true)}>Done ({reminders.filter(r=>r.done).length})</button>
      </div>
      {visible.length===0 ? <Empty icon={showDone?'📝':'🎉'} text={showDone?'Nothing completed yet.':'All clear!'} /> : visible.map(r=>{
        const overdue = !r.done&&r.dueDate&&r.dueDate<TODAY;
        return (
          <div key={r.id} style={{background:C.surf,border:`1px solid ${overdue?C.org+'44':C.border}`,borderRadius:8,padding:'12px 14px',marginBottom:8,display:'flex',alignItems:'flex-start',gap:12}}>
            <div onClick={()=>toggle(r.id)} style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${r.done?C.sage:C.border}`,background:r.done?C.sage:'transparent',cursor:'pointer',flexShrink:0,marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
              {r.done && <span style={{color:'#0C0A09',fontSize:11,fontWeight:900}}>✓</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,color:r.done?C.dim:C.txt,textDecoration:r.done?'line-through':'none',marginBottom:5,wordBreak:'break-word'}}>{r.text}</div>
              <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <PriBadge p={r.priority} />
                {r.dueDate && <span style={{fontSize:11,color:overdue?C.org:C.sub}}>{overdue?'⚠ ':''}Due {fmtDate(r.dueDate)}</span>}
              </div>
            </div>
            <button onClick={()=>del(r.id)} style={{background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:14,flexShrink:0}}>✕</button>
          </div>
        );
      })}
      {modal && (
        <Modal title="Add Reminder" onClose={()=>setModal(false)}>
          <div style={{marginBottom:12}}><Lbl>Reminder *</Lbl><Input value={form.text} onChange={ff('text')} placeholder="What needs to happen?" /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            <div><Lbl>Due Date</Lbl><Input value={form.dueDate} onChange={ff('dueDate')} type="date" /></div>
            <div><Lbl>Priority</Lbl><Sel value={form.priority} onChange={ff('priority')}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></Sel></div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={add}>Add</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Members View ──────────────────────────────────────────────
const INSTRUMENTS = ['Guitar','Bass','Drums','Keys','Vocals','Trumpet','Saxophone','Violin','Banjo','Other'];
const PAL = ['#D4A853','#E8613C','#8B9E6F','#6B9FBF','#A87BC2','#E0A060','#5BA8A0'];

function MembersView({ members, updMembers }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({name:'',instrument:'',color:'#D4A853'});
  const ff = k => v => setForm(p=>({...p,[k]:v}));

  const save = () => { if(!form.name.trim())return; updMembers(modal==='add'?[...members,{...form,id:uid()}]:members.map(m=>m.id===form.id?form:m)); setModal(null); };
  const del = id => updMembers(members.filter(m=>m.id!==id));

  return (
    <div>
      <SH title="Members" action={<Btn variant="primary" onClick={()=>{setForm({name:'',instrument:'',color:'#D4A853'});setModal('add');}}>+ Add Member</Btn>} />
      {members.length===0 ? <Empty icon="👥" text="No members yet." /> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))',gap:10}}>
          {members.map(m=>(
            <div key={m.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Oswald', sans-serif",fontSize:20,color:'#0C0A09',fontWeight:700,flexShrink:0}}>{m.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{fontFamily:"'Oswald', sans-serif",fontSize:15,fontWeight:500,color:C.txt}}>{m.name}</div>
                  <div style={{fontSize:12,color:C.sub}}>{m.instrument||'—'}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:6}}>
                <Btn sm variant="ghost" onClick={()=>{setForm({...m});setModal(m);}}>Edit</Btn>
                <Btn sm variant="danger" onClick={()=>del(m.id)}>Remove</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal==='add'?'Add Member':'Edit Member'} onClose={()=>setModal(null)}>
          <div style={{marginBottom:12}}><Lbl>Name *</Lbl><Input value={form.name} onChange={ff('name')} placeholder="Member name" /></div>
          <div style={{marginBottom:14}}><Lbl>Instrument</Lbl><Sel value={form.instrument} onChange={ff('instrument')}><option value="">Select…</option>{INSTRUMENTS.map(i=><option key={i}>{i}</option>)}</Sel></div>
          <div style={{marginBottom:20}}>
            <Lbl>Color</Lbl>
            <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap',alignItems:'center'}}>
              {PAL.map(c=><div key={c} onClick={()=>ff('color')(c)} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:`2.5px solid ${form.color===c?C.txt:'transparent'}`,transition:'border-color 0.15s',flexShrink:0}} />)}
              <input type="color" value={form.color} onChange={e=>ff('color')(e.target.value)} style={{width:28,height:28,borderRadius:'50%',border:'none',cursor:'pointer',padding:0,background:'transparent'}} title="Custom" />
            </div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>{modal==='add'?'Add Member':'Save'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function BandApp() {
  const [nav, setNav] = useState('songs');
  const [songPage, setSongPage] = useState(null);
  const [songs, setSongs] = useState(S_SONGS);
  const [setlists, setSetlists] = useState(S_SETLISTS);
  const [jams, setJams] = useState(S_JAMS);
  const [members, setMembers] = useState(S_MEMBERS);
  const [reminders, setReminders] = useState(S_REMINDERS);
  const [playlists, setPlaylists] = useState(S_PLAYLISTS);

  useEffect(() => {
    const load = (key, setter) => {
      try { const r = localStorage.getItem(key); if (r) setter(JSON.parse(r)); } catch {}
    };
    load('bq-songs', setSongs);
    load('bq-setlists', setSetlists);
    load('bq-jams', setJams);
    load('bq-members', setMembers);
    load('bq-reminders', setReminders);
    load('bq-playlists', setPlaylists);
  }, []);

  const persist = key => data => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  };
  const updSongs = d => { setSongs(d); persist('bq-songs')(d); };
  const updSetlists = d => { setSetlists(d); persist('bq-setlists')(d); };
  const updJams = d => { setJams(d); persist('bq-jams')(d); };
  const updMembers = d => { setMembers(d); persist('bq-members')(d); };
  const updReminders = d => { setReminders(d); persist('bq-reminders')(d); };
  const updPlaylists = d => { setPlaylists(d); persist('bq-playlists')(d); };

  const pendingRem = reminders.filter(r=>!r.done).length;
  const NAV = [
    { id:'songs',     icon:'🎸', label:'Songs' },
    { id:'setlists',  icon:'📋', label:'Setlists' },
    { id:'jams',      icon:'📅', label:'Jams' },
    { id:'playlists', icon:'🎵', label:'Playlists' },
    { id:'reminders', icon:'🔔', label:'Reminders' },
    { id:'members',   icon:'👥', label:'Members' },
  ];

  const handleNavClick = id => { setNav(id); setSongPage(null); };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}body{margin:0;}
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.7);cursor:pointer;}
        input[type="range"]{cursor:pointer;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#332B22;border-radius:3px;}
      `}</style>

      <div style={{minHeight:'100vh',background:C.bg,color:C.txt,fontFamily:"'DM Sans', sans-serif",fontSize:14}}>
        {/* Top bar */}
        <div style={{background:C.surf,borderBottom:`1px solid ${C.border}`,padding:'0 16px',height:52,display:'flex',alignItems:'center',gap:6,position:'sticky',top:0,zIndex:40}}>
          <div style={{fontFamily:"'Oswald', sans-serif",fontSize:16,fontWeight:600,color:C.acc,letterSpacing:'0.1em',marginRight:10,whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>
            <span style={{fontSize:18}}>⚡</span> BAND HQ
          </div>
          <div style={{display:'flex',gap:2,flex:1,overflowX:'auto'}}>
            {NAV.map(({id,icon,label})=>(
              <button key={id} onClick={()=>handleNavClick(id)} style={{padding:'5px 11px',borderRadius:6,border:'none',cursor:'pointer',fontSize:13,fontWeight:500,whiteSpace:'nowrap',fontFamily:"'DM Sans', sans-serif",background:nav===id?C.raised:'transparent',color:nav===id?C.acc:C.sub,display:'flex',alignItems:'center',gap:5,position:'relative'}}>
                <span>{icon}</span><span>{label}</span>
                {id==='reminders'&&pendingRem>0&&(
                  <span style={{background:C.org,color:'white',borderRadius:'50%',width:15,height:15,fontSize:9,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,position:'absolute',top:2,right:2}}>{pendingRem}</span>
                )}
                {id==='songs'&&songPage&&nav==='songs'&&(
                  <span style={{background:C.acc,color:'#0C0A09',borderRadius:4,padding:'1px 5px',fontSize:9,fontWeight:700,marginLeft:2}}>OPEN</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:1000,margin:'0 auto',padding:'22px 16px'}}>
          {nav==='songs' && !songPage && <SongsView songs={songs} updSongs={updSongs} onOpenSong={s=>{setSongPage(s);}} />}
          {nav==='songs' && songPage && <SongDetailPage song={songPage} songs={songs} updSongs={updSongs} onBack={()=>setSongPage(null)} onSongUpdated={updated=>{setSongPage(updated); setSongs(songs.map(s=>s.id===updated.id?updated:s));}} />}
          {nav==='setlists'  && <SetlistsView  setlists={setlists} songs={songs} updSetlists={updSetlists} />}
          {nav==='jams'      && <JamsView      jams={jams} members={members} updJams={updJams} />}
          {nav==='playlists' && <PlaylistsView playlists={playlists} members={members} updPlaylists={updPlaylists} />}
          {nav==='reminders' && <RemindersView reminders={reminders} updReminders={updReminders} />}
          {nav==='members'   && <MembersView   members={members} updMembers={updMembers} />}
        </div>
      </div>
    </>
  );
}
