import { App } from 'obsidian';

export async function ensureFolders(app: App) {
    const folders = ['Projects', 'Daily', 'Prompts'];
    for (const path of folders) {
        if (!app.vault.getAbstractFileByPath(path)) {
            await app.vault.createFolder(path);
        }
    }
    const iconize: any = (app as any).plugins?.plugins?.['iconize'];
    if (iconize?.api?.setFolderIcon) {
        iconize.api.setFolderIcon('Projects', 'briefcase');
        iconize.api.setFolderIcon('Daily', 'calendar');
        iconize.api.setFolderIcon('Prompts', 'message-square');
    }
}
