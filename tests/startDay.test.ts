import { LumiModal } from '../src/lumiModal';
import { updateIcons } from '../src/iconize';
import { isTemplaterEnabled, showTemplatePicker } from '../src/templaterHelper';

jest.mock('../src/lumiModal', () => ({
  __esModule: true,
  LumiModal: jest.fn().mockImplementation(() => ({ open: jest.fn() })),
}));

jest.mock('../src/iconize', () => ({
  updateIcons: jest.fn(),
}));

jest.mock('../src/templaterHelper', () => ({
  isTemplaterEnabled: jest.fn(),
  showTemplatePicker: jest.fn(),
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

describe('startDay', () => {
  const date = '2024-01-01';
  const leaf = { openFile: jest.fn() };
  (global as any).window = { moment: () => ({ format: () => date }) } as any;

  class TestPlugin extends LoomNotesCompanion {
    constructor(app: any) {
      super({} as any, {} as any);
      this.app = app as any;
    }
  }

  test('creates folder when missing', async () => {
    const createFolder = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null) // folder check
      .mockReturnValueOnce(null); // file check
    const plugin = new TestPlugin({
      vault: { getAbstractFileByPath, createFolder, create },
      workspace: { getLeaf: jest.fn(() => leaf) },
    });
    plugin.settings = { dailyFolder: 'Diario', deckJSON: '' } as any;

    await plugin.startDay();

    expect(createFolder).toHaveBeenCalledWith('Diario');
    expect(create).toHaveBeenCalled();
  });

  test('ignores folder creation errors', async () => {
    const createFolder = jest.fn().mockRejectedValue(new Error('exists'));
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);
    const plugin = new TestPlugin({
      vault: { getAbstractFileByPath, createFolder, create },
      workspace: { getLeaf: jest.fn(() => leaf) },
    });
    plugin.settings = { dailyFolder: 'Diario', deckJSON: '' } as any;

    await expect(plugin.startDay()).resolves.not.toThrow();
    expect(create).toHaveBeenCalled();
  });

  test('opens file and shows template when templater enabled', async () => {
    (isTemplaterEnabled as jest.Mock).mockReturnValue(true);
    const createFolder = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);
    const openFile = jest.fn();
    const plugin = new TestPlugin({
      vault: { getAbstractFileByPath, createFolder, create },
      workspace: { getLeaf: jest.fn(() => ({ openFile })) },
    });
    plugin.settings = { dailyFolder: 'Diario', deckJSON: '' } as any;

    await plugin.startDay();

    const call = (create as jest.Mock).mock.calls[0];
    expect(call[0]).toBe(`Diario/${date}.md`);
    expect(call[1]).toContain(`# ${date}`);
    expect(call[1]).toContain('Como você se sente hoje?');
    expect(openFile).toHaveBeenCalled();
    expect(updateIcons).toHaveBeenCalledWith(plugin.app, { Diario: 'calendar' });
    expect(showTemplatePicker).toHaveBeenCalledWith(plugin.app);
    const modal = (LumiModal as jest.Mock).mock.results[0].value;
    expect(modal.open).toHaveBeenCalled();
  });
});
