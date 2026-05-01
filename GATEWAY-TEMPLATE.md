# Ignition Gateway Project Template

Based on analysis of open-source Ignition projects:
- [Flintium](https://github.com/jlbcontrols/Flintium) — Rockwell PlantPAx faceplates (★45)
- [ignition-framework](https://github.com/joyja/ignition-framework) — Standard components + themes (★17)

## Directory Structure

```
project.json                              ← project manifest (title, enabled, inheritable)

com.inductiveautomation.perspective/      ← Perspective module resources
├── page-config/
│   ├── config.json                       ← URL → view mapping + shared docks
│   └── resource.json                     ← scope:G, version, actor
├── session-props/
│   ├── props.json                        ← auth, theme, timeouts
│   └── resource.json
├── session-scripts/
│   ├── data.bin                          ← compiled session event scripts
│   └── resource.json
├── style-classes/                        ← CSS-like style classes
│   └── {category}/{name}/
│       ├── style.json                    ← {base:{style:{...}}}
│       └── resource.json                 ← scope:A
└── views/
    └── {path}/{name}/
        ├── view.json                     ← component tree (root → children)
        └── resource.json                 ← scope:A, version, files:["view.json"]

gw-resources/                             ← gateway-scoped resources
├── tags/
│   ├── types/{TypeName}/                 ← UDT type definitions
│   │   ├── nodeconfig.json               ← {tagType:"UdtType"}
│   │   └── {MemberName}/
│   │       └── nodeconfig.json           ← {tagType:"AtomicTag",dataType,value}
│   ├── instances/{Path}/                 ← UDT instances
│   │   └── nodeconfig.json               ← {tagType:"UdtInstance",typeId}
│   └── tag-groups/
│       └── {GroupName}.json              ← {name,rate}
└── user-sources/{SourceName}/
    ├── roles.json                        ← role list
    └── users.json                        ← user + role assignments

ignition/                                 ← project-scoped resources
├── designer-properties/                  ← designer layout prefs
├── global-props/                         ← gateway event scripts
└── script-python/{library}/              ← shared script libraries
    └── {module}/
        ├── __init__.py                   ← module code
        └── resource.json                 ← scope:G

docker/                                   ← optional Docker deployment
├── Dockerfile
└── docker-compose.yml
```

## Key Patterns

| Pattern | Flintium | ignition-framework | GitNITION |
|---------|----------|-------------------|-----------|
| UDT types | nodeconfig.json per member | — | nodeconfig.json |
| Views | view.json + resource.json | view.json + resource.json | ✓ |
| Style classes | — | style.json per class | ✓ |
| Page config | — | config.json + resource.json | ✓ |
| Scripts | Jython libraries | — | ✓ |
| Tag instances | JSON export | — | nodeconfig.json |
| User sources | JSON export | — | ✓ |
| Docker | ✓ | ✓ (themes dir) | planned |

## resource.json Template

```json
{
  "scope": "A",
  "version": 1,
  "restricted": false,
  "overridable": true,
  "files": ["view.json"],
  "attributes": {},
  "lastModification": {
    "actor": "git",
    "timestamp": 1234567890000
  }
}
```

Scopes: `"G"` = Gateway, `"A"` = All/Any, `"C"` = Client
