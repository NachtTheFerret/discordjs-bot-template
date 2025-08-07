import { Events as EventType } from 'discord.js';
import { actions } from '..';
import { Event } from '../typings';
import { ActionType } from '../typings/enum';

export default <Event<EventType.ClientReady>>{
  identifier: 'register_global_commands',
  type: EventType.ClientReady,

  callback: async (client) => {
    console.log('');
    console.log(`\x1b[34m🔄 Registering global commands...\x1b[0m`);

    const registered = actions.all.filter((action) => {
      const isValidType = [ActionType.ChatInput, ActionType.MessageContext, ActionType.UserContext].includes(
        action.type
      );
      const isEnabled = !action.disabled;
      const hasData = action.data;

      return isValidType && isEnabled && hasData;
    });

    await client.application.commands.set(registered.map((action) => action.data));

    if (registered.size) {
      console.log(
        `\x1b[33m🌟 Successfully registered ${registered.size} global command${registered.size > 1 ? 's' : ''}.\x1b[0m`
      );
    } else {
      console.warn(`\x1b[33m⚠️  No global commands were registered.\x1b[0m`);
    }
  },

  disabled: false,
  tags: ['default', 'global_commands'],
};
