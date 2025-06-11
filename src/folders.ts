import { App } from 'obsidian';
import { updateIcons } from './iconize';

export async function createFolderIfMissing(app: App, path: string, icon?: string): Promise<void> {
  if (!app.vault.getAbstractFileByPath(path)) {
    try {
      await app.vault.createFolder(path);
    } catch {
      // ignore if folder exists or cannot be created
    }
  }
  if (icon) {
    updateIcons(app, { [path]: icon });
  }
}

export async function suggestLoomNotesFolders(app: App): Promise<void> {
  const folders: Record<string, string> = {
    Diario: 'calendar',
    Reflexoes: 'pencil',
    Projetos: 'folder',
  };
  for (const [folder, icon] of Object.entries(folders)) {
    if (!app.vault.getAbstractFileByPath(folder)) {
      if (window.confirm(`Criar pasta '${folder}'?`)) {
        await createFolderIfMissing(app, folder, icon);
      }
    } else {
      updateIcons(app, { [folder]: icon });
    }
  }
}
