# LoomNotes Companion

LoomNotes Companion integrates the LoomNotes workflow into Obsidian. It brings the Lumi assistant to your vault, helps you start a daily reflection note and lets you draw inspirational oracle cards.

## Key Features

- **Lumi Reflection Panel**: Open the command `LoomNotes: Refletir com Lumi` to show a modal with your note's word count and an option to draw a card.
- **Draw Oracle Cards**: `LoomNotes: Puxar Carta` inserts a random card (title, description and prompt) at the cursor position.
- **Daily Note Start**: Use `LoomNotes: Iniciar Dia` to create today's note in the configured folder and automatically open the Lumi panel.
- **Configurable Daily Folder**: Change the location of daily notes from the plugin settings.

## Installation

1. Download the latest release or clone this repository.
2. Copy `manifest.json`, `main.js` and `styles.css` to your vault folder at `.obsidian/plugins/loomnotes-companion/`.
3. Reload Obsidian and enable **LoomNotes Companion** in *Community Plugins*.

## Required External Plugins

The following plugins are recommended for automation and templates:

- **Templater** – create templates for your daily notes.
- **Dataview** – query and summarize notes and cards.
- **QuickAdd** – trigger LoomNotes commands through custom macros or hotkeys.

Install each plugin from Obsidian's community plugins gallery and follow their setup instructions.

## Usage

1. Run **LoomNotes: Iniciar Dia** to create or open today's note. The note begins with the question *Como você se sente hoje?*.
2. The Lumi modal opens. Click **Sortear Carta** if you want inspiration. The selected card appears in the modal.
3. At any time you can use **LoomNotes: Puxar Carta** to insert a card in the active note.
4. Adjust your daily note folder via **Settings → LoomNotes Companion**.

## Quick Start

1. Install LoomNotes Companion and the recommended plugins.
2. Restart Obsidian and enable all plugins.
3. Run `LoomNotes: Iniciar Dia` from the command palette.
4. Answer the prompt in the created note and use `LoomNotes: Puxar Carta` for extra insight.
5. Explore Templater or Dataview to organise your reflections.

## Styling

The plugin includes a small `styles.css` file that colors the Lumi modal and side
panel. If you prefer to use your own theme, remove this file from the plugin
folder to disable the default styles. You can also override the classes
`.loomnotes-modal`, `.loomnotes-panel` and `.loomnotes-button` in a snippet or
your theme to customize the appearance.

## Development

Install dependencies with `npm i` and start the watcher with `npm run dev`. Run the test suite with `npm test`.

## API Documentation

See [Obsidian API](https://github.com/obsidianmd/obsidian-api).
