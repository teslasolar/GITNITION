#!/usr/bin/env node
// test-runner.js — verify Perspective components one at a time against live gateway
const fs = require('fs');
const path = require('path');
const BASE = path.resolve(__dirname);
const VERIFIED = path.join(BASE, 'verified');
const LOG = path.join(BASE, 'test-log.json');

function loadLog() { try { return JSON.parse(fs.readFileSync(LOG,'utf8')); } catch { return { tests:[], pass:0, fail:0 }; } }
function saveLog(log) { fs.writeFileSync(LOG, JSON.stringify(log, null, 2)); }

function makeView(name, children, params) {
  return {
    custom: {},
    params: params || {},
    propConfig: {},
    props: { defaultSize: { width: 300, height: 200 } },
    root: {
      type: 'ia.container.coord',
      version: 0,
      props: { mode: 'fixed' },
      meta: { name: 'root' },
      children: children,
    },
  };
}

function makeResource() {
  return {
    scope: 'A', version: 1, restricted: false, overridable: true,
    files: ['view.json'], attributes: {},
    lastModification: { actor: 'gitnition-lib', timestamp: Date.now() },
  };
}

function saveComponent(name, viewJson) {
  var dir = path.join(VERIFIED, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'view.json'), JSON.stringify(viewJson, null, 2));
  fs.writeFileSync(path.join(dir, 'resource.json'), JSON.stringify(makeResource(), null, 2));
  return dir;
}

module.exports = { loadLog, saveLog, makeView, makeResource, saveComponent, VERIFIED, LOG };
