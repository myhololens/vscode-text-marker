import {any, mock, mockType, verify, when} from '../../helpers/mock';

import {PatternAction} from '../../../lib/pattern/pattern-action';
import ToggleWholeMatchCommand from '../../../lib/commands/toggle-whole-match';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import {Decoration} from '../../../lib/entities/decoration';

suite('ToggleWholeMatchCommand', () => {

    test('it toggles partial/whole match of the decoration', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const decoration = mockType<Decoration>();
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle partial/whole match')).thenResolve(decoration);
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperator.updateDecorationWithPatternAction(decoration, PatternAction.TOGGLE_WHOLE_MATCH));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick(any())).thenResolve();
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
