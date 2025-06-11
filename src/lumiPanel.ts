import { ItemView, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { drawCards, OracleCard, defaultDeck } from './oracle';

export const VIEW_TYPE_LUMI = 'lumi-panel';

export class LumiPanel extends ItemView {
  deck: OracleCard[];
  constructor(leaf: WorkspaceLeaf, deck: OracleCard[] = defaultDeck) {
    super(leaf);
    this.deck = deck;
  }

  getViewType(): string {
    return VIEW_TYPE_LUMI;
  }

  getDisplayText(): string {
    return 'Lumi';
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
    const active = this.app.workspace.getActiveViewOfType(MarkdownView);
    const text = active?.editor.getValue() || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    container.createEl('h2', { text: 'Olá, eu sou Lumi ✨' });
    container.createEl('p', { text: `Sua nota possui ${words} palavras.` });
    const button = container.createEl('button', { text: 'Sortear Carta' });
    button.onclick = () => {
      container.empty();
      const [card] = drawCards(1, this.deck);
      container.createEl('h2', { text: card.title });
      container.createEl('p', { text: card.description });
      container.createEl('em', { text: card.prompt });
    };
  }

  async onClose(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
  }
}
