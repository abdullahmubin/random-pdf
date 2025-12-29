## Title
Turbopack panic: "range end index ... out of range for slice" when running `next dev`

## Summary
When starting the Next.js dev server (Turbopack) the runtime panics with:

```
thread 'tokio-runtime-worker' (PID) panicked at turbopack\crates\turbo-persistence\src\static_sorted_file.rs:412:31:
range end index 2093472455 out of range for slice of length 737
```

This produces a `TurbopackInternalError: range end index ... out of range for slice of length 737` and writes a panic log to a temporary file.

## Reproduction Steps
1. Clone the repo (or use the existing project).
2. In the `frontend` folder run:

PowerShell:

```powershell
cd frontend
# (optional) remove stale lock
if (Test-Path .next\dev\lock) { Remove-Item .next\dev\lock -Force }
$env:RUST_BACKTRACE=1
npm run dev
```

CMD:

```cmd
cd frontend
if exist .next\dev\lock del .next\dev\lock
set RUST_BACKTRACE=1 && npm run dev
```

On my machine the server panics during startup and writes a panic log to `%TEMP%` (e.g. `C:\Users\mubin\AppData\Local\Temp\next-panic-*.log`).

## Environment
- OS: Windows (user-reported)
- Next.js: 16.1.1
- React: 19.2.3
- framer-motion (installed during debugging)
- Tailwind/PostCSS present

(Attach output of `node -v`, `npm -v`, `npm ls --depth=0`, and `git rev-parse --abbrev-ref HEAD`.)

## Exact panic excerpt
```
thread 'tokio-runtime-worker' (37372) panicked at turbopack\crates\turbo-persistence\src\static_sorted_file.rs:412:31:
range end index 2093472455 out of range for slice of length 737  
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

-----
FATAL: An unexpected Turbopack error occurred. A panic log has been written to C:\Users\mubin\AppData\Local\Temp\next-panic-d9929b54a9ae189dbc65191406ea038b.log.

Error [TurbopackInternalError]: range end index 2093472455 out of range for slice of length 737
    at <unknown> (TurbopackInternalError: range end index 2093472455 out of range for slice of length 737) {
  location: 'turbopack\\crates\\turbo-persistence\\src\\static_sorted_file.rs:412:31'
}
```

## Attachments
- Please find and attach the panic log file from the machine (look in `%TEMP%` for `next-panic-*.log`).
- Optionally attach a minimal repro archive of the `frontend` directory.

## Additional panic excerpt (user-provided)

```
thread 'tokio-runtime-worker' (39736) panicked at C:\actions-runner\_work\next.js\next.js\turbopack\crates\turbo-tasks-backend\src\backend\operation\mod.rs:156:17:
Failed to restore task data (corrupted database or bug): Meta for entrypoints_without_collectibles_operation (TaskId 494))

Caused by:
    0: Looking up data for TaskId 494 from database failed       
    1: Unable to open static sorted file referenced from 00000092.meta
    2: Unable to open static sorted file 00000087.sst
    3: The system cannot find the file specified. (os error 2)   
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

This indicates Turbo's persistence storage referenced `.sst` files that are missing (os error 2). That can mean the persistence DB is corrupted or an earlier cleanup removed files.

Suggested next actions for maintainers and for repro:

- Reproduce with a full Rust backtrace and attach the panic log from `%TEMP%` (Windows):

  PowerShell:

  ```powershell
  cd frontend
  if (Test-Path .next\dev\lock) { Remove-Item .next\dev\lock -Force }
  $env:RUST_BACKTRACE=1
  npm run dev 2>&1 | tee next-dev-output.log
  # check %TEMP% for next-panic-*.log and attach it
  ```

  CMD:

  ```cmd
  cd frontend
  if exist .next\dev\lock del .next\dev\lock
  set RUST_BACKTRACE=1 && npm run dev 2>&1 | tee next-dev-output.log
  ```

- If the panic references missing `.sst` files in the persistence folder, try making a safe backup of the `.next` folder and retrying a clean dev start (this will remove Turbopack caches):

  ```powershell
  # backup .next, then remove it to force a fresh persistence
  Rename-Item -Path .next -NewName ".next.bak" -Force
  npm run dev
  ```

- Attach the produced `%TEMP%/next-panic-*.log` and `next-dev-output.log` to the issue. If you prefer, paste the full panic log here and I will add it to the repo as `TURBOPACK_PANIC_LOG.txt`.

Notes: removing `.next` clears build/persistence caches and often resolves corrupted cache issues; please back up before deleting so maintainers can inspect the original files if needed.

## New panic log saved in repo

I saved the latest panic excerpt into the repository: `TURBOPACK_PANIC_D61154.log` (contains the new "range start index ... out of range for slice" message). Please attach this file when filing the issue.

Excerpt from the saved file:

```
Error [TurbopackInternalError]: range start index 1689184338 out of range for slice of length 16743
    at <unknown> (TurbopackInternalError: range start index 1689184338 out of range for slice of length 16743) {
  location: 'turbopack\\crates\\turbo-persistence\\src\\static_sorted_file.rs:411:46'
}
```
## Notes / Workarounds tried
- Removed `.next/dev/lock` and retried.
- Restarted dev server (Next picked another port e.g. 3002).
- To reproduce full backtrace, set `RUST_BACKTRACE=1` before starting dev.
- Temporary workaround: run production build and start server with `npm run build && npm run start` if you need a working server while the issue is investigated (note: build/start path is not the same as dev; it may not hit the same code paths but avoids Turbopack dev-time code paths).

## Request
Please investigate the panic in `turbo-persistence::static_sorted_file` — it looks like an integer overflow or corrupted range calculation when indexing into an internal buffer. If helpful, I can attach the full panic log and a small repro archive.

---

(You can copy-paste this issue body into https://github.com/vercel/turbopack/issues/new)
