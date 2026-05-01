// east.js — gateway detail panel
function renderEast(el) {
  el.innerHTML = '<div class="ph">⚙️ GATEWAY</div>'
    + '<div style="padding:4px 8px">'
    + (ACTIVE_GW ? [
      '<div class="tag-row"><span class="k">Name</span><span class="v">' + (ACTIVE_GW.PlatformName||'') + '</span></div>',
      '<div class="tag-row"><span class="k">Version</span><span class="v">' + (ACTIVE_GW.Version||'') + '</span></div>',
      '<div class="tag-row"><span class="k">Edition</span><span class="v">' + (ACTIVE_GW.PlatformEdition||'') + '</span></div>',
      '<div class="tag-row"><span class="k">URL</span><span class="v">' + ACTIVE_GW.url + '</span></div>',
      '<div class="tag-row"><span class="k">OS</span><span class="v">' + (ACTIVE_GW.OS||'') + '</span></div>',
      '<div class="tag-row"><span class="k">JRE</span><span class="v">' + (ACTIVE_GW.RuntimeVersion||'') + '</span></div>',
      '<div class="tag-row"><span class="k">State</span><span style="color:var(--ok)">● ' + ACTIVE_GW.state + '</span></div>',
    ].join('') : '<span style="color:var(--t2)">No gateway selected</span>')
    + '</div>'
    + '<div class="ph">🔗 LINKS</div>'
    + '<div style="padding:4px 8px;font-size:7px">'
    + '<div><a href="https://teslasolar.github.io/GITPLC/pages/" style="color:var(--ig);text-decoration:none">📐 GitPLC</a></div>'
    + '<div><a href="https://teslasolar.github.io/GITTAG/pages/" style="color:var(--ig);text-decoration:none">🏷️ GitTAG</a></div>'
    + '<div><a href="https://teslasolar.github.io/GITCONTROL/pages/" style="color:var(--ig);text-decoration:none">🎛️ GitControl</a></div>'
    + '</div>';
}
