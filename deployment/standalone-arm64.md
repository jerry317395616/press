# Standalone ARM64 deployment (`press.myyr.top`)

This fork is deployed on an ARM64 host in a separate Bench at
`/home/zyd/frappe/press-bench`. It does not share the Frappe/ERPNext Bench,
database, Redis instances, or process ports used by `child.myyr.top`.
This document describes the existing installation; it is not an automatic
installer or a replacement for the upstream production guide.

## Layout

- Frappe 15 and Press run in `press-bench` (Python 3.11 and Node 22).
- The site is `press.myyr.top`; the Bench web server listens on
  `127.0.0.1:17820` and a dedicated Nginx proxy on `127.0.0.1:17083`.
- MariaDB and two Redis instances run in an isolated Docker Compose project
  under `/home/zyd/frappe/press-deployment`, bound to localhost only.
- User-level systemd units named `press-web`, `press-worker-default`,
  `press-worker-long`, `press-scheduler`, `press-socketio`, and `press-proxy`
  manage the application. The separate Socket.IO process uses a Unix socket.
- The existing Cloudflare tunnel forwards only `press.myyr.top` to the
  dedicated proxy. Other tunnel routes are unchanged.
- Generated database and Administrator passwords are held in mode-600 files
  under `/home/zyd/frappe/press-deployment/secrets`; never commit or log them.

## Dependency compatibility

This fork's Press dependencies are aligned with the installed Frappe 15.121
series. Semgrep 1.159 is in its own environment at
`/home/zyd/frappe/press-deployment/marketplace-audit-bench/env` because its
OpenTelemetry dependencies conflict with Frappe's. The Press `Marketplace
Settings.audit_bench_path` points to that environment.

The upstream `frappe-mcp` commit used by Press pins older Pydantic and
Werkzeug versions. Until upstream updates those pins, the local clone at
`/home/zyd/frappe/press-deployment/frappe-mcp` uses the small
[`frappe-mcp-frappe15.patch`](frappe-mcp-frappe15.patch) compatibility patch and
is installed editable with `--no-deps`. A full dependency reinstall of Press
may replace it: reapply the patch, reinstall the local clone, and run
`uv pip check` before restarting services. Do not install Semgrep in the
main Bench environment.

ARM64 has no compatible ChromeDriver in this installation. The post-migrate
browser sanity check therefore skips only when running on ARM64 without a
locally installed ChromeDriver. Other sanity checks and architectures retain
their previous behavior.

## Verification and updates

Run from `/home/zyd/frappe/press-bench` unless noted otherwise:

```sh
/home/zyd/.local/bin/bench --site press.myyr.top migrate
/home/zyd/.local/bin/uv pip check --python /home/zyd/frappe/press-bench/env/bin/python
systemctl --user status press-web press-worker-default press-worker-long press-scheduler press-socketio press-proxy
PRESS_HEALTHCHECK_BASE=https://press.myyr.top python3 /home/zyd/frappe/press-deployment/healthcheck.py
```

The health check logs in using the protected password file and reports only
status; it does not print credentials. To inspect the running deployment,
also check `https://press.myyr.top`. Press is the control plane; creating
managed customer sites additionally requires build and application servers,
cluster/VM records, and agents configured in Press.

Never run `bench update` against this or the existing production Bench.
Back up the site, update and test each app intentionally, build assets, migrate,
then restart only the dedicated `press-*` services. In particular, do not
reinstall the Press dependency set without checking the local `frappe-mcp`
compatibility patch described above.
