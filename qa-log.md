# GitNITION QA Log

## Gateway: Ignition-pred (localhost:8090)
- Version: 8.3.4 Maker Edition
- OS: Windows 11 | JRE: 17.0.17
- Projects: assway_demo, water-industry-pack

## Common Errors + Fixes

### 1. "View Not Found — No view configured for this page"
**Cause**: page-config.json exists but gateway hasn't loaded it
**Fix**: Restart gateway or trigger project scan via Designer
**Status**: page-config.json is valid (8 pages, 5 docks), gateway not reading it
**Command**: `gwcmd -r` (restart) or open Designer → save+publish

### 2. Tag filesystem writes need admin elevation
**Cause**: tag-definition dir is in Program Files (admin-only)
**Fix**: Run PowerShell as admin, or use `Start-Process -Verb RunAs`
**Path**: `C:\Program Files\Inductive Automation\Ignition\data\config\resources\core\ignition\tag-definition\default\`

### 3. gwcmd has no tag import/export
**Cause**: gwcmd only does backup/restore, SSL, ports — NOT tag operations
**Fix**: Use filesystem writes or Designer for tag management
**Available**: `-b` backup, `-s` restore, `-i` info, `-r` restart, `-p` passwd

### 4. Tags API returns 404
**Cause**: Ignition Maker doesn't expose REST tag API by default
**Fix**: Use MCP `ign_tags` tool (reads filesystem), or install Web Dev module
**Endpoints that work**: /StatusPing, /system/gwinfo, /data/perspective/projects, /web/*

### 5. Maker Edition dialog blocks Playwright
**Cause**: "Personal Use Only" dialog appears on every new Perspective session
**Fix**: Click "AGREE & CLOSE" via `page.$('text=AGREE & CLOSE').click()`

### 6. Perspective URL routing
**Correct**: `/data/perspective/client/{project}/{page-path}`
**Example**: `/data/perspective/client/assway_demo/Overview`
**Default page**: mapped by `"/"` in page-config.json
**Note**: URL path must match page-config keys, not view paths

## Tag Tree Structure (verified)
```
Exchange/
├── WaterPack/
├── assway/
│   ├── _types/
│   └── AssFarm/
│       ├── Storage/Farm/T01/ (tags written: T01_TK, T01_Temp, T01_Press, T01_HiHi)
│       ├── Storage/Farm/T02/ (tags written: T02_TK, T02_Temp, T02_Press)
│       ├── Metering/Skid/ (tags written: FT001_Flow, FT001_Total)
│       ├── Safety/Detectors/ (tags written: GD001_LEL, GD001_Alarm)
│       └── Truck/Bay/ (tags written: TB01_Active, TB01_Volume)
└── assway_demo/
```

## View Inventory (23 views in assway_demo)
```
Docks: Header, Nav, Right, Alarms, Status
Plant: Overview, Custody, Operations, PID, Safety, SafetyConsole, TankDetail
Templates: AlarmChip, GasDot, GaugeTile, KpiTile, MeterCard, MiniTank,
           PumpSkidCard, TankCard, TrendCard, ValveChip, ValveColumn
```

## Tests Run
- [x] StatusPing: RUNNING
- [x] gwinfo: version, edition, OS confirmed
- [x] Projects API: 2 projects found
- [x] Tag browse: folder structure verified
- [x] Tag write: 13 tags written via admin filesystem
- [x] View list: 23 views confirmed
- [x] View read: Plant/Overview JSON structure valid
- [x] Page config: 8 pages + 5 shared docks defined
- [x] Perspective render: "View Not Found" on BOTH projects after restart
- [ ] Tag values in views: pending Designer publish

### 7. Perspective page-config requires Designer publish (CRITICAL)
**Cause**: Filesystem page-config.json is valid but Perspective ignores it
**Both projects** (assway_demo + water-industry-pack) show "View Not Found"
**Root cause**: Perspective caches page config internally — filesystem edits alone
don't register. Needs a Designer save+publish cycle to trigger the Perspective
module to reload its internal page registry.
**Fix**: Open Designer → open project → publish (even with no changes)
**Alternative**: Use the `ign 🔥` auto-launch → login → project → publish flow
**Note**: This is by design in Ignition — filesystem is the source of truth for
backup/restore, but the running gateway maintains its own internal state
