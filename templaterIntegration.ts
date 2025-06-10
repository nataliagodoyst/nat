import { App, Notice } from 'obsidian';

export async function suggestTemplate(app: App) {
    const plugin = (app as any).plugins?.plugins?.['templater-obsidian'];
    if (plugin && plugin.fuzzy_suggester) {
        plugin.fuzzy_suggester.create_new_note_from_template();
    } else {
        new Notice('Templater plugin not found');
    }
}
