import {any, mock, mockType, verify, when} from '../../helpers/mock';

import UnhighlightCommand from '../../../lib/commands/unhighlight';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import {Decoration} from '../../../lib/entities/decoration';

suite('UnhighlightCommand', () => {

    test('it removes one specified highlight', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const decoration = mockType<Decoration>({id: 'DECORATION_ID'});
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to remove highlight')).thenResolve(decoration);

        const command = new UnhighlightCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperator.removeDecoration('DECORATION_ID'));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick(any())).thenResolve();
        const command = new UnhighlightCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
