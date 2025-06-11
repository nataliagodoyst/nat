jest.mock('../src/iconize', () => ({
  updateIcons: jest.fn(),
}));

jest.mock('obsidian', () => ({
  App: class {},
  TFile: class {},
}), { virtual: true });

import { startProject } from '../src/project';
import { updateIcons } from '../src/iconize';

describe('startProject', () => {
  test('creates folder when missing', async () => {
    const createFolder = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null) // folder check
      .mockReturnValueOnce(null); // file check
    const openFile = jest.fn();
    const app = {
      vault: { getAbstractFileByPath, createFolder, create },
      workspace: { getLeaf: jest.fn(() => ({ openFile })) },
    } as any;

    await startProject(app, 'Test', 'Projetos');

    expect(createFolder).toHaveBeenCalledWith('Projetos/Test');
    expect(create).toHaveBeenCalled();
    expect(openFile).toHaveBeenCalled();
    expect(updateIcons).toHaveBeenCalled();
  });

  test('ignores folder creation errors', async () => {
    const createFolder = jest.fn().mockRejectedValue(new Error('exists'));
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);
    const openFile = jest.fn();
    const app = {
      vault: { getAbstractFileByPath, createFolder, create },
      workspace: { getLeaf: jest.fn(() => ({ openFile })) },
    } as any;

    await expect(startProject(app, 'Test', 'Projetos')).resolves.not.toThrow();

    expect(createFolder).toHaveBeenCalledWith('Projetos/Test');
    expect(create).toHaveBeenCalled();
    expect(openFile).toHaveBeenCalled();
  });
});
