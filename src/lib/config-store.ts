import * as Const from './const';
import ConfigurationTargetPicker from './config-target-picker';
import * as vscode from 'vscode';
import {Highlight} from './entities/highlight';
import {pipe} from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

export default class ConfigStore {
    private readonly workspace: typeof vscode.workspace;
    private readonly configTargetPicker: ConfigurationTargetPicker;

    constructor(workspace: typeof vscode.workspace, configTargetPicker: ConfigurationTargetPicker) {
        this.workspace = workspace;
        this.configTargetPicker = configTargetPicker;
    }

    get highlightColors() {
        return this.get<string[]>('highlightColors');
    }

    get defaultHighlightColor() {
        return this.get<string>('defaultHighlightColor');
    }

    get defaultHighlightOpacity() {
        return this.get<string>('defaultHighlightOpacity');
    }

    get savedHighlights() {
        return this.get<Highlight[]>('savedHighlights');
    }

    get delayForRefreshingHighlight() {
        return this.get<number>('delayForRefreshingHighlight');
    }

    get useHighlightColorOnRuler() {
        return this.get<boolean>('useHighlightColorOnRuler');
    }

    get autoSelectDistinctiveTextColor() {
        return this.get<boolean>('autoSelectDistinctiveTextColor');
    }

    get enableIgnoreCase() {
        return this.get<boolean>('enableIgnoreCase');
    }

    get enableWholeMatch() {
        return this.get<boolean>('enableWholeMatch');
    }

    get hideStatusBarItems() {
        return this.get<boolean>('hideStatusBarItems');
    }

    private get<T>(configName: string) {
        const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.get(configName) as T;
    }

    // TODO: Move this to WorkspaceAdaptor
    async set(configName: string, configValue: any) {
        pipe(
            await this.configTargetPicker.pick(),
            O.map(target => {
                const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
                return extensionConfig.update(configName, configValue, target);
            })
        );
    }
}
