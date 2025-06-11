jest.mock('obsidian', () => ({
  Plugin: class {},
  PluginSettingTab: class {},
  Modal: class {},
  ItemView: class {},
  WorkspaceLeaf: class {},
  App: class {},
  MarkdownView: class {},
  Notice: class {},
  Setting: class {
    setName() { return this; }
    setDesc() { return this; }
    addText() { return this; }
    addTextArea() { return this; }
  },
  TFile: class {},
}), { virtual: true });

import LoomNotesCompanion from '../main';
import { OracleCard } from '../src/oracle';

class TestPlugin extends LoomNotesCompanion {
  constructor() {
    super({} as any, {} as any);
  }
}

test('loadSettings parses custom deck JSON', async () => {
  const deck: OracleCard[] = [{ title: 'X', description: 'Y', prompt: 'Z' }];
  const plugin = new TestPlugin();
  plugin.loadData = jest.fn().mockResolvedValue({ deckJSON: JSON.stringify(deck) });
  await plugin.loadSettings();
  expect(plugin.deck).toEqual(deck);
});

test('saveSettings persists folder and custom deck', async () => {
  const deck: OracleCard[] = [{ title: '1', description: '2', prompt: '3' }];
  const plugin = new TestPlugin();
  let stored: any = {};
  plugin.loadData = jest.fn().mockResolvedValue({});
  plugin.saveData = jest.fn(async (data) => {
    stored = data;
  });

  await plugin.loadSettings();
  plugin.settings.dailyFolder = 'Journal';
  plugin.settings.deckJSON = JSON.stringify(deck);

  await plugin.saveSettings();

  plugin.loadData = jest.fn().mockResolvedValue(stored);
  await plugin.loadSettings();

  expect(plugin.settings.dailyFolder).toBe('Journal');
  expect(plugin.settings.deckJSON).toBe(JSON.stringify(deck));
  expect(plugin.deck).toEqual(deck);
});
