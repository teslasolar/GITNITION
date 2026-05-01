// tags.js — browse gateway tag tree
async function renderTagView(el) {
  if (!ACTIVE_GW) { el.innerHTML = '<p style="color:var(--t2)">Select a gateway first</p>'; return; }
  el.innerHTML = '<h3 style="color:var(--ign);font-size:11px">🏷️ Tags — ' + ACTIVE_GW.PlatformName + '</h3><div id="tag-list">Loading...</div>';
  var tags = await gwTags('default');
  var list = document.getElementById('tag-list');
  if (!tags || (typeof tags === 'string' && tags.includes('html'))) {
    list.innerHTML = '<p style="color:var(--t2)">Tag API not available (needs auth or different endpoint)</p>';
    return;
  }
  if (Array.isArray(tags)) {
    list.innerHTML = tags.map(function(t) {
      return '<div class="tag-row"><span class="k">' + (t.name||t) + '</span><span class="v">' + (t.value||'') + '</span></div>';
    }).join('');
  } else {
    list.innerHTML = '<pre style="font-size:7px;color:var(--t)">' + JSON.stringify(tags, null, 2).substring(0, 2000) + '</pre>';
  }
}
