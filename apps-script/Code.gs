// Band HQ sync backend — paste this into a Google Sheet's Apps Script editor
// (Extensions → Apps Script), then deploy as a Web App. See README.md for
// full setup steps.
//
// Storage model: one sheet tab per section (Songs, Setlists, Jams, Members,
// Reminders, Playlists), each a normal header-row-plus-data-rows table, so
// you can add or edit entries by hand directly in the spreadsheet — the app
// picks up any manual edits on its next load or on a ☰ menu → refresh.
//
// Nested fields that don't fit a single cell are flattened into one column:
// Setlist songIds is a comma-separated list of song IDs; Jam availability is
// a small JSON object string (e.g. {"M1":"in","M2":"maybe"}) since it's
// keyed by member ID and normally set via the app's voting UI, not by hand.

const SCHEMAS = {
  songs:     ['id', 'title', 'artist', 'key', 'bpm', 'genre', 'status', 'tags', 'tabUrl', 'lyrics', 'tabs', 'notes', 'rating', 'votes'],
  setlists:  ['id', 'name', 'songIds', 'created', 'notes'],
  jams:      ['id', 'date', 'time', 'endTime', 'location', 'notes', 'status', 'availability'],
  members:   ['id', 'name', 'instrument', 'color'],
  reminders: ['id', 'text', 'dueDate', 'priority', 'done'],
  playlists: ['id', 'memberId', 'name', 'url', 'description'],
};
const TAB_NAMES = { songs: 'Songs', setlists: 'Setlists', jams: 'Jams', members: 'Members', reminders: 'Reminders', playlists: 'Playlists' };
const ARRAY_FIELDS = { setlists: ['songIds'], songs: ['votes'] };
const JSON_FIELDS = { jams: ['availability'] };
const LEGACY_TAB = 'Data'; // old single-blob-per-row format, read as a fallback only

// Fields that are date/time-shaped strings (YYYY-MM-DD / HH:MM). Sheets
// auto-detects and silently converts these on write unless the column is
// forced to plain-text format, which corrupts them on the next read (e.g.
// "2026-07-04" round-trips as a Date object / serial number instead of the
// original string) — this broke Jam saving/syncing since jams have three
// such fields. DATE_FIELDS/TIME_FIELDS drive both the write-time format
// lock and a read-time fallback that reformats a Date back to a string if
// a cell was ever auto-converted (e.g. by data saved before this fix, or a
// manual edit in the sheet).
const DATE_FIELDS = { jams: ['date'], setlists: ['created'], reminders: ['dueDate'] };
const TIME_FIELDS = { jams: ['time', 'endTime'] };

// Row order used when writing each tab, so the sheet reads sensibly for
// manual browsing rather than showing raw save-order.
const SORTERS = {
  songs: (a, b) => (b.rating || 0) - (a.rating || 0) || ((b.votes || []).length - (a.votes || []).length) || String(a.title || '').localeCompare(String(b.title || '')),
  jams: (a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.time || '').localeCompare(String(b.time || '')),
  setlists: (a, b) => String(a.name || '').localeCompare(String(b.name || '')),
  members: (a, b) => String(a.name || '').localeCompare(String(b.name || '')),
  reminders: (a, b) => String(a.text || '').localeCompare(String(b.text || '')),
  playlists: (a, b) => String(a.name || '').localeCompare(String(b.name || '')),
};

function getTab_(key) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_NAMES[key]);
}
function ensureTab_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_NAMES[key]);
  if (!sheet) sheet = ss.insertSheet(TAB_NAMES[key]);
  return sheet;
}

function serializeCell_(key, field, value) {
  if ((ARRAY_FIELDS[key] || []).includes(field)) return (value || []).join(',');
  if ((JSON_FIELDS[key] || []).includes(field)) return JSON.stringify(value || {});
  return value === undefined || value === null ? '' : value;
}
function deserializeCell_(key, field, value) {
  if ((ARRAY_FIELDS[key] || []).includes(field)) return String(value || '').split(',').map(s => s.trim()).filter(Boolean);
  if ((JSON_FIELDS[key] || []).includes(field)) { try { return JSON.parse(value || '{}'); } catch (e) { return {}; } }
  if (value instanceof Date) {
    const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    if ((DATE_FIELDS[key] || []).includes(field)) return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
    if ((TIME_FIELDS[key] || []).includes(field)) return Utilities.formatDate(value, tz, 'HH:mm');
    return value.toISOString();
  }
  return value;
}

// One-time fallback for data saved before this tab-per-section rewrite.
function readLegacyBlob_(key) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEGACY_TAB);
  if (!sheet) return null;
  const rows = sheet.getDataRange().getValues();
  for (const row of rows) {
    if (row[0] === key) { try { return JSON.parse(row[1] || '[]'); } catch (e) { return []; } }
  }
  return null;
}

function readSection_(key) {
  const sheet = getTab_(key);
  if (!sheet || sheet.getLastRow() < 1) {
    return readLegacyBlob_(key) || [];
  }
  const values = sheet.getDataRange().getValues();
  const headerRow = values[0];
  const dataRows = values.slice(1).filter(r => r.some(c => c !== ''));
  return dataRows.map(row => {
    const obj = {};
    headerRow.forEach((h, i) => { obj[h] = deserializeCell_(key, h, row[i]); });
    return obj;
  });
}

function writeSection_(key, items) {
  const headers = SCHEMAS[key];
  const sheet = ensureTab_(key);
  const sorted = SORTERS[key] ? items.slice().sort(SORTERS[key]) : items;
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  // Lock date/time-shaped columns to plain text *before* writing values, so
  // Sheets never auto-converts "2026-07-04" / "18:00" into a Date/time
  // serial that would come back corrupted on the next read.
  const textFields = [...(DATE_FIELDS[key] || []), ...(TIME_FIELDS[key] || [])];
  const dataRowCount = Math.max(sorted.length, 1);
  textFields.forEach(f => {
    const col = headers.indexOf(f) + 1;
    if (col > 0) sheet.getRange(2, col, dataRowCount, 1).setNumberFormat('@');
  });
  if (sorted.length) {
    const rows = sorted.map(item => headers.map(h => serializeCell_(key, h, item[h])));
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
}

function doGet(e) {
  const data = {};
  Object.keys(SCHEMAS).forEach(key => { data[key] = readSection_(key); });
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const key = body.key;
    const value = Array.isArray(body.value) ? body.value : [];
    if (!SCHEMAS[key]) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unknown key' })).setMimeType(ContentService.MimeType.JSON);
    }
    writeSection_(key, value);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
