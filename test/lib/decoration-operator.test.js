
const DecorationOperator = require('../../lib/decoration-operator');

suite('DecorationOperator', () => {

    suite('#toggleDecoration', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                inquire: () => null,
                issue: stubWithArgs(['SELECTED_TEXT'], 'DECORATION_TYPE')
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.toggleDecoration('SELECTED_TEXT');

            expect(textDecorator.decorate).to.have.been.calledWith(
                editors, {SELECTED_TEXT: 'DECORATION_TYPE'}
            );
        });

        test('Selecting already selected text is de-highlights the selected strings', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                inquire: stubWithArgs(['SELECTED_TEXT'], 'DECORATION_TYPE'),
                revoke: sinon.spy()
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.toggleDecoration('SELECTED_TEXT');

            expect(textDecorator.undecorate).to.have.been.calledWith(
                editors, ['DECORATION_TYPE']
            );
        });
    });

    suite('#refreshDecorations', () => {

        test('it sets all currently active decorations to visible the given editor', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                retrieveAll: () => ({TEXT_1: 'DECORATION_TYPE_1', TEXT_2: 'DECORATION_TYPE_2'})
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.refreshDecorations();

            expect(textDecorator.decorate.args).to.eql([
                [editors, {TEXT_1: 'DECORATION_TYPE_1', TEXT_2: 'DECORATION_TYPE_2'}]
            ]);
        });
    });

    suite('#removeAllDecorations', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                revoke: sinon.spy(),
                retrieveAll: () => ({
                    text1: 'DECORATION_TYPE_1',
                    text2: 'DECORATION_TYPE_2'
                })
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator({decorationRegistry, textDecorator, editors});
            operator.removeAllDecorations();

            expect(decorationRegistry.revoke.args).to.eql([['text1'], ['text2']]);
            expect(textDecorator.undecorate).to.have.been.calledWith(
                ['EDITOR_1', 'EDITOR_2'],
                ['DECORATION_TYPE_1', 'DECORATION_TYPE_2']
            );
        });
    });
});