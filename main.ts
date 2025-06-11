import {
  App,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
} from 'obsidian';
import { LumiModal } from './src/lumiModal';
import { drawCards } from './src/oracle';
import { LumiPanel, VIEW_TYPE_LUMI } from './src/lumiPanel';

interface LoomNotesSettings {
  dailyFolder: string;
}

const DEFAULT_SETTINGS: LoomNotesSettings = {
  dailyFolder: 'Diario',
};

export default class LoomNotesCompanion extends Plugin {
  settings: LoomNotesSettings;

  async onload() {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_LUMI, (leaf) => new LumiPanel(leaf));

    this.addCommand({
      id: 'open-lumi',
      name: 'LoomNotes: Refletir com Lumi',
      callback: () => new LumiModal(this.app).open(),
    });

    this.addCommand({
      id: 'toggle-lumi-panel',
      name: 'LoomNotes: Alternar Painel Lumi',
      hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'L' }],
      callback: () => this.toggleLumiPanel(),
    });

    this.addCommand({
      id: 'loomnotes-draw-card',
      name: 'LoomNotes: Puxar Carta',
      callback: () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
          new Notice('Abra uma nota para inserir a carta');
          return;
        }
        const [card] = drawCards(1);
        view.editor.replaceSelection(`**${card.title}** - ${card.description}\n_${card.prompt}_\n`);
      },
    });

    this.addCommand({
      id: 'loomnotes-start-day',
      name: 'LoomNotes: Iniciar Dia',
      callback: () => this.startDay(),
    });

    this.addSettingTab(new LoomNotesSettingTab(this.app, this));
  }

  async startDay() {
    const date = window.moment().format('YYYY-MM-DD');
    const folder = this.settings.dailyFolder;
    const path = `${folder}/${date}.md`;
    let file = this.app.vault.getAbstractFileByPath(path) as TFile;
    if (!file) {
      file = await this.app.vault.create(path, `# ${date}\n\nComo você se sente hoje?\n`);
    }
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.openFile(file);
    new LumiModal(this.app).open();
  }

  async toggleLumiPanel() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_LUMI);
    if (leaves.length > 0) {
      leaves.forEach((l) => l.detach());
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE_LUMI, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_LUMI)
      .forEach((leaf) => leaf.detach());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class LoomNotesSettingTab extends PluginSettingTab {
  plugin: LoomNotesCompanion;

  constructor(app: App, plugin: LoomNotesCompanion) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Pasta de notas diárias')
      .setDesc('Local onde as notas diárias serão criadas')
      .addText((text) =>
        text
          .setPlaceholder('Diario')
          .setValue(this.plugin.settings.dailyFolder)
          .onChange(async (value) => {
            this.plugin.settings.dailyFolder = value || 'Diario';
            await this.plugin.saveSettings();
          })
      );
  }
}
