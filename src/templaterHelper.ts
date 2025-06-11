import { App } from 'obsidian';

export interface TemplaterPlugin {
  fuzzy_suggester?: {
    insert_template: () => void;
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
