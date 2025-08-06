import { actions } from '..';
import { Event } from '../typings';
import { ActionType, EventType } from '../typings/enum';

export default <Event<EventType.ClientReady>>{
  identifier: 'register_global_commands',
  type: EventType.ClientReady,

  callback: async (client) => {
    console.log('Registering global commands...');

    const registered = actions.all.filter((action) => {
      const isValidType = [ActionType.ChatInput, ActionType.MessageContext, ActionType.UserContext].includes(
        action.type
      );
      const isEnabled = !action.disabled;
      const hasData = action.data;

      return isValidType && isEnabled && hasData;
    });

    await client.application.commands.set(registered.map((action) => action.data));
  },

  disabled: false,
  tags: ['default', 'global_commands'],
};
