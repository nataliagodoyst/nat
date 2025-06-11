jest.mock('obsidian', () => ({
  App: class {},
  TFile: class {},
}), { virtual: true });

import { openReflection } from '../src/reflection';

describe('openReflection', () => {
  beforeEach(() => {
    (global as any).window = {
      moment: jest.fn(() => ({ format: () => '2024-01-01' })),
    };
  });

  afterEach(() => {
    delete (global as any).window;
  });

  test('creates folder when missing', async () => {
    const createFolder = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null) // folder check
      .mockReturnValueOnce(null); // file check
    const openFile = jest.fn();
    const app = {
      vault: { getAbstractFileByPath, create, createFolder },
      workspace: { getLeaf: jest.fn().mockReturnValue({ openFile }) },
    } as any;

    await openReflection(app);

    expect(createFolder).toHaveBeenCalledWith('Reflexoes');
    expect(create).toHaveBeenCalled();
    expect(openFile).toHaveBeenCalled();
  });

  test('ignores folder creation errors', async () => {
    const createFolder = jest.fn().mockRejectedValue(new Error('fail'));
    const create = jest.fn().mockResolvedValue({});
    const getAbstractFileByPath = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);
    const openFile = jest.fn();
    const app = {
      vault: { getAbstractFileByPath, create, createFolder },
      workspace: { getLeaf: jest.fn().mockReturnValue({ openFile }) },
    } as any;

    await openReflection(app);

    expect(createFolder).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    expect(openFile).toHaveBeenCalled();
  });
});
