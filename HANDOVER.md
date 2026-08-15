# Habit Tracker - Detailed Project Handover Document

**To the Next AI Agent:**
Hello! I am handing over this project to you. Please read this document carefully before making ANY changes. Do not start from scratch, do not make assumptions, and do not break the existing functionality. 

## 1. Current State of the Project
- **Tech Stack:** Vanilla HTML/CSS/JavaScript (PWA/SPA hybrid), Firebase (Firestore + Auth), GitHub Pages.
- **Git Branch:** We are currently on the `perf-optimization` branch. **Stay on this branch** for the upcoming fixes. Do not push to `main` until the user explicitly tests and approves.
- **Recent Completion (P0):** 
  - I just completed **Priority 0 (P0)** of our performance optimization. 
  - I extracted all shared inline CSS across 7 files into `style.css` (approx 10KB).
  - I extracted shared UI JavaScript (theme toggler, mobile menu, modals) into `app.js`.
  - I removed all redundant Firebase CDN script imports across the site. All files now rely purely on `firebase-config.js` for initialization.
  - **IMPORTANT:** Page-specific CSS (like `.chart-container` in analytics or `.habit-card` in index) was intentionally left inline at the top of those specific HTML files to prevent breaking their unique designs. **Do not blindly delete inline `<style>` tags.**

## 2. The Core Problem Being Solved
The user reported that the **Dashboard page (`index.html`) is lagging heavily** when interacting with sliders, toggles, or inputting data. 
After a deep performance audit, I discovered the root cause: The app uses **destructive `innerHTML` updates**. Every time a user updates a single habit's progress, the entire dashboard is destroyed and re-rendered via `innerHTML`, causing massive layout thrashing and forcing the browser to recalculate the entire DOM tree.

## 3. What is Incomplete & Pending (Your Next Tasks)
You must execute these in order, confirming with the user after each step:

### Priority 1 (P1): Fix Destructive `innerHTML` Updates (CRITICAL)
- **Target:** `index.html` (Dashboard) and `setup-habits.html`.
- **The Fix:** Refactor the Javascript so that when a habit's progress changes, you only update the specific targeted DOM nodes (e.g., using `element.textContent`, `element.style.width`, or `classList.toggle`). 
- **DO NOT** rewrite the entire dashboard using `.innerHTML = htmlString` on every state change. 

### Priority 2 (P2): Third-Party Optimization & SVG Sprite Sheets
- The SVG icons are currently duplicated massively as inline `<svg>` code inside every habit card. 
- **The Fix:** Extract the common SVG icons (fire, checkmark, trends, etc.) into an SVG Sprite Sheet (`<svg><symbol>...</symbol></svg>`) and reference them using `<use href="#icon-id">`. This will heavily reduce the DOM size.

### Priority 3 (P3): Web Workers for Heavy Math (Optional but recommended)
- The app calculates streaks and averages on the main thread, which can block rendering.
- **The Fix:** Move the heavy streak/scoring calculations into a dedicated Web Worker if possible.

## 4. Pending Feature Requests from the User
Before we started the performance audit, the user requested two feature updates on the **Analytics Page (`analytics.html`)**:
1. **Dynamic Chart Dates:** When displaying a chart, the chart should start from the *actual start date* the user began tracking the habit, rather than defaulting to 30 days of empty data.
2. **Multi-Habit Average:** When multiple habits are selected in the charts, show the overall "Average Score" across those specific habits above the chart.

## 5. Rules of Engagement for the New Agent
- **Test Before Moving On:** Complete one Priority level at a time. Do not jump from P1 to P2 without asking the user to verify the Dashboard lag is fixed.
- **Do Not Break CSS:** The user loves the "Premium Glassmorphism" UI. Be extremely careful when editing HTML structures so you don't accidentally break the CSS grids, flexboxes, or backdrop-filters.
- **Analytics Dependency:** `analytics.html` relies on Apache ECharts (`echarts.min.js`).

Good luck! Start by asking the user if they want you to begin executing **P1 (innerHTML refactor)**.
