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
import { drawCards, defaultDeck, OracleCard } from './src/oracle';
import { LumiPanel, VIEW_TYPE_LUMI } from './src/lumiPanel';
import { isTemplaterEnabled, showTemplatePicker } from './src/templaterHelper';
import { openReflection } from './src/reflection';
import { promptAndStartProject } from './src/project';
import { updateIcons } from './src/iconize';

interface LoomNotesSettings {
  dailyFolder: string;
  deckJSON: string;
}

const DEFAULT_SETTINGS: LoomNotesSettings = {
  dailyFolder: 'Diario',
  deckJSON: '',
};

export default class LoomNotesCompanion extends Plugin {
  settings: LoomNotesSettings;
  deck: OracleCard[] = defaultDeck;

  async onload() {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_LUMI, (leaf) => new LumiPanel(leaf, this.deck));

    this.addCommand({
      id: 'open-lumi',
      name: 'LoomNotes: Refletir com Lumi',
      callback: () => new LumiModal(this.app, this.deck).open(),
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
        const [card] = drawCards(1, this.deck);
        view.editor.replaceSelection(`**${card.title}** - ${card.description}\n_${card.prompt}_\n`);
      },
    });

    this.addCommand({
      id: 'loomnotes-start-day',
      name: 'LoomNotes: Iniciar Dia',
      callback: () => this.startDay(),
    });

    this.addCommand({
      id: 'loomnotes-open-reflection',
      name: 'LoomNotes: Abrir Reflexão',
      callback: () => openReflection(this.app),
    });

    this.addCommand({
      id: 'loomnotes-start-project',
      name: 'LoomNotes: Iniciar Projeto',
      callback: () => promptAndStartProject(this.app),
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
    updateIcons(this.app, { [folder]: 'calendar' });
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.openFile(file);
    if (isTemplaterEnabled(this.app)) {
      showTemplatePicker(this.app);
    }
    new LumiModal(this.app, this.deck).open();
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
    try {
      const deck = this.settings.deckJSON ? JSON.parse(this.settings.deckJSON) : null;
      if (Array.isArray(deck)) {
        this.deck = deck;
      } else {
        this.deck = defaultDeck;
      }
    } catch {
      this.deck = defaultDeck;
    }
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

    new Setting(containerEl)
      .setName('Baralho personalizado')
      .setDesc('Cole o JSON de cartas para substituir o baralho padrão')
      .addTextArea((text) =>
        text
          .setPlaceholder('[{"title":"Sol"}]')
          .setValue(this.plugin.settings.deckJSON)
          .onChange(async (value) => {
            this.plugin.settings.deckJSON = value;
            await this.plugin.saveSettings();
            await this.plugin.loadSettings();
          })
      );
  }
}
