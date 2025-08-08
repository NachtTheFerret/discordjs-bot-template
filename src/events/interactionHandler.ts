/**
 * Auto-handler for Discord interactions.
 * This event listens for all interactions and automatically handles them based on their type and identifier.
 * It retrieves the corresponding action from the actions manager and executes its callback.
 *
 * Français :
 * Gestionnaire automatique des interactions Discord.
 * Cet événement écoute toutes les interactions et les gère automatiquement en fonction de leur type et de leur identifiant.
 * Il récupère l'action correspondante dans le gestionnaire d'actions et exécute sa fonction de rappel.
 */

import { Interaction, Events as EventType, MessageFlags } from 'discord.js';
import { Event } from '../typings'; // Importing the Event type to define the event structure with type safety
import { ActionType, CustomErrorType } from '../typings/enum';
import { actions } from '..'; // Récupère le gestionnaire d'actions
import { Logger } from '../services/Logger';
import { CustomError } from '../errors/CustomError';
import messages, { getCustomMessageContent } from '../utils/messages';

/**
 * Determines the action type from the interaction.
 * This function checks the type of interaction and returns the corresponding ActionType.
 *
 * Français :
 * Détermine le type d'action à partir de l'interaction.
 * Cette fonction vérifie le type d'interaction et renvoie le ActionType correspondant.
 */
const getActionTypeFromInteraction = (interaction: Interaction): ActionType | null => {
  if (interaction.isChatInputCommand()) return ActionType.ChatInput;
  if (interaction.isMessageContextMenuCommand()) return ActionType.MessageContext;
  if (interaction.isUserContextMenuCommand()) return ActionType.UserContext;
  if (interaction.isButton()) return ActionType.Button;
  if (interaction.isStringSelectMenu()) return ActionType.StringSelectMenu;
  if (interaction.isUserSelectMenu()) return ActionType.UserSelectMenu;
  if (interaction.isRoleSelectMenu()) return ActionType.RoleSelectMenu;
  if (interaction.isMentionableSelectMenu()) return ActionType.MentionableSelectMenu;
  if (interaction.isChannelSelectMenu()) return ActionType.ChannelSelectMenu;
  if (interaction.isModalSubmit()) return ActionType.ModalSubmit;
  if (interaction.isAutocomplete()) return ActionType.Autocomplete;
  return null;
};

/**
 * Retrieves the identifier from the interaction.
 * This function checks the type of interaction and returns the corresponding identifier.
 *
 * Français :
 * Récupère l'identifiant de l'interaction.
 * Cette fonction vérifie le type d'interaction et renvoie l'identifiant correspondant.
 */
const getIdentifierFromInteraction = (interaction: Interaction): string | null => {
  if (interaction.isChatInputCommand()) return interaction.commandName;
  if (interaction.isMessageContextMenuCommand()) return interaction.commandName;
  if (interaction.isUserContextMenuCommand()) return interaction.commandName;
  if (interaction.isButton()) return interaction.customId;
  if (interaction.isStringSelectMenu()) return interaction.customId;
  if (interaction.isUserSelectMenu()) return interaction.customId;
  if (interaction.isRoleSelectMenu()) return interaction.customId;
  if (interaction.isMentionableSelectMenu()) return interaction.customId;
  if (interaction.isChannelSelectMenu()) return interaction.customId;
  if (interaction.isModalSubmit()) return interaction.customId;
  if (interaction.isAutocomplete()) return interaction.commandName;
  return null;
};

