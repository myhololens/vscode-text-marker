import * as Const from './const';
import CommandFactory from './command-factory';

export default class AppIntegrator {
    private readonly _commandFactory: CommandFactory;
    private readonly _vscode: any;

    static create(vscode, logger) {
        const commandFactory = new CommandFactory({vscode, logger});
        return new AppIntegrator({commandFactory, vscode});
    }

    constructor(params) {
        this._commandFactory = params.commandFactory;
        this._vscode = params.vscode;
    }

    integrate(context) {
        this._registerCommands(context);
        this._registerTextEditorCommands(context);
        this._registerEventListeners(context);
        this._prepareExtensionEventsDrivenItems();
        this._broadcastReady();
    }

    private _registerEventListeners(context) {
        const decorationRefresher = this._commandFactory.createDecorationRefresher();
        this._vscode.window.onDidChangeActiveTextEditor(
            decorationRefresher.refresh, decorationRefresher, context.subscriptions);
        this._vscode.workspace.onDidChangeTextDocument(
            decorationRefresher.refreshWithDelay, decorationRefresher, context.subscriptions);
    }

    private _registerCommands(context) {
        const factory = this._commandFactory;
        const commandMap = new Map([
            [`${Const.EXTENSION_ID}.highlightUsingRegex`, factory.createHighlightUsingRegex()],
            [`${Const.EXTENSION_ID}.clearAllHighlight`, factory.createRemoveAllHighlightsCommand()],
            [`${Const.EXTENSION_ID}.saveAllHighlights`, factory.createSaveAllHighlightsCommand()],
            [`${Const.EXTENSION_ID}.toggleCaseSensitivity`, factory.createToggleCaseSensitivityCommand()],
            [`${Const.EXTENSION_ID}.toggleModeForCaseSensitivity`, factory.createToggleCaseSensitivityModeCommand()],
            [`${Const.EXTENSION_ID}.toggleWholeMatch`, factory.createToggleWholeMatchCommand()],
            [`${Const.EXTENSION_ID}.toggleModeForWholeMatch`, factory.createToggleWholeMatchModeCommand()],
            [`${Const.EXTENSION_ID}.unhighlight`, factory.createUnhighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    private _registerTextEditorCommands(context) {
        const factory = this._commandFactory;
        const commandMap = new Map([
            [`${Const.EXTENSION_ID}.toggleHighlight`, factory.createToggleHighlightCommand()],
            [`${Const.EXTENSION_ID}.updateHighlight`, factory.createUpdateHighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerTextEditorCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    private _prepareExtensionEventsDrivenItems() {
        this._commandFactory.createSavedHighlightsRestorer();
        this._commandFactory.createToggleCaseSensitivityModeButton();
        this._commandFactory.createToggleWholeMatchModeButton();
    }

    private _broadcastReady() {
        this._commandFactory.getEventBus().emit(Const.Event.EXTENSION_READY);
    }

}
