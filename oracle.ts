import { App, Notice } from 'obsidian';

export interface OracleSettings {
    decks: Record<string, string[]>;
}

export function pullCard(app: App, settings: OracleSettings) {
    const deckNames = Object.keys(settings.decks || {});
    if (deckNames.length === 0) {
        new Notice('No oracle decks configured');
        return;
    }
    const deck = deckNames[0];
    const cards = settings.decks[deck];
    if (!cards || cards.length === 0) {
        new Notice(`Deck ${deck} is empty`);
        return;
    }
    const card = cards[Math.floor(Math.random() * cards.length)];
    new Notice(`${deck}: ${card}`);
}
