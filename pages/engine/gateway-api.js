// gateway-api.js — Ignition gateway REST API client
var ACTIVE_GW = null;

function setActiveGateway(gw) { ACTIVE_GW = gw; }

async function gwFetch(path) {
  if (!ACTIVE_GW) return null;
  try {
    var r = await fetch(ACTIVE_GW.url + path, { signal: AbortSignal.timeout(5000) });
    return r.headers.get('content-type')?.includes('json') ? await r.json() : await r.text();
  } catch { return null; }
}

async function gwProjects() {
  return await gwFetch('/data/perspective/projects') || [];
}

async function gwTags(path) {
  return await gwFetch('/system/tags/' + (path || 'default'));
}

async function gwModules() {
  var info = await gwFetch('/system/gwinfo');
  if (!info) return [];
  var plugins = (typeof info === 'string' ? info : '').match(/Plugins=([^;]*)/);
  return plugins ? plugins[1].split(',').filter(Boolean) : [];
}

async function gwDesignerLaunch() {
  return await gwFetch('/web/designerlaunch');
}
