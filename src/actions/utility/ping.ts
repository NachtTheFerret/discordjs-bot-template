import { Locale } from 'discord.js';
import { Action } from '../../typings';
import { ActionType } from '../../typings/enum';

export default <Action<ActionType.ChatInput>>{
  identifier: 'ping',
  type: ActionType.ChatInput,

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

  callback: async (interaction) => {
    await interaction.reply('Pong!');
  },

  tags: ['default', 'ping'],
  disabled: false,
};
