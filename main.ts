import { App, ItemView, Plugin, PluginSettingTab, Setting, TFile, moment } from 'obsidian';
import LumiView, { LUMI_VIEW_TYPE } from './lumiView';
import { suggestTemplate } from './templaterIntegration';
import { pullCard, OracleSettings } from './oracle';
import { ensureFolders } from './folderManager';

interface LoomNotesSettings extends OracleSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: LoomNotesSettings = {
    mySetting: 'default',
    decks: { default: ['Yes', 'No', 'Maybe'] },
};

export default class LoomNotesPlugin extends Plugin {
    settings: LoomNotesSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(LUMI_VIEW_TYPE, leaf => new LumiView(leaf));

        this.addCommand({
            id: 'toggle-lumi',
            name: 'Toggle Lumi Panel',
            hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'L' }],
            callback: () => this.activateView(),
        });

        this.addCommand({
            id: 'new-note-template',
            name: 'Create note from template',
            callback: () => suggestTemplate(this.app),
        });

        this.addCommand({
            id: 'create-daily-note',
            name: 'Create Daily Note',
            callback: () => this.createDailyNote(),
        });

        this.addCommand({
            id: 'pull-oracle-card',
            name: 'Pull Oracle Card',
            callback: () => pullCard(this.app, this.settings),
        });

        this.addCommand({
            id: 'open-reflection-prompt',
            name: 'Open Reflection Prompt',
            callback: () => this.openReflectionPrompt(),
        });

        this.addCommand({
            id: 'initiate-project',
            name: 'Initiate Project',
            callback: () => this.initiateProject(),
        });

        await ensureFolders(this.app);
        this.addSettingTab(new LoomNotesSettingTab(this.app, this));
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(LUMI_VIEW_TYPE);
    }

    async activateView() {
        const { workspace } = this.app;
        const leaf = workspace.getLeavesOfType(LUMI_VIEW_TYPE).first();
        if (leaf) {
            workspace.revealLeaf(leaf);
            return;
        }
        const newLeaf = workspace.getRightLeaf(false);
        if (newLeaf) {
            await newLeaf.setViewState({ type: LUMI_VIEW_TYPE, active: true });
        }
    }

    async createDailyNote() {
        const date = moment().format('YYYY-MM-DD');
        const path = `Daily/${date}.md`;
        let file = this.app.vault.getAbstractFileByPath(path) as TFile;
        if (!file) {
            file = await this.app.vault.create(path, '');
        }
        await this.app.workspace.getLeaf(false).openFile(file);
    }

    async openReflectionPrompt() {
        const path = 'Prompts/Reflection.md';
        let file = this.app.vault.getAbstractFileByPath(path) as TFile;
        if (!file) {
            file = await this.app.vault.create(path, '# Reflection Prompt\n');
        }
        await this.app.workspace.getLeaf(false).openFile(file);
    }

    async initiateProject() {
        const base = 'Projects/New Project';
        if (!this.app.vault.getAbstractFileByPath(base)) {
            await this.app.vault.createFolder(base);
            await this.app.vault.create(`${base}/README.md`, '# New Project');
        }
        const file = this.app.vault.getAbstractFileByPath(`${base}/README.md`) as TFile;
        await this.app.workspace.getLeaf(false).openFile(file);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class LoomNotesSettingTab extends PluginSettingTab {
    plugin: LoomNotesPlugin;

    constructor(app: App, plugin: LoomNotesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text =>
                text
                    .setPlaceholder('Enter your secret')
                    .setValue(this.plugin.settings.mySetting)
                    .onChange(async (value) => {
                        this.plugin.settings.mySetting = value;
                        await this.plugin.saveSettings();
                    }));
    }
}
