import { App, TFile } from 'obsidian';

export async function openReflection(app: App, folder = 'Reflexoes'): Promise<TFile> {
  const date = window.moment().format('YYYY-MM-DD');
  const path = `${folder}/${date}.md`;
  const folderExists = app.vault.getAbstractFileByPath(folder);
  if (!folderExists) {
    try {
      await app.vault.createFolder(folder);
    } catch {
      // ignore folder creation errors
    }
  }
  let file = app.vault.getAbstractFileByPath(path) as TFile;
  if (!file) {
    file = await app.vault.create(path, `# ${date}\n\nComo você se sente hoje?\n`);
  }
  const leaf = app.workspace.getLeaf(true);
  await leaf.openFile(file);
  return file;
}
