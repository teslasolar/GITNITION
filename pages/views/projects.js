// projects.js — list gateway Perspective projects
async function renderProjectsView(el) {
  if (!ACTIVE_GW) { el.innerHTML = '<p style="color:var(--t2)">Select a gateway first</p>'; return; }
  el.innerHTML = '<h3 style="color:var(--ign);font-size:11px">📦 Projects — ' + ACTIVE_GW.PlatformName + '</h3><div id="proj-list">Loading...</div>';
  var projects = await gwProjects();
  var list = document.getElementById('proj-list');
  if (!Array.isArray(projects) || !projects.length) { list.innerHTML = '<p style="color:var(--t2)">No projects found</p>'; return; }
  list.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px">'
    + projects.map(function(p) {
      return '<div class="gw-card">'
        + '<div class="name">' + p.name + '</div>'
        + '<div class="info">' + (p.title || '') + '</div>'
        + '<div class="info">' + (p.description || '') + '</div>'
        + '<div style="margin-top:4px"><a href="' + ACTIVE_GW.url + p.launchUrl + '" target="_blank" class="btn" style="color:var(--ok)">▶ Open</a></div>'
        + '</div>';
    }).join('') + '</div>';
}
