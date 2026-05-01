# 🔥 GitNITION

**Git-native Ignition Gateway interface — discover, connect, browse, control**

Auto-discovers Ignition gateways on the network. Browse tags, UDTs,
projects, modules. Import/export between Ignition and GitPLC/GitTAG.

## Structure

```
GITNITION/
├── pages/              GitHub Pages app
│   ├── ui/css/         Dark theme
│   ├── engine/         Gateway scanner, tag API, project API
│   ├── views/          Dashboard, tags, projects, modules, import/export
│   ├── faceplates/     Ignition-specific faceplates
│   └── scan/           Network discovery + gateway probe
├── gateways.json       Known gateway registry
├── index.html          Redirect → pages/
└── README.md
```

## How It Works

1. **Scan** — probes common ports (8088, 8090, 8043) on localhost + LAN
2. **Connect** — reads /system/gwinfo for version, edition, modules
3. **Browse** — tag tree, UDT definitions, project list via gateway API
4. **Sync** — import Ignition tags → GitTAG issues, export GitPLC UDTs → Ignition
