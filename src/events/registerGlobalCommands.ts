/**
 * This event registers global commands when the client is ready.
 * It filters actions based on their type, enabled status, and data presence,
 * then registers them as global commands in the Discord application.
 *
 * Français : Cet événement enregistre les commandes globales lorsque le client est prêt.
 * Il filtre les actions en fonction de leur type, de leur statut activé et de la
 * présence de données, puis les enregistre en tant que commandes globales dans l'application Discord.
 */

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

    /**
     * Filters the actions to find those that are valid for global command registration.
     * It checks if the action type is one of ChatInput, MessageContext, or UserContext,
     * if the action is not disabled, and if it has data defined.
     *
     * Français : Filtre les actions pour trouver celles qui sont valides pour l'enregistrement des commandes globales.
     * Il vérifie si le type d'action est l'un des types ChatInput, MessageContext ou UserContext,
     * si l'action n'est pas désactivée et si elle a des données définies.
     */
    const registered = actions.all.filter((action) => {
      const isValidType = [ActionType.ChatInput, ActionType.MessageContext, ActionType.UserContext].includes(
        action.type
      );
      const isEnabled = !action.disabled;
      const hasData = action.data;

      return isValidType && isEnabled && hasData;
    });

    /**
     * Registers the filtered actions as global commands in the Discord application.
     * It uses the `set` method to update the global commands with the data from each action.
     *
     * Français : Enregistre les actions filtrées en tant que commandes globales dans l'application Discord.
     * Il utilise la méthode `set` pour mettre à jour les commandes globales avec les données de chaque action.
     */
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
};
