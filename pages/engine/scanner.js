// scanner.js — discover Ignition gateways on the network
var GW_LIST = [];
var GW_CONFIG = null;

async function loadGatewayConfig() {
  try { GW_CONFIG = await (await fetch('../gateways.json')).json(); } catch { GW_CONFIG = { known:[], scan_ports:[8088,8090], scan_hosts:['localhost'] }; }
  return GW_CONFIG;
}

async function probeGateway(host, port) {
  var url = 'http://' + host + ':' + port;
  try {
    var r = await fetch(url + '/StatusPing', { signal: AbortSignal.timeout(3000) });
    var ping = await r.json();
    if (ping.state !== 'RUNNING') return null;
    var info = await (await fetch(url + '/system/gwinfo', { signal: AbortSignal.timeout(3000) })).text();
    var gw = { host:host, port:port, url:url, state:ping.state };
    info.split(';').forEach(function(kv) { var p=kv.split('='); if(p.length===2) gw[p[0]]=p[1]; });
    return gw;
  } catch { return null; }
}

async function scanAll() {
  if (!GW_CONFIG) await loadGatewayConfig();
  var results = [];
  var probes = [];
  var hosts = GW_CONFIG.scan_hosts || ['localhost'];
  var ports = GW_CONFIG.scan_ports || [8088, 8090];
  hosts.forEach(function(h) { ports.forEach(function(p) { probes.push(probeGateway(h, p)); }); });
  var all = await Promise.all(probes);
  all.forEach(function(gw) { if (gw) results.push(gw); });
  GW_LIST = results;
  return results;
}
