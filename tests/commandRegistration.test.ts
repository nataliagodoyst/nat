jest.mock('../src/lumiModal', () => ({
  __esModule: true,
  LumiModal: jest.fn().mockImplementation(() => ({ open: jest.fn() })),
}));

jest.mock('../src/oracle', () => ({
  drawCards: jest.fn(),
  defaultDeck: [],
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

export {};

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

const LoomNotesCompanion = require('../main').default;
const { LumiModal } = require('../src/lumiModal');
const { drawCards } = require('../src/oracle');
const { openReflection } = require('../src/reflection');
const { promptAndStartProject } = require('../src/project');

describe('command registration', () => {
  class TestPlugin extends LoomNotesCompanion {
    constructor(app: any) {
      super({} as any, {} as any);
      this.app = app as any;
    }
  }

  const setupPlugin = (app: any = {}) => {
    const plugin = new TestPlugin(app);
    plugin.addCommand = jest.fn();
    plugin.registerView = jest.fn();
    plugin.addSettingTab = jest.fn();
    plugin.loadSettings = jest.fn();
    return plugin;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loomnotes-start-day command triggers startDay', async () => {
    const plugin = setupPlugin({});
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
    const plugin = setupPlugin({});
    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'open-lumi'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(LumiModal).toHaveBeenCalledWith(plugin.app, plugin.deck);
    const modal = (LumiModal as jest.Mock).mock.results[0].value;
    expect(modal.open).toHaveBeenCalled();
  });

  test('toggle-lumi-panel command triggers toggleLumiPanel', async () => {
    const plugin = setupPlugin({});
    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'toggle-lumi-panel'
    );
    expect(call).toBeDefined();

    plugin.toggleLumiPanel = jest.fn();
    call[0].callback();
    expect(plugin.toggleLumiPanel).toHaveBeenCalled();
  });

  test('loomnotes-draw-card inserts drawn card into note', async () => {
    const card = { title: 'T', description: 'D', prompt: 'P' };
    (drawCards as jest.Mock).mockReturnValue([card]);
    const replaceSelection = jest.fn();
    const plugin = setupPlugin({
      workspace: {
        getActiveViewOfType: jest.fn(() => ({ editor: { replaceSelection } })),
      },
    });

    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-draw-card'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(drawCards).toHaveBeenCalledWith(1, plugin.deck);
    expect(replaceSelection).toHaveBeenCalledWith(
      `**${card.title}** - ${card.description}\n_${card.prompt}_\n`
    );
  });

  test('loomnotes-open-reflection command invokes openReflection', async () => {
    const plugin = setupPlugin({});
    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-open-reflection'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(openReflection).toHaveBeenCalledWith(plugin.app);
  });

  test('loomnotes-start-project command invokes promptAndStartProject', async () => {
    const plugin = setupPlugin({});
    await plugin.onload();

    const call = (plugin.addCommand as jest.Mock).mock.calls.find(
      ([cmd]) => cmd.id === 'loomnotes-start-project'
    );
    expect(call).toBeDefined();

    call[0].callback();
    expect(promptAndStartProject).toHaveBeenCalledWith(plugin.app);
  });
});
