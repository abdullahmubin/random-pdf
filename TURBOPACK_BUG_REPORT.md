Turbopack Bug Report
====================

Summary
-------
Please paste this into a new issue at https://github.com/vercel/turbopack/issues (or the Next.js repo if they ask you to).

Error (copy from terminal)
--------------------------
Error [TurbopackInternalError]: range start index 2885749755 out of range for slice of length 735
    at <unknown> (TurbopackInternalError: range start index 2885749755 out of range for slice of length 735) {
  location: 'turbopack\\crates\\turbo-persistence\\src\\static_sorted_file.rs:411:46'
}

Environment & Diagnostics
-------------------------
Please fill these in and attach the outputs when filing the issue.

- OS: Windows (copy from `winver` or Settings)
- Node version: `node -v`
- npm version: `npm -v`
- Next/Turbopack version: `npm list next` or `npx next --version`
- Repo root path: (absolute path you ran `next dev` from)
- Browser (if relevant): N/A

Collect debug info
------------------
Run these and attach the outputs (or paste into the issue):

```bash
node -v
npm -v
npx next --version
npx envinfo --system --binaries --npmPackages next,react,react-dom --markdown
# capture package.json
cat package.json
# capture next.config.js if present
cat next.config.js
# capture .env or relevant env vars (don't leak secrets)
# capture the terminal output including the full stack trace
```

Reproduction steps (what I did)
------------------------------
List the exact steps you ran that produced the error (example):

1. Clone my project (or point to repo/zip): (provide link or attach a zip)
2. From project root run: `cd frontend` (or the folder containing the Next app)
3. Run: `npm run dev` (or `next dev`)
4. Observe: turbopack prints the error and dev server exits.

What I tried to fix (already done)
---------------------------------
- Deleted `.next` and removed ` .next/dev/lock` if present
- Cleared npm cache: `npm cache clean --force`
- Restarted machine
- Confirmed files in `frontend/public` and `app` unchanged

Important files to attach
-------------------------
- `package.json` (root and `frontend/package.json` if monorepo)
- `next.config.js` (if present)
- `frontend/app/globals.css` and `frontend/app/layout.js` (recent edits may be relevant)
- Full terminal log showing the Turbopack stack trace

Minimal reproduction (recommended)
----------------------------------
If possible, create a minimal repo that reproduces the failure:

1. Make a copy of your `frontend` app to a new folder.
2. Remove unrelated pages/components until only the bare `app` folder and `package.json` remain.
3. Try `npm run dev` — if the error still appears, zip this folder and attach.

Suggested GitHub issue body (paste/attach files)
------------------------------------------------
Title: TurbopackInternalError: range start index ... out of range for slice of length ... (Windows)

Body:
```
# Summary
When running `next dev` using Turbopack, the dev server crashes with a TurbopackInternalError:

Error [TurbopackInternalError]: range start index 2885749755 out of range for slice of length 735
    at <unknown> (TurbopackInternalError: range start index 2885749755 out of range for slice of length 735) {
  location: 'turbopack\\crates\\turbo-persistence\\src\\static_sorted_file.rs:411:46'
}

# Environment
(Include outputs from commands listed above)

# Steps to reproduce
(Exact steps and the repo or a zip attached)

# What I tried
- Deleted `.next`
- Removed ` .next/dev/lock`
- Restarted dev server
- Cleared `npm` cache

# Attachments
- `package.json`
- `next.config.js`
- `frontend/app/globals.css`
- `frontend/app/layout.js`
- Full terminal log
```

Notes/Help
----------
- If you'd like, I can prepare the `package.json`, `next.config.js`, and the minimal reproduction zip from your workspace (you must confirm which folder to use and whether to include private data).
- If you want me to open the issue on your behalf, I cannot post to GitHub directly from here, but I can prepare the issue markdown in the repo for you to paste.


---
Generated at: (please add date/time)
