import { App } from 'obsidian';

export interface TemplaterPlugin {
  fuzzy_suggester?: {
    insert_template: () => void;
  };
}

export function getTemplaterPlugin(app: App): TemplaterPlugin | null {
  const plugin = app.plugins.getPlugin('templater-obsidian');
  return plugin as unknown as TemplaterPlugin | null;
}

export function isTemplaterEnabled(app: App): boolean {
  return getTemplaterPlugin(app) !== null && getTemplaterPlugin(app) !== undefined;
}

export function showTemplatePicker(app: App): boolean {
  const tpl = getTemplaterPlugin(app);
  if (tpl && tpl.fuzzy_suggester?.insert_template) {
    tpl.fuzzy_suggester.insert_template();
    return true;
  }
  return false;
}
