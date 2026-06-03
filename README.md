# Task Manager

A clean, fast browser-based task manager. Runs entirely client-side with `localStorage` persistence — no backend, no accounts, no tracking. Designed for daily task management as a small desktop PWA window.

**Live Demo:**

Full browser version:
[![Full](https://img.shields.io/badge/Dev-Full-blue)](https://runter-vom-mattenwagen.github.io/js-browsertasks/)<br>
Compact popup view:
[![Popup](https://img.shields.io/badge/Dev-Popup-orange)](https://runter-vom-mattenwagen.github.io/js-browsertasks/launcher.html)

## Features

- **Add tasks** with name, category, and optional due date
- **Category dropdown** with autocomplete from existing categories plus presets (🛒 🩺 💻 💰); arrow-key navigation, Enter to select
- **Category filter** to focus on one category at a time
- **Prioritize tasks** with a click on the category badge — prioritized tasks move to the top and are highlighted
- **Inline edit** of task name and category
- **Notes per task** — click the task text to open an inline note editor; saves on blur or Enter
- **Due dates** with relative display (heute, morgen, in N Tagen) and visual states for today (yellow) and overdue (red)
- **Done list** with item counter, collapsible, persisted between sessions
- **Bulk clear** of completed tasks via menu
- **Import/Export** as JSON file for backup or cross-device transfer
- **Dark mode** toggle with persistence and OS preference fallback
- **PWA-installable** as a standalone window

## Installation

```bash
git clone https://github.com/runter-vom-mattenwagen/js-browsertasks
cd js-browsertasks
```

Open `index.html` in any modern browser, or `launcher.html` for a pre-sized popup window. No build step, no dependencies.

## Usage

The intended workflow: open the app, type a task, hit Enter, done.

- **Add a task**: type the task name, type or pick a category, optionally pick a due date via the 📅 button, press Enter
- **Mark as priority**: click the category badge — task moves to the top and is highlighted
- **Add a note**: click the task text to open an inline editor; click again or press Enter to save
- **Edit**: click the ✏️ button to inline-edit name and category
- **Complete**: click the ✔ button — task moves to the Done list with completion date
- **Reactivate or delete**: in the Done list, ↩️ moves a task back, 🗑️ deletes (with confirmation)
- **Settings menu**: click the 📋 icon next to the heading for Import/Export, Clear Done, and dark mode toggle

## Technical

- **Vanilla JS**, no framework, no build step
- **Storage**: `localStorage`, key `tasks` (JSON array)
- **IDs**: `crypto.randomUUID()`
- **Date handling**: ISO `YYYY-MM-DD` strings, displayed in `de-DE` locale
- **Files**: `index.html`, `script.js`, `styles.css`, `darkmode.js`, `importExport.js`, `manifest.json`

## Acknowledgment

Developed with the assistance of **Claude** (Anthropic).

## License

Open source. Use, modify, adapt as needed.
