// sync.js — sync tags between Ignition and GitTAG
var SYNC = { lastSync:0, imported:0, exported:0 };
var TAG_REPO = 'teslasolar/GITTAG';

async function importFromIgnition(gwUrl, provider) {
  var tags = await gwFetch('/system/tags/' + (provider || 'default'));
  if (!tags || !Array.isArray(tags)) return { ok:false, error:'no tags' };
  SYNC.imported += tags.length;
  SYNC.lastSync = Date.now();
  return { ok:true, count:tags.length, provider:provider||'default' };
}

async function exportToGitTAG(tags, branch, token) {
  if (!token) return { ok:false, error:'need gh token' };
  var label = branch ? 'branch:' + branch : 'gittag';
  var count = 0;
  for (var t of tags) {
    var body = '```json\n' + JSON.stringify(t, null, 2) + '\n```';
    await fetch('https://api.github.com/repos/' + TAG_REPO + '/issues', {
      method: 'POST',
      headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t.tag_path || t.name, body: body, labels: [label] }),
    });
    count++;
  }
  SYNC.exported += count;
  return { ok:true, count:count, branch:branch||'master' };
}
