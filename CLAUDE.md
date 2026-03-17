# js-browsertasks — Browser Task Manager

Einfacher Task-Manager als Browser-App mit localStorage-Persistenz.

## Tech-Stack

- Vanilla HTML/CSS/JS — kein Build-Step, keine Dependencies
- Dateien: `index.html`, `styles.css`, `script.js`, `darkmode.js`, `importExport.js`
- Daten persistent in `localStorage`
- Launcher: `launcher.html` öffnet optimiertes Popup-Fenster
- Git-tracked, GitHub-Origin: runter-vom-mattenwagen/js-browsertasks

## Features (aktueller Stand)

- Tasks anlegen mit Name und Kategorie
- Kategorie-Filter
- Priorität (gelb, an Listenspitze) — Toggle via Klick auf Kategorie
- Tasks abschließen → separate Liste, reaktivierbar
- Edit bestehender Tasks
- Import/Export als Datei
- Dark Mode (`darkmode.js`)
- Auto-Cleanup: leere Kategorien werden entfernt
- Unique IDs via `Date.now()`

## Architektur

- `script.js`: Core-Logik (CRUD, Filtering, Rendering)
- `importExport.js`: JSON-basierter Export/Import
- `darkmode.js`: Theme-Toggle
- `manifest.json`: PWA-Manifest (Banana-Icon 🍌)

## Deployment

Direkt im nginx-Webroot — Dateien bearbeiten = sofort live unter:
https://www.claude.int/js-browsertasks/
