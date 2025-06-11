
jest.mock('../src/lumiModal', () => ({
  __esModule: true,
  LumiModal: jest.fn().mockImplementation(() => ({ open: jest.fn() })),
}));

jest.mock('../src/lumiPanel', () => ({
  VIEW_TYPE_LUMI: 'lumi-panel',
  LumiPanel: jest.fn(),
}));

jest.mock('../src/iconize', () => ({
  updateIcons: jest.fn(),
}));

jest.mock('../src/templaterHelper', () => ({
  isTemplaterEnabled: jest.fn(),
  showTemplatePicker: jest.fn(),
}));

jest.mock('../src/reflection', () => ({
  openReflection: jest.fn(),
}));

jest.mock('../src/project', () => ({
  promptAndStartProject: jest.fn(),
}));

jest.mock('../src/oracle', () => ({
  drawCards: jest.fn(),
  defaultDeck: [{ title: 'T', description: 'D', prompt: 'P' }],
}));

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

import LoomNotesCompanion from '../main.ts';
import { LumiModal } from '../src/lumiModal';
import { drawCards } from '../src/oracle';
import { openReflection } from '../src/reflection';
import { promptAndStartProject } from '../src/project';

describe('command registration', () => {
  class TestPlugin extends LoomNotesCompanion {
    constructor(app: any) {
      super({} as any, {} as any);
      this.app = app as any;
    }
  }

  test('loomnotes-start-day command triggers startDay', async () => {
    const plugin = new TestPlugin({});
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-start-day'
    );
    expect(call).toBeDefined();

    plugin.startDay = jest.fn();
    call[0].callback();
    expect(plugin.startDay).toHaveBeenCalled();
  });

  test('open-lumi command opens LumiModal', async () => {
    const plugin = new TestPlugin({});
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'open-lumi'
    );
    expect(call).toBeDefined();

    call[0].callback();
    const results = (LumiModal as jest.Mock).mock.results;
    const modal = results[results.length - 1].value;
    expect(modal.open).toHaveBeenCalled();
  });

  test('toggle-lumi-panel command triggers toggleLumiPanel', async () => {
    const plugin = new TestPlugin({});
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'toggle-lumi-panel'
    );
    expect(call).toBeDefined();

    plugin.toggleLumiPanel = jest.fn();
    call[0].callback();
    expect(plugin.toggleLumiPanel).toHaveBeenCalled();
  });

  test('loomnotes-draw-card command inserts card', async () => {
    const replaceSelection = jest.fn();
    const view = { editor: { replaceSelection } };
    (drawCards as jest.Mock).mockReturnValue([
      { title: 'X', description: 'Y', prompt: 'Z' },
    ]);
    const plugin = new TestPlugin({
      workspace: { getActiveViewOfType: jest.fn(() => view) },
    });
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-draw-card'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(replaceSelection).toHaveBeenCalledWith(
      '**X** - Y\n_Z_\n'
    );
  });

  test('loomnotes-open-reflection command invokes openReflection', async () => {
    const plugin = new TestPlugin({});
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-open-reflection'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(openReflection).toHaveBeenCalledWith(plugin.app);
  });

  test('loomnotes-start-project command invokes promptAndStartProject', async () => {
    const plugin = new TestPlugin({});
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-start-project'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(promptAndStartProject).toHaveBeenCalledWith(plugin.app);
  });
});
