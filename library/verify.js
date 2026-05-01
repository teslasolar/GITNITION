#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var COMPS = path.resolve(__dirname, 'components');
var VERIFIED = path.resolve(__dirname, 'verified');
var LOG = path.resolve(__dirname, 'test-log.json');
var GW_PROJ = 'C:/Program Files/Inductive Automation/Ignition/data/projects/assway_demo/com.inductiveautomation.perspective/views/LibTest';

function loadLog() { try { return JSON.parse(fs.readFileSync(LOG,'utf8')); } catch { return {tests:[],pass:0,fail:0}; } }

(async () => {
  var files = fs.readdirSync(COMPS).filter(f => f.endsWith('.json')).sort();
  var log = loadLog();

  console.log('═══ Component Verification ═══\n');
  console.log(files.length + ' components to verify\n');

  for (var f of files) {
    var comp = JSON.parse(fs.readFileSync(path.join(COMPS, f), 'utf8'));
    console.log(comp.id + '. ' + comp.name + ' (' + comp.component + ')');

    // Build view.json
    var view = {
      custom: {},
      params: comp.params || {},
      props: { defaultSize: { width: 300, height: 200 } },
      root: {
        type: 'ia.container.coord',
        version: 0,
        props: { mode: 'fixed' },
        meta: { name: 'root' },
        children: comp.children,
      },
    };
    var resource = {
      scope: 'A', version: 1, restricted: false, overridable: true,
      files: ['view.json'], attributes: {},
      lastModification: { actor: 'gitnition-lib', timestamp: Date.now() },
    };

    // Save to verified dir
    var vDir = path.join(VERIFIED, comp.name);
    fs.mkdirSync(vDir, { recursive: true });
    fs.writeFileSync(path.join(vDir, 'view.json'), JSON.stringify(view, null, 2));
    fs.writeFileSync(path.join(vDir, 'resource.json'), JSON.stringify(resource, null, 2));

    // Check component type exists in Ignition docs
    var knownTypes = [
      'ia.display.label', 'ia.display.icon', 'ia.display.image',
      'ia.display.cylindrical-tank', 'ia.display.linear-scale',
      'ia.display.moving-analog-indicator', 'ia.display.led-display',
      'ia.display.markdown', 'ia.display.view',
      'ia.container.coord', 'ia.container.flex', 'ia.container.column',
      'ia.input.toggle-switch', 'ia.input.numeric-entry', 'ia.input.text-field',
      'ia.input.dropdown', 'ia.input.button',
    ];

    var typesUsed = comp.children.map(c => c.type);
    var allKnown = typesUsed.every(t => knownTypes.includes(t));

    var result = {
      id: comp.id,
      name: comp.name,
      component: comp.component,
      types: typesUsed,
      typesValid: allKnown,
      hasView: true,
      hasResource: true,
      status: allKnown ? 'verified' : 'unknown_type',
      ts: new Date().toISOString(),
    };

    comp.status = result.status;
    fs.writeFileSync(path.join(COMPS, f), JSON.stringify(comp, null, 2));

    log.tests.push(result);
    if (allKnown) { log.pass++; console.log('  ✓ verified — types valid'); }
    else { log.fail++; console.log('  ✗ unknown types: ' + typesUsed.filter(t => !knownTypes.includes(t)).join(', ')); }
  }

  fs.writeFileSync(LOG, JSON.stringify(log, null, 2));
  console.log('\n═══════════════════════════');
  console.log('  ' + log.pass + '/' + (log.pass + log.fail) + ' verified');
  console.log('  Saved to library/verified/');
  console.log('═══════════════════════════');
})();
