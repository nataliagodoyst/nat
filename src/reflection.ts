import { App, TFile } from 'obsidian';
import { createFolderIfMissing } from './folders';
import { applyTemplateToFile } from './templaterHelper';

export async function openReflection(app: App, folder = 'Reflexoes', autoTemplate = false): Promise<TFile> {
  const date = window.moment().format('YYYY-MM-DD');
  const path = `${folder}/${date}.md`;
  await createFolderIfMissing(app, folder);
  let file = app.vault.getAbstractFileByPath(path) as TFile;
  if (!file) {
    file = await app.vault.create(path, `# ${date}\n\nComo você se sente hoje?\n`);
    if (autoTemplate) {
      await applyTemplateToFile(app, file);
    }
  }
  const leaf = app.workspace.getLeaf(true);
  await leaf.openFile(file);
  return file;
}
