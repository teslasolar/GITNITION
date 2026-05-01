// sync-view.js — import/export between Ignition and GitTAG
function renderSyncView(el) {
  el.innerHTML = '<h3 style="color:var(--ign);font-size:11px">🔄 Sync</h3>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'
    + '<div class="gw-card">'
    + '<div class="name">Ignition → GitTAG</div>'
    + '<div class="info">Import tags from gateway to GitHub Issues</div>'
    + '<div class="tag-row"><span class="k">Imported</span><span class="v">' + SYNC.imported + '</span></div>'
    + '<button class="btn" onclick="doImport()" style="margin-top:6px">⬇ Import Tags</button>'
    + '</div>'
    + '<div class="gw-card">'
    + '<div class="name">GitTAG → Ignition</div>'
    + '<div class="info">Export GitHub Issue tags to gateway</div>'
    + '<div class="tag-row"><span class="k">Exported</span><span class="v">' + SYNC.exported + '</span></div>'
    + '<button class="btn" onclick="doExport()" style="margin-top:6px">⬆ Export Tags</button>'
    + '</div></div>'
    + (SYNC.lastSync ? '<p style="color:var(--t2);font-size:7px;margin-top:8px">Last sync: ' + new Date(SYNC.lastSync).toLocaleString() + '</p>' : '');
}

async function doImport() {
  if (!ACTIVE_GW) { alert('Select a gateway first'); return; }
  var r = await importFromIgnition(ACTIVE_GW.url);
  renderSyncView(document.getElementById('main'));
}

async function doExport() { alert('Set localStorage.gh_token first'); }
