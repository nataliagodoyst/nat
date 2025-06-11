import { App } from 'obsidian';

export interface IconizePlugin {
  addFolderIcon?: (path: string, icon: string) => void;
}

export function getIconizePlugin(app: App): IconizePlugin | null {
  const plugin =
    (app as any).plugins?.getPlugin?.('icon-folder') ??
    (app as any).plugins?.getPlugin?.('obsidian-icon-folder');
  return plugin ? (plugin as unknown as IconizePlugin) : null;
}

export function updateIcons(app: App, folders: Record<string, string>): void {
  const iconize = getIconizePlugin(app);
  if (!iconize?.addFolderIcon) return;
  for (const [path, icon] of Object.entries(folders)) {
    try {
      iconize.addFolderIcon(path, icon);
    } catch {
      // ignore errors from iconize
    }
  }
}
