import { Interaction, Events as EventType } from 'discord.js';
import { Event } from '../typings';
import { ActionType } from '../typings/enum';
import { actions } from '..';

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
  identifier: 'interaction_auto_handler',
  type: EventType.InteractionCreate,

  callback: async (interaction) => {
    // Check if the interaction is valid and get the action type
    const type = getActionTypeFromInteraction(interaction);
    if (type === null) throw new Error(`Unknown interaction type: ${interaction.type}`);

    // Get the identifier for the action
    const identifier = getIdentifierFromInteraction(interaction);
    if (!identifier) throw new Error(`No identifier found for interaction type: ${type}`);

    // Retrieve the action from the actions manager
    const action = actions.get(type, identifier);
    if (!action) throw new Error(`No action found for type: ${type} and identifier: ${identifier}`);
    if (action?.disabled) throw new Error(`Action ${identifier} of type ${type} is disabled`);
    if (!action.callback) throw new Error(`Action ${identifier} of type ${type} has no callback defined`);

    // Execute the action's callback with the interaction
    await action.callback(interaction as any); // Use of `any` is to bypass type checking for the interaction, don't want to do multiple type checks here
  },
  tags: ['default', 'interaction', 'auto-handler'],
  disabled: false,
};
