import { ItemView, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { drawCards, OracleCard, defaultDeck } from './oracle';
import { getSuggestions } from './context';

interface Message {
  sender: 'user' | 'lumi';
  text: string;
}

export const VIEW_TYPE_LUMI = 'lumi-panel';

export class LumiPanel extends ItemView {
  deck: OracleCard[];
  messages: Message[] = [];
  countInput: HTMLInputElement | null = null;
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
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.addClass('loomnotes-panel');
    this.addLumiMessage('Olá, eu sou Lumi ✨');
    this.render();
  }

  async onClose(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
  }

  private addLumiMessage(text: string) {
    this.messages.push({ sender: 'lumi', text });
  }

  private addUserMessage(text: string) {
    this.messages.push({ sender: 'user', text });
  }

  private draw(count: number) {
    const cards = drawCards(count, this.deck);
    cards.forEach((card) =>
      this.addLumiMessage(`${card.title} - ${card.description}\n${card.prompt}`)
    );
  }

  private render() {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();

    const active = this.app.workspace.getActiveViewOfType(MarkdownView);
    const text = active?.editor.getValue() || '';
    const words = text.split(/\s+/).filter(Boolean).length;

    this.messages.forEach((m) => {
      container.createEl('p', { text: `${m.sender === 'lumi' ? 'Lumi' : 'Você'}: ${m.text}` });
    });

    container.createEl('p', { text: `Sua nota possui ${words} palavras.` });

    const suggestions = getSuggestions(text);
    if (suggestions.length) {
      container.createEl('h4', { text: 'Sugestões:' });
      const list = container.createEl('ul');
      suggestions.forEach((s) => list.createEl('li', { text: s }));
    }

    this.countInput = container.createEl('input', {
      type: 'number',
      value: '1',
      attr: { min: '1', max: '3' },
    });
    const button = container.createEl('button', {
      text: 'Sortear Carta',
      cls: 'loomnotes-button',
    });
    button.onclick = () => {
      const count = parseInt(this.countInput?.value || '1', 10) || 1;
      this.draw(count);
      this.render();
    };
  }
}
