# Gateway QA State Machine

```mermaid
stateDiagram-v2
    [*] --> PROBE

    state "1. Discovery" as disc {
        PROBE --> PING : StatusPing
        PING --> GWINFO : state=RUNNING
        PING --> OFFLINE : timeout/error
        GWINFO --> SCANNED : version+edition+OS parsed
    }

    state "2. Project Check" as proj {
        SCANNED --> PROJECTS : /data/perspective/projects
        PROJECTS --> VIEW_LIST : list views per project
        VIEW_LIST --> PAGE_CFG : read page-config.json
    }

    state "3. Tag Check" as tags {
        SCANNED --> TAG_BROWSE : ign_tags browse /
        TAG_BROWSE --> TAG_TREE : walk folder hierarchy
        TAG_TREE --> TAG_VALUES : read individual tags
        TAG_VALUES --> TAG_WRITE : create/update tags
        TAG_WRITE --> TAG_VERIFY : re-read written tags
    }

    state "4. Perspective QA" as persp {
        PAGE_CFG --> LAUNCH_URL : open in Playwright
        LAUNCH_URL --> MAKER_DLG : dismiss "Personal Use" dialog
        MAKER_DLG --> VIEW_CHECK : check for "View Not Found"
        VIEW_CHECK --> RENDER_OK : view renders
        VIEW_CHECK --> PUBLISH_NEEDED : "View Not Found"
    }

    state "5. Publish Flow" as pub {
        PUBLISH_NEEDED --> DESIGNER_LAUNCH : ign 🔥
        DESIGNER_LAUNCH --> DESIGNER_LOGIN : auto-auth
        DESIGNER_LOGIN --> PROJECT_OPEN : double-click project
        PROJECT_OPEN --> SAVE_PUBLISH : Ctrl+S
        SAVE_PUBLISH --> RETEST : wait + reload Perspective
    }

    state "6. Error Logging" as err {
        RETEST --> RENDER_OK : view renders
        RETEST --> LOG_ERROR : still broken
        LOG_ERROR --> GITTAG_POST : post to ignition-errors branch
        GITTAG_POST --> LEDGER_UPDATE : update error-ledger.json
    }

    RENDER_OK --> [*]
    OFFLINE --> [*]

    note right of PUBLISH_NEEDED : IGN-008: page-config ignored without Designer publish
    note right of TAG_WRITE : IGN-002: needs admin elevation for filesystem
    note right of MAKER_DLG : IGN-005: blocks Playwright automation
```
