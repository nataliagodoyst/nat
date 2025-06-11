jest.mock('obsidian', () => ({
  App: class {},
  Modal: class {
    app: any;
    constructor(app?: any) {
      this.app = app;
    }
    contentEl = {
      empty: jest.fn(),
      addClass: jest.fn(),
      createDiv: () => ({ createEl: jest.fn() }),
      createEl: jest.fn(() => ({ createEl: jest.fn() })),
    };
  },
  MarkdownView: class {},
}), { virtual: true });

import { LumiModal } from '../src/lumiModal';
import { defaultDeck } from '../src/oracle';

describe('LumiModal conversation', () => {
  test('maintains message history when drawing multiple cards', () => {
    const app = {
      workspace: {
        getActiveViewOfType: jest.fn(() => ({ editor: { getValue: () => '' } })),
      },
    } as any;
    const modal = new LumiModal(app, defaultDeck);
    modal.onOpen();
    expect((modal as any).messages.length).toBe(1);
    (modal as any).draw(2);
    expect((modal as any).messages.length).toBe(3);
  });
});
