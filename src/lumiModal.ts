import { App, Modal, MarkdownView } from 'obsidian';
import { drawCards, OracleCard, defaultDeck } from './oracle';

export class LumiModal extends Modal {
  deck: OracleCard[];
  constructor(app: App, deck: OracleCard[] = defaultDeck) {
    super(app);
    this.deck = deck;
  }

  onOpen(): void {
    const { contentEl } = this;
    const active = this.app.workspace.getActiveViewOfType(MarkdownView);
    const text = active?.editor.getValue() || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    contentEl.createEl('h2', { text: 'Olá, eu sou Lumi ✨' });
    contentEl.createEl('p', { text: `Sua nota possui ${words} palavras.` });
    const button = contentEl.createEl('button', { text: 'Sortear Carta' });
    button.onclick = () => {
      contentEl.empty();
      const [card] = drawCards(1, this.deck);
      contentEl.createEl('h2', { text: card.title });
      contentEl.createEl('p', { text: card.description });
      contentEl.createEl('em', { text: card.prompt });
    };
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
