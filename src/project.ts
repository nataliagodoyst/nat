import { App, TFile } from 'obsidian';
import { updateIcons } from './iconize';

export async function startProject(app: App, name: string, baseFolder = 'Projetos'): Promise<TFile | null> {
  if (!name) return null;
  const folderPath = `${baseFolder}/${name}`;
  if (!app.vault.getAbstractFileByPath(folderPath)) {
    try {
      await app.vault.createFolder(folderPath);
    } catch (e) {
      // ignore if folder exists or cannot be created
    }
  }
  updateIcons(app, { [baseFolder]: 'folder', [folderPath]: 'folder' });
  const path = `${folderPath}/index.md`;
  let file = app.vault.getAbstractFileByPath(path) as TFile;
  if (!file) {
    file = await app.vault.create(path, `# ${name}\n\nDescreva o objetivo do projeto.\n`);
  }
  const leaf = app.workspace.getLeaf(true);
  await leaf.openFile(file);
  return file;
}

export async function promptAndStartProject(app: App, baseFolder = 'Projetos'): Promise<TFile | null> {
  const name = window.prompt('Nome do projeto');
  if (!name) return null;
  return startProject(app, name, baseFolder);
}
