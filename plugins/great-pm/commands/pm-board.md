---
description: Open the great-pm board — a native, zero-dependency project board (hybrid stage×status Kanban + artifact panels + verdict metrics) served from the great-pm plugin itself. Self-contained, no npm packages.
argument-hint: ""
user-invocable: true
allowed-tools: Bash
model: opus
---

You are the great-pm `/pm-board` command. Open the native great-pm board.

## Operating procedure

1. Resolve the plugin root and register the current project so the board's
   switcher can find it:
   ```bash
   ROOT="${CLAUDE_PLUGIN_ROOT:-$HOME/great-pm}"
   REG="$HOME/.great-pm/projects.json"
   mkdir -p "$HOME/.great-pm"
   CWD="$(pwd)"
   # project name: title from .great-pm/PROJECT.md, else folder name
   NAME="$(grep -m1 '^# ' .great-pm/PROJECT.md 2>/dev/null | sed 's/^# *//' | head -c 40)"
   [ -z "$NAME" ] && NAME="$(basename "$CWD")"
   TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
   python3 - "$REG" "$CWD" "$NAME" "$TS" <<'PY'
   import json,sys,os
   reg,path,name,ts=sys.argv[1:5]
   try: d=json.load(open(reg))
   except Exception: d={"projects":[]}
   ps=[p for p in d.get("projects",[]) if os.path.abspath(p.get("path",""))!=os.path.abspath(path)]
   ps.insert(0,{"path":path,"name":name,"lastSeen":ts})
   json.dump({"projects":ps},open(reg,"w"),indent=2)
   print("registered:",name)
   PY
   ```

2. If the board is already serving on port 3142, just open it; otherwise start it
   (detached) from the plugin and open the browser:
   ```bash
   if [ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 http://localhost:3142/ 2>/dev/null)" = "200" ]; then
     open http://localhost:3142 2>/dev/null || xdg-open http://localhost:3142 2>/dev/null
     echo "opened existing board"
   else
     nohup node "$ROOT/board/server.mjs" --port 3142 > "$HOME/.great-pm/board.log" 2>&1 &
     disown
     sleep 2
     open http://localhost:3142 2>/dev/null || xdg-open http://localhost:3142 2>/dev/null
     echo "started board → http://localhost:3142"
   fi
   ```

3. Tell the user what they're looking at:
   - **Rows** = the 6 great-pm stages (Discover → Measure) + an **Unstaged / Ops**
     lane; **columns** = Backlog / In Progress / Done.
   - **Drag a card** across columns to change its status, or across rows to set its
     stage. **+ New issue** creates a beads task. All changes write straight to `bd`.
   - Right panel = pending gates, drafts, latest verdicts, brain.md. Top strip =
     verdict-derived metrics (cost is not instrumented yet).
   - Use the sidebar **Project** switcher to jump between any great-pm projects
     you've opened the board from.

## Notes

The board is fully self-contained in the plugin (`board/server.mjs` +
`board/public/`). It reads the same beads store + `.great-pm/` state the agents
write, and only mutates beads in direct response to your drag/click — never
autonomously.

## Reporting

- **DONE**: `DONE: great-pm board open at http://localhost:3142.`
- **BLOCKED**: when the board cannot start (node unavailable, port 3142 held by a
  non-board process). Include `tried` + `failed_because` + `need`.
