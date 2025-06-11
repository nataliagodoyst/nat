import { App, TFile } from 'obsidian';

export interface TemplaterPlugin {
  fuzzy_suggester?: {
    insert_template: () => void;
  };
  templater?: {
    write_template_to_file: (template: TFile, file: TFile) => Promise<void>;
    get_new_file_template_for_folder?: (folder: any) => string | undefined;
    get_new_file_template_for_file?: (file: TFile) => string | undefined;
  };
}

export function getTemplaterPlugin(app: App): TemplaterPlugin | null {
  const plugin = (app as any).plugins?.getPlugin?.('templater-obsidian');
  return plugin ? (plugin as unknown as TemplaterPlugin) : null;
}

export function isTemplaterEnabled(app: App): boolean {
  return getTemplaterPlugin(app) != null;
}

export function showTemplatePicker(app: App): boolean {
  const tpl = getTemplaterPlugin(app);
  if (tpl && tpl.fuzzy_suggester?.insert_template) {
    tpl.fuzzy_suggester.insert_template();
    return true;
  }
  return false;
}

export async function applyTemplateToFile(app: App, file: TFile): Promise<boolean> {
  const plugin = getTemplaterPlugin(app) as any;
  const templater = plugin?.templater;
  if (!templater?.write_template_to_file) return false;
  const match =
    templater.get_new_file_template_for_folder?.(file.parent) ||
    templater.get_new_file_template_for_file?.(file);
  if (!match) return false;
  const tplFile = app.vault.getAbstractFileByPath(match) as TFile;
  if (!tplFile) return false;
  try {
    await templater.write_template_to_file(tplFile, file);
    return true;
  } catch {
    return false;
  }
}
