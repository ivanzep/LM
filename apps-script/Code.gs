// Band HQ sync backend — paste this into a Google Sheet's Apps Script editor
// (Extensions → Apps Script), then deploy as a Web App. See README.md for
// full setup steps.
//
// Storage model: one sheet tab named "Data" with two columns, key | json.
// Each row holds one collection (songs, setlists, jams, members, reminders,
// playlists) as a JSON blob — simpler and safer than trying to flatten
// nested data (jam voting, ordered setlist song lists) into spreadsheet rows.

const SHEET_NAME = 'Data';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function doGet(e) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const data = {};
  rows.forEach(row => {
    const key = row[0];
    const json = row[1];
    if (!key) return;
    try { data[key] = JSON.parse(json || '[]'); } catch (err) { data[key] = []; }
  });
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const key = body.key;
    const value = body.value;
    const sheet = getSheet_();
    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === key) { rowIndex = i; break; }
    }
    const json = JSON.stringify(value);
    if (rowIndex === -1) {
      sheet.appendRow([key, json]);
    } else {
      sheet.getRange(rowIndex + 1, 2).setValue(json);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
