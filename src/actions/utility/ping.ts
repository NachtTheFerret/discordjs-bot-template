import { Action } from '../../typings';
import { ActionType } from '../../typings/enum';

export default <Action<ActionType.ChatInput>>{
  identifier: 'ping',
  type: ActionType.ChatInput,

  data: {
    name: 'ping',
    description: 'Replies with Pong!',
    descriptionLocalizations: {
      fr: 'Répond avec Pong !',
      en: 'Replies with Pong!',
      de: 'Antwortet mit Pong!',
      es: '¡Responde con Pong!',
    },
  },

  callback: async (interaction) => {
    await interaction.reply('Pong!');
  },

  tags: ['default', 'ping'],
  disabled: false,
};
