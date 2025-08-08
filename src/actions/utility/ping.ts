/**
 * Exporting an example action for the ping command.
 * This action responds with "Pong!" when the command is invoked.
 * This is a basic example of how to create a chat input command with this template.
 * You can modify or remove this action as needed.
 *
 * You can create folder structure like `src/actions/utility/ping.ts`
 * to organize your actions better, it'll be loaded automatically.
 *
 * Français : Exportation d'une action d'exemple pour la commande ping.
 * Cette action répond avec "Pong!" lorsque la commande est invoquée.
 * C'est un exemple de base de la façon de créer une commande d'entrée de chat avec ce modèle.
 * Vous pouvez modifier ou supprimer cette action selon vos besoins.
 *
 * Vous pouvez créer une structure de dossier comme `src/actions/utility/ping.ts`
 * pour mieux organiser vos actions, elle sera chargée automatiquement.
 */

import { Locale } from 'discord.js';
import { Action } from '../../typings'; // Importing the Action type to define the action structure with type safety
import { ActionType, CustomErrorType } from '../../typings/enum';
import { CustomError } from '../../errors/CustomError';

export default <Action<ActionType.ChatInput>>{
  /**
   * The identifier for this action.
   * This should be unique across all actions of the same type.
   * It is used to reference the action in the code and in Discord.
   *
   * Français : L'identifiant de cette action.
   * Cela doit être unique parmi toutes les actions du même type.
   * Il est utilisé pour référencer l'action dans le code et dans Discord.
   */
  identifier: 'ping',

  /**
   * The type of this action.
   * This indicates what kind of action it is, such as a chat input command.
   *
   * Français : Le type de cette action.
   * Cela indique quel type d'action il s'agit, comme une commande d'entrée de chat.
   */
  type: ActionType.ChatInput,

  /**
   * The data for this action.
   * This includes the name, description, and localizations for the command.
   * You can see more about it here https://discord.js.org/docs/packages/discord.js/14.21.0/ChatInputApplicationCommandData:Interface
   *
   * Français : Les données pour cette action.
   * Cela inclut le nom, la description et les localisations pour la commande.
   * Vous pouvez en savoir plus ici https://discord.js.org/docs/packages/discord.js/14.21.0/ChatInputApplicationCommandData:Interface
   */
  data: {
    name: 'ping',
    description: 'Replies with Pong!',
    descriptionLocalizations: {
      [Locale.French]: 'Répond avec Pong !',
      [Locale.German]: 'Antwortet mit Pong!',
      [Locale.SpanishES]: '¡Responde con Pong!',
      [Locale.Italian]: 'Risponde con Pong!',
      [Locale.PortugueseBR]: 'Responde com Pong!',
    },
  },

  /**
   * The callback function for this action.
   * This function is called when the action is invoked.
   *
   * Français : La fonction de rappel pour cette action.
   * Cette fonction est appelée lorsque l'action est invoquée.
   */
  callback: async (interaction) => {
    // Testing example of throwing a custom error
    throw new CustomError(CustomErrorType.EVENT_NOT_FOUND);

    await interaction.reply('Pong!');
  },

  /**
   * Tags for this action.
   * These can be used to categorize or filter actions.
   *
   * Français : Étiquettes pour cette action.
   * Celles-ci peuvent être utilisées pour catégoriser ou filtrer les actions.
   */
  tags: ['default', 'ping'],

  /**
   * Whether this action is disabled.
   * If true, the action will not be loaded or executed.
   *
   * Français : Si cette action est désactivée.
   * Si vrai, l'action ne sera pas chargée ou exécutée.
   */
  disabled: false,
};
