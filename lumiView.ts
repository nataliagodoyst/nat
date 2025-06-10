import { ItemView, WorkspaceLeaf } from 'obsidian';

export const LUMI_VIEW_TYPE = 'lumi-view';

export default class LumiView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return LUMI_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Lumi';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();

        const chat = container.createDiv('lumi-chat');
        const input = container.createEl('input', { type: 'text', cls: 'lumi-input' });
        input.placeholder = 'Say something...';
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value.length > 0) {
                    chat.createDiv({ text: '> ' + value });
                    input.value = '';
                }
            }
        });
    }

    async onClose() {
        const container = this.containerEl.children[1];
        container.empty();
    }
}
