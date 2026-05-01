// dashboard.js — gateway overview with scan results
function renderDashboard(el) {
  el.innerHTML = '<h3 style="color:var(--ign);font-size:11px;margin-bottom:8px">🔥 Gateways</h3>'
    + (GW_LIST.length === 0 ? '<p style="color:var(--t2)">No gateways found. Click Scan.</p>' : '')
    + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px">'
    + GW_LIST.map(function(gw) {
      return '<div class="gw-card" onclick="selectGateway(\'' + gw.host + '\',' + gw.port + ')">'
        + '<span class="status ok"></span>'
        + '<span class="name">' + (gw.PlatformName || gw.host) + '</span>'
        + '<div class="info">' + gw.host + ':' + gw.port + ' · ' + (gw.Version || '?') + ' · ' + (gw.PlatformEdition || '') + '</div>'
        + '<div class="info">OS: ' + (gw.OS || '?') + ' · JRE: ' + (gw.RuntimeVersion || '?') + '</div>'
        + '</div>';
    }).join('') + '</div>';
}
