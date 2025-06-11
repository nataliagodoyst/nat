import { App, TFile } from 'obsidian';
import { updateIcons } from './iconize';
import { createFolderIfMissing } from './folders';
import { applyTemplateToFile } from './templaterHelper';

export async function startProject(app: App, name: string, baseFolder = 'Projetos', autoTemplate = false): Promise<TFile | null> {
  if (!name) return null;
  const folderPath = `${baseFolder}/${name}`;
  await createFolderIfMissing(app, folderPath);
  updateIcons(app, { [baseFolder]: 'folder', [folderPath]: 'folder' });
  const path = `${folderPath}/index.md`;
  let file = app.vault.getAbstractFileByPath(path) as TFile;
  if (!file) {
    file = await app.vault.create(path, `# ${name}\n\nDescreva o objetivo do projeto.\n`);
    if (autoTemplate) {
      await applyTemplateToFile(app, file);
    }
  }
  const leaf = app.workspace.getLeaf(true);
  await leaf.openFile(file);
  return file;
}

export async function promptAndStartProject(app: App, baseFolder = 'Projetos', autoTemplate = false): Promise<TFile | null> {
  const name = window.prompt('Nome do projeto');
  if (!name) return null;
  return startProject(app, name, baseFolder, autoTemplate);
}
