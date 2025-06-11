import { App, Modal, MarkdownView } from 'obsidian';
import { drawCards, OracleCard, defaultDeck } from './oracle';
import { getSuggestions } from './context';

interface Message {
  sender: 'user' | 'lumi';
  text?: string;
  card?: OracleCard;
}

export class LumiModal extends Modal {
  deck: OracleCard[];
  messages: Message[] = [];
  countInput: HTMLInputElement | null = null;
  constructor(app: App, deck: OracleCard[] = defaultDeck) {
    super(app);
    this.deck = deck;
  }

  onOpen(): void {
    this.contentEl.addClass('loomnotes-modal');
    this.addLumiMessage('Olá, eu sou Lumi ✨');
    this.render();
  }

  onClose(): void {
    this.messages = [];
    this.contentEl.empty();
  }

  private addLumiMessage(text: string) {
    this.messages.push({ sender: 'lumi', text });
  }

  private addLumiCard(card: OracleCard) {
    this.messages.push({ sender: 'lumi', card });
  }

  private addUserMessage(text: string) {
    this.messages.push({ sender: 'user', text });
  }

  private draw(count: number) {
    const cards = drawCards(count, this.deck);
    cards.forEach((card) => this.addLumiCard(card));
  }

  private render() {
    const { contentEl } = this;
    contentEl.empty();

    const active = this.app.workspace.getActiveViewOfType(MarkdownView);
    const text = active?.editor.getValue() || '';
    const words = text.split(/\s+/).filter(Boolean).length;

    const history = contentEl.createDiv();
    this.messages.forEach((m) => {
      if (m.card) {
        const cardEl = history.createDiv('oracle-card');
        cardEl.createEl('div', {
          text: m.card.title,
          cls: 'oracle-card-title',
        });
        cardEl.createEl('div', { text: m.card.description });
        cardEl.createEl('div', {
          text: m.card.prompt,
          cls: 'oracle-card-prompt',
        });
      } else if (m.text) {
        history.createEl('p', {
          text: `${m.sender === 'lumi' ? 'Lumi' : 'Você'}: ${m.text}`,
        });
      }
    });

    contentEl.createEl('p', { text: `Sua nota possui ${words} palavras.` });

    const suggestions = getSuggestions(text);
    if (suggestions.length) {
      contentEl.createEl('h4', { text: 'Sugestões:' });
      const list = contentEl.createEl('ul');
      suggestions.forEach((s) => list.createEl('li', { text: s }));
    }

    this.countInput = contentEl.createEl('input', {
      type: 'number',
      value: '1',
      attr: { min: '1', max: '3' },
      cls: 'loomnotes-input',
    });
    const button = contentEl.createEl('button', {
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
