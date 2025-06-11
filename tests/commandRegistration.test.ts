import LoomNotesCompanion from '../main';

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
});
