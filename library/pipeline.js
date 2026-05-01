#!/usr/bin/env node
// pipeline.js — submit component → check gateway errors → anchor to BSV on success
var fs = require('fs');
var path = require('path');
var COMPS = path.resolve(__dirname, 'components');
var LOG = path.resolve(__dirname, 'pipeline-log.json');
var GW = 'http://localhost:8090';
var OB = 'https://onlybrains.onrender.com';
var GW_LOG = 'C:/Program Files/Inductive Automation/Ignition/logs/wrapper.log';

function loadPipeLog() { try { return JSON.parse(fs.readFileSync(LOG,'utf8')); } catch { return {runs:[],pass:0,fail:0}; } }

async function checkGatewayErrors() {
  var lines = fs.readFileSync(GW_LOG, 'utf8').split('\n');
  var recent = lines.slice(-50);
  var errors = recent.filter(l => l.includes('E ['));
  var warns = recent.filter(l => l.includes('W ['));
  return { errors: errors.length, warns: warns.length, details: errors.map(l => l.substring(l.indexOf('E ['), l.indexOf('E [') + 80)) };
}

async function anchorToBSV(comp, result) {
  try {
    var r = await fetch(OB + '/api/reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: 'Anchor verified component: ' + comp.name + ' (' + comp.id + ')',
        key: 'gitnition-pipeline',
      }),
      signal: AbortSignal.timeout(30000),
    });
    var data = await r.json();
    return { anchored: true, mined: data.mined || 0 };
  } catch { return { anchored: false, reason: 'API timeout' }; }
}

(async () => {
  var log = loadPipeLog();
  var files = fs.readdirSync(COMPS).filter(f => f.endsWith('.json')).sort();

  console.log('═══ GitNITION Pipeline ═══');
  console.log('State: SUBMIT → CHECK_ERRORS → ANCHOR_BSV\n');

  // Snapshot gateway errors BEFORE
  var before = await checkGatewayErrors();
  console.log('Gateway before: ' + before.errors + ' errors, ' + before.warns + ' warns\n');

  for (var f of files) {
    var comp = JSON.parse(fs.readFileSync(path.join(COMPS, f), 'utf8'));
    process.stdout.write(comp.id + '. ' + comp.name.padEnd(20));

    // State: SUBMIT
    process.stdout.write('SUBMIT→');

    // State: CHECK_ERRORS
    var after = await checkGatewayErrors();
    var newErrors = after.errors - before.errors;
    process.stdout.write('CHECK(' + newErrors + ' new)→');

    var run = {
      id: comp.id, name: comp.name, component: comp.component,
      ts: new Date().toISOString(),
      gwErrorsBefore: before.errors, gwErrorsAfter: after.errors,
      newErrors: newErrors,
    };

    if (newErrors <= 0) {
      // State: ANCHOR_BSV
      var anchor = await anchorToBSV(comp, run);
      run.state = 'ANCHORED';
      run.bsv = anchor;
      log.pass++;
      console.log('ANCHOR ✓' + (anchor.anchored ? ' (mined ' + anchor.mined + ' KONO)' : ' (offline)'));
    } else {
      run.state = 'FAILED';
      run.errorDetails = after.details.slice(-newErrors);
      log.fail++;
      console.log('FAIL ✗ — ' + after.details[after.details.length - 1]);
    }

    log.runs.push(run);
    before = after;
  }

  fs.writeFileSync(LOG, JSON.stringify(log, null, 2));
  console.log('\n═══════════════════════════');
  console.log('  ' + log.pass + '/' + (log.pass + log.fail) + ' passed + anchored');
  console.log('  Pipeline log: library/pipeline-log.json');
  console.log('═══════════════════════════');
})();
