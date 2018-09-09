import {mock, verify, when} from '../../helpers/mock';
import {PatternAction} from '../../../lib/pattern/pattern-action';
import ToggleCaseSensitivityCommand from '../../../lib/commands/toggle-case-sensitivity';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationOperator from '../../../lib/decoration/decoration-operator';

suite('ToggleCaseSensitivityCommand', () => {

    suite('When text is selected', () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const highlightPatternPicker = mock(DecorationPicker);
        when(highlightPatternPicker.pick('Select a pattern to toggle case sensitivity')).thenResolve('DECORATION_ID');

        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, highlightPatternPicker);

        test('it toggles case sensitivity of the decoration', async () => {
            await command.execute();

            verify(decorationOperator.updateDecorationWithPatternAction('DECORATION_ID', PatternAction.TOGGLE_CASE_SENSITIVITY));
        });
    });

    suite('When text is NOT selected', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const highlightPatternPicker = mock(DecorationPicker);
        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, highlightPatternPicker);

        test('it does nothing if text is not selected', async () => {
            await command.execute();

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });

});
