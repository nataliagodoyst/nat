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
