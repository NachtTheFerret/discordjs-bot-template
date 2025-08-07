import { ApplicationCommandOptionType } from 'discord.js';
import { Action } from '../../typings';
import { ActionType } from '../../typings/enum';
import { StringUtils } from '../../utils';

export default <Action<ActionType.ChatInput>>{
  /**
   * Converts a string to snake_case.
   * This function takes a string and converts it to snake_case format.
   *
   * Français : Convertit une chaîne de caractères en snake_case.
   * Cette fonction prend une chaîne de caractères et la convertit en format snake_case.
   */
  identifier: 'toSnakeCase',

  type: ActionType.ChatInput,

  data: {
    name: 'to-snake-case',
    description: 'Converts a string to snake_case.',

    options: [
      {
        name: 'input',
        description: 'The string to convert to snake_case.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  callback: async (interaction) => {
    const input = interaction.options.getString('input');
    if (!input) return interaction.reply('Please provide a string to convert.');

    const snakeCase = StringUtils.toSnakeCase(input);
    await interaction.reply(`Converted to snake_case: ${snakeCase}`);
  },
};