export default <Event<EventType.InteractionCreate>>{
  /**
   * The identifier for this event.
   * This should be unique across all events.
   * It is used to reference the event in the code and in Discord.
   *
   * Français : L'identifiant de cet événement.
   * Cela doit être unique parmi tous les événements.
   * Il est utilisé pour référencer l'événement dans le code et dans Discord.
   */
  identifier: 'interaction_auto_handler',

  /**
   * The type of this event.
   * This indicates what kind of event it is, such as an interaction create event.
   *
   * Français : Le type de cet événement.
   * Cela indique quel type d'événement il s'agit, comme un événement d'interaction créée.
   */
  type: EventType.InteractionCreate,

  /**
   * The callback function for this event.
   * This function is called when the event is triggered.
   *
   * Français : La fonction de rappel pour cet événement.
   * Cette fonction est appelée lorsque l'événement est déclenché.
   */
  callback: async (interaction) => {
    const logger = new Logger({ interaction });

    try {
      /**
       * Check if the interaction is valid.
       * If the interaction is not valid, we throw an error.
       * This is necessary to ensure that we can handle the interaction correctly.
       *
       * Français : Vérifie si l'interaction est valide.
       * Si l'interaction n'est pas valide, nous lançons une erreur.
       * Ceci est nécessaire pour s'assurer que nous pouvons gérer l'interaction correctement.
       */
      const type = getActionTypeFromInteraction(interaction);
      if (type === null)
        throw logger.error(
          CustomErrorType.INTERACTION_TYPE_NOT_SUPPORTED,
          `Interaction type ${interaction.type} is not supported`
        );

      /**
       * Retrieve the identifier from the interaction.
       * If the identifier is not found, we throw an error.
       * This is necessary to ensure that we can find the corresponding action in the actions manager.
       *
       * Français : Récupère l'identifiant de l'interaction.
       * Si l'identifiant n'est pas trouvé, nous lançons une erreur.
       * Ceci est nécessaire pour s'assurer que nous pouvons trouver l'action correspondante dans le gestionnaire d'actions.
       */
      const identifier = getIdentifierFromInteraction(interaction);
      if (!identifier)
        throw logger.error(
          CustomErrorType.ACTION_NOT_FOUND,
          `No identifier found for interaction type ${type} and identifier ${identifier}`
        );

      /**
       * Retrieve the action from the actions manager.
       * If the action is not found, we throw an error.
       * Or if the action is disabled or has no callback defined, we throw an error.
       * This is necessary to ensure that we can execute the action's callback.
       *
       * Français : Récupère l'action dans le gestionnaire d'actions.
       * Si l'action n'est pas trouvée, nous lançons une erreur.
       * Ou si l'action est désactivée ou n'a pas de fonction de rappel définie, nous lançons une erreur.
       * Ceci est nécessaire pour s'assurer que nous pouvons exécuter la fonction de rappel de l'action.
       */
      const action = actions.get(type, identifier);

      logger.addContext('action', action);

      if (!action)
        throw logger.error(CustomErrorType.ACTION_NOT_FOUND, `Action ${identifier} of type ${type} not found`);
      if (action?.disabled)
        throw logger.error(CustomErrorType.ACTION_DISABLED, `Action ${identifier} of type ${type} is disabled`);
      if (!action.callback)
        throw logger.error(
          CustomErrorType.ACTION_WITHOUT_CALLBACK,
          `Action ${identifier} of type ${type} has no callback defined`
        );

      /**
       * Execute the action's callback with the interaction.
       * This is where the action's logic is executed.
       *
       * Français : Exécute la fonction de rappel de l'action avec l'interaction.
       * C'est ici que la logique de l'action est exécutée.
       */
      await action.callback(interaction as any); // Use of `any` is to bypass type checking for the interaction, don't want to do multiple type checks here
    } catch (error) {
      logger.addContext('error', error); // Add the error to the logger context for better debugging

      const locale = interaction.locale; // Get the locale from the interaction, this is used to retrieve the correct message for the error

      if (error instanceof CustomError) {
        const message =
          messages[error.code][locale] ||
          messages[error.code].default || // Fallback to the default message if the locale is not found
          messages.UNKNOWN_ERROR[locale] || // Fallback to the unknown error message if the error code is not found
          messages.UNKNOWN_ERROR.default; // Fallback to the default unknown error message

        // Get the content of the custom message based on the error code and locale
        const content = (await getCustomMessageContent(message, logger.getContext())) as string;
        if (interaction.isRepliable()) await interaction.reply({ content, flags: [MessageFlags.Ephemeral] });
      } else {
        const message = messages.UNKNOWN_ERROR[locale] || messages.UNKNOWN_ERROR.default;
        const content = (await getCustomMessageContent(message, logger.getContext())) as string;
        if (interaction.isRepliable()) await interaction.reply({ content, flags: [MessageFlags.Ephemeral] });
      }
    }
  },

  /**
   * Whether this event is disabled.
   * If true, the event will not be loaded or executed.
   *
   * Français : Si cet événement est désactivé.
   * Si vrai, l'événement ne sera pas chargé ou exécuté.
   */
  disabled: false,
};
