// nav.js — sidebar navigation
var VIEWS = ['dashboard','projects','tags','sync'];
var VIEW_ICONS = { dashboard:'🔥', projects:'📦', tags:'🏷️', sync:'🔄' };
var currentView = 'dashboard';

function renderNav(el) {
  el.innerHTML = '<div class="ph">🔥 GITNITION</div>'
    + VIEWS.map(function(v) {
      return '<div class="nav-item' + (v===currentView?' on':'') + '" onclick="switchView(\'' + v + '\')">'
        + VIEW_ICONS[v] + ' ' + v.toUpperCase() + '</div>';
    }).join('')
    + '<div class="ph" style="margin-top:8px">📡 GATEWAYS</div>'
    + '<div id="gw-nav">' + GW_LIST.map(function(gw) {
      var active = ACTIVE_GW && ACTIVE_GW.host === gw.host && ACTIVE_GW.port === gw.port;
      return '<div class="nav-item' + (active?' on':'') + '" onclick="selectGateway(\'' + gw.host + '\',' + gw.port + ')">'
        + '<span class="status ok" style="display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--ok);margin-right:4px"></span>'
        + (gw.PlatformName || gw.host) + '</div>';
    }).join('') + '</div>';
}

function switchView(name) {
  currentView = name;
  renderNav(document.getElementById('west'));
  var main = document.getElementById('main');
  if (name === 'dashboard') renderDashboard(main);
  else if (name === 'projects') renderProjectsView(main);
  else if (name === 'tags') renderTagView(main);
  else if (name === 'sync') renderSyncView(main);
}
