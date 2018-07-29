
export default class HighlightPatternPicker {
    private readonly _decorationRegistry: any;
    private readonly _windowComponent: any;

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._windowComponent = params.windowComponent;
    }

    pick(placeHolderText) {
        const decorations = this._decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this._showPicker(decorations, placeHolderText) :
            this._showNoItemMessage();
    }

    private async _showPicker(decorations, placeHolderText) {
        const selectItems = this._buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        const item = await this._windowComponent.showQuickPick(selectItems, options);
        return item ? item.id : null;
    }

    private _buildQuickPickItems(decorations) {
        return decorations.map(decoration => ({
            id: decoration.id,
            label: decoration.pattern.displayText,
            detail: this._buildDetail(decoration.pattern)
        }));
    }

    private _buildDetail(pattern) {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        const wholeMatchSuffix = pattern.wholeMatch ? ' [Ab|]' : '';
        return `${pattern.type}${caseSuffix}${wholeMatchSuffix}`;
    }

    private _showNoItemMessage() {
        return this._windowComponent.showInformationMessage('No highlight is registered yet');
    }

}
