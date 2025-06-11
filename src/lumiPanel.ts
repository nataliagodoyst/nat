import { ItemView, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { drawCards } from './oracle';

export const VIEW_TYPE_LUMI = 'lumi-panel';

export class LumiPanel extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_LUMI;
  }

  getDisplayText(): string {
    return 'Lumi';
  }

  onOpen(): void {
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
      const [card] = drawCards(1);
      container.createEl('h2', { text: card.title });
      container.createEl('p', { text: card.description });
      container.createEl('em', { text: card.prompt });
    };
  }

  onClose(): void {
    const container = this.containerEl.children[1];
    container.empty();
  }
}
